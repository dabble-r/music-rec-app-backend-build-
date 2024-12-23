import { MONGODB_URI } from './utils/config.js'
import express, { json } from 'express'
const app = express()
import cors from 'cors'
import albumsRouter from './controllers/albums.js'
import { requestLogger, unknownEndpoint, errorHandler } from './utils/middleware.js'
import { info, errorLog } from './utils/logger.js'
import { set, connect } from 'mongoose'

set('strictQuery', false)

info('connecting to', MONGODB_URI)

connect(MONGODB_URI)
  .then(() => {
    info('connected to MongoDB')
  })
  .catch((error) => {
    errorLog('error connecting to MongoDB:', error.message)
  })

app.use(cors())
app.use(express.static('dist'))
app.use(json())
app.use(requestLogger)

app.use('/api/albums', albumsRouter)

app.use(unknownEndpoint)
app.use(errorHandler)

export default app