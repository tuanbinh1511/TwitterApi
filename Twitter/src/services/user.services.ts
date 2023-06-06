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
}
const userServices = new UserServices()
export default userServices
