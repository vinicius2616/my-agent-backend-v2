import type { RegisterInput, RegisterOutput } from '../dto';
import type { IAuthRepository } from '../../domain/repositories';
import type { IAuthProviderService } from '../../domain/services';
import { Email } from '../../domain/value-objects';
import { emailUniqueForRegistration } from '../../domain/rules';
import { ConflictError, ValidationError } from '@shared/errors/app-error';

export interface IRegisterUseCase {
  execute(input: RegisterInput): Promise<RegisterOutput>;
}

export class RegisterUseCase implements IRegisterUseCase {
  constructor(
    private readonly authRepository: IAuthRepository,
    private readonly authProviderService: IAuthProviderService
  ) {}

  async execute(input: RegisterInput): Promise<RegisterOutput> {
    let email: Email;
    try {
      email = new Email(input.email);
    } catch {
      throw new ValidationError('E-mail inválido.');
    }

    const existingUser = await this.authRepository.findUserByEmail(email.value());
    const canRegister = emailUniqueForRegistration({ userExists: !!existingUser });
    if (!canRegister) {
      throw new ConflictError('Este e-mail já está cadastrado.');
    }

    const result = await this.authProviderService.signUpEmail({
      email: input.email,
      password: input.password,
      name: input.name,
    });

    return {
      userId: result.userId,
      email: result.email,
      name: result.name,
    };
  }
}
