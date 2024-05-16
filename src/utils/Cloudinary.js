import { v2 as cloudinary } from "cloudinary";
import { response } from "express";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      console.log("Please provide a file path");
      return null;
    }
    // upload the file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    // file has been uploader successfully
    console.log("File has been uploaded successfully", response.url);
    
    fs.unlinkSync(localFilePath); // remove the locally saved temporary file
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath); // remove the locally saved temporary file as upload option failed
    console.log("Error uploading file", error);
    return null;
  }
};

// cloudinary.uploader.upload(
//   "https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg",
//   { public_id: "olympic_flag" },
//   function (error, result) {
//     console.log(result);
//   }
// );

const DeleteFromCloudinary = async (localPath) => {
  if (!localPath) {
    throw new Error("Please provide a file path");
  }

  try {
    const publicId = localPath.split("/").pop().split(".")[0];
    const response = await cloudinary.uploader.destroy(publicId);
    console.log("File has been deleted successfully", response);
    return response;
  } catch (error) {
    console.error("Error deleting file", error);
    throw error; // Propagate the error to the caller
  }
};


export { uploadOnCloudinary, DeleteFromCloudinary}
