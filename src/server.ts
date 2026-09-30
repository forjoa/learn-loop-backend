import httpServer from './app.ts'

const port = Number(process.env.PORT) || 8000

httpServer.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on port ${port}`)
})