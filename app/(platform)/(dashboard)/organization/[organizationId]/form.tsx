'use client'

import { createBoard, State } from '@/actions/createBoard'
import { Button } from '@/components/ui/button'
import { useFormState } from 'react-dom'

export const Form = () => {
  const initialState = { message: '', errors: { title: [] } }
  const [state, dispatch] = useFormState(
    (prevState: State, formData: FormData) => createBoard(prevState, formData),
    initialState
  )

  return (
    <div className='flex flex-col space-y-4'>
      <form action={dispatch}>
        <div className='flex flex-col space-y-2'>
          <input
            type='text'
            id='title'
            name='title'
            required
            placeholder='Enter Board title'
            className='border-black'
          />
          {state?.errors?.title && (
            <div className='text-rose-500'>
              {state.errors.title.map((error: string) => (
                <div key={error}>{error}</div>
              ))}
            </div>
          )}
        </div>
        <Button type='submit'>Submit</Button>
      </form>
    </div>
  )
}
