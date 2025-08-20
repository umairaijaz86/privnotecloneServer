import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const ALG = 'AES-256-GCM';
const NODE_ALG = 'aes-256-gcm'; 

const keyB64 = process.env.SECRET_KEY_BASE64;
if (!keyB64) {
    throw new Error('SECRET_KEY_BASE64 environment variable is not set');
}

const key = Buffer.from(keyB64, 'base64');

export function encryptMessage(plaintext: string) {
    const iv = crypto.randomBytes(12); // 96 bits for GCM
    const cipher = crypto.createCipheriv(NODE_ALG, key, iv);
    
    const ciphertext = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
    const tag = cipher.getAuthTag();
  
    
    return {
        cipherTextB64: Buffer.concat([ciphertext, tag]).toString('base64'),
        ivB64: iv.toString('base64'),
        alg: ALG,
    };
}

export function decryptMessage(cipherTextB64: string, ivB64: string) {
    const buf = Buffer.from(cipherTextB64, 'base64');
    const tag = buf.subarray(buf.length - 16); // Last 16 bytes are the tag
    const data = buf.subarray(0, buf.length - 16); // Everything before the tag is the ciphertext
    const iv = Buffer.from(ivB64, 'base64');

    const decipher = crypto.createDecipheriv(NODE_ALG, key, iv);
    decipher.setAuthTag(tag);  
    const plainText = Buffer.concat([decipher.update(data), decipher.final()]).toString('utf8');
    return plainText;
}
