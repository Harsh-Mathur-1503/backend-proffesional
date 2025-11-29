import { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  // Check if videoId is valid
  if (!videoId || !isValidObjectId(videoId)) {
    throw new ApiError(400, "Provide a valid Video Id");
  }

  const { userId } = req.body;

  // Check if userId is valid
  if (!userId || !isValidObjectId(userId)) {
    throw new ApiError(400, "Provide a valid User Id");
  }

  try {
    // Check if the user has already liked the video
    const userLike = await Like.findOne({ video: videoId, user: userId });

    if (!userLike) {
      // If not liked yet, create a new like
      const newLike = new Like({ video: videoId, user: userId });
      const savedLike = await newLike.save();
      if (!savedLike) {
        throw new ApiError(500, "Like failed");
      }
      return res
        .status(201)
        .json(new ApiResponse(201, "Liked successfully", savedLike));
    } else {
      // If already liked, remove the like
      const deletedLike = await Like.findByIdAndDelete(userLike._id);
      return res
        .status(200)
        .json(new ApiResponse(200, "Unliked successfully", deletedLike));
    }
  } catch (error) {
    console.log("Error in toggling video like", error);
    throw new ApiError(500, "Error in toggling video like");
  }
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  //TODO: toggle like on comment
  if (!commentId || !isValidObjectId(commentId)) {
    throw new ApiError(400, "Provide a valid comment Id");
  }
  const { userId } = req.body;
  if (!userId || !isValidObjectId(userId)) {
    throw new ApiError(400, "Provide a valid User Id");
  }
  try {
    const likedComment = await Like.findOne({
      comment: commentId,
      user: userId,
    });
    if (!likedComment) {
      const newCommentLike = new Like({ comment: commentId, user: userId });
      if (!newCommentLike) {
        throw new ApiError(500, "Liking the comment failed");
      }
      const savedCommentLike = await newCommentLike.save();
      if (!savedCommentLike) {
        throw new ApiError(500, "Your like was not saved");
      }
      return res
        .status(201)
        .json(
          new ApiResponse(201, "Comment Liked successfully", savedCommentLike)
        );
    } else {
      const deletedCommentLike = await Like.findByIdAndDelete({
        comment: commentId,
        user: userId,
      });
      if (!deletedCommentLike) {
        throw new ApiError(500, "Your like was not removed");
      }
    }
  } catch (error) {
    console.log("Error in toggling Comments like ", error);
  }
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  //TODO: toggle like on tweet
  if (!tweetId || !isValidObjectId(tweetId)) {
    throw new ApiError(400, "Provide a valid Tweet Id");
  }
  const { userId } = req.body;
  if (!userId || !isValidObjectId(userId)) {
    throw new ApiError(400, "Provide a valid User Id");
  }
  try {
    const likedTweet = await Like.findOne({ tweet: tweetId, user: userId });
    if (!likedTweet) {
      const newTweetLike = new Like({ tweet: tweetId, user: userId });
      if (!newTweetLike) {
        throw new ApiError(500, "Liking the tweet failed");
      }
      const savedTweetLike = await newTweetLike.save();
      if (!savedTweetLike) {
        throw new ApiError(500, "Your like was not saved");
      }
      return res
        .status(201)
        .json(new ApiResponse(201, "Tweet Liked successfully", savedTweetLike));
    } else {
      const deletedTweetLike = await Like.findByIdAndDelete({
        tweet: tweetId,
        user: userId,
      });
      if (!deletedTweetLike) {
        throw new ApiError(500, "Your like was not removed");
      }
    }
  } catch (error) {
    console.log("Error in toggling Tweet like ", error);
  }
});

const getLikedVideos = asyncHandler(async (req, res) => {
  //TODO: get all liked videos
  const { userId } = req.body;
  if (!userId || !isValidObjectId(userId)) {
    throw new ApiError(400, "Provide a valid User Id");
  }
  try {
    const likedVideos = await Like.find({
      user: { $eq: userId },
      videos: { $exists: true },
    });
    if (!likedVideos) {
      throw new ApiError(500, "Error in fetching liked videos");
    }
    return res
      .status(200)
      .json(
        new ApiResponse(200, "Liked videos fetched successfully", likedVideos)
      );
  } catch (error) {
    console.log("Error in fetching liked videos", error);
    throw new ApiError(500, "Error in fetching liked videos");
  }
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
