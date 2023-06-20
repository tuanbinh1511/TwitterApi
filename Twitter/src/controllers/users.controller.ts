import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { ObjectId } from 'mongodb'
import httpStatus from '~/constants/httpStatus'
import { USER_MESSAGES } from '~/constants/messages'
import { LogoutRequestBody, RegisterRequestBody, TokenPayLoad } from '~/models/requests/User.request'
import User from '~/models/schema/User.schema'
import databaseServices from '~/services/database.services'
import userServices from '~/services/user.services'

export const loginController = async (req: Request, res: Response) => {
  const user = req.user as User

  const user_id = user._id as ObjectId
  const result = await userServices.Login(user_id.toString())
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

export const emailVerifyValidator = async (req: Request, res: Response, next: NextFunction) => {
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
