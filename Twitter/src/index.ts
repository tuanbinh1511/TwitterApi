import express from 'express'
import usersRouter from './routes/users.routes'
import databaseServices from './services/database.services'
import { defaultErrorHandler } from './middlewares/errors.middlewares'
import mediasRouter from './routes/medias.routes'

const app = express()
const port = 4000
databaseServices.connect()

app.use(express.json())
app.use('/users', usersRouter)
app.use('/medias', mediasRouter)
app.use(defaultErrorHandler)
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
