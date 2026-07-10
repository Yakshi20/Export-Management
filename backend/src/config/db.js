import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");
    try {
      await mongoose.connection.collection("users").dropIndex("mobile_1");
      console.log("🧹 Dropped legacy mobile_1 index");
    } catch (_) {}
    try {
      await mongoose.connection.collection("users").dropIndex("email_1");
      console.log("🧹 Dropped legacy email_1 index");
    } catch (_) {}
  } catch (error) {
    console.log("❌ MongoDB Connection Failed");
    console.log(error.message);
  }
};

export default connectDB;
