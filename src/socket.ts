import { Server, Socket } from 'socket.io'

interface ChatSocketParams {
    room: string,
    message: string
}

export default function socketHandler(io: Server) {
    io.on('connection', (socket: Socket) => {
        console.log('a user is connected')

        socket.on('joinRoom', (room: string) => {
            socket.join(room)
            console.log(`user joined room ${room}`)
        })

        socket.on('chatMessage', ({room, message}: ChatSocketParams) => {
            io.to(room).emit('chatMessage', message)
        })

        socket.on('disconnect', () => console.log('user disconnected'))
    })
}