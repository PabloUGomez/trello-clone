'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { CardWithList } from '@/types'
import { AlignLeft } from 'lucide-react'
import { useParams } from 'next/navigation'
import { ElementRef, useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useEventListener, useOnClickOutside } from 'usehooks-ts'
import { FormTextarea } from '@/app/(platform)/(dashboard)/board/[boardId]/_components/form-textarea'
import { FormSubmit } from '@/components/form/form-button'
import { Button } from '@/components/ui/button'
import { useAction } from '@/hooks/use-action'
import { updateCard } from '@/actions/update-card'
import { toast } from 'sonner'

interface DescriptionProps {
  data: CardWithList
}

export const Description = ({ data }: DescriptionProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [description, setDescription] = useState(data.description)

  const textAreaRef = useRef<ElementRef<'textarea'>>(null)
  const formRef = useRef<ElementRef<'form'>>(null)

  const queryClient = useQueryClient()
  const params = useParams()

  const enableEditing = () => {
    setIsEditing(true)
    setTimeout(() => {
      textAreaRef.current?.focus()
    })
  }

  const disableEditing = () => {
    setIsEditing(false)
  }

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      disableEditing()
    }
  }

  useEventListener('keydown', onKeyDown)
  useOnClickOutside(formRef, disableEditing)

  const { execute } = useAction(updateCard, {
    onSuccess: () => {
      toast.success('Card description updated')
      queryClient.invalidateQueries({
        queryKey: ['card', data.id],
      })
      setDescription(data.description)
      disableEditing()
    },
    onError: () => {
      toast.error('Failed to update card')
    },
  })

  const onSubmit = (formData: FormData) => {
    const description = formData.get('description') as string
    const boardId = params.boardId as string

    if (description === data.description) {
      return
    }

    execute({ description, id: data.id, boardId })
  }

  return (
    <div className='flex items-start gap-x-3 w-full'>
      <AlignLeft className='h-5 w-5 mt-1.5 text-neutral-700' />
      <div className='w-full'>
        <p className='font-semibold text-neutral-800 mb-2'>Description</p>
        {isEditing ? (
          <form ref={formRef} action={onSubmit} className='space-y-2'>
            <FormTextarea
              ref={textAreaRef}
              id='description'
              defaultValue={description || undefined}
              className='w-full mt-2'
              placeholder='Add a more detailed description'
            />
            <div className='flex items-center gap-x-2'>
              <FormSubmit>Save</FormSubmit>
              <Button
                type='button'
                size='sm'
                variant='ghost'
                onClick={disableEditing}
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div
            className='min-h-[78px] bg-neutral-200 text-sm font-medium px-3.5 rounded-md py-3'
            role='button'
            onClick={enableEditing}
          >
            {description || 'Add a more detailed description'}
          </div>
        )}
      </div>
    </div>
  )
}

Description.Skeleton = function DescriptionSkeleton() {
  return (
    <div className='flex items-start gap-x-3 w-full'>
      <Skeleton className='h-6 w-6 bg-neutral-200' />
      <div className='w-full'>
        <Skeleton className='h-6 w-24 mb-2 bg-neutral-200' />
        <Skeleton className='h-[78px] w-full bg-neutral-200' />
      </div>
    </div>
  )
}
