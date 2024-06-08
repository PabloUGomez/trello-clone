import { ActivityItem } from '@/components/activity-item'
import { Skeleton } from '@/components/ui/skeleton'
import { prisma } from '@/lib/db'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export const ActivityList = async () => {
  const { userId, orgId } = auth()

  if (!orgId) {
    redirect('/select-org')
  }

  const auditLogs = await prisma.auditLog.findMany({
    where: {
      orgId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
  return (
    <ol className='space-y-4 mt-4'>
      <p className='hidden last:block text-sm text-center text-muted-foreground'>
        No activity found inside this organization
      </p>
      {auditLogs.map((log) => (
        <ActivityItem key={log.id} log={log} />
      ))}
    </ol>
  )
}

ActivityList.Skeleton = function ActivityListSkeleton() {
  return (
    <ol className='space-y-4 mt-4'>
      <Skeleton className='h-14 w-[80%]' />
      <Skeleton className='h-14 w-[50%]' />
      <Skeleton className='h-14 w-[60%]' />
      <Skeleton className='h-14 w-[70%]' />
      <Skeleton className='h-14 w-[60%]' />
    </ol>
  )
}
