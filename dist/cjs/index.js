"use strict";
/**
 * @promptpal/mcp — Public API
 *
 * Everything Phase 3+ (OAuth, Ingestion, Template Generation) needs
 * is exported from this single barrel. Never import internal modules directly.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntercomConnector = exports.CanvaConnector = exports.HubSpotConnector = exports.GoogleWorkspaceConnector = exports.JiraConnector = exports.LinearConnector = exports.SlackConnector = exports.FigmaConnector = exports.GitHubConnector = exports.NotionConnector = exports.getAllConnectors = exports.getConnector = exports.CONNECTOR_REGISTRY = exports.getRateLimitCount = exports.resetRateLimit = exports.checkRateLimit = exports.decryptFromStorage = exports.encryptForStorage = exports.decrypt = exports.encrypt = exports.sessionManager = exports.MCP_ERROR_MAP = exports.McpClientError = exports.McpClient = void 0;
// ─── Core client ──────────────────────────────────────────────────────────────
var McpClient_js_1 = require("./McpClient.js");
Object.defineProperty(exports, "McpClient", { enumerable: true, get: function () { return McpClient_js_1.McpClient; } });
// ─── Errors ───────────────────────────────────────────────────────────────────
var errors_js_1 = require("./errors.js");
Object.defineProperty(exports, "McpClientError", { enumerable: true, get: function () { return errors_js_1.McpClientError; } });
Object.defineProperty(exports, "MCP_ERROR_MAP", { enumerable: true, get: function () { return errors_js_1.MCP_ERROR_MAP; } });
// ─── Session pool ─────────────────────────────────────────────────────────────
var McpSessionManager_js_1 = require("./McpSessionManager.js");
Object.defineProperty(exports, "sessionManager", { enumerable: true, get: function () { return McpSessionManager_js_1.sessionManager; } });
// ─── Token vault ──────────────────────────────────────────────────────────────
var McpTokenVault_js_1 = require("./McpTokenVault.js");
Object.defineProperty(exports, "encrypt", { enumerable: true, get: function () { return McpTokenVault_js_1.encrypt; } });
Object.defineProperty(exports, "decrypt", { enumerable: true, get: function () { return McpTokenVault_js_1.decrypt; } });
Object.defineProperty(exports, "encryptForStorage", { enumerable: true, get: function () { return McpTokenVault_js_1.encryptForStorage; } });
Object.defineProperty(exports, "decryptFromStorage", { enumerable: true, get: function () { return McpTokenVault_js_1.decryptFromStorage; } });
// ─── Rate limiting ────────────────────────────────────────────────────────────
var McpRateLimit_js_1 = require("./McpRateLimit.js");
Object.defineProperty(exports, "checkRateLimit", { enumerable: true, get: function () { return McpRateLimit_js_1.checkRateLimit; } });
Object.defineProperty(exports, "resetRateLimit", { enumerable: true, get: function () { return McpRateLimit_js_1.resetRateLimit; } });
Object.defineProperty(exports, "getRateLimitCount", { enumerable: true, get: function () { return McpRateLimit_js_1.getRateLimitCount; } });
// ─── Connector registry ───────────────────────────────────────────────────────
var index_js_1 = require("./connectors/index.js");
Object.defineProperty(exports, "CONNECTOR_REGISTRY", { enumerable: true, get: function () { return index_js_1.CONNECTOR_REGISTRY; } });
Object.defineProperty(exports, "getConnector", { enumerable: true, get: function () { return index_js_1.getConnector; } });
Object.defineProperty(exports, "getAllConnectors", { enumerable: true, get: function () { return index_js_1.getAllConnectors; } });
Object.defineProperty(exports, "NotionConnector", { enumerable: true, get: function () { return index_js_1.NotionConnector; } });
Object.defineProperty(exports, "GitHubConnector", { enumerable: true, get: function () { return index_js_1.GitHubConnector; } });
Object.defineProperty(exports, "FigmaConnector", { enumerable: true, get: function () { return index_js_1.FigmaConnector; } });
Object.defineProperty(exports, "SlackConnector", { enumerable: true, get: function () { return index_js_1.SlackConnector; } });
Object.defineProperty(exports, "LinearConnector", { enumerable: true, get: function () { return index_js_1.LinearConnector; } });
Object.defineProperty(exports, "JiraConnector", { enumerable: true, get: function () { return index_js_1.JiraConnector; } });
Object.defineProperty(exports, "GoogleWorkspaceConnector", { enumerable: true, get: function () { return index_js_1.GoogleWorkspaceConnector; } });
Object.defineProperty(exports, "HubSpotConnector", { enumerable: true, get: function () { return index_js_1.HubSpotConnector; } });
Object.defineProperty(exports, "CanvaConnector", { enumerable: true, get: function () { return index_js_1.CanvaConnector; } });
Object.defineProperty(exports, "IntercomConnector", { enumerable: true, get: function () { return index_js_1.IntercomConnector; } });
