"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encrypt = encrypt;
exports.decrypt = decrypt;
exports.encryptForStorage = encryptForStorage;
exports.decryptFromStorage = decryptFromStorage;
const crypto_1 = require("crypto");
/**
 * AES-256-GCM token encryption/decryption.
 *
 * TOKEN_VAULT_KEY must be exactly 64 hex characters (= 32 bytes) in .env.
 * Generate: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
 *
 * @security NEVER log plaintext token values — not even in development.
 * @security NEVER store raw tokens in the database — always use encryptForStorage().
 * @security ALWAYS call decryptFromStorage() before passing a token to McpClient.
 */
const ALGORITHM = 'aes-256-gcm';
// Validated once at module load — fails fast if misconfigured.
const rawKey = process.env['TOKEN_VAULT_KEY'] ?? '';
if (rawKey.length !== 64) {
    throw new Error('TOKEN_VAULT_KEY must be exactly 64 hex characters (32 bytes). ' +
        'Generate with: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"');
}
const KEY = Buffer.from(rawKey, 'hex');
// ─── Core functions ───────────────────────────────────────────────────────────
/**
 * Encrypt a plaintext token.
 * Store the returned object as JSON in MongoDB.
 *
 * @security Do NOT log the plaintext parameter.
 */
function encrypt(plaintext) {
    const iv = (0, crypto_1.randomBytes)(16);
    const cipher = (0, crypto_1.createCipheriv)(ALGORITHM, KEY, iv);
    const encrypted = Buffer.concat([
        cipher.update(plaintext, 'utf8'),
        cipher.final(),
    ]);
    return {
        encrypted: encrypted.toString('hex'),
        iv: iv.toString('hex'),
        authTag: cipher.getAuthTag().toString('hex'),
    };
}
/**
 * Decrypt a stored EncryptedToken.
 *
 * @security Do NOT log the return value.
 */
function decrypt(stored) {
    const decipher = (0, crypto_1.createDecipheriv)(ALGORITHM, KEY, Buffer.from(stored.iv, 'hex'));
    decipher.setAuthTag(Buffer.from(stored.authTag, 'hex'));
    const decrypted = Buffer.concat([
        decipher.update(Buffer.from(stored.encrypted, 'hex')),
        decipher.final(),
    ]);
    return decrypted.toString('utf8');
}
// ─── Convenience wrappers (for MongoDB storage) ───────────────────────────────
/**
 * Encrypt and JSON-stringify for MongoDB storage.
 *
 * Usage: userIntegration.auth.accessToken = encryptForStorage(rawToken)
 *
 * @security Do NOT log rawToken.
 */
function encryptForStorage(rawToken) {
    return JSON.stringify(encrypt(rawToken));
}
/**
 * JSON-parse and decrypt from a MongoDB value.
 *
 * Usage: const rawToken = decryptFromStorage(userIntegration.auth.accessToken)
 *
 * @security Do NOT log the return value.
 */
function decryptFromStorage(stored) {
    return decrypt(JSON.parse(stored));
}
