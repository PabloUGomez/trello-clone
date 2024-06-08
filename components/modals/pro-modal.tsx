'use client'

import { useProModal } from '@/hooks/use-pro-modal'
import { Dialog, DialogContent } from '../ui/dialog'
import { Button } from '../ui/button'
import Image from 'next/image'

export const ProModal = () => {
  const { isOpen, onOpen, onClose } = useProModal()
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-w-md p-0 overflow-hidden'>
        <div className='aspect-video relative flex items-center justify-center'>
          <Image
            src='/BillingHero.png'
            alt='Billing Hero'
            fill
            className='object-cover'
          />
        </div>
        <div className='text-neutral-700 mx-auto space-y-6 p-6'>
          <h2 className='font-semibold text-xl'>
            Upgrade to Taskify Pro Today!
          </h2>
          <p className='text-sm font-semibold text-neutral-600'>
            Explore the best of Taskify
          </p>
          <div className='pl-3'>
            <ul className='text-sm list-disc'>
              <li>Unlimited boards</li>
              <li>Advanced checklists</li>
              <li>Admin and security features</li>
              <li>Add more!</li>
            </ul>
          </div>
          <Button className='w-full' variant='primary'>
            Upgrade to Pro
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
