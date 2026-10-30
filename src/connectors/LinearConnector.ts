import type { ConnectorConfig, ExtractedContent } from '../types.js';

interface LinearResponse {
  id?: string;
  number?: number;
  title?: string;
  name?: string;
  description?: string;
  content?: string;
  url?: string;
}

export const LinearConnector: ConnectorConfig = {
  id:       'linear',
  name:     'Linear',
  category: 'project_management',

  mcp: {
    serverUrl: process.env['LINEAR_MCP_URL'] ?? '',
    transport: 'http',
    isLocal:   false,
  },

  auth: {
    type:             'oauth2',
    scopes:           ['read'],
    scopeDescription: 'Read your issues, projects, and team workflows',
  },

  ingestionTools: [
    { tool: 'list_issues',   params: { first: 100 }, purpose: 'read_issues'   },
    { tool: 'list_projects', params: {},              purpose: 'read_projects' },
    { tool: 'list_teams',    params: {},              purpose: 'read_teams'   },
  ],

  contentExtractor: (mcpResponse: unknown): ExtractedContent => {
    const r = mcpResponse as LinearResponse;

    return {
      title:       r.title ?? r.name ?? 'Issue',
      content:     r.description ?? r.content ?? '',
      contentType: r.number !== undefined ? 'issue' : 'task',
      sourceId:    r.id ?? '',
      sourceUrl:   r.url ?? null,
    };
  },

  knowledgeTypes:     ['issues', 'tasks'],
  templateCategories: ['engineering', 'product_management', 'sprint_planning'],
};
