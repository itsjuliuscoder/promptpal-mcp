"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MCP_ERROR_MAP = exports.McpClientError = void 0;
class McpClientError extends Error {
    code;
    detail;
    constructor(code, detail = '') {
        super(`McpClientError [${code}]: ${detail}`);
        this.name = 'McpClientError';
        this.code = code;
        this.detail = detail;
    }
}
exports.McpClientError = McpClientError;
/**
 * Maps internal McpClientError codes to user-facing API error codes.
 * Use this in API controllers before returning a response to the frontend.
 * Never expose raw McpClientError codes to the frontend.
 */
exports.MCP_ERROR_MAP = {
    MCP_NOT_CONNECTED: 'MCP_CONNECTION_FAILED',
    MCP_CONNECTION_TIMEOUT: 'MCP_CONNECTION_FAILED',
    MCP_TOOL_TIMEOUT: 'MCP_RATE_LIMITED',
    MCP_TOOL_ERROR: 'MCP_PERMISSION_DENIED',
    MCP_RATE_LIMITED: 'MCP_RATE_LIMITED',
    UNSUPPORTED_TRANSPORT: 'MCP_CONNECTION_FAILED',
};
