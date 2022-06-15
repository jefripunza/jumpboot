import * as crypto from "crypto";

const full_characters =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const otp_characters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export const Generate = {
  random: {
    integer: (min: number, max: number) => {
      return Math.floor(Math.random() * (max - min)) + min;
    },
    string: (length = 20) => {
      let result = "";
      for (let i = 0; i < length; i++) {
        result += full_characters.charAt(
          Math.floor(Math.random() * full_characters.length)
        );
      }
      return result;
    },
    OTP: (length = 4) => {
      let result = "";
      for (let i = 0; i < length; i++) {
        result += otp_characters.charAt(
          Math.floor(Math.random() * otp_characters.length)
        );
      }
      return result;
    },
    HEX: (length = 20) => {
      return crypto.randomBytes(length).toString("hex");
    },
  },
  multiple: {
    digits: (num: number) => {
      let text = "";
      for (let i = 0; i < num; i++) {
        if (i > 0) {
          text = `${text},`;
        }
        text = text + String(i + 1);
      }
      return text.split(",");
    },
    fill: (num: number) => {
      let angka = "";
      let a = 0;
      for (let i = 0; i < num; i++) {
        a++;
        if (a === 10) {
          a = 0;
        }
        angka += a;
      }
      return angka;
    },
  },
};
