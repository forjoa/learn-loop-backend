import { createServer } from 'node:http'
import cors from 'cors'
import express from 'express'
import { Server } from 'socket.io'

// helpers
import { auth } from './middleware/auth.ts'
import authRoute from './modules/auth/auth.route.ts'
import chatRoutes from './modules/chat/chat.routes.ts'
import enrollmentRoutes from './modules/enrollments/enrollment.routes.ts'
import notificationRoutes from './modules/notifications/notification.routes.ts'
import postRoutes from './modules/posts/post.routes.ts'
import topicPublicRoutes from './modules/topics/topic.public.routes.ts'
import topicRoutes from './modules/topics/topic.routes.ts'
// routes
import userRoutes from './modules/users/user.routes.ts'

const app = express()

app.use(cors())
app.use(express.json())

// unprotected routes
app.use('/auth', authRoute)
app.use('/public/topics', topicPublicRoutes)

// @ts-expect-error
app.use(auth)

app.use('/users', userRoutes)
app.use('/topics', topicRoutes)
app.use('/enrollments', enrollmentRoutes)
app.use('/notifications', notificationRoutes)
app.use('/chats', chatRoutes)
app.use('/posts', postRoutes)

// socket init
const httpServer = createServer(app)
const io = new Server(httpServer, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
})

import socketHandler from './socket.ts'

socketHandler(io)
app.set('io', io)

export default httpServer
