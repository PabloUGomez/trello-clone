'use client'

import { createBoard } from '@/actions/create-board'
import { Button } from '@/components/ui/button'
import { useAction } from '@/hooks/use-action'

export const Form = () => {
  const { execute } = useAction(createBoard, {
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
          <input
            type='text'
            id='title'
            name='title'
            required
            placeholder='Enter Board title'
            className='border-black'
          />
        </div>
        <Button type='submit'>Submit</Button>
      </form>
    </div>
  )
}
