import TrelloIcon from '@/components/icons/Trello'
import { Button } from '@/components/ui/button'
import { Link } from 'lucide-react'

export const Navbar = () => {
  return (
    <div className='fixed top-0 w-full h-14 px-4 border-b shadow-sm bg-white flex items-center'>
      <div className='md:max-w-screen-2xl mx-auto flex items-center w-full justify-between'>
        <TrelloIcon />
        <div className='space-x-4 md:block md:w-auto flex items-center justify-center w-full'>
            <Button size="sm" variant="outline" asChild>
                <Link href='/signin'>Login</Link>
            </Button>
            <Button size="sm" asChild>
                Get Taskify for free
            </Button>
        </div>
      </div>
    </div>
  )
}
