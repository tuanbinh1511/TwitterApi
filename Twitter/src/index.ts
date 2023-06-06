import express from 'express'
import usersRouter from './routes/users.routes'
import databaseServices from './services/database.services'

const app = express()
const port = 4000
app.use(express.json())

app.use('/users', usersRouter)
databaseServices.connect()

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
