import { prisma } from '@/lib/db'

const OrganizationPage = () => {
  async function createBoard(formData: FormData) {
    'use server'

    const title = formData.get('title') as string
    if (!title) {
      throw new Error('Title is required')
    }

    try {
      const board = await prisma.board.create({
        data: {
          title: title,
        },
      })
      console.log('Board created:', board)
    } catch (error) {
      console.error('Error creating board:', error)
    }
  }

  return (
    <div>
      <form action={createBoard}>
        <input
          type='text'
          id='title'
          name='title'
          required
          placeholder='Enter Board title'
          className='border-black'
        />
      </form>
    </div>
  )
}

export default OrganizationPage
