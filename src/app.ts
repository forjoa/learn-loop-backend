import express from 'express'
import cors from 'cors'
import { createServer } from 'node:http'
import { Server } from 'socket.io'
import OpenAI from 'openai'

// helpers
import { auth } from './middleware/auth'

// routes
import userRoutes from './modules/users/user.routes'
import topicRoutes from './modules/topics/topic.routes'
import authRoute from './modules/auth/auth.route'
import enrollmentRoutes from './modules/enrollments/enrollment.routes'
import messageRoutes from './modules/messages/message.routes'
import chatMemberRoutes from './modules/chatMembers/chatMember.routes'
import notificationRoutes from './modules/notifications/notification.routes'
import chatRoutes from './modules/chat/chat.routes'

const app = express()

app.use(cors())
app.use(express.json())

// unprotected routes
app.use('/auth', authRoute)

// @ts-ignore
app.use(auth)

app.use('/users', userRoutes)
app.use('/topics', topicRoutes)
app.use('/enrollments', enrollmentRoutes)
app.use('/chatMembers', chatMemberRoutes)
app.use('/messages', messageRoutes)
app.use('/notifications', notificationRoutes)
app.use('/chats', chatRoutes)
app.post('/loopy', async (req, res) => {
    const { message } = req.body
    const openai = new OpenAI({
        baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
        apiKey: env.GEMINI_KEY,
    })

    const response = await openai.chat.completions.create({
        model: "gemini-2.0-flash",
        messages: [
            { role: "system", content: "You are a helpful assistant." },
            {
                role: "user",
                content: message as string,
            },
        ],
    });

    res.send(response.choices[0].message)
})

// socket init
const httpServer = createServer(app)
const io = new Server(httpServer, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
})

import socketHandler from './socket'
import { env } from './config/env'

socketHandler(io)

export default httpServer
