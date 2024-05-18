'use client'

import { useMobileSidebar } from '@/hooks/use-mobile-sidebar'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export const MobileSidebar = () => {
  const pathname = usePathname()
  const [isMounted, setIsMounted] = useState(false)
  const { onOpen, onClose, isOpen } = useMobileSidebar((state) => ({
    onOpen: state.onOpen,
    onClose: state.onClose,
    isOpen: state.isOpen,
  }))

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return <div>MobileSidebar</div>
}
