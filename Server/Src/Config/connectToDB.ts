import mongoose from "mongoose";
import { connectRedis } from "../Infra/Redis/redis";

export const connectToDatabase = async () => {
  const MONGO_URI = process.env.MONGO_URI
  if (!MONGO_URI) {
    throw new Error("Mongo uri not found")
  }
  await mongoose.connect(MONGO_URI)
  console.log('connected to Database')
  await connectRedis();
}