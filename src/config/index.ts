import { Ships } from '@/models/enums'

export const TypeShips = [
  { amount: 4, type: Ships.TorpedoBoat },
  { amount: 3, type: Ships.Destroyer },
  { amount: 2, type: Ships.Cruiser },
  { amount: 1, type: Ships.Battleship },
] as const

export abstract class Config {
  static readonly size = 360
  static readonly cells = 10
  static readonly cellSize = Math.floor(Config.size / Config.cells)
  static readonly halfCellSize = Config.cellSize / 2
  static readonly gridColor = '#a88213'
  static readonly shipColor = '#e4e4e4'
  static readonly successShotColor = '#8bc34a'
  static readonly missedShotColor = '#2196f3'
  static readonly failShotColor = '#ff4336'
  static readonly shipSize = Config.cellSize
  static readonly shipsSpotSize = Config.shipSize * 7
  static readonly gridPositionsSize = Config.size / Config.cellSize
  static readonly numberShips = TypeShips.reduce((a, prev) => a + prev.amount, 0)
  static readonly numberShipCells = TypeShips.reduce((a, prev) => a + prev.amount * prev.type, 0)
}
