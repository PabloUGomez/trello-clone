'use client'

import { FormInput } from '@/components/form/form-input'
import { Button } from '@/components/ui/button'
import { Board } from '@prisma/client'
import { ElementRef, useRef, useState } from 'react'
import { updateBoard } from '@/actions/update-board'
import { toast } from 'sonner'
import { useAction } from '@/hooks/use-action'

interface BoardTitleFormProps {
  data: Board
}

const BoardTitleForm = ({ data }: BoardTitleFormProps) => {
  const { execute } = useAction(updateBoard, {
    onSuccess: () => {
      toast.success(`Board "${data.title}" updated`)
      setTitle(data.title)
      disableEditing()
    },
    onError: () => {
      toast.error('Failed to update board')
    },
  })

  const formRef = useRef<ElementRef<'form'>>(null)
  const inputRef = useRef<ElementRef<'input'>>(null)

  const [title, setTitle] = useState(data.title)
  const [idEditing, setIsEditing] = useState(false)

  const enableEditing = () => {
    setIsEditing(true)
    setTimeout(() => {
      inputRef.current?.focus()
      inputRef.current?.select()
    }, 0)
  }

  const disableEditing = () => {
    setIsEditing(false)
  }

  const onSubmit = (formData: FormData) => {
    const title = formData.get('title') as string
    execute({ title, id: data.id })
  }

  const onBlur = () => {
    formRef.current?.requestSubmit()
  }

  if (idEditing) {
    return (
      <form
        action={onSubmit}
        ref={formRef}
        className='flex items-center gap-x-2'
      >
        <FormInput
          ref={inputRef}
          id='title'
          onBlur={onBlur}
          defaultValue={title}
          className='text-lg font-bold px-[7px] py-1 h-7 bg-transparent focus-visible:outline-none focus-visible:ring-transparent border-none'
        />
      </form>
    )
  }

  return (
    <Button
      onClick={enableEditing}
      className='text-lg font-bold h-auto w-auto p-1 px-2'
      variant='trasparent'
    >
      {title}
    </Button>
  )
}
export default BoardTitleForm
