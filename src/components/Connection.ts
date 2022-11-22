import gameService from '@/services/game-service'
import socketService from '@/services/socket-service'
import Button from './controls/Button'
import TextInput from './inputs/TextInput'
import { URL } from '@/config'

export default class Connection {
  private roomName: string = ''
  private updateCallback: Function | null = null

  public connect(updateCallback: { (): void }): void {
    this.updateCallback = updateCallback
    this.socketConnect()
    this.init()
  }

  private init(): void {
    const joinRoomInput = new TextInput({
      id: 'join-room-input',
      placeholder: 'Enter Room ID to Join the Game...',
    })
    joinRoomInput.input = event => {
      if (!event) return

      const target = event.target as HTMLInputElement
      this.roomName = target.value
      joinRoomInput.setValue(this.roomName)
    }

    const joinRoomButton = new Button({ id: 'join-room-button', text: 'Submit' })
    joinRoomButton.click = () => {
      this.joinRoom()
      joinRoomInput.clear()
    }

    joinRoomInput.appendTo('connection-settings')
    joinRoomButton.appendTo('connection-settings')
  }

  private async socketConnect(): Promise<void> {
    await socketService.connect(URL).catch(error => console.log('Error: ', error))
  }

  private async joinRoom(): Promise<void> {
    const socket = socketService.socket
    const tRoomName = this.roomName.trim()

    if (!socket || !tRoomName) return

    const joined = await gameService.joinGameRoom(socket, tRoomName).catch(error => alert(error))

    if (joined) {
      console.log('You have successfully joined.')
      this.updateCallback!()
    }
  }
}
