"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.McpClient = void 0;
const index_js_1 = require("@modelcontextprotocol/sdk/client/index.js");
const streamableHttp_js_1 = require("@modelcontextprotocol/sdk/client/streamableHttp.js");
const sse_js_1 = require("@modelcontextprotocol/sdk/client/sse.js");
const errors_js_1 = require("./errors.js");
const CONNECTION_TIMEOUT_MS = 30_000;
const TOOL_CALL_TIMEOUT_MS = 60_000;
// ─── McpClient ────────────────────────────────────────────────────────────────
/**
 * Core MCP client abstraction.
 *
 * This is the ONLY file that imports from @modelcontextprotocol/sdk.
 * All other files in this package interact exclusively with McpClient methods.
 * Raw SDK types (Client, Transport) never leave this file.
 *
 * Usage:
 *   const client = new McpClient();
 *   await client.connect(connector.mcp, decryptedToken);
 *   const tools = await client.listTools();
 *   const result = await client.callTool('search', { query: 'docs' });
 *   await client.disconnect();
 */
class McpClient {
    _client = null;
    _transport = null;
    _connected = false;
    /**
     * Connect to an MCP server.
     * @param mcpConfig - from connector definition
     * @param authToken - decrypted OAuth/PAT token; null for Figma (auth.type = 'none')
     */
    async connect(mcpConfig, authToken = null) {
        const { serverUrl, transport } = mcpConfig;
        if (!serverUrl) {
            throw new errors_js_1.McpClientError('MCP_NOT_CONNECTED', 'serverUrl is empty — check environment variables');
        }
        const headers = authToken
            ? { Authorization: `Bearer ${authToken}` }
            : {};
        if (transport === 'http') {
            this._transport = new streamableHttp_js_1.StreamableHTTPClientTransport(new URL(serverUrl), { requestInit: { headers } });
        }
        else if (transport === 'sse') {
            this._transport = new sse_js_1.SSEClientTransport(new URL(serverUrl), { requestInit: { headers } });
        }
        else {
            throw new errors_js_1.McpClientError('UNSUPPORTED_TRANSPORT', transport);
        }
        this._client = new index_js_1.Client({ name: 'promptpal-marketplace', version: '1.0.0' }, {});
        await Promise.race([
            this._client.connect(this._transport),
            createTimeout(CONNECTION_TIMEOUT_MS, 'MCP_CONNECTION_TIMEOUT'),
        ]);
        this._connected = true;
    }
    /**
     * List all tools exposed by this MCP server.
     */
    async listTools() {
        this._assertConnected();
        const result = await this._client.listTools();
        return (result.tools ?? []).map((t) => ({
            name: t.name,
            description: t.description,
            inputSchema: t.inputSchema,
        }));
    }
    /**
     * Call a named tool on the MCP server.
     * @param toolName - exact MCP tool name
     * @param params - tool arguments
     * @returns parsed tool content array
     */
    async callTool(toolName, params = {}) {
        this._assertConnected();
        const result = await Promise.race([
            this._client.callTool({ name: toolName, arguments: params }),
            createTimeout(TOOL_CALL_TIMEOUT_MS, 'MCP_TOOL_TIMEOUT'),
        ]);
        if (result.isError) {
            const detail = Array.isArray(result.content)
                ? String(result.content[0]?.text ?? '')
                : '';
            throw new errors_js_1.McpClientError('MCP_TOOL_ERROR', detail);
        }
        return result.content;
    }
    /**
     * List available resources (read-only data sources).
     */
    async listResources() {
        this._assertConnected();
        const result = await this._client.listResources();
        return (result.resources ?? []).map((r) => ({
            uri: r.uri,
            name: r.name,
            description: r.description,
            mimeType: r.mimeType,
        }));
    }
    /**
     * Read a specific resource by URI.
     */
    async readResource(uri) {
        this._assertConnected();
        const result = await this._client.readResource({ uri });
        return result.contents;
    }
    /**
     * Gracefully disconnect and clean up.
     * Safe to call even if not connected.
     */
    async disconnect() {
        if (this._client && this._connected) {
            await this._client.close().catch(() => { }); // best-effort
        }
        this._client = null;
        this._transport = null;
        this._connected = false;
    }
    get isConnected() {
        return this._connected;
    }
    // ─── Private ──────────────────────────────────────────────────────────────
    _assertConnected() {
        if (!this._connected || !this._client) {
            throw new errors_js_1.McpClientError('MCP_NOT_CONNECTED');
        }
    }
}
exports.McpClient = McpClient;
// ─── Helpers ──────────────────────────────────────────────────────────────────
function createTimeout(ms, code) {
    return new Promise((_, reject) => setTimeout(() => reject(new errors_js_1.McpClientError(code)), ms));
}
