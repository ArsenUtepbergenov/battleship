import { NotificationType, Ships } from './enums'

export type Node = {
  id?: string
  classList?: string[]
}

export type CanvasNode = Node & {
  width: number
  height: number
}

export type TextNode = Node & {
  text: string
}

export type ButtonNode = Node & {
  text: string
}

export type NotificationNode = Node & {
  text?: string
  type?: NotificationType
  lifeTime?: number
}

export const TypeShips = [
  { amount: 1, type: Ships.TorpedoBoat },
  // { amount: 3, type: Ships.Destroyer },
  // { amount: 2, type: Ships.Cruiser },
  // { amount: 1, type: Ships.Battleship },
]

export abstract class Config {
  static size = 360
  static cells = 10
  static cellSize = Math.floor(Config.size / Config.cells)
  static halfCellSize = Config.cellSize / 2
  static gridColor = '#483d8b'
  static shipColor = '#f08080'
  static successShotColor = '#8bc34a'
  static missedShotColor = '#2196f3'
  static failShotColor = '#f44336'
  static shipSize = Config.cellSize
  static shipsSpotSize = Config.shipSize * 7
  static gridPositionsSize = Config.size / Config.cellSize
  static numberShips = TypeShips.reduce((a, prev) => a + prev.amount, 0)
}

export const FieldRect = { x: 0, y: 0, w: Config.size, h: Config.size }

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

export const FightFieldParams = {
  parentElement: 'fight-field',
  id: 'opponent-game',
  width: Config.size + Config.shipsSpotSize,
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

export const Messages = {
  NotAllShipsOnField: 'Put all ships on the field!',
  GameHasStarted: 'The game has started! Good luck!',
}
