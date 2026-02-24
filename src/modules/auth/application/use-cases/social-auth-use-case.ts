import type { SocialAuthInput, SocialAuthOutput } from '../dto';
import type { IAuthRepository } from '../../domain/repositories';
import { Email, AuthProvider } from '../../domain/value-objects';
import { socialAuthDecision } from '../../domain/rules';
import { ConflictError, ValidationError } from '@shared/errors/app-error';

export interface ISocialAuthUseCase {
  execute(input: SocialAuthInput): Promise<SocialAuthOutput>;
}

export class SocialAuthUseCase implements ISocialAuthUseCase {
  constructor(private readonly authRepository: IAuthRepository) {}

  async execute(input: SocialAuthInput): Promise<SocialAuthOutput> {
    let email: Email;
    let provider: AuthProvider;
    try {
      email = new Email(input.email);
      provider = new AuthProvider(input.provider);
    } catch {
      throw new ValidationError('E-mail ou provedor inválido.');
    }

    const providerValue = provider.value();
    const accountId = input.providerAccountId.trim();

    const existingAccount =
      await this.authRepository.findAccountByProviderIdAndAccountId(
        providerValue,
        accountId
      );
    if (existingAccount) {
      return {
        userId: existingAccount.userId,
        provider: providerValue,
      };
    }

    const user = await this.authRepository.findUserByEmail(email.value());
    const account = user
      ? await this.authRepository.findAccountByUserIdAndProvider(
          user.id,
          providerValue
        )
      : null;

    const decision = socialAuthDecision({
      userExists: !!user,
      alreadyHasProvider: !!account,
    });

    if (decision === 'create') {
      const userAgain = await this.authRepository.findUserByEmail(email.value());
      if (userAgain) {
        throw new ConflictError('Este e-mail já está cadastrado.');
      }
      const newUser = await this.authRepository.createUser({
        email: email.value(),
        name: input.name.trim() || null,
      });
      const accountAgain =
        await this.authRepository.findAccountByProviderIdAndAccountId(
          providerValue,
          accountId
        );
      if (accountAgain) {
        return {
          userId: accountAgain.userId,
          provider: providerValue,
        };
      }
      await this.authRepository.createAccount({
        userId: newUser.id,
        providerId: providerValue,
        accountId,
      });
      return {
        userId: newUser.id,
        provider: providerValue,
      };
    }

    if (decision === 'link') {
      const accountAgain =
        await this.authRepository.findAccountByProviderIdAndAccountId(
          providerValue,
          accountId
        );
      if (accountAgain) {
        return {
          userId: accountAgain.userId,
          provider: providerValue,
        };
      }
      await this.authRepository.createAccount({
        userId: user!.id,
        providerId: providerValue,
        accountId,
      });
      return {
        userId: user!.id,
        provider: providerValue,
      };
    }

    return {
      userId: user!.id,
      provider: providerValue,
    };
  }
}
