import Battleship from './instances/Battleship'
//
import './styles/base.css'

function main() {
  const game = new Battleship('canvas')

  game.draw()
}

main()
