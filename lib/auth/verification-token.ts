import { randomBytes } from "crypto";

const EXPIRY_HOURS = 24;

export function generateVerificationToken() {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + EXPIRY_HOURS * 60 * 60 * 1000);
  return { token, expiresAt };
}
