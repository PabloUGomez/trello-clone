'use client'

import { forwardRef } from "react"
import { useFormStatus } from "react-dom"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { cn } from "@/lib/utils"
import { FormErrors } from "./form-errors"

interface FormInputProps {
    id: string,
    label?: string,
    type?: string,
    placeholder?: string,
    requiered?: boolean,
    disabled?: boolean,
    errors?: Record<string, string[] | undefined>
    className?: string,
    defaultValue?: string,
    onBlur?: () => void
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(({
    id,
    label,
    type,
    placeholder,
    requiered,
    disabled,
    errors,
    className,
    defaultValue  = '',
    onBlur
}, ref) => {
 const {pending} = useFormStatus()

 return (
    <div>
        <div>
            {label ? (
                <Label 
                    htmlFor={id}
                    className="text-xs font-semibold text-neutral-700"
                >
                    {label}
                </Label>
            ) : null}
            <Input 
                onBlur={onBlur}
                ref={ref}
                name={id}
                type={type}
                placeholder={placeholder}
                required={requiered}
                disabled={disabled || pending}
                defaultValue={defaultValue}
                id={id}
                className={cn('text-sm px-2 py-1 h-7', className)}
                aria-describedby={`${id}-error`}
            />
        </div>
        <FormErrors 
            id={id}
            errors={errors}
        />
    </div>
 )

})

FormInput.displayName = 'FormInput'