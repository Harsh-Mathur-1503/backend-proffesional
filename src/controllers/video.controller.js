import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary, uploadVideoOnCloudinary } from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    query,
    sortBy = "createdAt",
    sortType = "desc",
    userId,
  } = req.query;

  const filter = {};
  if (query) {
    filter.$or = [
      {
        title: {
          $regex: query,
          $options: "i",
        },
      },
      {
        description: {
          $regex: query,
          $options: "i",
        },
      },
    ];
  }
  if (userId) {
    filter.owner = userId;
  }

  try {
    const videos = await Video.find(filter)
      .sort({
        [sortBy]: sortType,
      })
      .skip((page - 1) * limit)
      .limit(limit);

    return res
      .status(200)
      .json(new ApiResponse(200, "All videos fetched", videos));
  } catch (error) {
    throw new ApiError(500, "Error fetching videos", error);
  }
});


const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) {
    throw new ApiError(400, "Title and description are required");
  }

  const videoLocalPath = req.files?.videoFile?.[0]?.path;
  const localThumbnailPath = req.files?.thumbnail?.[0]?.path;
  if (!videoLocalPath) {
    throw new ApiError(400, "Video file is required");
  }
  if(!localThumbnailPath){
    throw new ApiError(400, "Thumbnail file is required");
  }


  try {
    const videoUploadResponse = await uploadVideoOnCloudinary(videoLocalPath);
    const thumbnailUploadResponse = await uploadOnCloudinary(localThumbnailPath);
    if (!videoUploadResponse) {
      throw new ApiError(500, "Error uploading video to Cloudinary");
    }
    const newVideo = await Video.create({
      videoFile:videoUploadResponse.url,
      thumbnail:thumbnailUploadResponse.url,
      title,
      description,
      duration:videoUploadResponse.duration,
      view:0,
      isPublished:true,
      owner: req.user._id,
    });
    console.log("newVideo", newVideo);
    const savedVideo = await newVideo.save();
    return res
      .status(201)
      .json(new ApiResponse(201, "Video published successfully", savedVideo));
  } catch (error) {
    throw new ApiError(500, "Error publishing video", error);
  }
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId || !mongoose.isValidObjectId(videoId)) {
    throw new ApiError(400, "Valid Video Id is required");
  }
  try {
    const foundVideo = await Video.findById(videoId);
    if (!foundVideo) {
      throw new ApiError(404, "Video not found");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, "Video fetched successfully", foundVideo));
  } catch (error) {
    throw new ApiError(500, "Error fetching video", error);
  }
});


const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId || !mongoose.isValidObjectId(videoId)) {
    throw new ApiError(400, "Valid Video Id is required");
  }
  const { title, description } = req.body;
  if (!title || !description) {
    throw new ApiError(400, "Title and description are required");
  }

  try {
    const oldFoundVideo = await Video.findById(videoId);
    if (!oldFoundVideo) {
      throw new ApiError(404, "Video you wanted to update not found");
    }

    const updatedVideo = await Video.findByIdAndUpdate(
      videoId,
      { title, description },
      { new: true }
    );

    if (!updatedVideo) {
      throw new ApiError(500, "Error updating video in database");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, "Video updated successfully", updatedVideo));
  } catch (error) {
    throw new ApiError(500, "Error updating video", error);
  }
});


const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId || !mongoose.isValidObjectId(videoId)) {
    throw new ApiError(400, "Valid Video Id is required");
  }

  try {
    const foundVideo = await Video.findById(videoId);
    if (!foundVideo) {
      throw new ApiError(404, "Video not found");
    }

    await Video.findByIdAndDelete(videoId);
    return res
      .status(204)
      .json(new ApiResponse(204, "Video deleted successfully"));
  } catch (error) {
    throw new ApiError(500, "Error deleting video", error);
  }
});


const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId || !mongoose.isValidObjectId(videoId)) {
    throw new ApiError(400, "Valid Video Id is required");
  }

  try {
    const foundVideo = await Video.findById(videoId);
    if (!foundVideo) {
      throw new ApiError(404, "Video not found");
    }

    const updatedVideo = await Video.findByIdAndUpdate(
      videoId,
      { isPublished: !foundVideo.isPublished },
      { new: true }
    );

    if (!updatedVideo) {
      throw new ApiError(500, "Error updating video");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Video publish status toggled successfully",
          updatedVideo
        )
      );
  } catch (error) {
    throw new ApiError(500, "Error updating video", error);
  }
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
