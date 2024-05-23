'use client'

import { createBoard } from '@/actions/create-board'
import { FormInput } from '@/components/form/form-input'
import { Button } from '@/components/ui/button'
import { useAction } from '@/hooks/use-action'

export const Form = () => {
  const { execute, fieldErrors } = useAction(createBoard, {
    onSuccess: () => {
      console.log('Board created')
    },
    onError: (error) => {
      console.error(error)
    },
  })

  const onSubmit = (formData: FormData) => {
    const title = formData.get('title') as string

    execute({ title })
  }

  return (
    <div className='flex flex-col space-y-4'>
      <form action={onSubmit}>
        <div className='flex flex-col space-y-2'>
          <FormInput id='title' errors={fieldErrors} 
          label='Board Title' placeholder='Enter board title'
          />
        </div>
        <Button type='submit'>Submit</Button>
      </form>
    </div>
  )
}
