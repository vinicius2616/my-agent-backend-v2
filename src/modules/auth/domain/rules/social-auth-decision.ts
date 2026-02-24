export type SocialAuthDecisionResult = 'link' | 'create' | 'login';

export interface SocialAuthDecisionInput {
  userExists: boolean;
  alreadyHasProvider: boolean;
}

export function socialAuthDecision(input: SocialAuthDecisionInput): SocialAuthDecisionResult {
  if (!input.userExists) {
    return 'create';
  }
  if (input.alreadyHasProvider) {
    return 'login';
  }
  return 'link';
}
