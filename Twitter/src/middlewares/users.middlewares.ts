import { config } from 'dotenv'
import { Request, Response, NextFunction } from 'express'
import { checkSchema } from 'express-validator'
import { JsonWebTokenError } from 'jsonwebtoken'
import httpStatus from '~/constants/httpStatus'
import { USER_MESSAGES } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Errors'
import databaseServices from '~/services/database.services'
import userServices from '~/services/user.services'
import { hashPassword } from '~/utils/crypto'
import { verifyToken } from '~/utils/jwt'
import { validate } from '~/utils/validation'

config()
export const loginValidator = validate(
  checkSchema(
    {
      email: {
        isEmail: {
          errorMessage: USER_MESSAGES.EMAIL_IN_VALID
        },
        trim: true,
        custom: {
          options: async (value: string, { req }) => {
            const user = await databaseServices.users.findOne({
              email: value,
              password: hashPassword(req.body.password)
            })
            if (user === null) {
              throw new Error(USER_MESSAGES.EMAIL_AND_PASSWORD_INCORRECT)
            }
            req.user = user
            return true
          }
        }
      },
      password: {
        notEmpty: {
          errorMessage: USER_MESSAGES.PASSWORD_IS_REQUIRE
        },
        isString: {
          errorMessage: USER_MESSAGES.PASSWORD_MUST_BE_A_STRING
        },
        isLength: {
          options: {
            min: 6,
            max: 50
          },
          errorMessage: USER_MESSAGES.PASSWORD_LENGTH
        }
      }
    },
    ['body']
  )
)

export const registerValidator = validate(
  checkSchema(
    {
      name: {
        notEmpty: {
          errorMessage: USER_MESSAGES.NAME_IS_REQUIRED
        },
        isString: {
          errorMessage: USER_MESSAGES.NAME_MUST_BE_A_STRING
        },
        isLength: {
          options: {
            min: 1,
            max: 50
          },
          errorMessage: USER_MESSAGES.NAME_LENGTH
        },
        trim: true
      },
      email: {
        notEmpty: {
          errorMessage: USER_MESSAGES.EMAIL_IS_REQUIRE
        },
        isEmail: {
          errorMessage: USER_MESSAGES.EMAIL_IN_VALID
        },
        trim: true,
        custom: {
          options: async (value: string) => {
            const result = await userServices.checkEmailExist(value)
            if (result) {
              throw new Error(USER_MESSAGES.EMAIL_ALREADY_EXISTS)
            }
            return result
          }
        }
      },
      password: {
        notEmpty: {
          errorMessage: USER_MESSAGES.PASSWORD_IS_REQUIRE
        },
        isString: {
          errorMessage: USER_MESSAGES.PASSWORD_MUST_BE_A_STRING
        },
        isLength: {
          options: {
            min: 6,
            max: 50
          },
          errorMessage: USER_MESSAGES.PASSWORD_LENGTH
        },
        isStrongPassword: {
          errorMessage: USER_MESSAGES.CONFIRMPASSWORD_MUST_BE_A_STRONG,
          options: {
            minLength: 6,
            minLowercase: 1,
            minNumbers: 1,
            minUppercase: 1,
            minSymbols: 1
          }
        }
      },
      confirmPassword: {
        errorMessage: USER_MESSAGES.CONFIRMPASSWORD_MUST_BE_A_STRONG,
        notEmpty: {
          errorMessage: USER_MESSAGES.CONFIRMPASSWORD_IS_REQUIRE
        },
        isString: {
          errorMessage: USER_MESSAGES.CONFIRMPASSWORD_LENGTH
        },
        isLength: {
          options: {
            min: 6,
            max: 50
          },
          errorMessage: USER_MESSAGES.CONFIRMPASSWORD_LENGTH
        },
        isStrongPassword: {
          options: {
            minLength: 6,
            minLowercase: 1,
            minNumbers: 1,
            minUppercase: 1,
            minSymbols: 1
          },
          errorMessage: USER_MESSAGES.CONFIRMPASSWORD_MUST_BE_A_STRONG
        },
        custom: {
          options: (value, { req }) => {
            if (value !== req.body.password) {
              throw new Error(USER_MESSAGES.CONFIRMPASSWORD_NOTSAME)
            }
            return true
          }
        }
      },
      date_of_birth: {
        isISO8601: {
          options: {
            strict: true,
            strictSeparator: true
          }
        },
        errorMessage: USER_MESSAGES.DATE_OF_BIRTH_NOT_BE_ISO8601
      }
    },
    ['body']
  )
)
export const accessTokenValidator = validate(
  checkSchema(
    {
      Authorization: {
        custom: {
          options: async (value: string, { req }) => {
            const access_token = value.split(' ')[1]
            console.log('access_token', access_token)

            if (!access_token)
              throw new ErrorWithStatus({
                message: USER_MESSAGES.ACCESSTOKEN_IS_REQUIRED,
                status: httpStatus.UNAUTHORIZED
              })
            try {
              const decoded_authorization = verifyToken({ token: access_token })
              req.decoded_authorization = decoded_authorization
            } catch (error) {
              throw new ErrorWithStatus({
                message: (error as JsonWebTokenError).message,
                status: httpStatus.UNAUTHORIZED
              })
            }
            return true
          }
        }
      }
    },
    ['headers']
  )
)
export const refreshTokenValidator = validate(
  checkSchema(
    {
      refresh_token: {
        notEmpty: {
          errorMessage: USER_MESSAGES.REFRESHTOKEN_IS_REQUIRED
        },
        custom: {
          options: async (value: string, { req }) => {
            try {
              const [decoded_refresh_token, refresh_token] = await Promise.all([
                verifyToken({ token: value }),
                databaseServices.refreshToken.findOne({ token: value })
              ])
              if (refresh_token === null) {
                throw new ErrorWithStatus({
                  status: httpStatus.UNAUTHORIZED,
                  message: USER_MESSAGES.USER_REFRESHTOKEN_NOT_EXIST
                })
              }
              ;(req as Request).decoded_refresh_token = decoded_refresh_token
            } catch (error) {
              if (error instanceof JsonWebTokenError) {
                throw new ErrorWithStatus({
                  status: httpStatus.UNAUTHORIZED,
                  message: USER_MESSAGES.REFRESHTOKEN_INVALID
                })
              }
              throw error
            }
            return true
          }
        }
      }
    },
    ['body']
  )
)
