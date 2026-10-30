import { NotionConnector } from './NotionConnector.js';
import { GitHubConnector } from './GitHubConnector.js';
import { FigmaConnector } from './FigmaConnector.js';
import { SlackConnector } from './SlackConnector.js';
import { LinearConnector } from './LinearConnector.js';
import { JiraConnector } from './JiraConnector.js';
import { GoogleWorkspaceConnector } from './GoogleWorkspaceConnector.js';
import { HubSpotConnector } from './HubSpotConnector.js';
import { CanvaConnector } from './CanvaConnector.js';
import { IntercomConnector } from './IntercomConnector.js';
import type { ConnectorConfig } from '../types.js';
export { NotionConnector, GitHubConnector, FigmaConnector, SlackConnector, LinearConnector, JiraConnector, GoogleWorkspaceConnector, HubSpotConnector, CanvaConnector, IntercomConnector, };
/**
 * Registry of all supported platform connectors.
 * Keyed by connector id.
 */
export declare const CONNECTOR_REGISTRY: Readonly<Record<string, ConnectorConfig>>;
/**
 * Look up a connector by id.
 * @throws Error if the connector is not found.
 */
export declare function getConnector(id: string): ConnectorConfig;
/**
 * All connectors as an array (useful for iteration in ingestion pipeline).
 */
export declare function getAllConnectors(): ConnectorConfig[];
//# sourceMappingURL=index.d.ts.map