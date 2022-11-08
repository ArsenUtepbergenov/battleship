export type CanvasConfig = {
  parentElement: string
  id?: string
  width: number
  height: number
}

export type ButtonConfig = {
  parentElement: string
  id?: string
  width?: number
  height?: number
  text?: string
}

export abstract class Config {
  static size = 400
  static cells = 10
  static cellSize = Math.floor(Config.size / Config.cells)
  static gridColor = '#2586b4'
  static shipColor = '#ff9187'
  static shipSize = Config.cellSize
  static shipsSpotSize = Config.shipSize * 8
  static gridPositionsSize = Config.size / Config.cellSize
}

export type EventHandlerParams = ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null

export enum Ships {
  TorpedoBoat = 1,
  Destroyer = 2,
  Cruiser = 3,
  Battleship = 4,
}

export enum Orientation {
  H = 'horizontal',
  V = 'vertical',
}

export interface IRect {
  x: number
  y: number
  w: number
  h: number
}

export interface IPoint {
  x: number
  y: number
}

export type ShipParams = {
  x: number
  y: number
  type: Ships
  id?: string
}

export const TypeShips = [
  { amount: 4, type: Ships.TorpedoBoat },
  { amount: 3, type: Ships.Destroyer },
  { amount: 2, type: Ships.Cruiser },
  { amount: 1, type: Ships.Battleship },
]

export const BgCanvasParams = {
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
