import Link from 'next/link'

import { cn } from '@/lib/utils'
import localFont from 'next/font/local'

const headingFont = localFont({
  src: '../../public/fonts/font.woff2',
})

export default function TrelloIcon() {
  return (
    <Link href='/'>
      <div className='hover:opacity-75 transition items-center h-full gap-x-2 hidden md:flex'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='30'
          height='30'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        >
          <path stroke='none' d='M0 0h24v24H0z' fill='none' />
          <path d='M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z' />
          <path d='M7 7h3v10h-3z' />
          <path d='M14 7h3v6h-3z' />
        </svg>
        <p
          className={cn('text-lg text-neutral-700 flex pt-1', headingFont.className)}
        >
          Taskify
        </p>
      </div>
    </Link>
  )
}
