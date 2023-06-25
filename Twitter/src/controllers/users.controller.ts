import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { pick, result } from 'lodash'
import { ObjectId } from 'mongodb'
import { UserVerifyStatus } from '~/constants/enums'
import httpStatus from '~/constants/httpStatus'
import { USER_MESSAGES } from '~/constants/messages'
import {
  EmailVerifyTokenRequestBody,
  ForgotPasswordRequestBody,
  GetProfileReqParams,
  LoginRequestBody,
  LogoutRequestBody,
  RegisterRequestBody,
  ResetPasswordRequestBody,
  TokenPayLoad,
  UpdateMeRequestBody,
  VerifyForgotPasswordRequestBody,
  followRequestBody
} from '~/models/requests/User.request'
import User from '~/models/schema/User.schema'
import databaseServices from '~/services/database.services'
import userServices from '~/services/user.services'

export const loginController = async (req: Request<ParamsDictionary, any, LoginRequestBody>, res: Response) => {
  const user = req.user as User

  const user_id = user._id as ObjectId
  const result = await userServices.Login({ user_id: user_id.toString(), verify: user.verify })
  return res.json({
    message: USER_MESSAGES.LOGIN_SUCCESS,
    result
  })
}
export const registerController = async (
  req: Request<ParamsDictionary, any, RegisterRequestBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await userServices.register(req.body)

    return res.json({
      message: USER_MESSAGES.REGISTER_SUCCESS,
      result
    })
  } catch (error) {
    next(error)
    // return res.status(400).json({
    //   error: 'Register failed'
    // })
  }
}
export const logoutController = async (req: Request<ParamsDictionary, any, LogoutRequestBody>, res: Response) => {
  const { refresh_token } = req.body
  const result = await userServices.Logout(refresh_token)
  return res.json(result)
}

export const emailVerifyController = async (
  req: Request<ParamsDictionary, any, EmailVerifyTokenRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = req.decoded_email_verify_token as TokenPayLoad
  const user = await databaseServices.users.findOne({
    _id: new ObjectId(user_id)
  })
  // Nếu không tìm thấy user thì mình sẽ báo lỗi
  if (!user) {
    return res.status(httpStatus.NOT_FOUND).json({
      message: USER_MESSAGES.USER_NOT_FOUND
    })
  }
  // Đã verify rồi thì mình sẽ không báo lỗi
  // Mà mình sẽ trả về status OK với message là đã verify trước đó rồi
  if (user.email_verify_token === '') {
    return res.json({
      message: USER_MESSAGES.EMAIL_ALREADY_VERIFIED_BEFORE
    })
  }
  const result = await userServices.verifyEmail(user_id)
  return res.json({
    message: USER_MESSAGES.EMAIL_VERIFY_SUCCESS,
    result
  })
}

export const resendVerifyEmailController = async (req: Request, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayLoad

  const user = await databaseServices.users.findOne({ _id: new ObjectId(user_id) })
  if (!user) {
    return res.status(httpStatus.NOT_FOUND).json({
      message: USER_MESSAGES.USER_NOT_FOUND
    })
  }
  if (user.verify === UserVerifyStatus.Verified) {
    return res.json({
      message: USER_MESSAGES.EMAIL_ALREADY_VERIFIED_BEFORE
    })
  }
  const result = await userServices.resendVerifyEmail(user_id)
  return res.json(result)
}

export const forgotPasswordController = async (
  req: Request<ParamsDictionary, any, ForgotPasswordRequestBody>,
  res: Response
) => {
  const { _id, verify } = req.user as User
  const result = await userServices.forgotPassword({ user_id: (_id as ObjectId).toString(), verify: verify })
  return res.json(result)
}
export const verifyForgotPasswordController = async (
  req: Request<ParamsDictionary, any, VerifyForgotPasswordRequestBody>,
  res: Response
) => {
  return res.json({
    message: 'Verify password successfully!'
  })
}

export const resetPasswordController = async (
  req: Request<ParamsDictionary, any, ResetPasswordRequestBody>,
  res: Response
) => {
  console.log(req.decoded_forgot_password_token)
  const { user_id } = req.decoded_forgot_password_token as TokenPayLoad
  const { password } = req.body
  const result = await userServices.resetPassword(user_id, password)
  return res.json(result)
}

export const getMeController = async (req: Request, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayLoad
  const user = await userServices.getMe(user_id)
  return res.json({
    message: 'Get me successfully!',
    result: user
  })
}

export const updateMeController = async (req: Request<ParamsDictionary, any, UpdateMeRequestBody>, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayLoad
  const body = req.body
  const user = await userServices.updateMe(user_id, body)

  return res.json({
    message: USER_MESSAGES.UPDATE_ME_SUCCESS,
    result: user
  })
}

export const getProfileController = async (req: Request<GetProfileReqParams>, res: Response, next: NextFunction) => {
  const { username } = req.params
  const user = await userServices.getProfile(username)
  return res.json({
    message: 'Get profile successfully',
    result: user
  })
}
export const followController = async (
  req: Request<ParamsDictionary, any, followRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = req.decoded_authorization as TokenPayLoad
  const { followed_user_id } = req.body
  const result = await userServices.follow(user_id, followed_user_id)
  return res.json(result)
}
