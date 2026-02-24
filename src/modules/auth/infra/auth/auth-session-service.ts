import type { IAuthSessionService, SessionData } from '../../domain/services/auth-session-service';
import { auth } from './better-auth';
import { fromNodeHeaders } from 'better-auth/node';
import type { Request, Response } from 'express';

function setAuthCookiesFromHeaders(res: Response, headers: Headers): void {
  const setCookie = headers.get('set-cookie');
  if (setCookie) {
    res.setHeader('Set-Cookie', setCookie);
  }
}

export class BetterAuthSessionService implements IAuthSessionService {
  constructor(
    private readonly req: Request,
    private readonly res: Response
  ) {}

  async createSession(_input: {
    userId: string;
    token: string;
    expiresAt: Date;
  }): Promise<SessionData> {
    throw new Error('createSession ainda não implementado.');
  }

  async getSessionByToken(_token: string): Promise<SessionData | null> {
    return null;
  }

  async invalidateSession(_token: string): Promise<void> {
    const result = await auth.api.signOut({
      headers: fromNodeHeaders(this.req.headers),
      returnHeaders: true,
    }) as { headers?: Headers };

    if (result?.headers) {
      setAuthCookiesFromHeaders(this.res, result.headers);
    }
  }
}
