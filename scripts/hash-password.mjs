#!/usr/bin/env node
// Generates a value for ADMIN_PASSWORD_HASH.
// Usage: npm run hash-password -- "your-strong-password"
import { pbkdf2Sync, randomBytes } from "node:crypto";

const password = process.argv[2];
if (!password || password.length < 12) {
  console.error('Usage: npm run hash-password -- "<password of at least 12 characters>"');
  process.exit(1);
}

const iterations = 310000;
const salt = randomBytes(16);
const hash = pbkdf2Sync(password, salt, iterations, 32, "sha256");
const b64url = (buf) => buf.toString("base64url");

console.log(`ADMIN_PASSWORD_HASH=pbkdf2:${iterations}:${b64url(salt)}:${b64url(hash)}`);
console.log(`ADMIN_SESSION_SECRET=${randomBytes(48).toString("base64url")}`);
