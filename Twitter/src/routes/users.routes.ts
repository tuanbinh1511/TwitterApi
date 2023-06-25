import { Router } from 'express'
import {
  emailVerifyController,
  followController,
  forgotPasswordController,
  getMeController,
  getProfileController,
  loginController,
  logoutController,
  registerController,
  resendVerifyEmailController,
  resetPasswordController,
  updateMeController,
  verifyForgotPasswordController
} from '~/controllers/users.controller'
import { filterMiddleware } from '~/middlewares/common.middleware'
import {
  accessTokenValidator,
  emailVerifyTokenValidator,
  followValidator,
  forgotPasswordValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator,
  resetPasswordValidator,
  updateMeValidator,
  verifiedUserValidator,
  verifyForgotPasswordTokenValidator
} from '~/middlewares/users.middlewares'
import { UpdateMeRequestBody } from '~/models/requests/User.request'
import { wrapAsync } from '~/utils/handlers'

const usersRouter = Router()

usersRouter.post('/login', loginValidator, wrapAsync(loginController))
usersRouter.post('/register', registerValidator, wrapAsync(registerController))
usersRouter.post('/logout', accessTokenValidator, refreshTokenValidator, wrapAsync(logoutController))
usersRouter.post('/verify-email', emailVerifyTokenValidator, wrapAsync(emailVerifyController))
usersRouter.post('/resend-verify-email', accessTokenValidator, wrapAsync(resendVerifyEmailController))
usersRouter.post('/forgot-password', forgotPasswordValidator, wrapAsync(forgotPasswordController))
usersRouter.post(
  '/verify-forgot-password',
  verifyForgotPasswordTokenValidator,
  wrapAsync(verifyForgotPasswordController)
)
usersRouter.post('/reset-password', resetPasswordValidator, wrapAsync(resetPasswordController))
usersRouter.get('/me', accessTokenValidator, wrapAsync(getMeController))
usersRouter.patch(
  '/me',
  accessTokenValidator,
  verifiedUserValidator,
  updateMeValidator,
  filterMiddleware<UpdateMeRequestBody>([
    'name',
    'date_of_birth',
    'bio',
    'location',
    'website',
    'username',
    'avatar',
    'cover_photo'
  ]),
  wrapAsync(updateMeController)
)

usersRouter.get('/:username', wrapAsync(getProfileController))
usersRouter.post('/follow', accessTokenValidator, verifiedUserValidator, followValidator, wrapAsync(followController))

export default usersRouter
