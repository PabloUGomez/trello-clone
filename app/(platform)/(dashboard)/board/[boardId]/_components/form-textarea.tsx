'use client'

import { FormErrors } from '@/components/form/form-errors'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { forwardRef, KeyboardEventHandler } from 'react'
import { useFormStatus } from 'react-dom'

interface FormTextareaProps {
  id: string
  label?: string
  placeholder?: string
  defaultValue?: string
  required?: boolean
  disabled?: boolean
  errors?: Record<string, string[] | undefined>
  className?: string
  onClick?: () => void
  onBlur?: () => void
  onKeyDown?: KeyboardEventHandler<HTMLTextAreaElement> | undefined
}

export const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  (
    {
      id,
      label,
      placeholder,
      defaultValue,
      required,
      disabled,
      errors,
      className,
      onClick,
      onBlur,
      onKeyDown,
    },
    ref
  ) => {
    const { pending } = useFormStatus()
    return (
      <div className='space-y-2 w-full'>
        <div className='space-y-1 w-full'>
          {label ? (
            <Label
              htmlFor={id}
              className='text-xs font-semibold text-neutral-700'
            >
              {label}
            </Label>
          ) : null}
          <Textarea
            ref={ref}
            id={id}
            name={id}
            placeholder={placeholder}
            defaultValue={defaultValue}
            required={required}
            disabled={pending || disabled}
            onClick={onClick}
            onBlur={onBlur}
            onKeyDown={onKeyDown}
            className={cn(
              'resize-none focus-visible:ring-0 focus-visible:ring-offset-0 ring-0 focus:ring-0 outline-none shadow-sm',
              className
            )}
            aria-describedby={`${id}-error`}
          />
        </div>
        <FormErrors id={id} errors={errors} />
      </div>
    )
  }
)

FormTextarea.displayName = 'FormTextarea'
