import type { ConnectorConfig, ExtractedContent } from '../types.js';

interface CanvaThumbnail {
  url?: string;
}

interface CanvaUrls {
  view_url?: string;
}

interface CanvaResponse {
  id?: string;
  title?: string;
  name?: string;
  description?: string;
  thumbnail?: CanvaThumbnail;
  urls?: CanvaUrls;
  url?: string;
}

export const CanvaConnector: ConnectorConfig = {
  id:       'canva',
  name:     'Canva',
  category: 'design',

  mcp: {
    serverUrl: process.env['CANVA_MCP_URL'] ?? '',
    transport: 'http',
    isLocal:   false,
  },

  auth: {
    type:             'oauth2',
    scopes:           ['design:content:read', 'asset:read'],
    scopeDescription: 'Read your Canva design projects and brand templates',
  },

  ingestionTools: [
    { tool: 'list_designs', params: {},             purpose: 'read_designs'  },
    { tool: 'list_brands',  params: {},             purpose: 'read_brands'   },
    { tool: 'list_folders', params: { limit: 50 },  purpose: 'read_folders'  },
  ],

  contentExtractor: (mcpResponse: unknown): ExtractedContent => {
    const r = mcpResponse as CanvaResponse;

    return {
      title:       r.title ?? r.name ?? 'Design',
      content:     r.description ?? r.thumbnail?.url ?? '',
      contentType: 'design_spec',
      sourceId:    r.id ?? '',
      sourceUrl:   r.urls?.view_url ?? r.url ?? null,
    };
  },

  knowledgeTypes:     ['designs', 'documents'],
  templateCategories: ['content_creation', 'social_media', 'marketing'],
};
