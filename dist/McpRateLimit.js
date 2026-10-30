import { McpClientError } from './errors.js';
/**
 * In-memory sliding window rate limiter for MCP tool calls.
 *
 * Limit: 10 MCP tool calls per user per connector per 60-second window.
 * Key pattern: `${userId}:${connectorId}`
 *
 * This is intentionally in-memory (no Redis dependency).
 * For multi-instance deployments, swap the Map for a shared Redis counter.
 *
 * Usage (in the ingestion pipeline, before each callTool):
 *   checkRateLimit(userId, connector.id);   // throws if over limit
 *   await client.callTool(tool, params);
 */
const WINDOW_MS = 60_000; // 1 minute
const MAX_CALLS = 10;
const _store = new Map();
/**
 * Check and increment the rate limit counter for a user+connector pair.
 * Throws McpClientError('MCP_RATE_LIMITED') if the limit is exceeded.
 *
 * @param userId      - the authenticated user's ID
 * @param connectorId - the connector's ID (e.g. 'notion', 'github')
 */
export function checkRateLimit(userId, connectorId) {
    const key = `${userId}:${connectorId}`;
    const now = Date.now();
    const entry = _store.get(key);
    if (!entry || now >= entry.expiresAt) {
        // Start a fresh window
        _store.set(key, { count: 1, expiresAt: now + WINDOW_MS });
        return;
    }
    if (entry.count >= MAX_CALLS) {
        throw new McpClientError('MCP_RATE_LIMITED', `Rate limit exceeded: ${MAX_CALLS} calls per ${WINDOW_MS / 1000}s for connector '${connectorId}'`);
    }
    entry.count += 1;
}
/**
 * Reset the rate limit counter for a user+connector pair.
 * Useful for testing.
 */
export function resetRateLimit(userId, connectorId) {
    _store.delete(`${userId}:${connectorId}`);
}
/**
 * Current call count within the active window.
 * Returns 0 if no window exists or the window has expired.
 */
export function getRateLimitCount(userId, connectorId) {
    const key = `${userId}:${connectorId}`;
    const entry = _store.get(key);
    if (!entry || Date.now() >= entry.expiresAt)
        return 0;
    return entry.count;
}
//# sourceMappingURL=McpRateLimit.js.map