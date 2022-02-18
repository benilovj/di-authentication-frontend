import { CountryCode, isValidPhoneNumber } from "libphonenumber-js/mobile";

export function containsUKMobileNumber(value: string): boolean {
  return isValidPhoneNumber(value, "GB");
}

export function containsMobileNumberFromCountryCode(value: string, countryCode: CountryCode): boolean {
  return isValidPhoneNumber(value, countryCode);
}

export function containsMobileNumber(value: string): boolean {
  return isValidPhoneNumber(value);
}

export function containsNumbersOrSpacesOnly(value: string): boolean {
  return value ? /^[\d\s]+$/.test(value) : false;
}

export function lengthInRangeWithoutSpaces(
  value: string,
  min: number,
  max: number
): boolean {
  const length = value.replace(/\s+/g, "").length;
  return length >= min && length <= max;
}