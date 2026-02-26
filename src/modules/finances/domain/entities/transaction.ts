import type { TransactionCategoryValue } from '../value-objects/transaction-category';
import type { TransactionTypeValue } from '../value-objects/transaction-type';

export interface TransactionProps {
  id: string;
  userId: string;
  description: string;
  amount: number;
  type: TransactionTypeValue;
  category: TransactionCategoryValue;
  isRecurring: boolean;
  installmentNumber: number | null;
  totalInstallments: number | null;
  launchDate: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export class Transaction {
  constructor(private readonly props: TransactionProps) {}

  get id(): string {
    return this.props.id;
  }

  get userId(): string {
    return this.props.userId;
  }

  get description(): string {
    return this.props.description;
  }

  get amount(): number {
    return this.props.amount;
  }

  get type(): TransactionTypeValue {
    return this.props.type;
  }

  get category(): TransactionCategoryValue {
    return this.props.category;
  }

  get isRecurring(): boolean {
    return this.props.isRecurring;
  }

  get installmentNumber(): number | null {
    return this.props.installmentNumber;
  }

  get totalInstallments(): number | null {
    return this.props.totalInstallments;
  }

  get launchDate(): Date {
    return this.props.launchDate;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  get deletedAt(): Date | null {
    return this.props.deletedAt;
  }
}
