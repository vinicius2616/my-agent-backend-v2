import type {
  ITransactionRepository,
  TransactionRecord,
  CreateTransactionData,
  UpdateTransactionData,
} from '../../domain/repositories/transaction-repository';
import { prisma } from '@shared/database/prisma';
import {
  toTransactionRecord,
  toPrismaCreateData,
  toPrismaUpdateData,
} from '../mappers/transaction-mapper';

export class PrismaTransactionRepository implements ITransactionRepository {
  async create(userId: string, data: CreateTransactionData): Promise<TransactionRecord> {
    const createData = toPrismaCreateData(userId, data);
    const created = await prisma.transaction.create({
      data: createData,
    });
    return toTransactionRecord(created);
  }

  async update(
    userId: string,
    id: string,
    data: UpdateTransactionData
  ): Promise<TransactionRecord | null> {
    const updateData = toPrismaUpdateData(data);
    if (Object.keys(updateData).length === 0) {
      const existing = await this.findById(userId, id);
      return existing;
    }
    const result = await prisma.transaction.updateMany({
      where: { id, userId, deletedAt: null },
      data: updateData,
    });
    if (result.count === 0) return null;
    const updated = await prisma.transaction.findFirst({
      where: { id, userId },
    });
    return updated ? toTransactionRecord(updated) : null;
  }

  async findById(userId: string, id: string): Promise<TransactionRecord | null> {
    const row = await prisma.transaction.findFirst({
      where: { id, userId, deletedAt: null },
    });
    return row ? toTransactionRecord(row) : null;
  }

  async delete(userId: string, id: string): Promise<void> {
    await prisma.transaction.updateMany({
      where: { id, userId },
      data: { deletedAt: new Date() },
    });
  }
}
