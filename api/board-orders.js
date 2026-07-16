const { collection, getDocs, query, orderBy } = require("firebase/firestore");
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
    const q = query(collection(db, "board_orders"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    const data = [];
    querySnapshot.forEach((doc) => {
      // ดึงข้อมูลแต่ทำการแปลง createdAt ให้อ่านง่ายขึ้น
      let order = doc.data();
      if (order.createdAt && order.createdAt.toDate) {
        order.createdAt = order.createdAt.toDate().toISOString();
      }
      data.push({ id: doc.id, ...order });
    });

    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
};
