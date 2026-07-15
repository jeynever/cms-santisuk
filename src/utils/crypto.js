import CryptoJS from 'crypto-js';

const SECRET_KEY = process.env.VUE_APP_ENCRYPTION_SECRET || 'default_secret_key_change_in_production';

export const encryptData = (data) => {
  if (!data) return data;
  return CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
};

export const decryptData = (ciphertext) => {
  if (!ciphertext) return ciphertext;
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (e) {
    console.error("Error decrypting data", e);
    return null;
  }
};

export const hashData = (data) => {
  if (!data) return data;
  return CryptoJS.SHA256(data).toString();
};
