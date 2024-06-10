'use server'

import { auth } from '@clerk/nextjs/server'
import { InputType, ReturnType } from './types'
import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { createSafeAction } from '@/lib/create-safe-action'
import { CreateBoard } from './schema'
import { createAuditLog } from '@/lib/create-audit-log'
import { incrementAvailableCount, hasAvailableCount } from '@/lib/org-limit'
import { checkSubscription } from '@/lib/subscription'

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth()

  if (!userId) {
    return {
      error: 'Unauthorized',
    }
  }

  const canCreate = await hasAvailableCount()
  const isPro = await checkSubscription()

  if (!canCreate && !isPro) {
    return {
      error:
        'You have reached your limit of free boards. Please upgrade to create more.',
    }
  }

  const { title, image } = data

  const [imageId, imageThumbUrl, imageFullUrl, imageUserName, imageLinkHTML] =
    image.split('|')

  console.log(orgId)

  if (
    !imageId ||
    !imageThumbUrl ||
    !imageFullUrl ||
    !imageUserName ||
    !imageLinkHTML ||
    !orgId
  ) {
    return {
      error: 'Missing fields. Failed to create board.',
    }
  }

  let board

  try {
    board = await prisma.board.create({
      data: {
        title,
        orgId,
        imageId,
        imageThumbUrl,
        imageFullUrl,
        imageUserName,
        imageLinkHTML,
      },
    })

    await createAuditLog({
      entityId: board.id,
      entityType: 'BOARD',
      action: 'CREATE',
      entityTitle: board.title,
    })

    if (!isPro) {
      await incrementAvailableCount()
    }
  } catch (error) {
    console.error(error)
    return {
      error: 'Internal Server Error',
    }
  }

  revalidatePath(`/board/${board.id}`)
  return { data: board }
}

export const createBoard = createSafeAction(CreateBoard, handler)
