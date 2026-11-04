/**
 * LovelyCam - Cryptography Module (Real Web Crypto API)
 * Provides SHA-256 hashing and AES-GCM encryption
 */

const CryptoUtils = {
    // SHA-256 Hash
    async hashPassword(password) {
        const msgBuffer = new TextEncoder().encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    },

    // Verify Password
    async verifyPassword(inputPassword, storedHash) {
        const inputHash = await this.hashPassword(inputPassword);
        return inputHash === storedHash;
    },

    // --- E2EE Helpers (AES-GCM) ---

    // Generate a random key for the session/conversation
    async generateKey() {
        return await crypto.subtle.generateKey(
            { name: "AES-GCM", length: 256 },
            true,
            ["encrypt", "decrypt"]
        );
    },

    // Export key to string (JWK) for storage (simulated signaling)
    async exportKey(key) {
        const exported = await crypto.subtle.exportKey("jwk", key);
        return JSON.stringify(exported);
    },

    // Import key from string
    async importKey(jsonKey) {
        const jwk = JSON.parse(jsonKey);
        return await crypto.subtle.importKey(
            "jwk",
            jwk,
            { name: "AES-GCM" },
            true,
            ["encrypt", "decrypt"]
        );
    },

    // Encrypt Data
    async encrypt(text, key) {
        const encoded = new TextEncoder().encode(text);
        const iv = crypto.getRandomValues(new Uint8Array(12));
        const encrypted = await crypto.subtle.encrypt(
            { name: "AES-GCM", iv: iv },
            key,
            encoded
        );

        // Convert to Base64 for storage
        const encryptedArray = Array.from(new Uint8Array(encrypted));
        const encryptedHex = encryptedArray.map(b => b.toString(16).padStart(2, '0')).join('');
        const ivHex = Array.from(iv).map(b => b.toString(16).padStart(2, '0')).join('');
        
        return {
            content: encryptedHex,
            iv: ivHex
        };
    },

    // Decrypt Data
    async decrypt(encryptedData, key) {
        // encryptedData should be { content: hex, iv: hex }
        if (!encryptedData || !encryptedData.content || !encryptedData.iv) return null;

        const iv = new Uint8Array(encryptedData.iv.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
        const content = new Uint8Array(encryptedData.content.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));

        try {
            const decrypted = await crypto.subtle.decrypt(
                { name: "AES-GCM", iv: iv },
                key,
                content
            );
            return new TextDecoder().decode(decrypted);
        } catch (e) {
            console.error("Decryption failed:", e);
            return null;
        }
    }
};

window.CryptoUtils = CryptoUtils;
