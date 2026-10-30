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
class McpSessionManager {
  private _sessions = new Map<string, McpClient>();

  /**
   * Get an existing session or create and connect a new one.
   * @param userId - the authenticated user's ID
   * @param connectorConfig - the full connector definition
   * @param authToken - decrypted OAuth/PAT token; null for Figma
   */
  async getOrCreate(
    userId: string,
    connectorConfig: ConnectorConfig,
    authToken: string | null,
  ): Promise<McpClient> {
    const key = `${userId}:${connectorConfig.id}`;

    const existing = this._sessions.get(key);
    if (existing) return existing;

    const client = new McpClient();
    await client.connect(connectorConfig.mcp, authToken);
    this._sessions.set(key, client);
    return client;
  }

  /**
   * Disconnect and remove a single session.
   */
  async destroy(userId: string, connectorId: string): Promise<void> {
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
  async destroyAll(userId: string): Promise<void> {
    const prefix = `${userId}:`;
    for (const [key, client] of this._sessions.entries()) {
      if (key.startsWith(prefix)) {
        await client.disconnect().catch(() => {});
        this._sessions.delete(key);
      }
    }
  }

  /** Number of active sessions (useful for health checks / tests). */
  get size(): number {
    return this._sessions.size;
  }
}

export const sessionManager = new McpSessionManager();
