import * as crypto from "crypto";
import { logger } from "../../app.js";

const algorithm = "aes-256-gcm";

function getKey(): Buffer {
  const envKey = process.env.ENCRYPTION_KEY;
  if (!envKey) {
    logger.error("CRITICAL ERROR: ENCRYPTION_KEY environment variable is missing.");
    process.exit(1);
  }
  const key = Buffer.from(envKey, "hex");
  if (key.length !== 32) {
    logger.error("CRITICAL ERROR: ENCRYPTION_KEY must be a 64-character hex string (32 bytes).");
    process.exit(1);
  }
  return key;
}

export async function encrypt(value: string): Promise<string> {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, getKey(), iv);
  
  let encrypted = cipher.update(value, "utf8", "hex");
  encrypted += cipher.final("hex");
  const authTag = cipher.getAuthTag().toString("hex");
  
  return `${iv.toString("hex")}:${authTag}:${encrypted}`;
}

export async function decrypt(value: string): Promise<string> {
  try {
    const parts = value.split(":");
    if (parts.length !== 3) throw new Error("Invalid encrypted format");
    
    const iv = Buffer.from(parts[0], "hex");
    const authTag = Buffer.from(parts[1], "hex");
    const encryptedText = parts[2];
    
    const decipher = crypto.createDecipheriv(algorithm, getKey(), iv);
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encryptedText, "hex", "utf8");
    decrypted += decipher.final("utf8");
    
    return decrypted;
  } catch (error) {
    logger.error({ err: error }, "Failed to decrypt value");
    throw new Error("Decryption failed");
  }
}
