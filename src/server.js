import express from 'express'
import dotenv from 'dotenv'
import connect from './config/db.js'
import cors from 'cors'
import verifyToken from './middlewares/verifyToken.js'
dotenv.config()
connect()

const app = express()
app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
    console.log('hello')
})

import userRoute from './routes/user.routes.js'
app.use('/api/user', userRoute)

import chatRoute from './routes/chat.routes.js'
app.use('/api/chat', verifyToken, chatRoute)

import messageRoute from './routes/message.routes.js'
app.use('/api/message', verifyToken, messageRoute)


import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer(app);

const io = new Server(httpServer, {
    pingTimeout: 60000,
    cors: {
        origin: 'http://127.0.0.1:5173'
    }
})

io.on('connection', (socket) => {
    console.log('someone connected!');

    socket.on('setup', (userData) => {
        if(!userData) return
        socket.join(userData._id)
        console.log('object')
        socket.emit('connected')
    })

    socket.on('join chat', (room) => {
        socket.join(room)
        console.log('joined room', room)
    })

    socket.on('new message', (newMessageRecieved) => {
        var chat = newMessageRecieved.chat
        
        if(!chat.users) return console.log('chat.users not defined')

        chat.users.forEach((user) => {
            if(user._id === newMessageRecieved.sender._id) return

            socket.in(user._id).emit('message recieved', newMessageRecieved)
        })
    })
});

const PORT = process.env.PORT || 4000
httpServer.listen(PORT, () => {
    console.log(`server started at port ${PORT}`)
});