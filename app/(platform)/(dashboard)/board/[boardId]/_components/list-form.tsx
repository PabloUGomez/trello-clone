'use client'

import { Plus, X } from 'lucide-react'
import { ListWrapper } from './list-wrapper'
import { useState, useRef, ElementRef } from 'react'
import { useEventListener, useOnClickOutside } from 'usehooks-ts'
import { FormInput } from '@/components/form/form-input'
import { useParams } from 'next/navigation'
import { FormSubmit } from '@/components/form/form-button'
import { Button } from '@/components/ui/button'

export const ListForm = () => {
  const params = useParams()

  const [isEditing, setIsEditing] = useState(false)
  const formRef = useRef<ElementRef<'form'>>(null)
  const inputRef = useRef<ElementRef<'input'>>(null)

  const enableEditing = () => {
    setIsEditing(true)
    setTimeout(() => inputRef.current?.focus())
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

  if (isEditing) {
    return (
      <ListWrapper>
        <form
          ref={formRef}
          className='w-full p-3 rounded-md bg-white space-y-4 shadow-md'
        >
          <FormInput
            ref={inputRef}
            id='title'
            className='text-sm px-2 py-1 h-7 font-medium border-transparent hover:border-input focus:border-input transition'
            placeholder='Enter list title...'
          />
          <input className='hidden' value={params.boardId} name='boardId' />
          <div className='flex items-center gap-x-1'>
            <FormSubmit>Add list</FormSubmit>
            <Button onClick={disableEditing} size='sm' variant='ghost'>
              <X className='w-5 h-5' />
            </Button>
          </div>
        </form>
      </ListWrapper>
    )
  }

  return (
    <ListWrapper>
      <button
        onClick={enableEditing}
        className='flex w-full rounded-md bg-white/80 hover:bg-white/50 transition p-3 items-center font-medium text-sm'
      >
        <Plus className='w-4 h-4 mr-2' />
        Add a list
      </button>
    </ListWrapper>
  )
}