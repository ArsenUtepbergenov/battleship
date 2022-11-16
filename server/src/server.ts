import 'reflect-metadata'
import app from './app'
const debug = require('debug')('socketio-server:server')
import { createServer } from 'http'
import socketServer from './socket'

const port = normalizePort(process.env.PORT || '9000')
app.set('port', port)

const server = createServer(app)

server.listen(port)
server.on('error', onError)
server.on('listening', onListening)

const io = socketServer(server)

function normalizePort(val: string) {
  const port = parseInt(val, 10)

  if (isNaN(port)) return val
  if (port >= 0) return port

  return false
}

function onError(error: { syscall: string; code: any }) {
  if (error.syscall !== 'listen') {
    throw error
  }

  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port

  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges')
      process.exit(1)
      break
    case 'EADDRINUSE':
      console.error(bind + ' is already in use')
      process.exit(1)
      break
    default:
      throw error
  }
}

function onListening() {
  const addr = server.address()
  const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr?.port
  debug('Listening on ' + bind)

  console.log('Server Running on Port: ', port)
}
