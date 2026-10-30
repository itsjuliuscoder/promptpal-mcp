import { McpClient } from './McpClient.js';
import type { ConnectorConfig } from './types.js';
/**
 * Manages a pool of McpClient instances keyed by `${userId}:${connectorId}`.
 *
 * Prevents re-connecting for every tool call within the same ingestion job.
 * Sessions must be explicitly destroyed after an ingestion job completes.
 *
 * Exported as a singleton — import { sessionManager } from '@promptpal/mcp'.
 */
declare class McpSessionManager {
    private _sessions;
    /**
     * Get an existing session or create and connect a new one.
     * @param userId - the authenticated user's ID
     * @param connectorConfig - the full connector definition
     * @param authToken - decrypted OAuth/PAT token; null for Figma
     */
    getOrCreate(userId: string, connectorConfig: ConnectorConfig, authToken: string | null): Promise<McpClient>;
    /**
     * Disconnect and remove a single session.
     */
    destroy(userId: string, connectorId: string): Promise<void>;
    /**
     * Disconnect and remove all sessions for a user (e.g. on sign-out).
     */
    destroyAll(userId: string): Promise<void>;
    /** Number of active sessions (useful for health checks / tests). */
    get size(): number;
}
export declare const sessionManager: McpSessionManager;
export {};
//# sourceMappingURL=McpSessionManager.d.ts.map