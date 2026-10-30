import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import { SSEClientTransport } from '@modelcontextprotocol/sdk/client/sse.js';

import { McpClientError } from './errors.js';
import type { McpConfig } from './types.js';

const CONNECTION_TIMEOUT_MS = 30_000;
const TOOL_CALL_TIMEOUT_MS  = 60_000;

// ─── Public-facing tool/resource shapes ───────────────────────────────────────
// These are plain data interfaces — no raw SDK types are exposed.

export interface McpTool {
  name: string;
  description?: string;
  inputSchema: Record<string, unknown>;
}

export interface McpResource {
  uri: string;
  name?: string;
  description?: string;
  mimeType?: string;
}

export type McpContent = Array<{ type: string; text?: string; [key: string]: unknown }>;

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
export class McpClient {
  private _client: Client | null = null;
  private _transport: StreamableHTTPClientTransport | SSEClientTransport | null = null;
  private _connected = false;

  /**
   * Connect to an MCP server.
   * @param mcpConfig - from connector definition
   * @param authToken - decrypted OAuth/PAT token; null for Figma (auth.type = 'none')
   */
  async connect(mcpConfig: McpConfig, authToken: string | null = null): Promise<void> {
    const { serverUrl, transport } = mcpConfig;

    if (!serverUrl) {
      throw new McpClientError('MCP_NOT_CONNECTED', 'serverUrl is empty — check environment variables');
    }

    const headers: Record<string, string> = authToken
      ? { Authorization: `Bearer ${authToken}` }
      : {};

    if (transport === 'http') {
      this._transport = new StreamableHTTPClientTransport(
        new URL(serverUrl),
        { requestInit: { headers } },
      );
    } else if (transport === 'sse') {
      this._transport = new SSEClientTransport(
        new URL(serverUrl),
        { requestInit: { headers } },
      );
    } else {
      throw new McpClientError('UNSUPPORTED_TRANSPORT', transport);
    }

    this._client = new Client(
      { name: 'promptpal-marketplace', version: '1.0.0' },
      {},
    );

    await Promise.race([
      this._client.connect(this._transport),
      createTimeout(CONNECTION_TIMEOUT_MS, 'MCP_CONNECTION_TIMEOUT'),
    ]);

    this._connected = true;
  }

  /**
   * List all tools exposed by this MCP server.
   */
  async listTools(): Promise<McpTool[]> {
    this._assertConnected();
    const result = await this._client!.listTools();
    return (result.tools ?? []).map((t) => ({
      name: t.name,
      description: t.description,
      inputSchema: t.inputSchema as Record<string, unknown>,
    }));
  }

  /**
   * Call a named tool on the MCP server.
   * @param toolName - exact MCP tool name
   * @param params - tool arguments
   * @returns parsed tool content array
   */
  async callTool(toolName: string, params: Record<string, unknown> = {}): Promise<McpContent> {
    this._assertConnected();

    const result = await Promise.race([
      this._client!.callTool({ name: toolName, arguments: params }),
      createTimeout(TOOL_CALL_TIMEOUT_MS, 'MCP_TOOL_TIMEOUT'),
    ]);

    if (result.isError) {
      const detail = Array.isArray(result.content)
        ? String((result.content[0] as { text?: string })?.text ?? '')
        : '';
      throw new McpClientError('MCP_TOOL_ERROR', detail);
    }

    return result.content as McpContent;
  }

  /**
   * List available resources (read-only data sources).
   */
  async listResources(): Promise<McpResource[]> {
    this._assertConnected();
    const result = await this._client!.listResources();
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
  async readResource(uri: string): Promise<unknown> {
    this._assertConnected();
    const result = await this._client!.readResource({ uri });
    return result.contents;
  }

  /**
   * Gracefully disconnect and clean up.
   * Safe to call even if not connected.
   */
  async disconnect(): Promise<void> {
    if (this._client && this._connected) {
      await this._client.close().catch(() => {}); // best-effort
    }
    this._client    = null;
    this._transport = null;
    this._connected = false;
  }

  get isConnected(): boolean {
    return this._connected;
  }

  // ─── Private ──────────────────────────────────────────────────────────────

  private _assertConnected(): void {
    if (!this._connected || !this._client) {
      throw new McpClientError('MCP_NOT_CONNECTED');
    }
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function createTimeout(ms: number, code: 'MCP_CONNECTION_TIMEOUT' | 'MCP_TOOL_TIMEOUT'): Promise<never> {
  return new Promise((_, reject) =>
    setTimeout(() => reject(new McpClientError(code)), ms),
  );
}
