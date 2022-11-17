import Connection from './components/Connection'
import Layout from './components/Layout'
//
import Battleship from './instances/Battleship'
//
import './styles/base.css'

function main() {
  const layout = new Layout()
  const game = new Battleship()
  const connection = new Connection()

  connection.connect(update)

  function update() {
    try {
      if (!layout.create()) {
        throw new Error('A global error! The game cannot be started.')
      }

      game.run()
    } catch (error) {
      console.error(error)
    }
  }
}

main()
