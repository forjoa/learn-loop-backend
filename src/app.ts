import { createServer } from 'node:http'
import cors from 'cors'
import express from 'express'
import OpenAI from 'openai'
import { Server } from 'socket.io'

// helpers
import { auth } from './middleware/auth.ts'
import authRoute from './modules/auth/auth.route.ts'
import chatRoutes from './modules/chat/chat.routes.ts'
import chatMemberRoutes from './modules/chatMembers/chatMember.routes.ts'
import enrollmentRoutes from './modules/enrollments/enrollment.routes.ts'
import filesRoutes from './modules/files/files.routes.ts'
import messageRoutes from './modules/messages/message.routes.ts'
import notificationRoutes from './modules/notifications/notification.routes.ts'
import postRoutes from './modules/posts/post.routes.ts'
import topicRoutes from './modules/topics/topic.routes.ts'
// routes
import userRoutes from './modules/users/user.routes.ts'

const app = express()

app.use(cors())
app.use(express.json())

// unprotected routes
app.use('/auth', authRoute)

// @ts-expect-error
app.use(auth)

app.use('/users', userRoutes)
app.use('/topics', topicRoutes)
app.use('/enrollments', enrollmentRoutes)
app.use('/chatMembers', chatMemberRoutes)
app.use('/messages', messageRoutes)
app.use('/notifications', notificationRoutes)
app.use('/chats', chatRoutes)
app.use('/posts', postRoutes)
app.use('/files', filesRoutes)
app.post('/loopy', async (req, res) => {
    const { message } = req.body
    const openai = new OpenAI({
        baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
        apiKey: env.GEMINI_KEY,
    })

    const response = await openai.chat.completions.create({
        model: 'gemini-2.0-flash',
        messages: [
            { role: 'system', content: 'You are a helpful assistant.' },
            {
                role: 'user',
                content: message as string,
            },
        ],
    })

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

import { env } from './config/env.ts'
import socketHandler from './socket.ts'

socketHandler(io)

export default httpServer
