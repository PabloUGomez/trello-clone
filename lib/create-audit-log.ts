import { auth, currentUser } from '@clerk/nextjs/server'
import { prisma } from './db'

interface Props {
  entityId: string
  entityType: 'BOARD' | 'LIST' | 'CARD'
  action: 'CREATE' | 'UPDATE' | 'DELETE'
  entityTitle: string
}

export const createAuditLog = async (props: Props) => {
  try {
    const user = await currentUser()
    const { orgId } = auth()

    if (!user || !orgId) {
      throw new Error('User not found')
    }

    const { entityId, entityType, entityTitle, action } = props

    await prisma.auditLog.create({
      data: {
        orgId,
        entityId,
        entityType,
        entityTitle,
        action,
        userId: user.id,
        userImage: user?.imageUrl,
        userName: user?.firstName + ' ' + user?.lastName,
      },
    })
  } catch (error) {
    console.error('AUDIT_LOG_ERROR', error)
  }
}
