import type { LoginInput, LoginOutput } from '../dto';
import type { IAuthProviderService } from '../../domain/services';
import { Email } from '../../domain/value-objects';
import { UnauthorizedError, ValidationError } from '@shared/errors/app-error';

export interface ILoginUseCase {
  execute(input: LoginInput): Promise<LoginOutput>;
}

export class LoginUseCase implements ILoginUseCase {
  constructor(private readonly authProviderService: IAuthProviderService) {}

  async execute(input: LoginInput): Promise<LoginOutput> {
    try {
      new Email(input.email);
    } catch {
      throw new ValidationError('E-mail inválido.');
    }

    const result = await this.authProviderService.signInEmail({
      email: input.email,
      password: input.password,
    });

    if (!result) {
      throw new UnauthorizedError('E-mail ou senha inválidos.');
    }

    return {
      userId: result.userId,
      email: result.email,
      name: result.name,
    };
  }
}
