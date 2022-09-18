
require('dotenv').config();
const CryptoJS = require("crypto-js");
// (B1) THE SECRET KEY

// (B2) ENCRYPT
module.exports = class Crypt {
    secret = process.env.CRYPT_KEY;
    
    encrypt(clear) {
        var cipher = CryptoJS.AES.encrypt(clear, this.secret);
        cipher = cipher.toString();
        return cipher;
    }

    // (B3) DECRYPT
    decrypt(cipher) {
        var decipher = CryptoJS.AES.decrypt(cipher, this.secret);
        decipher = decipher.toString(CryptoJS.enc.Utf8);
        return decipher;
    }
}

