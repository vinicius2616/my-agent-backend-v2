import type { DeleteTransactionOutput } from '../dto';
import type { ITransactionRepository } from '../../domain/repositories';
import { NotFoundError } from '@shared/errors/app-error';

export interface IDeleteTransactionUseCase {
  execute(userId: string, id: string): Promise<DeleteTransactionOutput>;
}

const MESSAGE_NOT_FOUND = 'Transação não encontrada.';
const MESSAGE_SUCCESS = 'Lançamento removido com sucesso.';

export class DeleteTransactionUseCase implements IDeleteTransactionUseCase {
  constructor(private readonly transactionRepository: ITransactionRepository) {}

  async execute(userId: string, id: string): Promise<DeleteTransactionOutput> {
    const record = await this.transactionRepository.findById(userId, id);
    if (!record) {
      throw new NotFoundError(MESSAGE_NOT_FOUND);
    }
    await this.transactionRepository.delete(userId, id);
    return { message: MESSAGE_SUCCESS };
  }
}
