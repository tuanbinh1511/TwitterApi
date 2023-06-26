export const USER_MESSAGES = {
  VALIDATION_ERROR: 'Validation error !',
  EMAIL_ALREADY_EXISTS: 'Email đã tồn tại!',
  NAME_IS_REQUIRED: 'Yêu cầu nhập tên!',
  NAME_MUST_BE_A_STRING: 'Name must be a string !',
  NAME_LENGTH: 'Độ dài tên từ 1-50 kí tự !',
  EMAIL_IS_REQUIRE: 'Email là bắt buộc!',
  EMAIL_IN_VALID: 'Email không phù hợp!',
  PASSWORD_IS_REQUIRE: 'Mật khẩu là bắt buộc',
  Password_MUST_BE_A_STRONG: 'Password must be strong !',
  PASSWORD_LENGTH: 'Độ dài mật khẩu từ 1-50 kí tự !',
  PASSWORD_MUST_BE_A_STRING: 'Mật khẩu must be a string !',
  CONFIRMPASSWORD_MUST_BE_A_STRING: 'Mật khẩu must be a string !',
  CONFIRMPASSWORD_IS_REQUIRE: 'Mật khẩu là bắt buộc',
  CONFIRMPASSWORD_MUST_BE_A_STRONG: 'ConfirmPassword must be strong !',
  CONFIRMPASSWORD_LENGTH: 'Độ dài mật khẩu từ 1-50 kí tự !',
  CONFIRMPASSWORD_NOTSAME: 'Mật khẩu nhập lại không chính xác!',
  DATE_OF_BIRTH_NOT_BE_ISO8601: 'Sai định dạng Date of birth!',
  USER_NOT_FOUND: 'Không tìm thấy người dùng!',
  LOGIN_SUCCESS: 'Đăng nhập thành công!',
  REGISTER_SUCCESS: 'Đăng kí tài khoản thành công!',
  EMAIL_AND_PASSWORD_INCORRECT: 'Sai tài khoàn hoặc mật khẩu!',
  ACCESSTOKEN_IS_REQUIRED: 'AccessToken không tồn tại!',
  REFRESHTOKEN_IS_REQUIRED: 'RefreshToken không tồn tại!',
  REFRESHTOKEN_INVALID: 'RefreshToken invalid!',
  USER_REFRESHTOKEN_NOT_EXIST: 'RefreshToken not exist!',
  LOGOUT_SUCCESS: 'Logout success',
  EMAIL_VERIFY_TOKEN_IS_REQUIRED: 'Email verify token is required',
  EMAIL_ALREADY_VERIFIED_BEFORE: 'Email already verified before',
  EMAIL_VERIFY_SUCCESS: 'Email verify success',
  FORGOT_PASSWORD_TOKEN_IS_REQUIRED: 'Forgot password token is required',
  FORGOT_PASSWORD_TOKEN_NOT_EXISTS: 'Forgot password token not exist',
  FORGOT_PASSWORD_TOKEN_INVALID: 'Forgot password token is invalid',
  USER_NOT_VERIFY: 'User not verified!',
  BIO_MUST_BE_STRING: 'Bio must be a string',
  BIO_LENGTH: 'Bio length must be from 1 to 200',
  LOCATION_MUST_BE_STRING: 'Location must be a string',
  LOCATION_LENGTH: 'Location length must be from 1 to 200',
  WEBSITE_MUST_BE_STRING: 'Website must be a string',
  WEBSITE_LENGTH: 'Website length must be from 1 to 200',
  USERNAME_MUST_BE_STRING: 'Username must be a string',
  USERNAME_LENGTH: 'Username length must be from 1 to 50',
  IMAGE_URL_MUST_BE_STRING: 'Avatar must be a string',
  IMAGE_URL_LENGTH: 'Avatar length must be from 1 to 200',
  UPDATE_ME_SUCCESS: 'Update my profile success',
  FOLLOW_SUCCESS: 'Follow successfully!',
  USERNAME_INVALID:
    'Username must be 4-15 characters long and contain only letters, numbers, underscores, not only numbers',
  UNFOLLOW_SUCCESS: 'Unfollow success',
  USERNAME_EXISTED: 'Username existed'
} as const
