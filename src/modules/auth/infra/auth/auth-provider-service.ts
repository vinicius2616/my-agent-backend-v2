import type {
  IAuthProviderService,
  SignUpEmailInput,
  SignInEmailInput,
  EmailAuthResult,
  SocialAuthInput,
  SocialAuthResult,
} from '../../domain/services/auth-provider-service';
import { auth } from './better-auth';
import { fromNodeHeaders } from 'better-auth/node';
import type { Request, Response } from 'express';
import { ConflictError } from '@shared/errors/app-error';

function setAuthCookiesFromHeaders(res: Response, headers: Headers): void {
  const setCookie = headers.get('set-cookie');
  if (setCookie) {
    res.setHeader('Set-Cookie', setCookie);
  }
}

export class BetterAuthProviderService implements IAuthProviderService {
  constructor(
    private readonly req: Request,
    private readonly res: Response
  ) {}

  async signUpEmail(input: SignUpEmailInput): Promise<EmailAuthResult> {
    try {
      const result = await auth.api.signUpEmail({
        body: {
          email: input.email,
          password: input.password,
          name: input.name,
        },
        returnHeaders: true,
      }) as {
        headers?: Headers;
        response?: { user?: { id: string; email: string; name: string | null } };
      };

      if (result.headers) {
        setAuthCookiesFromHeaders(this.res, result.headers);
      }

      const user = result.response?.user;
      if (!user) {
        throw new ConflictError('Não foi possível realizar o cadastro.');
      }

      return {
        userId: user.id,
        email: user.email,
        name: user.name ?? '',
      };
    } catch (err: unknown) {
      if (err instanceof ConflictError) throw err;
      const message = err instanceof Error ? err.message : String(err);
      if (message.toLowerCase().includes('already') || message.toLowerCase().includes('exist') || message.toLowerCase().includes('unique')) {
        throw new ConflictError('Este e-mail já está cadastrado.');
      }
      throw err;
    }
  }

  async signInEmail(input: SignInEmailInput): Promise<EmailAuthResult | null> {
    try {
      const result = await auth.api.signInEmail({
        body: {
          email: input.email,
          password: input.password,
        },
        headers: fromNodeHeaders(this.req.headers),
        returnHeaders: true,
      }) as {
        headers?: Headers;
        response?: { user?: { id: string; email: string; name: string | null } };
      };

      if (result.headers) {
        setAuthCookiesFromHeaders(this.res, result.headers);
      }

      const user = result.response?.user;
      if (!user) {
        return null;
      }

      return {
        userId: user.id,
        email: user.email,
        name: user.name ?? '',
      };
    } catch {
      return null;
    }
  }

  async authenticateWithProvider(_input: SocialAuthInput): Promise<SocialAuthResult | null> {
    throw new Error('Login social ainda não implementado.');
  }
}
