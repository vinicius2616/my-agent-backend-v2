export interface CreateSessionInput {
  userId: string;
  token: string;
  expiresAt: Date;
}

export interface SessionData {
  id: string;
  userId: string;
  expiresAt: Date;
}

export interface IAuthSessionService {
  createSession(input: CreateSessionInput): Promise<SessionData>;
  getSessionByToken(token: string): Promise<SessionData | null>;
  invalidateSession(token: string): Promise<void>;
}
