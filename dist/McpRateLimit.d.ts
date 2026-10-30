/**
 * Check and increment the rate limit counter for a user+connector pair.
 * Throws McpClientError('MCP_RATE_LIMITED') if the limit is exceeded.
 *
 * @param userId      - the authenticated user's ID
 * @param connectorId - the connector's ID (e.g. 'notion', 'github')
 */
export declare function checkRateLimit(userId: string, connectorId: string): void;
/**
 * Reset the rate limit counter for a user+connector pair.
 * Useful for testing.
 */
export declare function resetRateLimit(userId: string, connectorId: string): void;
/**
 * Current call count within the active window.
 * Returns 0 if no window exists or the window has expired.
 */
export declare function getRateLimitCount(userId: string, connectorId: string): number;
//# sourceMappingURL=McpRateLimit.d.ts.map