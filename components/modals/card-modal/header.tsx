'use client'

import { FormInput } from '@/components/form/form-input'
import { Skeleton } from '@/components/ui/skeleton'
import { CardWithList } from '@/types'
import { Layout } from 'lucide-react'
import { ElementRef, useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { useAction } from '@/hooks/use-action'
import { updateCard } from '@/actions/update-card'
import { toast } from 'sonner'

interface HeaderProps {
  data: CardWithList
}

export const Header = ({ data }: HeaderProps) => {
  const [title, setTitle] = useState(data.title)
  const queryClient = useQueryClient()
  const params = useParams()
  const inputRef = useRef<ElementRef<'input'>>(null)

  const { execute } = useAction(updateCard, {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['card', data.id],
      })
      queryClient.invalidateQueries({
        queryKey: ['card-logs', data.id],
      })
      toast.success('Card updated')
      setTitle(data.title)
    },
    onError: () => {
      toast.error('Failed to update card')
    },
  })

  const onBlur = () => {
    inputRef.current?.form?.submit()
  }

  const onSubmit = (formData: FormData) => {
    const title = formData.get('title') as string
    const boardId = params.boardId as string

    if (title === data.title) {
      return
    }

    execute({ title, id: data.id, boardId })
  }

  return (
    <div className='flex items-start gap-x-3 mb-6 w-full'>
      <Layout className='h-5 w-5 mt-1 text-neutral-700' />
      <div className='w-full'>
        <form action={onSubmit}>
          <FormInput
            ref={inputRef}
            onBlur={onBlur}
            id='title'
            defaultValue={title}
            className='font-semibold px-1 text-xl bg-transparent border-transparent text-neutral-700 relative -left-1.5 w-[95%] focus-visible:bg-white focus-visible:border-input mb-0.5 truncate'
          />
        </form>
        <p className='text-sm text-muted-foreground'>
          in list <span className='underline'>{data.list.title}</span>
        </p>
      </div>
    </div>
  )
}

Header.Skeleton = function HeaderSkeleton() {
  return (
    <div className='flex items-start gap-x-3 mb-6'>
      <Skeleton className='h-6 w-6 mt-1 bg-neutral-200' />
      <div>
        <Skeleton className='h-6 w-24 mb-1 bg-neutral-200' />
        <Skeleton className='h-4 w-12 bg-neutral-200' />
      </div>
    </div>
  )
}
