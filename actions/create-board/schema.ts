import { title } from 'process'
import { z } from 'zod'

export const CreateBoard = z.object({
  title: z
    .string({
      required_error: 'Title is required',
      invalid_type_error: 'Title is required',
    })
    .min(3, {
      message: 'Title must be at least 3 characters',
    })
    .max(50, {
      message: 'Title must be at most 100 characters',
    }),
})
