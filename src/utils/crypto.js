import CryptoJS from "crypto-js";
import Utf8 from "crypto-js/enc-utf8";
import AES from "crypto-js/aes";
import Pkcs7 from "crypto-js/pad-pkcs7";

class AESCipher {
  constructor(
    key = process.env.VUE_APP_AESC_KEY,
    iv = process.env.VUE_APP_AESC_IV,
    mode = CryptoJS.mode.CBC,
    padding = Pkcs7
  ) {
    this.key = Utf8.parse(key);
    this.iv = Utf8.parse(iv);
    this.mode = mode;
    this.padding = padding;
  }
  // 加密函数
  encrypt(plaintext) {
    const encrypted = AES.encrypt(plaintext, this.key, {
      iv: this.iv,
      mode: this.mode,
      padding: this.padding
    }).toString();
    return encrypted;
  }

  // 解密函数（可选）
  decrypt(encryptedText) {
    const decrypted = AES.decrypt(encryptedText, this.key, {
      iv: this.iv,
      mode: this.mode,
      padding: this.padding
    }).toString(Utf8);
    return decrypted;
  }
}

export default new AESCipher();

// const aesCipher = new AESCipher();
// const encryptedText = aesCipher.encrypt("Hello Wrold");
// console.log("加密：", encryptedText);
// const decryptedText = aesCipher.decrypt(encryptedText);
// console.log("解密：", decryptedText);
