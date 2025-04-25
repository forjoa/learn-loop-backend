import httpServer from './app'

httpServer.listen(8000, '0.0.0.0', () => {
    console.log('Server is running on port 8000')
})