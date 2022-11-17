import Button from './components/controls/Button'
import TextInput from './components/inputs/TextInput'
import gameService from './services/game-service'
import socketService from './services/socket-service'
//
// import Battleship from './instances/Battleship'
//
import './styles/base.css'

function main() {
  let roomName: string = ''
  let isJoining = false
  let inRoom = false

  const socketConnect = async () => {
    await socketService
      .connect('http://localhost:9000')
      .catch(error => console.log('Error: ', error))
  }

  socketConnect()

  const joinRoom = async () => {
    const socket = socketService.socket
    const tRoomName = roomName.trim()

    if (!socket || !tRoomName) return

    isJoining = true

    const joined = await gameService.joinGameRoom(socket, tRoomName).catch(error => alert(error))

    if (joined) inRoom = true

    isJoining = false
  }

  const joinRoomInput = new TextInput({
    id: 'join-room-input',
    placeholder: 'Enter Room ID to Join the Game...',
  })
  joinRoomInput.input = event => {
    if (!event) return

    const target = event.target as HTMLInputElement
    target.setAttribute('value', roomName)
    roomName = target.value
  }

  const joinRoomButton = new Button({ id: 'join-room-button', text: 'Submit' })
  joinRoomButton.click = () => joinRoom()

  joinRoomInput.appendTo('connection-settings')
  joinRoomButton.appendTo('connection-settings')

  // const game = new Battleship()
  // game.run()
}

main()
