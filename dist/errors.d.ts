export type McpErrorCode = 'MCP_NOT_CONNECTED' | 'MCP_CONNECTION_TIMEOUT' | 'MCP_TOOL_TIMEOUT' | 'MCP_TOOL_ERROR' | 'MCP_RATE_LIMITED' | 'UNSUPPORTED_TRANSPORT';
export declare class McpClientError extends Error {
    readonly code: McpErrorCode;
    readonly detail: string;
    constructor(code: McpErrorCode, detail?: string);
}
/**
 * Maps internal McpClientError codes to user-facing API error codes.
 * Use this in API controllers before returning a response to the frontend.
 * Never expose raw McpClientError codes to the frontend.
 */
export declare const MCP_ERROR_MAP: Record<McpErrorCode, string>;
//# sourceMappingURL=errors.d.ts.map