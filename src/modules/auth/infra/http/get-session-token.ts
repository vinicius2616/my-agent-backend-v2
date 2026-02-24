import type { Request } from 'express';
import { createHmac, timingSafeEqual } from 'crypto';
import { env } from '@shared/env';

const BETTER_AUTH_SESSION_COOKIE_NAME = 'better-auth.session_token';

/**
 * Codifica buffer em base64url sem padding (compatível com Better Auth).
 */
function toBase64UrlNoPadding(buffer: Buffer): string {
  return buffer
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/**
 * Verifica a assinatura HMAC do cookie e retorna o token puro.
 * Formato do cookie: token.assinatura (assinatura = HMAC-SHA256 base64urlnopad do token).
 */
function verifySignedSessionCookie(signedValue: string): string | null {
  const dotIndex = signedValue.indexOf('.');
  if (dotIndex <= 0 || dotIndex === signedValue.length - 1) {
    return null;
  }
  const token = signedValue.slice(0, dotIndex);
  const signature = signedValue.slice(dotIndex + 1);
  const expectedSignature = toBase64UrlNoPadding(
    createHmac('sha256', env.BETTER_AUTH_SECRET).update(token, 'utf8').digest()
  );
  // Cookie pode vir em base64 (+/) ou base64url (-_) e com ou sem padding
  const normalizedSignature = signature.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  if (expectedSignature.length !== normalizedSignature.length) {
    return null;
  }
  try {
    if (
      timingSafeEqual(
        Buffer.from(expectedSignature, 'utf8'),
        Buffer.from(normalizedSignature, 'utf8')
      )
    ) {
      return token;
    }
  } catch {
    return null;
  }
  return null;
}

export function getSessionTokenFromRequest(req: Request): string | null {
  const cookieHeader = req.headers.cookie;
  if (!cookieHeader || typeof cookieHeader !== 'string') {
    return null;
  }

  const pairs = cookieHeader.split(';');
  for (const pair of pairs) {
    const [name, ...valueParts] = pair.trim().split('=');
    const value = valueParts.join('=').trim();
    if (name === BETTER_AUTH_SESSION_COOKIE_NAME && value) {
      const decoded = decodeURIComponent(value);
      return verifySignedSessionCookie(decoded);
    }
  }
  return null;
}
