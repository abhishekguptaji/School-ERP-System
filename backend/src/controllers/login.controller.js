import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import User from "../models/user.model.js";
import { generateAccessAndRefreshTokens } from "../utils/generateTokens.js";

const loginUser = asyncHandler(async (req, res) => {
  const { email, rollNumber, password, role } = req.body;

  if (!role) {
    throw new ApiError(400, "Role is required");
  }

  if (!["admin", "teacher", "student"].includes(role)) {
    throw new ApiError(400, "Invalid role");
  }

  if ((!email && !rollNumber) || !password) {
    throw new ApiError(400, "Credentials are required");
  }

  const user = await User.findOne({
    role,
    $or: [{ email }, { rollNumber }],
  }).select("+password +refreshToken");

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  if (!user.isActive) {
    throw new ApiError(403, "User account is deactivated");
  }

//   console.log(
//   "Has method:",
//   typeof user.isPasswordCorrect,
//   Object.getPrototypeOf(user)
// );


  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id,
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          role: loggedInUser.role,
          accessToken,
          refreshToken,
        },
        "Login successful",
      ),
    );
});

const logoutUser = asyncHandler(async (req, res) => {

  if (!req.user?._id) {
    throw new ApiError(401, "Unauthorized request");
  }

  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: { refreshToken: 1 },
    },
    { new: true }
  );

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});




export { 
  loginUser,
  logoutUser,

 };
