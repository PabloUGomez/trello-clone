'use server'

import { auth } from '@clerk/nextjs/server'
import { InputType, ReturnType } from './types'
import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { createSafeAction } from '@/lib/create-safe-action'
import { UpdateOrderList } from './schema'

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth()

  if (!userId || !orgId) {
    return {
      error: 'Unauthorized',
    }
  }
  const { items, boardId } = data

  let lists

  try {
    const transaction = items.map((list) => {
      return prisma.list.update({
        where: {
          id: list.id,
          board: {
            orgId,
          },
        },
        data: {
          order: list.order,
        },
      })
    })
    lists = await prisma.$transaction(transaction)
  } catch (error) {
    return {
      error: 'Error updating list order',
    }
  }

  revalidatePath(`/board/${boardId}`)
  return {
    data: lists,
  }
}

export const updateListOrder = createSafeAction(UpdateOrderList, handler)
