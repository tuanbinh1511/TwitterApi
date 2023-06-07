import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { RegisterRequestBody } from '~/models/requests/User.request'
import userServices from '~/services/user.services'

export const loginController = (req: Request, res: Response) => {
  const { email, password } = req.body
  if (email === 'binh123@gmail.com' && password === '123123') {
    return res.status(200).json({
      message: 'Login success!'
    })
  }

  return res.status(400).json({
    error: 'Login failed'
  })
}
export const registerController = async (req: Request<ParamsDictionary, any, RegisterRequestBody>, res: Response) => {
  try {
    const result = await userServices.register(req.body)

    return res.json({
      message: 'Register success!',
      result
    })
  } catch (error) {
    return res.status(400).json({
      error: 'Register failed'
    })
  }
}
