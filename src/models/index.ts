import { Ships } from './enums'

export type ElementConfig = {
  parentElement: string
  id?: string
}

export type CanvasConfig = ElementConfig & {
  width: number
  height: number
}

export type NodeWithText = ElementConfig & {
  text: string
}

export type ButtonConfig = NodeWithText
export type NotificationConfig = NodeWithText

export const TypeShips = [
  { amount: 2, type: Ships.TorpedoBoat },
  // { amount: 3, type: Ships.Destroyer },
  // { amount: 2, type: Ships.Cruiser },
  // { amount: 1, type: Ships.Battleship },
]

export abstract class Config {
  static size = 400
  static cells = 10
  static cellSize = Math.floor(Config.size / Config.cells)
  static gridColor = '#483d8b'
  static shipColor = '#f08080'
  static shipSize = Config.cellSize
  static shipsSpotSize = Config.shipSize * 8
  static gridPositionsSize = Config.size / Config.cellSize
  static numberShips = TypeShips.reduce((a, prev) => a + prev.amount, 0)
}

export type EventHandler = ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null

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
}

export const FieldParams = {
  parentElement: 'field',
  id: 'game',
  width: Config.size + Config.shipsSpotSize,
  height: Config.size,
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
