const { collection, getDocs } = require("firebase/firestore");
const { db } = require("./_firebase.js");

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
    const querySnapshot = await getDocs(collection(db, "board_members"));
    const data = [];
    querySnapshot.forEach((doc) => {
      let member = doc.data();
      if (member.status === 'Inactive') {
        member.name = 'ว่าง';
        member.profileImageBase64 = '';
      }
      data.push({ id: doc.id, ...member });
    });

    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
};
