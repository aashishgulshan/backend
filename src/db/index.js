import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );
    // console.log(
    //   `\n MongoDB Connected Sucessfully !! DB HOST: ${connectionInstance.connection.host}`
    // );
    console.log(`Connected with ${DB_NAME} ~ DB !! `);
  } catch (error) {
    console.log("MongoDB CONNECTION FAILED :", error);
    process.exit(1);
  }
};

export default connectDB;
