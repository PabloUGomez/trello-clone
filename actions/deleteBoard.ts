'use server'

import { prisma } from "@/lib/db"

export async function deleteBoard(boardId: string) {
  try {
    const board = await prisma.board.delete({
      where: {
        id: boardId,
      },
    })
    console.log('Board deleted:', board)
  } catch (error) {
    console.error('Error deleting board:', error)
  }
}