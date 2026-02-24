export interface LoginInput {
  email: string;
  password: string;
}

export interface LoginOutput {
  userId: string;
  email: string;
  name: string;
}
