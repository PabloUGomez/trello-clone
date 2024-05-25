'use client'

import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

import { useAction } from '@/hooks/use-action'
import { createBoard } from '@/actions/create-board'

import { FormInput } from './form-input'
import { FormSubmit } from './form-button'
import { Button } from '../ui/button'
import { X } from 'lucide-react'
import { toast } from 'sonner'
import { FromPicker } from './form-picker'

interface FormPopoverProps {
  children: React.ReactNode
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
  sideOffset?: number
}

export const FormPopover = ({
  children,
  side = 'bottom',
  align = 'center',
  sideOffset = 0,
}: FormPopoverProps) => {
  const { execute, fieldErrors } = useAction(createBoard, {
    onSuccess: (data) => {
      toast.success('Board created successfully')
    },
    onError: (error) => {
      toast.error(error)
    },
  })

  const onSubmit = (formData: FormData) => {
    const title = formData.get('title') as string

    execute({ title })
  }

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        className='w-80 pt-3'
        side={side}
        align={align}
        sideOffset={sideOffset}
      >
        <div className='text-sm font-medium text-center text-neutral-600 pb-4'>
          Create board
        </div>
        <PopoverClose asChild>
          <Button
            className='h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600'
            variant='ghost'
          >
            <X className='h-4 w-4' />
          </Button>
        </PopoverClose>
        <form action={onSubmit} className='space-y-4'>
          <div className='space-y-4'>
          <FromPicker 
            id='image'
            errors={fieldErrors}
          />
            <FormInput
              id='title'
              label='Board title'
              placeholder='Enter board title'
              type='text'
              errors={fieldErrors}
            />
            <FormSubmit className='w-full'>Create</FormSubmit>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  )
}
