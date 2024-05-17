import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path"; // Import path module for better file path handling

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      console.error("Please provide a file path");
      return null;
    }

    // Upload the file to Cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    console.log("File has been uploaded successfully", response.url);

    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath); // Remove the locally saved temporary file
    }
    return response;
  } catch (error) {
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath); // Remove the locally saved temporary file if upload failed
    }
    console.error("Error uploading file", error);
    return { error: "Error uploading file", details: error };
  }
};

const uploadVideoOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      console.error("Please provide a file path");
      return null;
    }

    // Upload the video to Cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "video",
    });

    console.log("File has been uploaded successfully", response.url);

    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath); // Remove the locally saved temporary file
    }
    return response;
  } catch (error) {
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath); // Remove the locally saved temporary file if upload failed
    }
    console.error("Error uploading file", error);
    return { error: "Error uploading file", details: error };
  }
};

const DeleteFromCloudinary = async (localPath) => {
  if (!localPath) {
    throw new Error("Please provide a file path");
  }

  try {
    const publicId = path.basename(localPath, path.extname(localPath)); // Better way to get public ID
    const response = await cloudinary.uploader.destroy(publicId);
    console.log("File has been deleted successfully", response);
    return response;
  } catch (error) {
    console.error("Error deleting file", error);
    throw error; // Propagate the error to the caller
  }
};

export { uploadOnCloudinary, DeleteFromCloudinary, uploadVideoOnCloudinary };
