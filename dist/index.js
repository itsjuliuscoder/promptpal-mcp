/**
 * @promptpal/mcp — Public API
 *
 * Everything Phase 3+ (OAuth, Ingestion, Template Generation) needs
 * is exported from this single barrel. Never import internal modules directly.
 */
// ─── Core client ──────────────────────────────────────────────────────────────
export { McpClient } from './McpClient.js';
// ─── Errors ───────────────────────────────────────────────────────────────────
export { McpClientError, MCP_ERROR_MAP } from './errors.js';
// ─── Session pool ─────────────────────────────────────────────────────────────
export { sessionManager } from './McpSessionManager.js';
// ─── Token vault ──────────────────────────────────────────────────────────────
export { encrypt, decrypt, encryptForStorage, decryptFromStorage, } from './McpTokenVault.js';
// ─── Rate limiting ────────────────────────────────────────────────────────────
export { checkRateLimit, resetRateLimit, getRateLimitCount } from './McpRateLimit.js';
// ─── Connector registry ───────────────────────────────────────────────────────
export { CONNECTOR_REGISTRY, getConnector, getAllConnectors, NotionConnector, GitHubConnector, FigmaConnector, SlackConnector, LinearConnector, JiraConnector, GoogleWorkspaceConnector, HubSpotConnector, CanvaConnector, IntercomConnector, } from './connectors/index.js';
//# sourceMappingURL=index.js.map