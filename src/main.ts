import Button from './components/controls/Button'
import Controller from './entities/Controller'
import Battleship from './instances/Battleship'
import { GameState } from './models'
//
import './styles/base.css'

function main() {
  const game = new Battleship()
  game.run()
}

main()
