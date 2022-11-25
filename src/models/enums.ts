export const enum GameState {
  START,
  PLAY,
  OVER,
}

export const enum Ships {
  TorpedoBoat = 1,
  Destroyer = 2,
  Cruiser = 3,
  Battleship = 4,
}

export const enum Orientation {
  Horizontal = 'horizontal',
  Vertical = 'vertical',
}

export const enum ColorType {
  DEFAULT,
  ERROR,
  SUCCESS,
  INFO,
}

export const enum Messages {
  NotAllShipsOnField = 'Put all ships on the field!',
  GameHasStarted = 'The game has started! Good luck!',
  GameIsOver = 'The game is over! Thanks for playing.',
  TwoPlayersInRoom = 'Your opponent has joined.',
  NoTwoPlayersInRoom = 'You don not have an opponent!',
  PlayerPlaying = 'Your opponent has started playing.',
  PlayerIsNotReady = 'Your opponent is not ready.',
  PlayerWon = 'Congratulations! You have won!',
  NotYourMove = 'It is not your move now.',
  YouHitOpponent = 'Nice! You have hit opponent!',
}
