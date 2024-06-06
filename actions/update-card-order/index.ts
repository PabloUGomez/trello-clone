'use server'

import { auth } from '@clerk/nextjs/server'
import { InputType, ReturnType } from './types'
import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { createSafeAction } from '@/lib/create-safe-action'
import { UpdateCardOrder } from './schema'

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth()

  if (!userId || !orgId) {
    return {
      error: 'Unauthorized',
    }
  }
  const { items, boardId } = data

  let cards

  try {
    const transaction = items.map((item) =>
      prisma.card.update({
        where: {
          id: item.id,
          list: {
            board: {
              orgId,
            },
          },
        },
        data: {
          order: item.order,
          listId: item.listId,
        },
      })
    )
    cards = await prisma.$transaction(transaction)
  } catch (error) {
    return {
      error: 'Error updating card order',
    }
  }

  revalidatePath(`/board/${boardId}`)
  return {
    data: cards,
  }
}

export const updateCardOrder = createSafeAction(UpdateCardOrder, handler)
