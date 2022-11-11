import Button from './components/controls/Button'
import Battleship from './instances/Battleship'
//
import './styles/base.css'

function main() {
  const game = new Battleship()
  game.run()

  const playButton = new Button({
    parentElement: 'controls',
    id: 'play-button',
    text: 'play',
  })

  const resetAllButton = new Button({
    parentElement: 'controls',
    id: 'reset-all-button',
    text: 'reset all',
  })

  const undoLastButton = new Button({
    parentElement: 'controls',
    id: 'undo-button',
    text: 'undo last',
  })

  playButton.click = () => {
    playButton.setAttribute('disabled', '')
    resetAllButton.setAttribute('disabled', '')
    undoLastButton.setAttribute('disabled', '')
    playButton.click = null
    resetAllButton.click = null
    undoLastButton.click = null
    game.play()
  }
  resetAllButton.click = () => game.reset()
  undoLastButton.click = () => game.undoLastAction()
}

main()
