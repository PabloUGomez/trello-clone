'use server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export type State = {
  errors?: {
    title?: string[]
  }
  message?: string | null
}

const CreateBoard = z.object({
  title: z.string().min(3, {
    message: 'Title must be at least 3 characters long',
  }),
})

export async function createBoard(prevState: State, formData: FormData) {
  const validatedFields = CreateBoard.safeParse({
    title: formData.get('title'),
  })
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error?.flatten().fieldErrors,

      message: 'Missing fields',
    }
  }

  const { title } = validatedFields.data
  try {
    await prisma.board.create({
      data: {
        title,
      },
    })
  } catch (error) {
    return {
      message: 'Error creating board',
    }
  }

  revalidatePath('/organization/org_2gVLE5jIPuWsZyb269OwfidbsWl')
  redirect('/organization/org_2gVLE5jIPuWsZyb269OwfidbsWl')
}
