import mongoose from "mongoose";
import { env } from "../config/env.js";

console.log(env.mongoUri)

export const connectToDatabase = () => mongoose.connect(env.mongoUri);
