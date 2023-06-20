import { Request } from 'express'
import User from './models/schema/User.schema'
import { TokenPayLoad } from './models/requests/User.request'

declare module 'express' {
  interface Request {
    user?: User
    decoded_authorization?: TokenPayLoad
    decoded_refresh_token?: TokenPayLoad
    decoded_email_verify_token?: TokenPayload
  }
}
