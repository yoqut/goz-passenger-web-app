export const PHONE_PATTERNS = {
  UZBEKISTAN: {
    countryCode: "+998",
    format: "+998 99 898 89 98",
    regex: /^\+998[0-9]{9}$/,
    digits: 12, // including country code
    mobilePrefix: "9", // Uzbek mobile numbers typically start with 9
  },
};
export const maskPhoneNumber = (phone: string): string => {
  const digitsOnly = phone.replaceAll(/\D/g, "");
  if (digitsOnly.length < 5) return phone;
  const start = digitsOnly.slice(0, 3);
  const end = digitsOnly.slice(-2);
  return `+${start}*******${end}`;
};
export const formatPhoneNumber = (value: string): string => {
  const digitsOnly = value.replaceAll(/\D/g, "");

  if (!digitsOnly) return "";

  if (digitsOnly.startsWith("998")) {
    const formatted = digitsOnly.slice(0, 12);
    if (formatted.length === 0) return "+998";
    if (formatted.length <= 2) return `+${formatted}`;
    if (formatted.length <= 5)
      return `+${formatted.slice(0, 3)} ${formatted.slice(3)}`;
    if (formatted.length <= 8)
      return `+${formatted.slice(0, 3)} ${formatted.slice(
        3,
        5,
      )} ${formatted.slice(5)}`;
    if (formatted.length <= 10)
      return `+${formatted.slice(0, 3)} ${formatted.slice(
        3,
        5,
      )} ${formatted.slice(5, 8)} ${formatted.slice(8)}`;
    return `+${formatted.slice(0, 3)} ${formatted.slice(
      3,
      5,
    )} ${formatted.slice(5, 8)} ${formatted.slice(8, 10)} ${formatted.slice(
      10,
    )}`;
  }

  if (digitsOnly.startsWith("9")) {
    const withCountryCode = "998" + digitsOnly.slice(0, 9);
    if (withCountryCode.length === 0) return "+998";
    if (withCountryCode.length <= 2) return `+${withCountryCode}`;
    if (withCountryCode.length <= 5)
      return `+${withCountryCode.slice(0, 3)} ${withCountryCode.slice(3)}`;
    if (withCountryCode.length <= 8)
      return `+${withCountryCode.slice(0, 3)} ${withCountryCode.slice(
        3,
        5,
      )} ${withCountryCode.slice(5)}`;
    if (withCountryCode.length <= 10)
      return `+${withCountryCode.slice(0, 3)} ${withCountryCode.slice(
        3,
        5,
      )} ${withCountryCode.slice(5, 8)} ${withCountryCode.slice(8)}`;
    return `+${withCountryCode.slice(0, 3)} ${withCountryCode.slice(
      3,
      5,
    )} ${withCountryCode.slice(5, 8)} ${withCountryCode.slice(
      8,
      10,
    )} ${withCountryCode.slice(10)}`;
  }

  const fullNumber = "998" + digitsOnly.slice(0, 9);
  if (fullNumber.length === 0) return "+998";
  if (fullNumber.length <= 2) return `+${fullNumber}`;
  if (fullNumber.length <= 5)
    return `+${fullNumber.slice(0, 3)} ${fullNumber.slice(3)}`;
  if (fullNumber.length <= 8)
    return `+${fullNumber.slice(0, 3)} ${fullNumber.slice(
      3,
      5,
    )} ${fullNumber.slice(5)}`;
  if (fullNumber.length <= 10)
    return `+${fullNumber.slice(0, 3)} ${fullNumber.slice(
      3,
      5,
    )} ${fullNumber.slice(5, 8)} ${fullNumber.slice(8)}`;
  return `+${fullNumber.slice(0, 3)} ${fullNumber.slice(
    3,
    5,
  )} ${fullNumber.slice(5, 8)} ${fullNumber.slice(8, 10)} ${fullNumber.slice(
    10,
  )}`;
};
