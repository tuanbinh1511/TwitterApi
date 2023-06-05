import express from 'express'
import usersRouter from './routes/users.routes'
const app = express()
const port = 4000
app.use(express.json())
const router = express.Router()

router.post('/', (req, res) => {
  console.log('hello world')
})

app.use('/users', usersRouter)

module.exports = router
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
