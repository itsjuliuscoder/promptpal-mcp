import type { ConnectorConfig } from '../types.js';
/**
 * SPECIAL CONNECTOR — Figma Desktop Local Server
 *
 * Figma exposes an MCP server via its desktop app (Dev Mode).
 * There is NO OAuth — authentication is handled by the local network binding.
 * This connector MUST NOT be treated as an OAuth connector.
 *
 * Setup: Open Figma desktop → Dev Mode → Settings → Enable MCP Server
 */
export declare const FigmaConnector: ConnectorConfig;
//# sourceMappingURL=FigmaConnector.d.ts.map