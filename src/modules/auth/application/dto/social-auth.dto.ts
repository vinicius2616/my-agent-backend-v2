export interface SocialAuthInput {
  provider: string;
  providerAccountId: string;
  email: string;
  name: string;
}

export interface SocialAuthOutput {
  userId: string;
  provider: string;
}
