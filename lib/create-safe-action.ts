import { z, ZodRawShape } from 'zod';

export type FieldErrors<T> = {
  [K in keyof T]?: string[];
}

export type ActionState<TInput, TOutput> = {
  fieldErrors?: FieldErrors<TInput>;
  error?: string | null;
  data?: TOutput;
}

export const createSafeAction = <TInput extends ZodRawShape, TOutput>(
  schema: z.ZodObject<TInput>,
  handler: (validatedData: z.infer<typeof schema>) => Promise<ActionState<z.infer<typeof schema>, TOutput>>
) => {
  return async (data: unknown): Promise<ActionState<z.infer<typeof schema>, TOutput>> => {
    const validationResult = schema.safeParse(data);
    if (!validationResult.success) {
      return {
        fieldErrors: validationResult.error.flatten()
          .fieldErrors as FieldErrors<z.infer<typeof schema>>,
      };
    }

    return handler(validationResult.data);
  }
}
