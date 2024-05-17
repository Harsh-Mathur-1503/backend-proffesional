import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  if(!isValidObjectId(channelId)){
    throw new ApiError(400, "Invalid Channel Id");
  }

  const {userId} = req.body;
  if(!isValidObjectId(userId)){
    throw new ApiError(400, "Invalid User Id");
  }

  try {
    const subscription = await Subscription.findOne({subscriber:userId,channel:channelId});
    if(!subscription){
      const newSubscription = new Subscription({subscriber:userId,channel:channelId});
      const savedSubscription = await newSubscription.save();
      if(!savedSubscription){
        throw new ApiError(400, "Subscription failed");
      }
      return res.status(200).json(new ApiResponse(200, "Subscribed successfully", savedSubscription));
    }
    if(subscription){
      const deletedSubscription = await Subscription.findByIdAndDelete(subscription._id);
      return res.status(200).json(new ApiResponse(200, "Unsubscribed successfully",deletedSubscription));
    }
  
  } catch (error) {
    console.log("Error in toggleSubscription: ", error);
  }
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.body;
  if(!channelId || !isValidObjectId(channelId)){
    throw new ApiError(400, "Provide a valid Channel Id");
  }
  try {
    const subscribers = await Subscription.aggregate([
      {
        $match: {channel: channelId}
      },
      {
        $project:{
          subscriber:1,
          _id:0
        }
      }
    ])
    if(!subscribers){
      throw new ApiError(404, "No subscribers found");
    }
    return res.status(200).json(new ApiResponse(200, "Subscribers found", subscribers));
  } catch (error) {
    console.log("Error in getUserChannelSubscribers: ", error);
  }
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.body;
  if(!subscriberId){
    throw new ApiError(400, "Provide a Subscriber Id");
  }
  if(!isValidObjectId(subscriberId)){
    throw new ApiError(400, "Provide a valid Subscriber Id");
  }
try {
    const channel = await Subscription.aggregate([
      {
        $match: {subscriber: subscriberId}
      },
      {
        $project:{
          channel:1,
          _id:1
        }
      }
    ])
  
    if(!channel){
      throw new ApiError(404, "No channels found");
    }
    return res.status(200).json(new ApiResponse(200, "Channels found", channel));
} catch (error) {
  console.log("Error in getSubscribedChannels: ", error);
}
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
