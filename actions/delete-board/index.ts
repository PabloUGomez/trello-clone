'use server'

import { auth } from '@clerk/nextjs/server'
import { InputType, ReturnType } from './types'
import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { createSafeAction } from '@/lib/create-safe-action'
import { DeleteBoard } from './schema'
import { redirect } from 'next/navigation'
import { createAuditLog } from '@/lib/create-audit-log'
import { decreseAvailableCount } from '@/lib/org-limit'

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth()

  if (!userId || !orgId) {
    return {
      error: 'Unauthorized',
    }
  }
  const { id } = data
  let board

  try {
    board = await prisma.board.delete({
      where: {
        id,
        orgId,
      },
    })
    await createAuditLog({
      entityId: board.id,
      entityType: 'BOARD',
      action: 'DELETE',
      entityTitle: board.title,
    })

    await decreseAvailableCount()
    
  } catch (error) {
    return {
      error: 'Failed to delete board',
    }
  }

  revalidatePath(`/organization/${orgId}`)
  redirect(`/organization/${orgId}`)
}

export const deleteBoard = createSafeAction(DeleteBoard, handler)
