import dotenv from "dotenv";
import connectDb from "./db/index.js";
import { app } from "./app.js";
dotenv.config({
  path: "./env"
});
/*
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

connectDb() // connecting the database to the app's server
.then(()=>{
  app.listen(process.env.PORT || 8000,()=>{
    console.log(`Server is running on port ${process.env.PORT}`)
  })
})
.catch((err) => {
  console.error("MongoDB connection failed",err)
  throw err;
})
