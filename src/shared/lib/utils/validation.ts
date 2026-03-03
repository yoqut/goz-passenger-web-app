export const VALIDATION_MESSAGE_KEYS = {
  FULL_NAME_REQUIRED: "auth.fullNameRequired",
  PHONE_REQUIRED: "auth.phoneRequired",
  PHONE_INVALID: "auth.phoneInvalid",
  GENDER_REQUIRED: "auth.genderRequired",
  OTP_INCOMPLETE: "auth.otpIncomplete",
} as const;

export const VALIDATION_OTP = {
  LENGTH: 4,
  PATTERN: /^[0-9]{4}$/,
  INCOMPLETE_MESSAGE_KEY: VALIDATION_MESSAGE_KEYS.OTP_INCOMPLETE,
};

export const isValidOTP = (otp: string): boolean => {
  return (
    VALIDATION_OTP.PATTERN.test(otp) && otp.length === VALIDATION_OTP.LENGTH
  );
};
