'use server'

import { auth } from '@clerk/nextjs/server'
import { InputType, ReturnType } from './types'
import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { createSafeAction } from '@/lib/create-safe-action'
import { CreateCard } from './schema'
import { createAuditLog } from '@/lib/create-audit-log'

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth()

  if (!userId || !orgId) {
    return {
      error: 'Unauthorized',
    }
  }
  const { title, boardId, listId } = data
  let card

  try {
    const list = await prisma.list.findUnique({
      where: {
        id: listId,
        board: {
          orgId,
        },
      },
    })
    if (!list) {
      return {
        error: 'List not found',
      }
    }

    const lastCard = await prisma.card.findFirst({
      where: {
        listId,
      },
      orderBy: {
        order: 'desc',
      },
      select: {
        order: true,
      },
    })

    const newOrder = lastCard ? lastCard.order + 1 : 1

    card = await prisma.card.create({
      data: {
        title,
        listId,
        order: newOrder,
      },
    })

    await createAuditLog({
      entityId: card.id,
      entityType: 'CARD',
      action: 'CREATE',
      entityTitle: card.title,
    })

  } catch (error) {
    return {
      error: 'Failed to update board',
    }
  }

  revalidatePath(`/board/${boardId}`)
  return {
    data: card,
  }
}

export const createCard = createSafeAction(CreateCard, handler)
