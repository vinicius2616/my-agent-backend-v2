import type { GetSessionInput, SessionOutput } from '../dto';
import type { IAuthRepository } from '../../domain/repositories/auth-repository';

export interface IGetSessionUseCase {
  execute(input: GetSessionInput): Promise<SessionOutput | null>;
}

export class GetSessionUseCase implements IGetSessionUseCase {
  constructor(private readonly authRepository: IAuthRepository) {}

  async execute(input: GetSessionInput): Promise<SessionOutput | null> {
    if (!input.sessionToken) {
      return null;
    }

    const session = await this.authRepository.findSessionByToken(input.sessionToken);
    if (!session) {
      return null;
    }

    const user = await this.authRepository.findUserById(session.userId);
    if (!user) {
      return null;
    }

    return {
      userId: user.id,
      email: user.email,
      name: user.name ?? '',
    };
  }
}
