export type McpErrorCode =
  | 'MCP_NOT_CONNECTED'
  | 'MCP_CONNECTION_TIMEOUT'
  | 'MCP_TOOL_TIMEOUT'
  | 'MCP_TOOL_ERROR'
  | 'MCP_RATE_LIMITED'
  | 'UNSUPPORTED_TRANSPORT';

export class McpClientError extends Error {
  public readonly code: McpErrorCode;
  public readonly detail: string;

  constructor(code: McpErrorCode, detail = '') {
    super(`McpClientError [${code}]: ${detail}`);
    this.name = 'McpClientError';
    this.code = code;
    this.detail = detail;
  }
}

/**
 * Maps internal McpClientError codes to user-facing API error codes.
 * Use this in API controllers before returning a response to the frontend.
 * Never expose raw McpClientError codes to the frontend.
 */
export const MCP_ERROR_MAP: Record<McpErrorCode, string> = {
  MCP_NOT_CONNECTED:      'MCP_CONNECTION_FAILED',
  MCP_CONNECTION_TIMEOUT: 'MCP_CONNECTION_FAILED',
  MCP_TOOL_TIMEOUT:       'MCP_RATE_LIMITED',
  MCP_TOOL_ERROR:         'MCP_PERMISSION_DENIED',
  MCP_RATE_LIMITED:       'MCP_RATE_LIMITED',
  UNSUPPORTED_TRANSPORT:  'MCP_CONNECTION_FAILED',
};
