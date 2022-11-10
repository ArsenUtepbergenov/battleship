import Button from './components/controls/Button'
import Battleship from './instances/Battleship'
//
import './styles/base.css'

function main() {
  const game = new Battleship()
  game.run()

  const resetAllButton = new Button({
    parentElement: 'controls',
    id: 'reset-all-button',
    text: 'reset all',
  })

  const undoLastAction = new Button({
    parentElement: 'controls',
    id: 'undo-button',
    text: 'undo last',
  })

  resetAllButton.click = () => game.rerun()
  undoLastAction.click = () => game.undoLastAction()
}

main()
