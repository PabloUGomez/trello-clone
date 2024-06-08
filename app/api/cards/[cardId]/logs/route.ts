import { prisma } from '@/lib/db'
import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { cardId: string } }
) {
  try {
    const { userId, orgId } = auth()

    if (!userId || !orgId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const auditLogs = await prisma.auditLog.findMany({
      where: {
        orgId,
        entityId: params.cardId,
        entityType: 'CARD',
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 3,
    })

    return NextResponse.json(auditLogs)
  } catch {
    return new NextResponse('Internal Error', { status: 500 })
  }
}
