import type { LogoutInput, LogoutOutput } from '../dto';
import type { IAuthSessionService } from '../../domain/services/auth-session-service';

export interface ILogoutUseCase {
  execute(input: LogoutInput): Promise<LogoutOutput>;
}

export class LogoutUseCase implements ILogoutUseCase {
  constructor(private readonly authSessionService: IAuthSessionService) {}

  async execute(input: LogoutInput): Promise<LogoutOutput> {
    if (input.sessionToken) {
      await this.authSessionService.invalidateSession(input.sessionToken);
    }
    return null;
  }
}
