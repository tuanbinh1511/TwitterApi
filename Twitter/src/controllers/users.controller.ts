import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { ObjectId } from 'mongodb'
import { USER_MESSAGES } from '~/constants/messages'
import { LogoutRequestBody, RegisterRequestBody } from '~/models/requests/User.request'
import User from '~/models/schema/User.schema'
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
