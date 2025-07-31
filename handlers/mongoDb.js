// handlers/mongo.js
const mongoose = require('mongoose');

module.exports = async (mongoURI) => {
  if (!mongoURI) {
    throw new Error("❌ MongoDB URI not provided.");
  }

  mongoose.set('strictQuery', true);

  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ MongoDB connected successfully.");
  } catch (err) {
    console.error("❌ Failed to connect to MongoDB:", err);
  }
};
