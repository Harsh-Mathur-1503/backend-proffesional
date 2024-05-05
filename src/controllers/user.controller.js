import { asyncHandler } from "../utils/asyncHandler.js";

const registerUser = asyncHandler(async (req, res) => {
  res.status(500).json({
    message: "user registration route is working",
  });
});

export { registerUser };
