import { AuditLog } from '@prisma/client'

export const generateLogMessage = (log: AuditLog) => {
  const { action, entityTitle, entityType } = log
  switch (action) {
    case 'CREATE':
      return `Created a new ${entityType.toLowerCase()} "${entityTitle}"`
    case 'UPDATE':
      return `Updated the ${entityType.toLowerCase()} "${entityTitle}"`
    case 'DELETE':
      return `Deleted the ${entityType.toLowerCase()} "${entityTitle}"`
    default:
      return `Unknown action on ${entityType.toLowerCase()} "${entityTitle}"`
  }
}
