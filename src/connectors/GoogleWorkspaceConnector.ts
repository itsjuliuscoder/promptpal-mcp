import type { ConnectorConfig, ExtractedContent } from '../types.js';

interface GoogleDocBody {
  content?: string;
}

interface GoogleResponse {
  id?: string;
  name?: string;
  subject?: string;
  title?: string;
  body?: GoogleDocBody;
  snippet?: string;
  description?: string;
  webViewLink?: string;
  alternateLink?: string;
}

export const GoogleWorkspaceConnector: ConnectorConfig = {
  id:       'google_workspace',
  name:     'Google Workspace',
  category: 'productivity',

  mcp: {
    serverUrl: process.env['GOOGLE_WORKSPACE_MCP_URL'] ?? '',
    transport: 'http',
    isLocal:   false,
  },

  auth: {
    type: 'oauth2',
    scopes: [
      'https://www.googleapis.com/auth/gmail.readonly',
      'https://www.googleapis.com/auth/drive.readonly',
      'https://www.googleapis.com/auth/documents.readonly',
    ],
    scopeDescription: 'Read your Gmail, Google Docs, and Drive files',
  },

  ingestionTools: [
    { tool: 'list_documents', params: {},                 purpose: 'read_docs'  },
    { tool: 'list_emails',    params: { maxResults: 50 }, purpose: 'read_gmail' },
    { tool: 'list_files',     params: { pageSize: 50 },   purpose: 'read_drive' },
  ],

  contentExtractor: (mcpResponse: unknown): ExtractedContent => {
    const r = mcpResponse as GoogleResponse;

    return {
      title:       r.name ?? r.subject ?? r.title ?? 'Document',
      content:     r.body?.content ?? r.snippet ?? r.description ?? '',
      contentType: r.subject !== undefined ? 'email' : 'document',
      sourceId:    r.id ?? '',
      sourceUrl:   r.webViewLink ?? r.alternateLink ?? null,
    };
  },

  knowledgeTypes:     ['documents', 'emails'],
  templateCategories: ['writing', 'email', 'documentation'],
};
