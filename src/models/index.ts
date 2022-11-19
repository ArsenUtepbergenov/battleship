import { Config } from '@/config'
import { ColorType, Ships } from './enums'

export type Node = {
  id?: string
  classList?: string[]
}

export type CanvasNode = Node & {
  width: number
  height: number
  outlineColor?: string
}

export type TextNode = Node & {
  text: string
}

export type ButtonNode = Node & {
  text: string
}

export type TextInputNode = Node & {
  value?: string
  placeholder?: string
}

export type NotificationNode = Node & {
  text?: string
  type?: ColorType
  lifeTime?: number
}

export const FieldRect = { x: 0, y: 0, w: Config.size, h: Config.size }

export type EventHandler = ((this: GlobalEventHandlers, ev: Event) => any) | null
export type MouseEventHandler = ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null
export type KeyboardEventHandler = ((this: GlobalEventHandlers, ev: KeyboardEvent) => any) | null

export type ShipParams = {
  x: number
  y: number
  type: Ships
  id?: string
}

export const BackgroundGridParams = {
  parentElement: 'field',
  id: 'grid',
  width: Config.size,
  height: Config.size,
  outlineColor: Config.gridColor,
}

export const FightFieldParams = {
  parentElement: 'fight-field',
  id: 'opponent-game',
  width: Config.size + Config.shipsSpotSize,
  height: Config.size,
  outlineColor: Config.gridColor,
}

export const FieldParams = {
  parentElement: 'field',
  id: 'game',
  width: Config.size + Config.shipsSpotSize,
  height: Config.size,
  outlineColor: Config.gridColor,
}

/**
 * The directions around a specific cell, where r - a row, c - a column
 */
export const Directions = [
  { r: -1, c: 0 },
  { r: 1, c: 0 },
  { r: 0, c: -1 },
  { r: 0, c: 1 },
  { r: 1, c: 1 },
  { r: -1, c: 1 },
  { r: 1, c: -1 },
  { r: -1, c: -1 },
]

export const Messages = {
  NotAllShipsOnField: 'Put all ships on the field!',
  GameHasStarted: 'The game has started! Good luck!',
  GameIsOver: 'The game is over! Thanks for playing.',
  TwoPlayersInRoom: 'Two players in the room! You can start to play.',
  PlayerSurrendered: 'Your opponent has surrendered! Congratulations!',
}
