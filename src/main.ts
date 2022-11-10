import Button from './components/controls/Button'
import Battleship from './instances/Battleship'
//
import './styles/base.css'

function main() {
  const game = new Battleship()
  game.run()

  const restartButton = new Button({
    parentElement: 'controls',
    id: 'restart-button',
    text: 'restart',
  })

  const undoLastAction = new Button({
    parentElement: 'controls',
    id: 'undo-button',
    text: 'undo',
  })

  restartButton.click = () => game.rerun()
  undoLastAction.click = () => game.undoLastAction()
}

main()
