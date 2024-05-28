'use client'

import { FormInput } from '@/components/form/form-input'
import { Button } from '@/components/ui/button'
import { Board } from '@prisma/client'
import { set } from 'lodash'
import { ElementRef, useRef, useState } from 'react'

interface BoardTitleFormProps {
  data: Board
}

const BoardTitleForm = ({ data }: BoardTitleFormProps) => {
  const formRef = useRef<ElementRef<'form'>>(null)
  const inputRef = useRef<ElementRef<'input'>>(null)

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
    console.log(title);
    disableEditing()
  }

  if (idEditing) {
    return (
      <form action={onSubmit} ref={formRef} className='flex items-center gap-x-2'>
        <FormInput
          ref={inputRef}
          id='title'
          onBlur={() => {}}
          defaultValue={data.title}
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
      {data.title}
    </Button>
  )
}
export default BoardTitleForm
