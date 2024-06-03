'use client'

import { ListWithCards } from '@/types'
import { ListForm } from './list-form'
import { useEffect, useState } from 'react'
import { ListItem } from './list-item'

interface ListContainerProps {
  boardId: string
  data: ListWithCards[]
}

export const ListContainer = ({ boardId, data }: ListContainerProps) => {
  const [orderData, setOrderData] = useState(data)

  useEffect(() => {
    setOrderData(data)
  }, [data])

  return (
    <ol className='flex gap-x-3 h-full'>
      {orderData.map((list, index) => (
        <ListItem key={list.id} data={list} index={index} />
      ))}
      <ListForm />
      <div className='flex-shrink-0 w-1' />
    </ol>
  )
}
