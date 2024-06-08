import { Card, List } from '@prisma/client'

export type ListWithCards = List & { cards: Card[] }

export type CardWithList = Card & { list: List }

export type ENTITY_TYPE = 'CARD' | 'LIST' | 'BOARD'
export type ACTION = 'CREATE' | 'UPDATE' | 'DELETE'
