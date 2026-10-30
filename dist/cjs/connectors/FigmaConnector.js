"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FigmaConnector = void 0;
/**
 * SPECIAL CONNECTOR — Figma Desktop Local Server
 *
 * Figma exposes an MCP server via its desktop app (Dev Mode).
 * There is NO OAuth — authentication is handled by the local network binding.
 * This connector MUST NOT be treated as an OAuth connector.
 *
 * Setup: Open Figma desktop → Dev Mode → Settings → Enable MCP Server
 */
exports.FigmaConnector = {
    id: 'figma',
    name: 'Figma',
    category: 'design',
    mcp: {
        serverUrl: 'http://127.0.0.1:3845/mcp',
        transport: 'http',
        isLocal: true,
        localSetupNote: 'Open Figma desktop → Dev Mode → Settings → Enable MCP Server',
    },
    auth: {
        type: 'none', // No OAuth — local network access only. Do NOT add OAuth here.
    },
    ingestionTools: [
        { tool: 'get_design_context', params: {}, purpose: 'read_designs' },
        { tool: 'get_variable_defs', params: {}, purpose: 'read_variables' },
    ],
    contentExtractor: (mcpResponse) => {
        const r = mcpResponse;
        return {
            title: r.name ?? 'Design File',
            content: JSON.stringify({
                components: r.components ?? {},
                variables: r.variables ?? {},
                frames: r.frames ?? [],
            }),
            contentType: 'design_spec',
            sourceId: r.id ?? r.fileKey ?? '',
            sourceUrl: r.link ?? null,
        };
    },
    knowledgeTypes: ['designs'],
    templateCategories: ['ux_writing', 'design_briefs', 'content_design'],
};
