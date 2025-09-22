// src/modules/moneyRequest/moneyRequest.validation.ts
import { z } from "zod";

export const createMoneyRequestValidation = z.object({
  body: z.object({
    toUserId: z.string({
      required_error: "Recipient user ID is required",
      invalid_type_error: "Recipient user ID must be a string"
    }).min(1, "Recipient user ID is required"),

    amount: z.number({
      required_error: "Amount is required",
      invalid_type_error: "Amount must be a number"
    }).positive("Amount must be greater than zero")
    .min(1, "Minimum amount is 1 BDT"),

    description: z.string()
      .max(200, "Description cannot exceed 200 characters")
      .optional()
  })
});

export const requestActionValidation = z.object({
  params: z.object({
    requestId: z.string({
      required_error: "Request ID is required",
      invalid_type_error: "Request ID must be a string"
    }).min(1, "Request ID is required")
  })
});