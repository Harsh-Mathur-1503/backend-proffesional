import dotenv from "dotenv";
import mongoose, { mongo } from "mongoose";
import {DB_NAME} from "./constants.js"
import connectDb from "./db/index.js";

dotenv.config({
  path: "./env"
});
/*
1st method
import express from "express";
const app = express();

;(async ()=>{
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
    app.on("error",(error) => {
      console.log("Server error", error)
      throw error;
    })

    app.listen(process.env.PORT,()=>{
      console.log(`Server is running on port ${process.env.PORT}`)
    })
  } catch (error) {
    console.error(error);
    throw error;
  }
})()

*/

connectDb();
