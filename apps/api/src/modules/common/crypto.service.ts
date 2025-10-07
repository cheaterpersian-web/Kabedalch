import { Injectable } from '@nestjs/common';
import crypto from 'crypto';

@Injectable()
export class CryptoService {
  private getKey() {
    const key = process.env.DATA_ENCRYPTION_KEY;
    if (!key) throw new Error('DATA_ENCRYPTION_KEY is required');
    const buf = Buffer.from(key, 'base64');
    if (buf.length !== 32) {
      throw new Error('DATA_ENCRYPTION_KEY must be 32 bytes base64');
    }
    return buf;
  }

  encrypt(plaintext: string): string {
    const key = this.getKey();
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
    const ciphertext = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
    const tag = cipher.getAuthTag();
    return Buffer.concat([iv, tag, ciphertext]).toString('base64');
  }

  decrypt(payload: string): string {
    const key = this.getKey();
    const buf = Buffer.from(payload, 'base64');
    const iv = buf.subarray(0, 12);
    const tag = buf.subarray(12, 28);
    const ciphertext = buf.subarray(28);
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(tag);
    const plaintext = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
    return plaintext.toString('utf8');
  }
}
