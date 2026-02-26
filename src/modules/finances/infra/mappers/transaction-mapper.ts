import type {
  TransactionRecord,
  CreateTransactionData,
  UpdateTransactionData,
} from '../../domain/repositories/transaction-repository';
import type { TransactionCategoryValue } from '../../domain/value-objects/transaction-category';
import type { TransactionTypeValue } from '../../domain/value-objects/transaction-type';
import { TransactionCategory as PrismaCategory } from '../../../../generated/prisma/enums';
import { TransactionType as PrismaType } from '../../../../generated/prisma/enums';

/** Shape of a Transaction row as returned by Prisma (create/findFirst/etc.). */
export interface PrismaTransactionRow {
  id: string;
  userId: string;
  description: string;
  amount: unknown;
  type: string;
  category: string;
  isRecurring: boolean;
  installmentNumber: number | null;
  totalInstallments: number | null;
  launchDate: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

const PRISMA_CATEGORIES = [
  'alimentacao',
  'transporte',
  'saude',
  'educacao',
  'lazer',
  'outros',
] as const;
type PrismaCategoryValue = (typeof PRISMA_CATEGORIES)[number];

const DOMAIN_CATEGORY_TO_PRISMA: Record<
  TransactionCategoryValue,
  PrismaCategoryValue
> = {
  alimentacao: 'alimentacao',
  moradia: 'outros',
  transporte: 'transporte',
  lazer: 'lazer',
  saude: 'saude',
  educacao: 'educacao',
  salario: 'outros',
  investimentos: 'outros',
  outros: 'outros',
};

function decimalToNumber(value: unknown): number {
  if (typeof value === 'number' && !Number.isNaN(value)) return value;
  if (value != null && typeof (value as { toNumber?: () => number }).toNumber === 'function') {
    return (value as { toNumber: () => number }).toNumber();
  }
  return Number(value);
}

function prismaTypeToDomain(type: string): TransactionTypeValue {
  const lower = type.toLowerCase();
  if (lower === 'entrada') return 'entrada';
  if (lower === 'saida') return 'saida';
  return type as TransactionTypeValue;
}

function domainTypeToPrisma(type: TransactionTypeValue): 'ENTRADA' | 'SAIDA' {
  return type === 'entrada' ? PrismaType.ENTRADA : PrismaType.SAIDA;
}

function domainCategoryToPrisma(category: TransactionCategoryValue): PrismaCategoryValue {
  return DOMAIN_CATEGORY_TO_PRISMA[category];
}

export function toTransactionRecord(row: PrismaTransactionRow): TransactionRecord {
  return {
    id: row.id,
    userId: row.userId,
    description: row.description,
    amount: decimalToNumber(row.amount),
    type: prismaTypeToDomain(row.type),
    category: row.category as TransactionCategoryValue,
    isRecurring: row.isRecurring,
    installmentNumber: row.installmentNumber,
    totalInstallments: row.totalInstallments,
    launchDate: row.launchDate,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    deletedAt: row.deletedAt,
  };
}

export function toPrismaCreateData(
  userId: string,
  data: CreateTransactionData
): {
  userId: string;
  description: string;
  amount: number;
  type: 'ENTRADA' | 'SAIDA';
  category: (typeof PrismaCategory)[keyof typeof PrismaCategory];
  isRecurring: boolean;
  installmentNumber: number | null;
  totalInstallments: number | null;
  launchDate: Date;
} {
  return {
    userId,
    description: data.description,
    amount: data.amount,
    type: domainTypeToPrisma(data.type),
    category: domainCategoryToPrisma(data.category),
    isRecurring: data.isRecurring,
    installmentNumber: data.installmentNumber,
    totalInstallments: data.totalInstallments,
    launchDate: data.launchDate,
  };
}

export function toPrismaUpdateData(
  data: UpdateTransactionData
): {
  description?: string;
  amount?: number;
  type?: 'ENTRADA' | 'SAIDA';
  category?: (typeof PrismaCategory)[keyof typeof PrismaCategory];
  isRecurring?: boolean;
  installmentNumber?: number | null;
  totalInstallments?: number | null;
  launchDate?: Date;
} {
  const out: ReturnType<typeof toPrismaUpdateData> = {};
  if (data.description !== undefined) out.description = data.description;
  if (data.amount !== undefined) out.amount = data.amount;
  if (data.type !== undefined) out.type = domainTypeToPrisma(data.type);
  if (data.category !== undefined) out.category = domainCategoryToPrisma(data.category);
  if (data.isRecurring !== undefined) out.isRecurring = data.isRecurring;
  if (data.installmentNumber !== undefined) out.installmentNumber = data.installmentNumber;
  if (data.totalInstallments !== undefined) out.totalInstallments = data.totalInstallments;
  if (data.launchDate !== undefined) out.launchDate = data.launchDate;
  return out;
}
