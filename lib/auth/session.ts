import { cookies } from "next/headers";

import { signAuthToken, verifyAuthToken, type AuthTokenPayload } from "./jwt";

export const AUTH_COOKIE_NAME = "wff_session";

const AUTH_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

const authCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: AUTH_COOKIE_MAX_AGE_SECONDS,
};

export async function setAuthCookie(payload: AuthTokenPayload) {
  const token = await signAuthToken(payload);
  const cookieStore = await cookies();

  cookieStore.set(AUTH_COOKIE_NAME, token, authCookieOptions);
}

export async function getAuthSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  try {
    return await verifyAuthToken(token);
  } catch {
    return null;
  }
}

export async function clearAuthCookie() {
  const cookieStore = await cookies();

  cookieStore.delete(AUTH_COOKIE_NAME);
}
