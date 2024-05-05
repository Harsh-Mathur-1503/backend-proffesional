import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";


const registerUser = asyncHandler(async (req, res) => {


  // get user details from frontend
  const { fullname, email, username, password } = req.body;
  console.log("email : ", email);



  // validation of details
  if (
    [fullname, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are necessary");
  }


  // check if user exists
  const existedUser = User.findOne({
    $or:[{ email },{ username }]
  })
  if(existedUser){
    throw new ApiError(409, "User already exists");
  }





  // check for images and avatar
  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;
  console.log("req.files : ", req.files);
  console.log("avatarLocalPath : ", avatarLocalPath);
  console.log("coverImageLocalPath : ", coverImageLocalPath);
  if(!avatarLocalPath){
    throw new ApiError(400, "Avatar is necessary");
  }




  // upload them to cloudinary, avatar
  const avatar = await uploadOnCloudinary(avatarLocalPath)
  const coverImage = await uploadOnCloudinary(coverImageLocalPath)
  if(!avatar){
    throw new ApiError(500, "Error uploading avatar");
  }




  // create user object - create entry in dB
  const user = await User.create({
    fullname,
    avatar:avatar.url,
    coverImage:coverImage?.url || "",
    email,
    password,
    username:username.toLowerCase(),
  })
  const createdUser = await User.findById(user._id).select(
    // remove password and refreshToken from response
    -"password -refreshToken"
  );


  // check for user creation
  if (!createdUser) {
    throw new ApiError(500, "Error registering user in database");
  }



  // send response to frontend
  return res.status(201).json(
    new ApiResponse(201, createdUser, "User registered successfully")
  )
});

export { registerUser };
