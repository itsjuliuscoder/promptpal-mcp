export const SlackConnector = {
    id: 'slack',
    name: 'Slack',
    category: 'communication',
    mcp: {
        serverUrl: process.env['SLACK_MCP_URL'] ?? '',
        transport: 'http',
        isLocal: false,
    },
    auth: {
        type: 'oauth2',
        scopes: ['channels:read', 'channels:history', 'search:read', 'users:read'],
        scopeDescription: 'Read public channels, threads, and search your workspace',
    },
    ingestionTools: [
        { tool: 'list_channels', params: { limit: 50 }, purpose: 'discover' },
        { tool: 'get_channel_history', params: { limit: 100 }, purpose: 'read_messages' },
        { tool: 'search_messages', params: { query: '' }, purpose: 'search' },
    ],
    contentExtractor: (mcpResponse) => {
        const r = mcpResponse;
        return {
            title: r.channel_name ?? r.username ?? 'Message',
            content: r.text ?? r.attachments?.[0]?.text ?? '',
            contentType: 'message',
            sourceId: r.ts ?? r.client_msg_id ?? '',
            sourceUrl: r.permalink ?? null,
        };
    },
    knowledgeTypes: ['messages'],
    templateCategories: ['communication', 'team_updates', 'announcements'],
};
//# sourceMappingURL=SlackConnector.js.map