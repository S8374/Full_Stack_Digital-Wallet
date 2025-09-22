// src/types/user.types.ts
export enum UserStatus {
  ACTIVE = 'active',
  BLOCKED = 'blocked',
  PENDING = 'pending',
  SUSPENDED = 'suspended'
}

export enum Role {
  USER = 'user',
  AGENT = 'agent',
  ADMIN = 'admin'
}

export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  status: UserStatus;
  role: Role;
  isVerified: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  wallet?: Wallet;
  transactions?: Transaction[];
}

// src/types/wallet.types.ts
export enum WalletStatus {
  ACTIVE = 'active',
  BLOCKED = 'blocked',
  SUSPENDED = 'suspended'
}

export enum WalletType {
  USER = 'user',
  AGENT = 'agent',
  SYSTEM = 'system'
}

export interface Wallet {
  _id: string;
  userId: string;
  balance: number;
  currency: string;
  status: WalletStatus;
  type: WalletType;
  createdAt: string;
  updatedAt: string;
}

// src/types/transaction.types.ts
export enum TransactionType {
  DEPOSIT = 'deposit',
  WITHDRAWAL = 'withdrawal',
  TRANSFER = 'transfer',
  CASH_IN = 'cash_in',
  CASH_OUT = 'cash_out'
}

export enum TransactionStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  PROCESSING = 'processing'
}

export interface Transaction {
  _id: string;
  type: TransactionType;
  amount: number;
  fee: number;
  commission: number;
  netAmount: number;
  status: TransactionStatus;
  reference: string;
  description: string;
  fromWallet?: string;
  toWallet?: string;
  initiatedBy: string;
  processedBy?: string;
  createdAt: string;
  updatedAt: string;
}