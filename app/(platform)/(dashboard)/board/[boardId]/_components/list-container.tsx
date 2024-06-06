'use client'

import { ListWithCards } from '@/types'
import { ListForm } from './list-form'
import { useEffect, useState } from 'react'
import { ListItem } from './list-item'

import { DragDropContext, Droppable } from '@hello-pangea/dnd'

import { useAction } from '@/hooks/use-action'
import { updateListOrder } from '@/actions/update-order-list'
import { toast } from 'sonner'

interface ListContainerProps {
  boardId: string
  data: ListWithCards[]
}

function reOrder<T>(list: T[], startIndex: number, endIndex: number) {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)
  return result
}

export const ListContainer = ({ boardId, data }: ListContainerProps) => {
  const [orderData, setOrderData] = useState(data)

  const { execute: executeUpdateListOrder } = useAction(updateListOrder, {
    onSuccess: () => {
      toast.success('List order updated')
    },
    onError: () => {
      toast.error('Error updating list order')
    },
  })

  useEffect(() => {
    setOrderData(data)
  }, [data])

  const onDragEnd = (result: any) => {
    const { source, destination, type } = result
    if (!destination) return

    //Dropped in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return
    }
    //User moved list
    if (type === 'list') {
      const items = reOrder(orderData, source.index, destination.index).map(
        (item, index) => {
          return {
            ...item,
            order: index,
          }
        }
      )
      setOrderData(items)
      executeUpdateListOrder({
        items,
        boardId,
      })
    }
    //User moved card
    if (type === 'card') {
      const newOrderData = [...orderData]
      const sourceList = newOrderData.find(
        (list) => list.id === source.droppableId
      )
      const destinationList = newOrderData.find(
        (list) => list.id === destination.droppableId
      )

      if (!sourceList || !destinationList) {
        return
      }
      // Check if cards exist on the source list
      if (!sourceList.cards) {
        sourceList.cards = []
      }
      // Check if cards exist on the destination list
      if (!destinationList.cards) {
        destinationList.cards = []
      }
      // Moving card in the same list
      if (source.droppableId === destination.droppableId) {
        const reOrderedCards = reOrder(
          sourceList.cards,
          source.index,
          destination.index
        )
        reOrderedCards.forEach((card, index) => {
          card.order = index
        })
        sourceList.cards = reOrderedCards
        setOrderData(newOrderData)
        //TODO: Update order in the backend
        //remove card from source list
      } else {
        const [movedCard] = sourceList.cards.splice(source.index, 1)

        //Assing the new order to the moved card
        movedCard.listId = destination.droppableId
        //Add card to the destination list
        destinationList.cards.splice(destination.index, 0, movedCard)

        sourceList.cards.forEach((card, index) => {
          card.order = index
        })

        //  Update the order for each card in the destination list
        destinationList.cards.forEach((card, index) => {
          card.order = index
        })
        setOrderData(newOrderData)
        //TODO: Update order in the backend
      }
    }
  }
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId='lists' type='list' direction='horizontal'>
        {(provided) => (
          <ol
            {...provided.droppableProps}
            ref={provided.innerRef}
            className='flex gap-x-3 h-full'
          >
            {orderData.map((list, index) => (
              <ListItem key={list.id} data={list} index={index} />
            ))}
            {provided.placeholder}
            <ListForm />
            <div className='flex-shrink-0 w-1' />
          </ol>
        )}
      </Droppable>
    </DragDropContext>
  )
}
