import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { AnyZodObject, ZodEffects } from "zod";


export const validateRequest = (zodSchema: AnyZodObject | ZodEffects<AnyZodObject>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log('Validating request body:', req.body); // Debug log
      // If there's a data field (common with form data), parse it
      if (req.body.data) {
        req.body = JSON.parse(req.body.data);
      }

      // Always wrap the body in a body object to match your schema structure
      await zodSchema.parseAsync({ body: req.body }) || (req.body);
      next();
    } catch (error) {
      next(error);
    }
  };