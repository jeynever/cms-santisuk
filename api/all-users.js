const { collection, getDocs } = require("firebase/firestore");
const { db } = require("./_firebase.js");
const CryptoJS = require("crypto-js");

const SECRET_KEY = process.env.VUE_APP_ENCRYPTION_SECRET || 'default_secret_key_change_in_production';

const decryptData = (ciphertext) => {
  if (!ciphertext) return ciphertext;
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (e) {
    console.error("Error decrypting data", e);
    return null;
  }
};

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const querySnapshot = await getDocs(collection(db, "users"));
    const data = [];
    
    querySnapshot.forEach((doc) => {
      const docData = doc.data();
      data.push({
        id: doc.id,
        username: docData.username || "",
        prefix: docData.prefix || "",
        firstName: decryptData(docData.firstNameEncrypted) || "",
        lastName: decryptData(docData.lastNameEncrypted) || "",
        email: decryptData(docData.emailEncrypted) || "",
        role: docData.role || "unknown",
        position: docData.position || "",
        affiliation: docData.affiliation || "",
        profileImage: decryptData(docData.profileImageEncrypted) || "",
        order: docData.order || 9999
      });
    });

    data.sort((a, b) => a.order - b.order);

    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
};
