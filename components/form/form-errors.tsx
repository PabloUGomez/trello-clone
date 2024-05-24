import { XCircle } from 'lucide-react'

interface FormErrorsProps {
  id: string;
  errors?: Record<string, string[] | undefined>;
}

export const FormErrors = ({ id, errors }: FormErrorsProps) => {
  if (!errors) return null

  return (
    <div
      id={`${id}-error`}
      aria-live='polite'
      className='text-sm text-rose-500 mt-2'
    >
      {errors?.[id]?.map((error: string) => (
        <div
          key={error}
          className='flex items-center font-medium border border-rose-500 bg-rose-500/10 rounded-sm p-1'
        >
          <XCircle className='w-4 h-4 mr-2' />
          <span>{error}</span>
        </div>
      ))}
    </div>
  )
}