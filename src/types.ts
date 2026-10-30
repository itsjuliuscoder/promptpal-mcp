// ─── MCP transport config ─────────────────────────────────────────────────────

export type TransportType = 'http' | 'sse';

export interface McpConfig {
  serverUrl: string;
  transport: TransportType;
  /** true only for Figma's local desktop server */
  isLocal: boolean;
  /** Shown in UI when isLocal is true */
  localSetupNote?: string;
}

// ─── Auth config ──────────────────────────────────────────────────────────────

export type AuthType = 'oauth2' | 'pat' | 'none';

export interface AuthConfig {
  type: AuthType;
  authorizationUrl?: string;
  tokenUrl?: string;
  scopes?: string[];
  /** Shown on the OAuth consent screen */
  scopeDescription?: string;
}

// ─── Ingestion ────────────────────────────────────────────────────────────────

export interface IngestionTool {
  /** Exact MCP tool name */
  tool: string;
  /** Default parameters passed to the tool */
  params: Record<string, unknown>;
  /** Human-readable purpose: 'discover' | 'read_content' | etc. */
  purpose: string;
}

export interface ExtractedContent {
  title: string;
  content: string;
  contentType: string;
  sourceId: string;
  sourceUrl: string | null;
}

// ─── Connector config ─────────────────────────────────────────────────────────

export interface ConnectorConfig {
  /** Unique identifier — matches ConnectorRegistry._id */
  id: string;
  /** Display name */
  name: string;
  /** Category shown in the UI */
  category: string;
  mcp: McpConfig;
  auth: AuthConfig;
  /** MCP tools to call during ingestion, in order */
  ingestionTools: IngestionTool[];
  /** Extract clean structured content from a raw MCP tool response */
  contentExtractor: (mcpResponse: unknown) => ExtractedContent;
  /** Maps to KnowledgeChunk.contentType enum values */
  knowledgeTypes: string[];
  /** Hints for template generation engine */
  templateCategories: string[];
}
