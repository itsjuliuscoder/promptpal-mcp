import { NotionConnector }          from './NotionConnector.js';
import { GitHubConnector }          from './GitHubConnector.js';
import { FigmaConnector }           from './FigmaConnector.js';
import { SlackConnector }           from './SlackConnector.js';
import { LinearConnector }          from './LinearConnector.js';
import { JiraConnector }            from './JiraConnector.js';
import { GoogleWorkspaceConnector } from './GoogleWorkspaceConnector.js';
import { HubSpotConnector }         from './HubSpotConnector.js';
import { CanvaConnector }           from './CanvaConnector.js';
import { IntercomConnector }        from './IntercomConnector.js';

import type { ConnectorConfig } from '../types.js';

export {
  NotionConnector,
  GitHubConnector,
  FigmaConnector,
  SlackConnector,
  LinearConnector,
  JiraConnector,
  GoogleWorkspaceConnector,
  HubSpotConnector,
  CanvaConnector,
  IntercomConnector,
};

/**
 * Registry of all supported platform connectors.
 * Keyed by connector id.
 */
export const CONNECTOR_REGISTRY: Readonly<Record<string, ConnectorConfig>> = {
  notion:           NotionConnector,
  github:           GitHubConnector,
  figma:            FigmaConnector,
  slack:            SlackConnector,
  linear:           LinearConnector,
  jira:             JiraConnector,
  google_workspace: GoogleWorkspaceConnector,
  hubspot:          HubSpotConnector,
  canva:            CanvaConnector,
  intercom:         IntercomConnector,
};

/**
 * Look up a connector by id.
 * @throws Error if the connector is not found.
 */
export function getConnector(id: string): ConnectorConfig {
  const connector = CONNECTOR_REGISTRY[id];
  if (!connector) throw new Error(`Unknown connector: "${id}". Valid ids: ${Object.keys(CONNECTOR_REGISTRY).join(', ')}`);
  return connector;
}

/**
 * All connectors as an array (useful for iteration in ingestion pipeline).
 */
export function getAllConnectors(): ConnectorConfig[] {
  return Object.values(CONNECTOR_REGISTRY);
}
