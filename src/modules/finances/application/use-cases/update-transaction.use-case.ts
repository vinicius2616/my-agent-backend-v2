import type {
  UpdateTransactionInput,
  UpdateTransactionOutput,
  TransactionOutput,
} from '../dto';
import type {
  ITransactionRepository,
  TransactionRecord,
  UpdateTransactionData,
} from '../../domain/repositories';
import { Description, Amount, LaunchDate } from '../../domain/value-objects';
import {
  isDescriptionValid,
  isAmountGreaterThanZero,
  isInstallmentRecurringExclusive,
  canChangeTotalInstallments,
  canSetRecurring,
} from '../../domain/rules';
import { ValidationError, NotFoundError } from '@shared/errors/app-error';

export interface IUpdateTransactionUseCase {
  execute(userId: string, id: string, input: UpdateTransactionInput): Promise<UpdateTransactionOutput>;
}

const MESSAGE_SUCCESS = 'Lançamento atualizado com sucesso.';
const MESSAGE_NOT_FOUND = 'Transação não encontrada.';
const MESSAGE_NO_CHANGE_TOTAL_INSTALLMENTS =
  'Não é permitido alterar o total de parcelas após a criação.';
const MESSAGE_PARCELLED_NOT_RECURRING =
  'Transação parcelada não pode ser marcada como recorrente.';
const MESSAGE_INSTALLMENT_RECURRING = 'Parcelado não pode ser recorrente.';

function toTransactionOutput(record: TransactionRecord): TransactionOutput {
  const { deletedAt: _, ...output } = record;
  return output;
}

function buildUpdateData(input: UpdateTransactionInput): UpdateTransactionData {
  const data: UpdateTransactionData = {};
  if (input.description !== undefined) data.description = input.description;
  if (input.amount !== undefined) data.amount = input.amount;
  if (input.type !== undefined) data.type = input.type;
  if (input.category !== undefined) data.category = input.category;
  if (input.isRecurring !== undefined) data.isRecurring = input.isRecurring;
  if (input.installmentNumber !== undefined)
    data.installmentNumber = input.installmentNumber;
  if (input.totalInstallments !== undefined)
    data.totalInstallments = input.totalInstallments;
  if (input.launchDate !== undefined) data.launchDate = input.launchDate;
  return data;
}

export class UpdateTransactionUseCase implements IUpdateTransactionUseCase {
  constructor(private readonly transactionRepository: ITransactionRepository) {}

  async execute(
    userId: string,
    id: string,
    input: UpdateTransactionInput
  ): Promise<UpdateTransactionOutput> {
    const existing = await this.transactionRepository.findById(userId, id);
    if (!existing) {
      throw new NotFoundError(MESSAGE_NOT_FOUND);
    }

    const newIsRecurring = input.isRecurring ?? existing.isRecurring;
    const newInstallmentNumber =
      input.installmentNumber !== undefined
        ? input.installmentNumber
        : existing.installmentNumber;
    const newTotalInstallments =
      input.totalInstallments !== undefined
        ? input.totalInstallments
        : existing.totalInstallments;

    if (
      !canChangeTotalInstallments(
        existing.totalInstallments,
        newTotalInstallments
      )
    ) {
      throw new ValidationError(MESSAGE_NO_CHANGE_TOTAL_INSTALLMENTS);
    }

    if (!canSetRecurring(existing.totalInstallments, newIsRecurring)) {
      throw new ValidationError(MESSAGE_PARCELLED_NOT_RECURRING);
    }

    if (
      !isInstallmentRecurringExclusive({
        isRecurring: newIsRecurring,
        installmentNumber: newInstallmentNumber,
        totalInstallments: newTotalInstallments,
      })
    ) {
      throw new ValidationError(MESSAGE_INSTALLMENT_RECURRING);
    }

    if (input.description !== undefined) {
      if (!isDescriptionValid(input.description)) {
        throw new ValidationError(
          'Descrição deve ter entre 3 e 255 caracteres e não pode estar vazia.'
        );
      }
      try {
        new Description(input.description);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Dados inválidos.';
        throw new ValidationError(message);
      }
    }

    if (input.amount !== undefined) {
      if (!isAmountGreaterThanZero(input.amount)) {
        throw new ValidationError('Valor da transação deve ser maior que zero.');
      }
      try {
        new Amount(input.amount);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Dados inválidos.';
        throw new ValidationError(message);
      }
    }

    if (input.launchDate !== undefined) {
      try {
        new LaunchDate(input.launchDate);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Data de lançamento inválida.';
        throw new ValidationError(message);
      }
    }

    const data = buildUpdateData(input);
    let record: TransactionRecord;

    if (Object.keys(data).length === 0) {
      record = existing;
    } else {
      const updated = await this.transactionRepository.update(userId, id, data);
      if (!updated) {
        throw new NotFoundError(MESSAGE_NOT_FOUND);
      }
      record = updated;
    }

    return {
      message: MESSAGE_SUCCESS,
      transaction: toTransactionOutput(record),
    };
  }
}
