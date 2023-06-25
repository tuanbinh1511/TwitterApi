import { config } from 'dotenv'
import { Request, Response, NextFunction } from 'express'
import { ParamSchema, checkSchema } from 'express-validator'
import { JsonWebTokenError } from 'jsonwebtoken'
import { capitalize } from 'lodash'
import { ObjectId } from 'mongodb'
import { UserVerifyStatus } from '~/constants/enums'
import httpStatus from '~/constants/httpStatus'
import { USER_MESSAGES } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Errors'
import { TokenPayLoad } from '~/models/requests/User.request'
import databaseServices from '~/services/database.services'
import userServices from '~/services/user.services'
import { hashPassword } from '~/utils/crypto'
import { verifyToken } from '~/utils/jwt'
import { validate } from '~/utils/validation'

config()

const passwordSchema: ParamSchema = {
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
}
const confirm_passwordSchema: ParamSchema = {
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
}

const forgot_passwordSchema: ParamSchema = {
  trim: true,
  custom: {
    options: async (value: string, { req }) => {
      if (!value) {
        throw new ErrorWithStatus({
          message: USER_MESSAGES.FORGOT_PASSWORD_TOKEN_IS_REQUIRED,
          status: httpStatus.UNAUTHORIZED
        })
      }
      try {
        const decoded_forgot_password_token = await verifyToken({
          token: value,
          secretOrPublicKey: process.env.JWT_SECRET_FORGOT_PASSWORD_TOKEN as string
        })
        const { user_id } = decoded_forgot_password_token
        const user = await databaseServices.users.findOne({ _id: new ObjectId(user_id) })

        if (user === null) {
          throw new ErrorWithStatus({
            status: httpStatus.UNAUTHORIZED,
            message: USER_MESSAGES.USER_NOT_FOUND
          })
        }
        if (user.forgot_password_token !== value) {
          throw new ErrorWithStatus({
            status: httpStatus.UNAUTHORIZED,
            message: USER_MESSAGES.FORGOT_PASSWORD_TOKEN_INVALID
          })
        }
        ;(req as Request).decoded_forgot_password_token = decoded_forgot_password_token
      } catch (error) {
        if (error instanceof JsonWebTokenError) {
          throw new ErrorWithStatus({
            status: httpStatus.UNAUTHORIZED,
            message: USER_MESSAGES.FORGOT_PASSWORD_TOKEN_NOT_EXISTS
          })
        }
        throw error
      }
      return true
    }
  }
}
const nameSchema: ParamSchema = {
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
}
const date_of_birthSchema: ParamSchema = {
  isISO8601: {
    options: {
      strict: true,
      strictSeparator: true
    }
  },
  errorMessage: USER_MESSAGES.DATE_OF_BIRTH_NOT_BE_ISO8601
}
const imageSchema: ParamSchema = {
  optional: true,
  isString: {
    errorMessage: USER_MESSAGES.IMAGE_URL_MUST_BE_STRING
  },
  trim: true,
  isLength: {
    options: {
      min: 1,
      max: 200
    },
    errorMessage: USER_MESSAGES.IMAGE_URL_LENGTH
  }
}
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
      name: nameSchema,
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
      password: passwordSchema,
      confirm_password: confirm_passwordSchema,
      date_of_birth: date_of_birthSchema
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
            const access_token = (value || '').split(' ')[1]

            if (!access_token)
              throw new ErrorWithStatus({
                message: USER_MESSAGES.ACCESSTOKEN_IS_REQUIRED,
                status: httpStatus.UNAUTHORIZED
              })
            try {
              const decoded_authorization = await verifyToken({
                token: access_token,
                secretOrPublicKey: process.env.JWT_SECRET_ACCESS_TOKEN as string
              })
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
        trim: true,
        custom: {
          options: async (value: string, { req }) => {
            if (!value) {
              throw new ErrorWithStatus({
                message: USER_MESSAGES.REFRESHTOKEN_IS_REQUIRED,
                status: httpStatus.UNAUTHORIZED
              })
            }
            try {
              const [decoded_refresh_token, refresh_token] = await Promise.all([
                verifyToken({ token: value, secretOrPublicKey: process.env.JWT_SECRET_REFRESH_TOKEN as string }),
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

export const emailVerifyTokenValidator = validate(
  checkSchema(
    {
      email_verify_token: {
        trim: true,
        custom: {
          options: async (value: string, { req }) => {
            if (!value) {
              throw new ErrorWithStatus({
                message: USER_MESSAGES.EMAIL_VERIFY_TOKEN_IS_REQUIRED,
                status: httpStatus.UNAUTHORIZED
              })
            }
            try {
              const decoded_email_verify_token = await verifyToken({
                token: value,
                secretOrPublicKey: process.env.JWT_SECRET_EMAIL_VERIFY_TOKEN as string
              })

              ;(req as Request).decoded_email_verify_token = decoded_email_verify_token
            } catch (error) {
              throw new ErrorWithStatus({
                message: capitalize((error as JsonWebTokenError).message),
                status: httpStatus.UNAUTHORIZED
              })
            }

            return true
          }
        }
      }
    },
    ['body']
  )
)

export const forgotPasswordValidator = validate(
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
              email: value
            })
            if (user === null) {
              throw new Error(USER_MESSAGES.USER_NOT_FOUND)
            }
            req.user = user
            return true
          }
        }
      }
    },
    ['body']
  )
)

