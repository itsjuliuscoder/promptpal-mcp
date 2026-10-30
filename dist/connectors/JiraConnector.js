export const JiraConnector = {
    id: 'jira',
    name: 'Jira',
    category: 'project_management',
    mcp: {
        serverUrl: process.env['ATLASSIAN_MCP_URL'] ?? '',
        transport: 'http',
        isLocal: false,
    },
    auth: {
        type: 'oauth2',
        scopes: ['read:jira-work', 'read:confluence-content.all'],
        scopeDescription: 'Read Jira tickets, epics, and Confluence documentation',
    },
    ingestionTools: [
        { tool: 'search_issues', params: { jql: 'ORDER BY updated DESC', maxResults: 100 }, purpose: 'read_issues' },
        { tool: 'get_page', params: {}, purpose: 'read_confluence' },
    ],
    contentExtractor: (mcpResponse) => {
        const r = mcpResponse;
        return {
            title: r.fields?.summary ?? r.title ?? 'Issue',
            content: r.fields?.description ?? r.body?.storage?.value ?? '',
            contentType: r.fields ? 'issue' : 'wiki_page',
            sourceId: r.id ?? r.key ?? '',
            sourceUrl: r.self ?? r._links?.webui ?? null,
        };
    },
    knowledgeTypes: ['issues', 'documents'],
    templateCategories: ['engineering', 'product_management', 'documentation'],
};
//# sourceMappingURL=JiraConnector.js.map