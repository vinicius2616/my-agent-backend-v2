export interface EmailUniqueForRegistrationInput {
  userExists: boolean;
}

export function emailUniqueForRegistration(input: EmailUniqueForRegistrationInput): boolean {
  return !input.userExists;
}
