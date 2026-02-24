export interface RegisterInput {
  email: string;
  password: string;
  name: string;
}

export interface RegisterOutput {
  userId: string;
  email: string;
  name: string;
}
