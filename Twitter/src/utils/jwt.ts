import { config } from 'dotenv'
import jwt, { SignOptions } from 'jsonwebtoken'
import { reject } from 'lodash'
import { TokenPayLoad } from '~/models/requests/User.request'

config()

export const signToken = ({
  payload,
  privateKey = process.env.JWT_SECRET as string,
  options = {
    algorithm: 'HS256'
  }
}: {
  payload: string | Buffer | object
  privateKey?: string
  options?: SignOptions
}) => {
  return new Promise<string>((resolve, reject) => {
    jwt.sign(payload, privateKey, options, (error, token) => {
      if (error) {
        throw reject(error)
      }
      resolve(token as string)
    })
  })
}

export const verifyToken = ({
  token,
  secretOnPublicKey = process.env.JWT_SECRET as string
}: {
  token: string
  secretOnPublicKey?: string
}) => {
  return new Promise<TokenPayLoad>((resolve, reject) => {
    jwt.verify(token, secretOnPublicKey, (error, decoded) => {
      if (error) {
        throw reject(error)
      }
      resolve(decoded as TokenPayLoad)
    })
  })
}
