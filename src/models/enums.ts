export enum GameState {
  START,
  PLAY,
  OVER,
}

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

export enum NotificationType {
  DEFAULT,
  ERROR,
  SUCCESS,
  INFO,
}
