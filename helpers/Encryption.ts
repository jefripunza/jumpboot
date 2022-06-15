import * as crypto from "crypto";

import { Generate } from "../";
import { requireEnv } from "../require";

const fixedPassword = (password_text: string) => {
  const length = String(password_text).length;
  if (length > 32) {
    return String(password_text)
      .split("")
      .filter((_, i) => i <= 32 - 1)
      .join("");
  } else if (length < 32) {
    const kurangan = 32 - length;
    const tambahan_angka = Generate.multiple.fill(kurangan);
    return password_text + tambahan_angka;
  }
  return password_text;
};

export const Encode = {
  Base64: (value: string) => {
    return Buffer.from(value).toString("base64");
  },
  // AES256 (Password)
  AES256: (password_text: string, value: string) => {
    // generate 16 bytes of random data
    const iv: any = requireEnv(
      "PASSWORD_IV",
      crypto.randomBytes(16).toString("hex").slice(0, 16)
    );
    // make the encrypter function
    const encrypter = crypto.createCipheriv(
      "aes-256-cbc",
      fixedPassword(password_text),
      iv
    );
    // encrypt the message
    // set the input encoding
    // and the output encoding
    let encryptedMsg = encrypter.update(value, "utf8", "hex");
    // stop the encryption using
    // the final method and set
    // output encoding to hex
    encryptedMsg += encrypter.final("hex");
    return encryptedMsg;
  },
  // RSA PKCS1 OAEP (public key)
  RSA_PKCS1_OAEP: (publicKey: string, value: string) => {
    return crypto
      .publicEncrypt(
        { key: publicKey, padding: crypto.constants.RSA_PKCS1_OAEP_PADDING },
        Buffer.from(value, "utf8")
      )
      .toString("base64");
  },
};

export const Decode = {
  Base64: (value: string) => {
    return Buffer.from(value, "base64").toString("ascii");
  },
  // AES256 (Password)
  AES256: (password_text: string, encrypted: string) => {
    try {
      // generate 16 bytes of random data
      const iv: any = requireEnv(
        "PASSWORD_IV",
        crypto.randomBytes(16).toString("hex").slice(0, 16)
      );
      // make the decrypter function
      const decrypter = crypto.createDecipheriv(
        "aes-256-cbc",
        fixedPassword(password_text),
        iv
      );
      // decrypt the message
      // set the input encoding
      // and the output encoding
      let decryptedMsg = decrypter.update(encrypted, "hex", "utf8");
      // stop the decryption using
      // the final method and set
      // output encoding to utf8
      decryptedMsg += decrypter.final("utf8");
      return decryptedMsg;
    } catch (error) {
      return false;
    }
  },
  // RSA PKCS1 OAEP (private key)
  RSA_PKCS1_OAEP: (privateKey: string, encrypted_string: string) => {
    return crypto
      .privateDecrypt(
        { key: privateKey, padding: crypto.constants.RSA_PKCS1_OAEP_PADDING },
        Buffer.from(encrypted_string, "base64")
      )
      .toString("utf8");
  },
};
