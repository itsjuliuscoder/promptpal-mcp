"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleWorkspaceConnector = void 0;
exports.GoogleWorkspaceConnector = {
    id: 'google_workspace',
    name: 'Google Workspace',
    category: 'productivity',
    mcp: {
        serverUrl: process.env['GOOGLE_WORKSPACE_MCP_URL'] ?? '',
        transport: 'http',
        isLocal: false,
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
        { tool: 'list_documents', params: {}, purpose: 'read_docs' },
        { tool: 'list_emails', params: { maxResults: 50 }, purpose: 'read_gmail' },
        { tool: 'list_files', params: { pageSize: 50 }, purpose: 'read_drive' },
    ],
    contentExtractor: (mcpResponse) => {
        const r = mcpResponse;
        return {
            title: r.name ?? r.subject ?? r.title ?? 'Document',
            content: r.body?.content ?? r.snippet ?? r.description ?? '',
            contentType: r.subject !== undefined ? 'email' : 'document',
            sourceId: r.id ?? '',
            sourceUrl: r.webViewLink ?? r.alternateLink ?? null,
        };
    },
    knowledgeTypes: ['documents', 'emails'],
    templateCategories: ['writing', 'email', 'documentation'],
};
