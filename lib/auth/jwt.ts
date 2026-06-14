import { jwtVerify, SignJWT } from "jose";

const encoder = new TextEncoder();

export type AuthTokenPayload = {
  userId: string;
  email: string;
};

function getJwtSecret() {
  const secret = process.env.AUTH_SECRET;

  if (!secret) {
    throw new Error("AUTH_SECRET is not configured");
  }

  return encoder.encode(secret);
}

export async function signAuthToken(payload: AuthTokenPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.userId)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getJwtSecret());
}

export async function verifyAuthToken(token: string) {
  const { payload } = await jwtVerify(token, getJwtSecret());

  if (typeof payload.userId !== "string" || typeof payload.email !== "string") {
    return null;
  }

  return {
    userId: payload.userId,
    email: payload.email,
  };
}
