import type { McpConfig } from './types.js';
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
export type McpContent = Array<{
    type: string;
    text?: string;
    [key: string]: unknown;
}>;
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
export declare class McpClient {
    private _client;
    private _transport;
    private _connected;
    /**
     * Connect to an MCP server.
     * @param mcpConfig - from connector definition
     * @param authToken - decrypted OAuth/PAT token; null for Figma (auth.type = 'none')
     */
    connect(mcpConfig: McpConfig, authToken?: string | null): Promise<void>;
    /**
     * List all tools exposed by this MCP server.
     */
    listTools(): Promise<McpTool[]>;
    /**
     * Call a named tool on the MCP server.
     * @param toolName - exact MCP tool name
     * @param params - tool arguments
     * @returns parsed tool content array
     */
    callTool(toolName: string, params?: Record<string, unknown>): Promise<McpContent>;
    /**
     * List available resources (read-only data sources).
     */
    listResources(): Promise<McpResource[]>;
    /**
     * Read a specific resource by URI.
     */
    readResource(uri: string): Promise<unknown>;
    /**
     * Gracefully disconnect and clean up.
     * Safe to call even if not connected.
     */
    disconnect(): Promise<void>;
    get isConnected(): boolean;
    private _assertConnected;
}
//# sourceMappingURL=McpClient.d.ts.map