import type { CreateTransactionInput, CreateTransactionOutput } from '../dto';
import type {
  ITransactionRepository,
  CreateTransactionData,
} from '../../domain/repositories';
import { Description, Amount, LaunchDate } from '../../domain/value-objects';
import {
  isDescriptionValid,
  isAmountGreaterThanZero,
  isInstallmentRecurringExclusive,
} from '../../domain/rules';
import { ValidationError } from '@shared/errors/app-error';

export interface ICreateTransactionUseCase {
  execute(userId: string, input: CreateTransactionInput): Promise<CreateTransactionOutput>;
}

const MESSAGE_SUCCESS = 'Lançamento criado com sucesso.';

export class CreateTransactionUseCase implements ICreateTransactionUseCase {
  constructor(private readonly transactionRepository: ITransactionRepository) {}

  async execute(userId: string, input: CreateTransactionInput): Promise<CreateTransactionOutput> {
    if (!isDescriptionValid(input.description)) {
      throw new ValidationError(
        'Descrição deve ter entre 3 e 255 caracteres e não pode estar vazia.'
      );
    }

    if (!isAmountGreaterThanZero(input.amount)) {
      throw new ValidationError('Valor da transação deve ser maior que zero.');
    }

    const installmentNumber = input.installmentNumber ?? null;
    const totalInstallments = input.totalInstallments ?? null;
    if (
      !isInstallmentRecurringExclusive({
        isRecurring: input.isRecurring,
        installmentNumber,
        totalInstallments,
      })
    ) {
      throw new ValidationError('Parcelado não pode ser recorrente.');
    }

    try {
      new Description(input.description);
      new Amount(input.amount);
      new LaunchDate(input.launchDate);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Dados inválidos.';
      throw new ValidationError(message);
    }

    const total = totalInstallments ?? 1;
    const transactionIds: string[] = [];

    if (total > 1) {
      for (let i = 1; i <= total; i++) {
        const data: CreateTransactionData = {
          description: input.description,
          amount: input.amount,
          type: input.type,
          category: input.category,
          isRecurring: false,
          installmentNumber: i,
          totalInstallments: total,
          launchDate: input.launchDate,
        };
        const record = await this.transactionRepository.create(userId, data);
        transactionIds.push(record.id);
      }
    } else {
      const data: CreateTransactionData = {
        description: input.description,
        amount: input.amount,
        type: input.type,
        category: input.category,
        isRecurring: input.isRecurring,
        installmentNumber: null,
        totalInstallments: null,
        launchDate: input.launchDate,
      };
      const record = await this.transactionRepository.create(userId, data);
      transactionIds.push(record.id);
    }

    return {
      message: MESSAGE_SUCCESS,
      transactionIds,
    };
  }
}
