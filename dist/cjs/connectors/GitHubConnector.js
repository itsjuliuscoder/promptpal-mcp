"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitHubConnector = void 0;
exports.GitHubConnector = {
    id: 'github',
    name: 'GitHub',
    category: 'developer',
    mcp: {
        serverUrl: 'https://api.githubcopilot.com/mcp/',
        transport: 'http',
        isLocal: false,
    },
    auth: {
        type: 'pat',
        scopeDescription: 'Read your repositories, issues, and code documentation',
    },
    ingestionTools: [
        { tool: 'list_repositories', params: { per_page: 30 }, purpose: 'discover' },
        { tool: 'get_file_contents', params: { path: 'README.md' }, purpose: 'read_readme' },
        { tool: 'list_issues', params: { state: 'all', per_page: 50 }, purpose: 'read_issues' },
        { tool: 'search_code', params: { q: 'language:markdown' }, purpose: 'read_docs' },
    ],
    contentExtractor: (mcpResponse) => {
        const r = mcpResponse;
        let content = '';
        if (r.content) {
            // File content is base64-encoded by the GitHub API
            content = Buffer.from(r.content, 'base64').toString('utf8');
        }
        else {
            content = r.body ?? r.description ?? '';
        }
        return {
            title: r.name ?? r.title ?? r.full_name ?? 'Untitled',
            content,
            contentType: r.number !== undefined ? 'issue' : 'readme',
            sourceId: String(r.id ?? r.number ?? ''),
            sourceUrl: r.html_url ?? r.url ?? null,
        };
    },
    knowledgeTypes: ['code', 'issues', 'documents'],
    templateCategories: ['engineering', 'code_review', 'documentation'],
};
