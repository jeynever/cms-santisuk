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
    const querySnapshot = await getDocs(collection(db, "board_orders"));
    const data = [];
    querySnapshot.forEach((doc) => {
      let order = doc.data();
      // If there's no orderName, fallback to title. Same for orderDate -> createdAt
      if (!order.orderName) order.orderName = order.title || "";
      if (!order.orderDate && order.createdAt && order.createdAt.toDate) {
        order.orderDate = order.createdAt.toDate().toISOString().split('T')[0];
      }
      data.push({ id: doc.id, ...order });
    });

    data.sort((a, b) => {
      const dateA = a.orderDate || (a.createdAt && a.createdAt.toDate ? a.createdAt.toDate().toISOString() : "");
      const dateB = b.orderDate || (b.createdAt && b.createdAt.toDate ? b.createdAt.toDate().toISOString() : "");
      return dateB.localeCompare(dateA);
    });

    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
};
