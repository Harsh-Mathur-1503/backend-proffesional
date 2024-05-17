  import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTweet = asyncHandler(async (req, res) => {
  //TODO: create tweet
  const { content, owner } = req.body;
  if(!content) {
    throw new ApiError(400, "Content is required");
  }
  if (!owner || !isValidObjectId(owner)) {
    throw new ApiError(400, "Invalid owner id");
  }
  try {
    const tweet = new Tweet({content,owner});
    const savedTweet = await tweet.save();
    return res.status(201).json(new ApiResponse(201, savedTweet));
  } catch (error) {
    throw new ApiError(400, "Tweet creation failed");
  }
});

const getUserTweets = asyncHandler(async (req, res) => {
  try {
    // Extract user id from request params
    const { userId } = req.params;

    // Validate user id
    if (!isValidObjectId(userId)) {
      throw new ApiError(400, "Invalid user id");
    }

    // Find user by id
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found with this Id");
    }

    // Find tweets by user id
    const tweets = await Tweet.find({ owner: userId });
    if (!tweets.length) {
      throw new ApiError(404, "No tweets found for this user");
    }

    // Return the found tweets
    return res.status(200).json(new ApiResponse(200, "User tweets fetched successfully", tweets));
  } catch (error) {
    // Handle errors
    throw new ApiError(400, "Error fetching user tweets", error);
  }
});


const updateTweet = asyncHandler(async (req, res) => {
  // Extract tweet id from request params
  const { tweetId } = req.params;

  // Validate tweet id
  if (!tweetId || !isValidObjectId(tweetId)) {
    throw new ApiError(400, "Provide a valid tweet id");
  }
  // Extract updated content from request body
  const { content } = req.body;
  if (!content) {
    throw new ApiError(400, "Content is required for updating tweet");
  }
  try {
    // Find tweet by id and update
    const updatedTweet = await Tweet.findByIdAndUpdate(
      tweetId,
      { content },
      { new: true }
    );
    if (!updatedTweet) {
      throw new ApiError(404, "Tweet not found and updated in database");
    }
    
    // Return the updated tweet
    return res
      .status(200)
      .json(new ApiResponse(200, "Tweet updated successfully", updatedTweet));
  } catch (error) {
    // Handle errors
    throw new ApiError(500, "Error updating tweet", error);
  }
});

const deleteTweet = asyncHandler(async (req, res) => {
  try {
    // Extract tweet id from request params
    const { tweetId } = req.params;

    // Validate tweet id
    if (!tweetId || !isValidObjectId(tweetId)) {
      throw new ApiError(400, "Provide a valid tweet id");
    }

    // Find and delete tweet by id
    const deletedTweet = await Tweet.findByIdAndDelete(tweetId);

    // Check if tweet was found and deleted
    if (!deletedTweet) {
      throw new ApiError(404, "Tweet not found in database");
    }

    // Return success response
    return res
      .status(200)
      .json(new ApiResponse(200, "Tweet deleted successfully"));
  } catch (error) {
    // Handle errors
    throw new ApiError(500, "Error deleting the tweet", error);
  }
});


export { createTweet, getUserTweets, updateTweet, deleteTweet };
