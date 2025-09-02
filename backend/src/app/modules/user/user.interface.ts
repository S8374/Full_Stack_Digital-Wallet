import { Types } from "mongoose";
import { IWallet } from "../wallet/wallet.interface";
import { ITransaction } from "../transaction/transaction.interface";

export enum Role {
  ADMIN = "admin",
  USER = "user",
  AGENT = "agent"
}

export interface IAuthProvider {
  provider: "Google" | "Credential";
  providerId: string;
}

export enum UserStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  BLOCKED = "blocked",
  PENDING = "pending"
}

export interface IUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  picture?: string;
  address?: string;
  isDeleted?: boolean;
  status?: UserStatus;
  isVerified?: boolean;
  role?: Role;
  wallet?: IWallet;
  auths?: IAuthProvider[];
  createdAt?: Date;
  updatedAt?: Date;
  transactions?: ITransaction[];
}