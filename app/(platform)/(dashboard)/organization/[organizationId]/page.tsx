import { createBoard } from '@/actions/createBoard'
import { Button } from '@/components/ui/button'
import { prisma } from '@/lib/db'
import { Form } from './form'

const OrganizationPage = async () => {
  const boards = await prisma.board.findMany()

  return (
    <div className='flex flex-col space-y-4'>
      <Form />
      <div className='space-y-2'>
        {boards.map((board) => (
          <div key={board.id} className='flex justify-between'>
            <div>Board name:{board.title}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default OrganizationPage
