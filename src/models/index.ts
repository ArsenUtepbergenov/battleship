export type CanvasConfig = {
  parent: string
  width: number
  height: number
}

export abstract class Config {
  static size = 400
  static cells = 10
  static cellSize = Math.floor(Config.size / Config.cells)
  static gridColor = '#3c813f'
}
