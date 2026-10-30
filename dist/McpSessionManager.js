import { McpClient } from './McpClient.js';
/**
 * Manages a pool of McpClient instances keyed by `${userId}:${connectorId}`.
 *
 * Prevents re-connecting for every tool call within the same ingestion job.
 * Sessions must be explicitly destroyed after an ingestion job completes.
 *
 * Exported as a singleton — import { sessionManager } from '@promptpal/mcp'.
 */
class McpSessionManager {
    _sessions = new Map();
    /**
     * Get an existing session or create and connect a new one.
     * @param userId - the authenticated user's ID
     * @param connectorConfig - the full connector definition
     * @param authToken - decrypted OAuth/PAT token; null for Figma
     */
    async getOrCreate(userId, connectorConfig, authToken) {
        const key = `${userId}:${connectorConfig.id}`;
        const existing = this._sessions.get(key);
        if (existing)
            return existing;
        const client = new McpClient();
        await client.connect(connectorConfig.mcp, authToken);
        this._sessions.set(key, client);
        return client;
    }
    /**
     * Disconnect and remove a single session.
     */
    async destroy(userId, connectorId) {
        const key = `${userId}:${connectorId}`;
        const client = this._sessions.get(key);
        if (client) {
            await client.disconnect();
            this._sessions.delete(key);
        }
    }
    /**
     * Disconnect and remove all sessions for a user (e.g. on sign-out).
     */
    async destroyAll(userId) {
        const prefix = `${userId}:`;
        for (const [key, client] of this._sessions.entries()) {
            if (key.startsWith(prefix)) {
                await client.disconnect().catch(() => { });
                this._sessions.delete(key);
            }
        }
    }
    /** Number of active sessions (useful for health checks / tests). */
    get size() {
        return this._sessions.size;
    }
}
export const sessionManager = new McpSessionManager();
//# sourceMappingURL=McpSessionManager.js.map