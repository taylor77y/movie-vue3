// src/utils/aes.js
import CryptoJS from "crypto-js"

const AES = {
  encrypt(text, keyStr, ivStr) {
    const key = CryptoJS.enc.Utf8.parse(keyStr)
    const iv = CryptoJS.enc.Utf8.parse(ivStr)

    const encrypted = CryptoJS.AES.encrypt(text, key, {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    })
    return encrypted.toString()
  },

  decrypt(cipherText, keyStr, ivStr) {
    const key = CryptoJS.enc.Utf8.parse(keyStr)
    const iv = CryptoJS.enc.Utf8.parse(ivStr)

    const decrypted = CryptoJS.AES.decrypt(cipherText, key, {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    })
    return CryptoJS.enc.Utf8.stringify(decrypted)
  },
}

export default AES
