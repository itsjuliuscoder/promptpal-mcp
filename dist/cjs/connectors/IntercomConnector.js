"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntercomConnector = void 0;
exports.IntercomConnector = {
    id: 'intercom',
    name: 'Intercom',
    category: 'support',
    mcp: {
        serverUrl: process.env['INTERCOM_MCP_URL'] ?? '',
        transport: 'http',
        isLocal: false,
    },
    auth: {
        type: 'oauth2',
        scopes: ['read_conversations', 'read_articles'],
        scopeDescription: 'Read support conversations and help center articles',
    },
    ingestionTools: [
        { tool: 'list_conversations', params: { per_page: 50 }, purpose: 'read_conversations' },
        { tool: 'list_articles', params: {}, purpose: 'read_help_center' },
    ],
    contentExtractor: (mcpResponse) => {
        const r = mcpResponse;
        const parts = r.conversation_parts?.body;
        const content = parts
            ? parts.map((p) => p.body ?? '').join('\n')
            : r.body ?? '';
        return {
            title: r.title ?? `Conversation ${r.id ?? ''}`,
            content,
            contentType: r.conversation_parts ? 'conversation' : 'document',
            sourceId: String(r.id ?? ''),
            sourceUrl: r.app_url ?? r.url ?? null,
        };
    },
    knowledgeTypes: ['conversations', 'documents'],
    templateCategories: ['customer_support', 'help_center', 'faq'],
};
