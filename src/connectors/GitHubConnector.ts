import type { ConnectorConfig, ExtractedContent } from '../types.js';

interface GitHubResponse {
  id?: number | string;
  number?: number;
  name?: string;
  full_name?: string;
  title?: string;
  content?: string;      // base64-encoded file content
  body?: string;
  description?: string;
  html_url?: string;
  url?: string;
}

export const GitHubConnector: ConnectorConfig = {
  id:       'github',
  name:     'GitHub',
  category: 'developer',

  mcp: {
    serverUrl: 'https://api.githubcopilot.com/mcp/',
    transport: 'http',
    isLocal:   false,
  },

  auth: {
    type:             'pat',
    scopeDescription: 'Read your repositories, issues, and code documentation',
  },

  ingestionTools: [
    { tool: 'list_repositories', params: { per_page: 30 },              purpose: 'discover'    },
    { tool: 'get_file_contents', params: { path: 'README.md' },         purpose: 'read_readme' },
    { tool: 'list_issues',       params: { state: 'all', per_page: 50 }, purpose: 'read_issues' },
    { tool: 'search_code',       params: { q: 'language:markdown' },    purpose: 'read_docs'   },
  ],

  contentExtractor: (mcpResponse: unknown): ExtractedContent => {
    const r = mcpResponse as GitHubResponse;

    let content = '';
    if (r.content) {
      // File content is base64-encoded by the GitHub API
      content = Buffer.from(r.content, 'base64').toString('utf8');
    } else {
      content = r.body ?? r.description ?? '';
    }

    return {
      title:       r.name ?? r.title ?? r.full_name ?? 'Untitled',
      content,
      contentType: r.number !== undefined ? 'issue' : 'readme',
      sourceId:    String(r.id ?? r.number ?? ''),
      sourceUrl:   r.html_url ?? r.url ?? null,
    };
  },

  knowledgeTypes:     ['code', 'issues', 'documents'],
  templateCategories: ['engineering', 'code_review', 'documentation'],
};