export const verifyForgotPasswordTokenValidator = validate(
  checkSchema(
    {
      forgot_password_token: forgot_passwordSchema
    },
    ['body']
  )
)

export const resetPasswordValidator = validate(
  checkSchema(
    {
      password: passwordSchema,
      confirm_password: confirm_passwordSchema,
      forgot_password_token: forgot_passwordSchema
    },
    ['body']
  )
)

export const verifiedUserValidator = (req: Request, res: Response, next: NextFunction) => {
  const { verify } = req.decoded_authorization as TokenPayLoad
  if (verify !== UserVerifyStatus.Verified) {
    return next(
      new ErrorWithStatus({
        message: USER_MESSAGES.USER_NOT_VERIFY,
        status: httpStatus.FORBIDDEN
      })
    )
  }
  next()
}

export const updateMeValidator = validate(
  checkSchema(
    {
      name: { ...nameSchema, optional: true, isEmpty: undefined },
      date_of_birth: { ...date_of_birthSchema, optional: true },
      bio: {
        optional: true,
        isString: {
          errorMessage: USER_MESSAGES.BIO_MUST_BE_STRING
        },
        trim: true,
        isLength: {
          options: {
            min: 1,
            max: 200
          },
          errorMessage: USER_MESSAGES.BIO_LENGTH
        }
      },
      location: {
        optional: true,
        isString: {
          errorMessage: USER_MESSAGES.LOCATION_MUST_BE_STRING
        },
        trim: true,
        isLength: {
          options: {
            min: 1,
            max: 200
          },
          errorMessage: USER_MESSAGES.LOCATION_LENGTH
        }
      },
      website: {
        optional: true,
        isString: {
          errorMessage: USER_MESSAGES.WEBSITE_MUST_BE_STRING
        },
        trim: true,
        isLength: {
          options: {
            min: 1,
            max: 200
          },
          errorMessage: USER_MESSAGES.WEBSITE_LENGTH
        }
      },
      username: {
        optional: true,
        isString: {
          errorMessage: USER_MESSAGES.USERNAME_MUST_BE_STRING
        },
        trim: true,

        isLength: {
          options: {
            min: 1,
            max: 50
          },
          errorMessage: USER_MESSAGES.USERNAME_LENGTH
        }
      },
      avatar: imageSchema,
      cover_photo: imageSchema
    },
    ['body']
  )
)

export const followValidator = validate(
  checkSchema({
    followed_user_id: {
      custom: {
        options: async (value, { req }) => {
          if (!ObjectId.isValid(value)) {
            throw new ErrorWithStatus({
              message: 'Invalid user_id',
              status: httpStatus.NOT_FOUND
            })
          }
          const followed_user = await databaseServices.users.findOne({
            _id: new ObjectId(value)
          })
          if (followed_user === null) {
            throw new ErrorWithStatus({
              message: USER_MESSAGES.USER_NOT_FOUND,
              status: httpStatus.NOT_FOUND
            })
          }
        }
      }
    }
  })
)
