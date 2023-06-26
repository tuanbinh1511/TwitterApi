import { JwtPayload } from 'jsonwebtoken'
import { TokenType } from '~/constants/enums'
import { ParamsDictionary } from 'express-serve-static-core'
export interface LoginRequestBody {
  email: string
  password: string
}

export interface RegisterRequestBody {
  name: string
  email: string
  password: string
  confirm_password: string
  date_of_birth: string
}

export interface EmailVerifyTokenRequestBody {
  email_verify_token: string
}

export interface LogoutRequestBody {
  refresh_token: string
}

export interface TokenPayLoad extends JwtPayload {
  user_id: string
  token_type: TokenType
}
export interface ForgotPasswordRequestBody {
  email: string
}
export interface VerifyForgotPasswordRequestBody {
  forgot_password_token: string
}
export interface ResetPasswordRequestBody {
  password: string
  confirm_password: string
  forgot_password_token: string
}
export interface UpdateMeRequestBody {
  name?: string
  date_of_birth?: string
  bio?: string
  location?: string
  website?: string
  username?: string
  avatar?: string
  cover_photo?: string
}
export interface followRequestBody {
  followed_user_id: string
}
export interface unFollowRequestParams extends ParamsDictionary {
  user_id: string
}
export interface GetProfileReqParams {
  username: string
}
export interface changePasswordReqBody {
  old_password: string
  password: string
  confirm_password: string
}
