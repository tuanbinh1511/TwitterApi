import { JwtPayload } from 'jsonwebtoken'
import { TokenType } from '~/constants/enums'

export interface RegisterRequestBody {
  name: string
  email: string
  password: string
  confrimpassword: string
  date_of_birth: string
}

export interface LogoutRequestBody {
  refresh_token: string
}

export interface TokenPayLoad extends JwtPayload {
  user_id: string
  token_type: TokenType
}
