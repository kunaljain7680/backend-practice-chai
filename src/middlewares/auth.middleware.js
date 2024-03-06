// verifies wheteher user is there or not

// agar true login h i.e accessTOken and refreshToken h to strategy h ki req k andar naya object krdiya i.e user (can be any like kunal) i.e req.user
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";


// agar response ka use nhi ho rha then we can write _ in place of it (as it is written in production grade)
// asyncHandler(async (req, _, next)

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", ""); // cookies me accessToken ho ya na ho ya fir header se arha ho

    // this means that header k andar if we send Authorization key k andar Bearer <Token> then we will replace Bearer with empty string and take token value

    // if no token then error

    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    // validate accessToken using jwt as we have sent a lot of details

    // VERIFY TOKEN using secret key

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // ?. as agar h to check krenge

    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    ); // _id as when we madfe accessToken then we have written name as_id

    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }

    req.user = user;
    next();  // means jahan par call kiya h verifyJWT ko uske bad jo methid h vo call krne k lie used next() method

  } catch (error) {

    throw new ApiError(401,error?.message || "Invalid access token");
  }
});
