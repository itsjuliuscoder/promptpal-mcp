import type { ConnectorConfig, ExtractedContent } from '../types.js';

interface SlackAttachment {
  text?: string;
}

interface SlackResponse {
  ts?: string;
  client_msg_id?: string;
  channel_name?: string;
  username?: string;
  text?: string;
  attachments?: SlackAttachment[];
  permalink?: string;
}

export const SlackConnector: ConnectorConfig = {
  id:       'slack',
  name:     'Slack',
  category: 'communication',

  mcp: {
    serverUrl: process.env['SLACK_MCP_URL'] ?? '',
    transport: 'http',
    isLocal:   false,
  },

  auth: {
    type:             'oauth2',
    scopes:           ['channels:read', 'channels:history', 'search:read', 'users:read'],
    scopeDescription: 'Read public channels, threads, and search your workspace',
  },

  ingestionTools: [
    { tool: 'list_channels',       params: { limit: 50 },  purpose: 'discover'       },
    { tool: 'get_channel_history', params: { limit: 100 }, purpose: 'read_messages'  },
    { tool: 'search_messages',     params: { query: '' },  purpose: 'search'         },
  ],

  contentExtractor: (mcpResponse: unknown): ExtractedContent => {
    const r = mcpResponse as SlackResponse;

    return {
      title:       r.channel_name ?? r.username ?? 'Message',
      content:     r.text ?? r.attachments?.[0]?.text ?? '',
      contentType: 'message',
      sourceId:    r.ts ?? r.client_msg_id ?? '',
      sourceUrl:   r.permalink ?? null,
    };
  },

  knowledgeTypes:     ['messages'],
  templateCategories: ['communication', 'team_updates', 'announcements'],
};
