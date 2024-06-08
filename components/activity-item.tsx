import { AuditLog } from '@prisma/client'
import { generateLogMessage } from '@/lib/generate-log-message'
import { Avatar, AvatarImage } from './ui/avatar'
import { format } from 'date-fns'

interface ActivityProps {
  log: AuditLog
}

export const ActivityItem = ({ log }: ActivityProps) => {
  return (
    <li className='flex items-center gap-x-2'>
      <Avatar className='w-8 h-8'>
        <AvatarImage src={log.userImage} alt={log.userName} />
      </Avatar>
      <div className='flex flex-col space-x-0.5'>
        <p className='text-sm text-muted-foreground'>
          <span className='font-semibold lowercase text-neutral-700'>
            {`${log.userName} `}
          </span>
          {generateLogMessage(log)}
        </p>
        <p className='text-sm text-muted-foreground'>
          {format(new Date(log.createdAt), "MMM d, yyyy 'at' h:mm a")}
        </p>
      </div>
    </li>
  )
}
