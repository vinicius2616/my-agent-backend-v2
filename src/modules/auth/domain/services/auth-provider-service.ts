export interface SocialAuthInput {
  provider: string;
  token: string;
}

export interface SocialAuthResult {
  userId: string;
  sessionToken: string;
  expiresAt: Date;
}

export interface SignUpEmailInput {
  email: string;
  password: string;
  name: string;
}

export interface SignInEmailInput {
  email: string;
  password: string;
}

export interface EmailAuthResult {
  userId: string;
  email: string;
  name: string;
}

export interface IAuthProviderService {
  signUpEmail(input: SignUpEmailInput): Promise<EmailAuthResult>;
  signInEmail(input: SignInEmailInput): Promise<EmailAuthResult | null>;
  authenticateWithProvider(input: SocialAuthInput): Promise<SocialAuthResult | null>;
}
