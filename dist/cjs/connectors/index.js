"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CONNECTOR_REGISTRY = exports.IntercomConnector = exports.CanvaConnector = exports.HubSpotConnector = exports.GoogleWorkspaceConnector = exports.JiraConnector = exports.LinearConnector = exports.SlackConnector = exports.FigmaConnector = exports.GitHubConnector = exports.NotionConnector = void 0;
exports.getConnector = getConnector;
exports.getAllConnectors = getAllConnectors;
const NotionConnector_js_1 = require("./NotionConnector.js");
Object.defineProperty(exports, "NotionConnector", { enumerable: true, get: function () { return NotionConnector_js_1.NotionConnector; } });
const GitHubConnector_js_1 = require("./GitHubConnector.js");
Object.defineProperty(exports, "GitHubConnector", { enumerable: true, get: function () { return GitHubConnector_js_1.GitHubConnector; } });
const FigmaConnector_js_1 = require("./FigmaConnector.js");
Object.defineProperty(exports, "FigmaConnector", { enumerable: true, get: function () { return FigmaConnector_js_1.FigmaConnector; } });
const SlackConnector_js_1 = require("./SlackConnector.js");
Object.defineProperty(exports, "SlackConnector", { enumerable: true, get: function () { return SlackConnector_js_1.SlackConnector; } });
const LinearConnector_js_1 = require("./LinearConnector.js");
Object.defineProperty(exports, "LinearConnector", { enumerable: true, get: function () { return LinearConnector_js_1.LinearConnector; } });
const JiraConnector_js_1 = require("./JiraConnector.js");
Object.defineProperty(exports, "JiraConnector", { enumerable: true, get: function () { return JiraConnector_js_1.JiraConnector; } });
const GoogleWorkspaceConnector_js_1 = require("./GoogleWorkspaceConnector.js");
Object.defineProperty(exports, "GoogleWorkspaceConnector", { enumerable: true, get: function () { return GoogleWorkspaceConnector_js_1.GoogleWorkspaceConnector; } });
const HubSpotConnector_js_1 = require("./HubSpotConnector.js");
Object.defineProperty(exports, "HubSpotConnector", { enumerable: true, get: function () { return HubSpotConnector_js_1.HubSpotConnector; } });
const CanvaConnector_js_1 = require("./CanvaConnector.js");
Object.defineProperty(exports, "CanvaConnector", { enumerable: true, get: function () { return CanvaConnector_js_1.CanvaConnector; } });
const IntercomConnector_js_1 = require("./IntercomConnector.js");
Object.defineProperty(exports, "IntercomConnector", { enumerable: true, get: function () { return IntercomConnector_js_1.IntercomConnector; } });
/**
 * Registry of all supported platform connectors.
 * Keyed by connector id.
 */
exports.CONNECTOR_REGISTRY = {
    notion: NotionConnector_js_1.NotionConnector,
    github: GitHubConnector_js_1.GitHubConnector,
    figma: FigmaConnector_js_1.FigmaConnector,
    slack: SlackConnector_js_1.SlackConnector,
    linear: LinearConnector_js_1.LinearConnector,
    jira: JiraConnector_js_1.JiraConnector,
    google_workspace: GoogleWorkspaceConnector_js_1.GoogleWorkspaceConnector,
    hubspot: HubSpotConnector_js_1.HubSpotConnector,
    canva: CanvaConnector_js_1.CanvaConnector,
    intercom: IntercomConnector_js_1.IntercomConnector,
};
/**
 * Look up a connector by id.
 * @throws Error if the connector is not found.
 */
function getConnector(id) {
    const connector = exports.CONNECTOR_REGISTRY[id];
    if (!connector)
        throw new Error(`Unknown connector: "${id}". Valid ids: ${Object.keys(exports.CONNECTOR_REGISTRY).join(', ')}`);
    return connector;
}
/**
 * All connectors as an array (useful for iteration in ingestion pipeline).
 */
function getAllConnectors() {
    return Object.values(exports.CONNECTOR_REGISTRY);
}
