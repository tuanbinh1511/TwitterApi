import User from '~/models/schema/User.schema'
import databaseServices from './database.services'
import { RegisterRequestBody } from '~/models/requests/User.request'
import { hashPassword } from '~/utils/crypto'
import { signToken } from '~/utils/jwt'
import { TokenType } from '~/constants/enums'
import RefreshToken from '~/models/schema/RefreshToken.schema'
import { ObjectId } from 'mongodb'
import { config } from 'dotenv'

config()

class UserServices {
  private signAccessToken(userId: string) {
    return signToken({
      payload: {
        userId,
        token_type: TokenType.AccessToken
      },
      options: {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN
      }
    })
  }
  private signRefreshToken(userId: string) {
    return signToken({
      payload: {
        userId,
        token_type: TokenType.RefreshToken
      },
      options: {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN
      }
    })
  }
  private SignAccessAndRefreshToken = (user_id: string) => {
    return Promise.all([this.signAccessToken(user_id), this.signRefreshToken(user_id)])
  }
  async register(payload: RegisterRequestBody) {
    const result = await databaseServices.users.insertOne(
      new User({
        ...payload,
        date_of_birth: new Date(payload.date_of_birth),
        password: hashPassword(payload.password)
      })
    )
    const user_id = result.insertedId.toString()
    const [access_token, refresh_token] = await this.SignAccessAndRefreshToken(user_id)
    await databaseServices.refreshToken.insertOne(new RefreshToken({ user_id: new ObjectId(), token: refresh_token }))
    return {
      access_token,
      refresh_token
    }
  }
  async checkEmailExist(email: string) {
    const user = await databaseServices.users.findOne({ email })

    return Boolean(user)
  }
  async Login(user_id: string) {
    const [access_token, refresh_token] = await this.SignAccessAndRefreshToken(user_id)
    await databaseServices.refreshToken.insertOne(new RefreshToken({ user_id: new ObjectId(), token: refresh_token }))

    return {
      access_token,
      refresh_token
    }
  }
  async Logout(refresh_token: string) {
    await databaseServices.refreshToken.deleteOne({ token: refresh_token })
    return {
      message: 'Logout success!'
    }
  }
}
const userServices = new UserServices()
export default userServices
