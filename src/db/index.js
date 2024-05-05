import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDb = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log(
      `\n MONGODB Connected to DB_HOST : ${connectionInstance.connection.host} \n`
    );
  } catch (error) {
    console.error("MONGODB connection error", error);
    process.exit(1);
  }
};

export default connectDb;
