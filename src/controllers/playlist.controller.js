import { isValidObjectId } from "mongoose";
import { Playlist } from "../models/playlist.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    throw new ApiError(400, "Name is required");
  }
  if (!description) {
    throw new ApiError(400, "Description is required");
  }

  try {
    const playlist = new Playlist({
      name,
      description,
      videos: [],
      owner: req.user._id,
    });

    const savedPlaylist = await playlist.save();
    if (!savedPlaylist) {
      throw new ApiError(500, "Error in saving playlist");
    }

    return res
      .status(201)
      .json(
        new ApiResponse(201, "Playlist created successfully", savedPlaylist)
      );
  } catch (error) {
    console.log("Error in creating playlist", error);
    throw new ApiError(500, "Error in creating playlist", error);
  }
});

const getUserPlaylists = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    throw new ApiError(400, "User id is required");
  }
  if (!isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid user id");
  }

  try {
    const playlists = await Playlist.find({ owner: userId });
    if (!playlists.length) {
      throw new ApiError(404, "User playlists not found");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, "User playlists retrieved successfully", playlists)
      );
  } catch (error) {
    console.log("Error in getting user playlists", error);
    throw new ApiError(500, "Error in getting user playlists", error);
  }
});

const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;

  if (!playlistId) {
    throw new ApiError(400, "Playlist id is required");
  }

  try {
    const foundPlaylist = await Playlist.findById(playlistId);
    if (!foundPlaylist) {
      throw new ApiError(404, "Playlist not found");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, "Playlist retrieved successfully", foundPlaylist)
      );
  } catch (error) {
    console.log("Error in getting playlist by id", error);
    throw new ApiError(500, "Error in getting playlist by id", error);
  }
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;

  if (!playlistId) {
    throw new ApiError(400, "Playlist id is required");
  }
  if (!videoId) {
    throw new ApiError(400, "Video id is required");
  }

  try {
    const updatedPlaylist = await Playlist.findByIdAndUpdate(
      playlistId,
      { $push: { videos: videoId } },
      { new: true }
    );

    if (!updatedPlaylist) {
      throw new ApiError(500, "Error in pushing video to playlist");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Video added to playlist successfully",
          updatedPlaylist
        )
      );
  } catch (error) {
    console.log("Error in adding video to playlist", error);
    throw new ApiError(500, "Error in adding video to playlist", error);
  }
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;

  if (!playlistId) {
    throw new ApiError(400, "Playlist id is required");
  }
  if (!videoId) {
    throw new ApiError(400, "Video id is required");
  }

  try {
    const updatedPlaylist = await Playlist.findByIdAndUpdate(
      playlistId,
      { $pull: { videos: videoId } },
      { new: true }
    );

    if (!updatedPlaylist) {
      throw new ApiError(500, "Error in pulling video from playlist");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Video removed from playlist successfully",
          updatedPlaylist
        )
      );
  } catch (error) {
    console.log("Error in removing video from playlist", error);
    throw new ApiError(500, "Error in removing video from playlist", error);
  }
});

const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;

  if (!playlistId) {
    throw new ApiError(400, "Playlist id is required");
  }

  try {
    const deletedPlaylist = await Playlist.findByIdAndDelete(playlistId);
    if (!deletedPlaylist) {
      throw new ApiError(500, "Error in finding and deleting playlist");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, "Playlist deleted successfully", deletedPlaylist)
      );
  } catch (error) {
    console.log("Error in deleting playlist", error);
    throw new ApiError(500, "Error in deleting playlist", error);
  }
});

const updatePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { name, description } = req.body;

  if (!playlistId) {
    throw new ApiError(400, "Playlist id is required");
  }
  if (typeof name !== "string" || !name) {
    throw new ApiError(400, "Valid name is required");
  }
  if (typeof description !== "string" || !description) {
    throw new ApiError(400, "Valid description is required");
  }

  try {
    const updatedPlaylist = await Playlist.findByIdAndUpdate(
      playlistId,
      { $set: { name, description } },
      { new: true }
    );

    if (!updatedPlaylist) {
      throw new ApiError(500, "Error in finding and updating playlist");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, "Playlist updated successfully", updatedPlaylist)
      );
  } catch (error) {
    console.log("Error in updating playlist", error);
    throw new ApiError(500, "Error in updating playlist", error);
  }
});

export {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
};
