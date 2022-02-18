import { expect } from "chai";
import { describe } from "mocha";
import {
  containsMobileNumber,
  containsMobileNumberFromCountryCode,
  containsNumbersOrSpacesOnly,
  containsUKMobileNumber,
  lengthInRangeWithoutSpaces,
} from "../../../src/utils/phone-number";

describe("phone-number", () => {
  describe("containsUKMobileNumber", () => {
    it("should return false when text entered as UK phone number", () => {
      expect(containsUKMobileNumber("test")).to.equal(false);
    });

    it("should return false when number too short", () => {
      expect(containsUKMobileNumber("1234")).to.equal(false);
    });

    it("should return false when non UK phone number entered", () => {
      expect(containsUKMobileNumber("541 754-3010")).to.equal(false);
    });

    it("should return true when UK mobile phone number entered", () => {
      expect(containsUKMobileNumber("07911 123456")).to.equal(true);
    });

    it("should return false when invalid UK mobile phone number entered", () => {
      expect(containsUKMobileNumber("06911123456")).to.equal(false);
    });

    it("should return false when London UK landline number entered", () => {
      expect(containsUKMobileNumber("020 7946 0000")).to.equal(false);
    });

    it("should return false when Edinburgh UK landline number entered", () => {
      expect(containsUKMobileNumber("01314960001")).to.equal(false);
    });

    it("should return false when no area UK landline number entered", () => {
      expect(containsUKMobileNumber("01632 960999")).to.equal(false);
    });

    it("should return false when UK wide landline number entered", () => {
      expect(containsUKMobileNumber("03069 990000 ")).to.equal(false);
    });

    it("should return false when freephone number entered", () => {
      expect(containsUKMobileNumber("08081 570000")).to.equal(false);
    });

    it("should return false when premium rate number entered", () => {
      expect(containsUKMobileNumber("0909 8790000")).to.equal(false);
    });
  });

  describe("containsNumbersOrSpacesOnly", () => {
    it("should return false when non numeric character is in string", () => {
      expect(containsNumbersOrSpacesOnly("test")).to.equal(false);
    });

    it("should return false when symbol is in string", () => {
      expect(containsNumbersOrSpacesOnly("!!")).to.equal(false);
    });

    it("should return true when spaces only in string", () => {
      expect(containsNumbersOrSpacesOnly("   ")).to.equal(true);
    });

    it("should return true when numbers only in string", () => {
      expect(containsNumbersOrSpacesOnly("1234567")).to.equal(true);
    });

    it("should return true when spaces and numbers in string", () => {
      expect(containsNumbersOrSpacesOnly("123 4567 33")).to.equal(true);
    });
  });

  describe("lengthInRangeWithoutSpaces", () => {
    it("should return true when empty and between 0 and 0", () => {
      expect(lengthInRangeWithoutSpaces("", 0, 0)).to.equal(true);
    });

    it("should return false when empty and between 1 and 2", () => {
      expect(lengthInRangeWithoutSpaces("", 1, 2)).to.equal(false);
    });

    it("should return true when 1 space only and between 0 and 0", () => {
      expect(lengthInRangeWithoutSpaces(" ", 0, 0)).to.equal(true);
    });

    it("should return true when 3 spaces only and between 0 and 0", () => {
      expect(lengthInRangeWithoutSpaces("   ", 0, 0)).to.equal(true);
    });

    it("should return true with leading space and 5 chars", () => {
      expect(lengthInRangeWithoutSpaces(" 12345", 5, 5)).to.equal(true);
    });

    it("should return true with trailing space and 5 chars", () => {
      expect(lengthInRangeWithoutSpaces("12345 ", 5, 5)).to.equal(true);
    });

    it("should return true with middle space and 5 chars", () => {
      expect(lengthInRangeWithoutSpaces("123 45", 5, 5)).to.equal(true);
    });

    it("should return false with leading space and 5 chars with range above", () => {
      expect(lengthInRangeWithoutSpaces(" 12345", 6, 7)).to.equal(false);
    });

    it("should return false with trailing space and 5 chars with range above", () => {
      expect(lengthInRangeWithoutSpaces("12345 ", 6, 7)).to.equal(false);
    });

    it("should return false with middle space and 5 chars with range above", () => {
      expect(lengthInRangeWithoutSpaces("123 45", 6, 7)).to.equal(false);
    });

    it("should return false with leading space and 5 chars with range below", () => {
      expect(lengthInRangeWithoutSpaces(" 12345", 3, 4)).to.equal(false);
    });

    it("should return false with trailing space and 5 chars with range below", () => {
      expect(lengthInRangeWithoutSpaces("12345 ", 3, 4)).to.equal(false);
    });

    it("should return false with middle space and 5 chars with range below", () => {
      expect(lengthInRangeWithoutSpaces("123 45", 3, 4)).to.equal(false);
    });

    it("should return true with numbers and spaces in range", () => {
      expect(lengthInRangeWithoutSpaces(" 123 45 678 901 ", 11, 11)).to.equal(
        true
      );
    });
  });

  describe("test international uk mobile numbers", () => {
    it("should return true with valid uk mobile domestic", () => {
      expect(containsUKMobileNumber("07911123456")).to.equal(true);
    });

    it("should return true with valid uk mobile", () => {
      expect(containsUKMobileNumber("00447911123456")).to.equal(true);
    });

    it("should return true with valid uk mobile in E164", () => {
      expect(containsUKMobileNumber("+447911123456")).to.equal(true);
    });

    it("should return true with valid uk mobile in E164 with zero", () => {
      expect(containsUKMobileNumber("+4407911123456")).to.equal(true);
    });

    it("should return false with valid uk mobile without lib country code", () => {
      expect(containsMobileNumber("07911123456")).to.equal(false);
    });

    it("should return false with valid uk mobile without lib country code", () => {
      expect(containsMobileNumber("00447911123456")).to.equal(false);
    });

    it("should return true with valid uk mobile in E164 without lib country code", () => {
      expect(containsMobileNumber("+447911123456")).to.equal(true);
    });

    it("should return true with valid uk mobile in E164 without lib country code with zero", () => {
      expect(containsMobileNumber("+4407911123456")).to.equal(true);
    });

  });

  describe("test international French mobile numbers", () => {
    it("should return true with valid French mobile domestic", () => {
      expect(containsMobileNumberFromCountryCode("0608453322", "FR")).to.equal(true);
    });

    it("should return true with valid French mobile", () => {
      expect(containsMobileNumberFromCountryCode("0033645453322", "FR")).to.equal(true);
    });

    it("should return true with valid French mobile in E164", () => {
      expect(containsMobileNumberFromCountryCode("+33645453322", "FR")).to.equal(true);
    });

    it("should return true with valid French mobile in E164 with national number", () => {
      expect(containsMobileNumberFromCountryCode("+330645453322", "FR")).to.equal(true);
    });

    it("should return false with valid French mobile without lib country code", () => {
      expect(containsMobileNumber("0645453322")).to.equal(false);
    });

    it("should return false with valid French mobile without lib country code", () => {
      expect(containsMobileNumber("0033645453322")).to.equal(false);
    });

    it("should return true with valid French mobile in E164 without lib country code", () => {
      expect(containsMobileNumber("+33645453322")).to.equal(true);
    });

    it("should return true with valid French mobile in E164 without lib country code with zero", () => {
      expect(containsMobileNumber("+330645453322")).to.equal(true);
    });
  });

  describe("test international Spanish mobile numbers", () => {
    it("should return true with valid Spanish mobile domestic", () => {
      expect(containsMobileNumberFromCountryCode("608453322", "ES")).to.equal(true);
    });

    it("should return true with valid Spanish mobile external", () => {
      expect(containsMobileNumberFromCountryCode("0034608453322", "ES")).to.equal(true);
    });

    it("should return true with valid Spanish mobile in E164", () => {
      expect(containsMobileNumberFromCountryCode("+34608453322", "ES")).to.equal(true);
    });

    it("should return false with invalid Spanish mobile in E164 with national number", () => {
      expect(containsMobileNumberFromCountryCode("+340608453322", "ES")).to.equal(false);
    });

    it("should return false with valid Spanish mobile without lib country code", () => {
      expect(containsMobileNumber("608453322")).to.equal(false);
    });

    it("should return false with valid Spanish mobile without lib country code", () => {
      expect(containsMobileNumber("0034608453322")).to.equal(false);
    });

    it("should return true with valid Spanish mobile in E164 without lib country code", () => {
      expect(containsMobileNumber("+34608453322")).to.equal(true);
    });
  });
});
