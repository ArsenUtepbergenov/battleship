export type CanvasConfig = {
  parentElement: string
  id?: string
  width: number
  height: number
}

export abstract class Config {
  static size = 400
  static cells = 10
  static cellSize = Math.floor(Config.size / Config.cells)
  static gridColor = '#3c813f'
  static shipColor = '#ff9800'
  static shipSize = Config.cellSize
  static shipsSpotSize = Config.shipSize * 8
}

export enum Ships {
  TorpedoBoat = 1,
  Destroyer = 2,
  Cruiser = 3,
  Battleship = 4,
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
}

export const TypeShips = [
  { amount: 4, type: Ships.TorpedoBoat },
  { amount: 3, type: Ships.Destroyer },
  { amount: 2, type: Ships.Cruiser },
  { amount: 1, type: Ships.Battleship },
]
