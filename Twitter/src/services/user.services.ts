import User from '~/models/schema/User.schema'
import databaseServices from './database.services'

class UserServices {
  async register(payload: { email: string; password: string }) {
    const { email, password } = payload
    const result = await databaseServices.users.insertOne(
      new User({
        email,
        password
      })
    )
    return result
  }
  async checkEmailExist(email: string) {
    const user = await databaseServices.users.findOne({ email })

    return Boolean(user)
  }
}
const userServices = new UserServices()
export default userServices
