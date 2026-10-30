import type { ConnectorConfig, ExtractedContent } from '../types.js';

interface HubSpotProperties {
  dealname?: string;
  firstname?: string;
  lastname?: string;
  hs_note_body?: string;
  description?: string;
  hs_body_preview?: string;
}

interface HubSpotResponse {
  id?: string;
  properties?: HubSpotProperties;
}

export const HubSpotConnector: ConnectorConfig = {
  id:       'hubspot',
  name:     'HubSpot',
  category: 'crm',

  mcp: {
    serverUrl: process.env['HUBSPOT_MCP_URL'] ?? '',
    transport: 'http',
    isLocal:   false,
  },

  auth: {
    type: 'oauth2',
    scopes: [
      'crm.objects.contacts.read',
      'crm.objects.deals.read',
      'crm.objects.notes.read',
    ],
    scopeDescription: 'Read CRM contacts, deals, and sales notes',
  },

  ingestionTools: [
    { tool: 'list_contacts', params: { limit: 50 },  purpose: 'read_contacts' },
    { tool: 'list_deals',    params: { limit: 50 },  purpose: 'read_deals'    },
    { tool: 'list_notes',    params: { limit: 100 }, purpose: 'read_notes'    },
  ],

  contentExtractor: (mcpResponse: unknown): ExtractedContent => {
    const r = mcpResponse as HubSpotResponse;
    const p = r.properties;

    const firstName = p?.firstname ?? '';
    const lastName  = p?.lastname  ?? '';
    const fullName  = [firstName, lastName].filter(Boolean).join(' ') || 'CRM Record';

    return {
      title:       p?.dealname ?? fullName,
      content:     p?.hs_note_body ?? p?.description ?? p?.hs_body_preview ?? '',
      contentType: 'contact_note',
      sourceId:    r.id ?? '',
      sourceUrl:   r.id ? `https://app.hubspot.com/contacts/${r.id}` : null,
    };
  },

  knowledgeTypes:     ['contacts', 'tasks'],
  templateCategories: ['sales', 'email', 'outreach'],
};
