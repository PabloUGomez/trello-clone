'use client'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { CardWithList } from '@/types'
import { Copy, Trash } from 'lucide-react'
import { useAction } from '@/hooks/use-action'
import { deleteCard } from '@/actions/delete-card'
import { copyCard } from '@/actions/copy-card'
import { toast } from 'sonner'
import { useParams } from 'next/navigation'
import { useCardModal } from '@/hooks/use-card-modal'

interface ActionsProps {
  data: CardWithList
}

export const Actions = ({ data }: ActionsProps) => {
  const params = useParams()

  const cardModal = useCardModal()

  const { execute: deleteCardAction, isLoading: isLoadingCopy } = useAction(
    deleteCard,
    {
      onSuccess: () => {
        toast.success('Card deleted')
        cardModal.onClose()
      },
      onError: () => {
        toast.error('Failed to delete card')
      },
    }
  )

  const { execute: copyCardAction, isLoading: isLoadingDelete } = useAction(
    copyCard,
    {
      onSuccess: () => {
        toast.success('Card copied')
        cardModal.onClose()
      },
      onError: () => {
        toast.error('Failed to copy card')
      },
    }
  )

  const onCopy = () => {
    const boardId = params.boardId as string
    copyCardAction({ id: data.id, boardId })
  }

  const onDelete = () => {
    const boardId = params.boardId as string
    deleteCardAction({ id: data.id, boardId })
  }

  return (
    <div className='space-y-2 mt-2'>
      <p className='text-sm font-semibold'>Actions</p>
      <Button
        variant='gray'
        className='w-full justify-start'
        size='inline'
        onClick={onCopy}
        disabled={isLoadingCopy}
      >
        Copy
        <Copy className='mr-2 h-4 w-4' />
      </Button>
      <Button
        variant='gray'
        className='w-full justify-start'
        size='inline'
        onClick={onDelete}
        disabled={isLoadingDelete}
      >
        Delete
        <Trash className='mr-2 h-4 w-4' />
      </Button>
    </div>
  )
}

Actions.Skeleton = function ActionsSkeleton() {
  return (
    <div className='space-y-2 mt-2'>
      <Skeleton className='h-4 w-20 bg-neutral-200' />
      <Skeleton className='h-8 w-full bg-neutral-200' />
      <Skeleton className='h-8 w-20 bg-neutral-200' />
    </div>
  )
}
