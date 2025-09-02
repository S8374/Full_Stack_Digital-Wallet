import { z } from "zod";

const addMoneyValidation = z.object({
  body: z.object({
    amount: z.number().positive("Amount must be positive"),
    description: z.string().optional()
  })
});

const withdrawMoneyValidation = z.object({
  body: z.object({
    amount: z.number().positive("Amount must be positive"),
    description: z.string().optional()
  })
});

const sendMoneyValidation = z.object({
  body: z.object({
    toUserId: z.string(),
    amount: z.number().positive("Amount must be positive"),
    description: z.string().optional()
  })
});

const cashInValidation = z.object({
  body: z.object({
    userId: z.string(),
    amount: z.number(),
    description: z.string().optional()
  })
});

const cashOutValidation = z.object({
  body: z.object({
    userId: z.string().min(1, "User ID is required"),
    amount: z.number().positive("Amount must be positive"),
    description: z.string().optional()
  })
});

export {
  addMoneyValidation,
  withdrawMoneyValidation,
  sendMoneyValidation,
  cashInValidation,
  cashOutValidation
};