'use client'

import { useFormStatus } from 'react-dom'
import { cn } from '@/lib/utils'
import { Button } from '../ui/button'

interface FormSubmitProps {
  children: React.ReactNode
  disabled?: boolean
  className?: string
  variant?:
    | 'default'
    | 'secondary'
    | 'ghost'
    | 'primary'
    | 'outline'
    | 'link'
    | 'destructive'
}

export const FormSubmit = ({
  children,
  disabled,
  className,
  variant = 'primary',
}: FormSubmitProps) => {
  const { pending } = useFormStatus()
  return (
    <Button
      type='submit'
      disabled={disabled || pending}
      className={cn(className)}
      variant={variant}
      size='sm'
    >
      {children}
    </Button>
  )
}
