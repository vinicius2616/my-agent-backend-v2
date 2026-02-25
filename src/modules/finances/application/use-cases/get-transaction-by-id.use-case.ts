import type { TransactionOutput } from '../dto';
import type {
  ITransactionRepository,
  TransactionRecord,
} from '../../domain/repositories';
import { NotFoundError } from '@shared/errors/app-error';

export interface IGetTransactionByIdUseCase {
  execute(userId: string, id: string): Promise<TransactionOutput>;
}

const MESSAGE_NOT_FOUND = 'Transação não encontrada.';

function toTransactionOutput(record: TransactionRecord): TransactionOutput {
  const { deletedAt: _, ...output } = record;
  return output;
}

export class GetTransactionByIdUseCase implements IGetTransactionByIdUseCase {
  constructor(private readonly transactionRepository: ITransactionRepository) {}

  async execute(userId: string, id: string): Promise<TransactionOutput> {
    const record = await this.transactionRepository.findById(userId, id);
    if (!record) {
      throw new NotFoundError(MESSAGE_NOT_FOUND);
    }
    return toTransactionOutput(record);
  }
}
