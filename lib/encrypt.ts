import crypto from 'crypto';

const secret = '8OQTAoMc51EKdVMUJvg2Esp4sYDU1t2B'; // Store this securely
const algorithm = 'aes-256-cbc';
const iv = crypto.randomBytes(16);

export async function encrypt(text: string): Promise<string> {
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(secret), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

export async function decrypt(encryptedText: string): Promise<string> {
  const parts = encryptedText.split(':');
  const iv = Buffer.from(parts[0], 'hex');
  const encrypted = Buffer.from(parts[1], 'hex');
  const decipher = crypto.createDecipheriv(algorithm, Buffer.from(secret), iv);
  let decrypted = decipher.update(encrypted);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}