import { z } from "zod";
import { PAYMENT_TYPE } from "./paymnet.interface";

export const paymentValidation = z.object({
    body: z.object({
        type: z.nativeEnum(PAYMENT_TYPE), // Use nativeEnum for proper validation
        amount: z.number().positive("Amount must be greater than zero"),
        toUserId: z.string().optional()
    })
});