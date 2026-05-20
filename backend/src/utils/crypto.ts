import crypto from 'crypto';

/**
 * Derives a key from a master password and salt using PBKDF2.
 * Uses SHA-256, 310,000 iterations, and outputs a 32-byte key.
 */
export function deriveKey(masterPassword: string, salt: Buffer): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(masterPassword, salt, 310000, 32, 'sha256', (err, derivedKey) => {
      if (err) {
        reject(err);
      } else {
        resolve(derivedKey);
      }
    });
  });
}

/**
 * Encrypts a plaintext string using AES-256-GCM.
 * Returns a base64-encoded string formatted as: iv:authTag:ciphertext
 */
export function encryptField(plaintext: string, key: Buffer): string {
  const iv = crypto.randomBytes(12); // Standard 12-byte IV for GCM
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);

  let ciphertext = cipher.update(plaintext, 'utf8', 'base64');
  ciphertext += cipher.final('base64');

  const authTag = cipher.getAuthTag();

  const ivBase64 = iv.toString('base64');
  const authTagBase64 = authTag.toString('base64');

  return `${ivBase64}:${authTagBase64}:${ciphertext}`;
}

/**
 * Decrypts an AES-256-GCM encrypted string formatted as: iv:authTag:ciphertext
 */
export function decryptField(encrypted: string, key: Buffer): string {
  const parts = encrypted.split(':');
  if (parts.length !== 3) {
    throw new Error('Invalid encrypted format. Expected iv:authTag:ciphertext');
  }

  const [ivBase64, authTagBase64, ciphertextBase64] = parts;

  const iv = Buffer.from(ivBase64, 'base64');
  const authTag = Buffer.from(authTagBase64, 'base64');
  const ciphertext = Buffer.from(ciphertextBase64, 'base64');

  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(ciphertext);
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString('utf8');
}
