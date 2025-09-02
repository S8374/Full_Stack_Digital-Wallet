import { z } from "zod";
import { WalletStatus } from "../wallet/wallet.interface";
import { UserStatus } from "../user/user.interface";

// Validation for updating wallet status
const updateWalletStatusValidation = z.object({
  body: z.object({
    status: z.enum(
      [WalletStatus.ACTIVE, WalletStatus.BLOCKED, WalletStatus.INACTIVE],
      {
        required_error: "Status is required",
        invalid_type_error: "Status must be either 'active', 'blocked', or 'inactive'",
      }
    )
  })
});

// Validation for updating agent status
const updateAgentStatusValidation = z.object({
  body: z.object({
    status: z.enum(
      [UserStatus.ACTIVE, UserStatus.BLOCKED, UserStatus.PENDING],
      {
        required_error: "Status is required",
        invalid_type_error: "Status must be either 'active', 'blocked', or 'pending'",
      }
    )
  })
});

// Validation for pagination parameters
const paginationValidation = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).default("1").transform(Number).optional(),
    limit: z.string().regex(/^\d+$/).default("10").transform(Number).optional(),
    sortBy: z.string().optional().default("createdAt"),
    sortOrder: z.enum(["asc", "desc"]).optional().default("desc")
  })
});

// Validation for user/agent filters
const userFilterValidation = z.object({
  query: z.object({
    status: z.enum([UserStatus.ACTIVE, UserStatus.BLOCKED, UserStatus.PENDING, UserStatus.INACTIVE]).optional(),
    search: z.string().optional(),
    fromDate: z.string().datetime().optional(),
    toDate: z.string().datetime().optional()
  })
});

// Validation for wallet filters
const walletFilterValidation = z.object({
  query: z.object({
    status: z.enum([WalletStatus.ACTIVE, WalletStatus.BLOCKED, WalletStatus.INACTIVE]).optional(),
    type: z.enum(["user", "agent", "system"]).optional(),
    minBalance: z.string().regex(/^\d+$/).transform(Number).optional(),
    maxBalance: z.string().regex(/^\d+$/).transform(Number).optional()
  })
});

// Validation for transaction filters
const transactionFilterValidation = z.object({
  query: z.object({
    type: z.enum(["deposit", "withdrawal", "transfer", "cash_in", "cash_out", "fee", "commission"]).optional(),
    status: z.enum(["pending", "completed", "failed", "reversed"]).optional(),
    fromDate: z.string().datetime().optional(),
    toDate: z.string().datetime().optional(),
    minAmount: z.string().regex(/^\d+$/).transform(Number).optional(),
    maxAmount: z.string().regex(/^\d+$/).transform(Number).optional()
  })
});
export const updateUserStatusValidation = z.object({
  body: z.object({
    status: z.enum(['active', 'inactive', 'blocked'], {
      required_error: "Status is required",
      invalid_type_error: "Status must be either 'active', 'inactive', or 'blocked'"
    })
  })
});


export {
  updateWalletStatusValidation,
  updateAgentStatusValidation,
  paginationValidation,
  userFilterValidation,
  walletFilterValidation,
  transactionFilterValidation
};
