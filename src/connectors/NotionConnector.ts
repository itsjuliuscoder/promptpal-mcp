import type { ConnectorConfig, ExtractedContent } from '../types.js';

interface NotionBlock {
  plain_text?: string;
}

interface NotionResponse {
  id?: string;
  url?: string;
  object?: string;
  title?: string;
  content?: NotionBlock[] | string;
  properties?: {
    title?: { title?: NotionBlock[] };
  };
}

export const NotionConnector: ConnectorConfig = {
  id:       'notion',
  name:     'Notion',
  category: 'productivity',

  mcp: {
    serverUrl: 'https://mcp.notion.com/mcp',
    transport: 'http',
    isLocal:   false,
  },

  auth: {
    type:             'oauth2',
    authorizationUrl: 'https://api.notion.com/v1/oauth/authorize',
    tokenUrl:         'https://api.notion.com/v1/oauth/token',
    scopes:           ['read_content', 'read_user'],
    scopeDescription: 'Read your Notion pages, databases, and workspace content',
  },

  ingestionTools: [
    { tool: 'notion-search', params: { query: '' }, purpose: 'discover_all' },
    { tool: 'notion-fetch',  params: {},             purpose: 'read_content' },
  ],

  contentExtractor: (mcpResponse: unknown): ExtractedContent => {
    const r = mcpResponse as NotionResponse;

    const rawContent = r.content;
    let content = '';
    if (Array.isArray(rawContent)) {
      content = rawContent.map((b) => b.plain_text ?? '').join('\n');
    } else if (typeof rawContent === 'string') {
      content = rawContent;
    }

    return {
      title:       r.properties?.title?.title?.[0]?.plain_text ?? r.title ?? 'Untitled',
      content,
      contentType: r.object === 'database' ? 'database_entry' : 'wiki_page',
      sourceId:    r.id ?? '',
      sourceUrl:   r.url ?? null,
    };
  },

  knowledgeTypes:     ['documents', 'databases'],
  templateCategories: ['documentation', 'knowledge_management', 'writing'],
};
