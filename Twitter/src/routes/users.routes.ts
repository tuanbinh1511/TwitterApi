import { Router } from 'express'
import { loginController, registerController } from '~/controllers/users.controller'
import { loginValidator, registerValidator } from '~/middlewares/users.middlewares'
import { validate } from '~/utils/validation'

const usersRouter = Router()

usersRouter.post('/login', loginValidator, loginController)
usersRouter.post('/register', registerValidator, registerController)

export default usersRouter
