export interface EncryptedToken {
    encrypted: string;
    iv: string;
    authTag: string;
}
/**
 * Encrypt a plaintext token.
 * Store the returned object as JSON in MongoDB.
 *
 * @security Do NOT log the plaintext parameter.
 */
export declare function encrypt(plaintext: string): EncryptedToken;
/**
 * Decrypt a stored EncryptedToken.
 *
 * @security Do NOT log the return value.
 */
export declare function decrypt(stored: EncryptedToken): string;
/**
 * Encrypt and JSON-stringify for MongoDB storage.
 *
 * Usage: userIntegration.auth.accessToken = encryptForStorage(rawToken)
 *
 * @security Do NOT log rawToken.
 */
export declare function encryptForStorage(rawToken: string): string;
/**
 * JSON-parse and decrypt from a MongoDB value.
 *
 * Usage: const rawToken = decryptFromStorage(userIntegration.auth.accessToken)
 *
 * @security Do NOT log the return value.
 */
export declare function decryptFromStorage(stored: string): string;
//# sourceMappingURL=McpTokenVault.d.ts.map