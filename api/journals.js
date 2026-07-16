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
    const q = query(collection(db, "journals"), orderBy("publishDate", "desc"));
    const querySnapshot = await getDocs(q);
    const data = [];
    
    querySnapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() });
    });

    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching journals:", error);
    
    // In case there is an index error on publishDate, fallback to fetch without orderBy
    try {
      const fallbackSnapshot = await getDocs(collection(db, "journals"));
      const fallbackData = [];
      fallbackSnapshot.forEach((doc) => {
        fallbackData.push({ id: doc.id, ...doc.data() });
      });
      // Sort in JS
      fallbackData.sort((a, b) => {
        const dateA = a.publishDate || "";
        const dateB = b.publishDate || "";
        return dateB.localeCompare(dateA);
      });
      res.status(200).json(fallbackData);
    } catch (fallbackError) {
      res.status(500).json({ error: "Internal Server Error", details: fallbackError.message });
    }
  }
};
