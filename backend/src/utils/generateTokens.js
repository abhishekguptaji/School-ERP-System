import User from "../models/user.model.js";
import { ApiError } from "./ApiError.js";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId).select("+refreshToken");

    if (!user) {
      throw new ApiError(404, "User not found while generating tokens");
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
  console.log("TOKEN GENERATION ERROR FULL:", error);
  console.log("TOKEN ERROR MESSAGE:", error.message);

  throw new ApiError(500, error.message);
}
};

export {
  generateAccessAndRefreshTokens 
}