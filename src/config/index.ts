import { Ships } from '@/models/enums'

export const URL = 'http://localhost:9000'

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
