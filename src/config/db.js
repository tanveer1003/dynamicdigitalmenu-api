const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    //await mongoose.connect(process.env.MONGO_URI);
    await mongoose.connect("mongodb+srv://tanveeranon:xZWXWtP0V3JSpTFp@cluster0.y6cpnf7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  ssl: true,
  tlsAllowInvalidCertificates: true, // try this only for dev
});
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;