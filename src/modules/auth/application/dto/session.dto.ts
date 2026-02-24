export interface GetSessionInput {
  sessionToken: string | null;
}

export interface SessionOutput {
  userId: string;
  email: string;
  name: string;
}
