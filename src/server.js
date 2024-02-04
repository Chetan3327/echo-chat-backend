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

const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
    console.log(`server started at port: ${PORT}`)
})