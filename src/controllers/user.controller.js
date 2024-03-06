import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
// registerUser is a method which registers users

import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/apiResponse.js";
import jwt from "jsonwebtoken";

// async handler not used here as it our internal method and we are not making any web calls here

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken; // as user has a key named refershToken (see in user.models.js)

    await user.save({ validateBeforeSave: false }); // save krane pe mongoose k model kick-in hojenge eg:password wala bhi kick-in hojega so to handle this we use validateBeforeSave

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while genreating refresh and Acess Tokens"
    );
  }
};
const registerUser = asyncHandler(async (req, res) => {
  // get user details from frontend
  // validation - not empty fields
  // check if user already exists: check wwith username or email
  // cehck for images,check for avatar
  // upload them to cloudinary,check if avatar uploaded
  // create a user object - from making entry in mongodb (as no sql db so accepts objects)
  // remove password and refreshToken field from response
  // check for user creation i.e null response or not
  // return res

  const { fullName, username, email, password } = req.body;
  console.log(fullName, username, email);

  // if(fullName===""){

  //     // throw errr

  //     throw new ApiError(400,"fullname is required") // it accepts status codes and message
  // }

  // or

  // some k upar condition lgake check kro and it return true or false

  if (
    [fullName, email, username.password].some((field) => field?.trim() === "") // if filed h to trim krdo and agar trim krne k bad bhi empty h then return true
  ) {
    throw new ApiError(400, "All fields are requried");
  }

  // find user in db :  we will use findOne i.e pehle jouser find hoga vo return hoga

  const existedUser = await User.findOne({
    // this means ya to username mil je ya fir email mil je then hum response bhejenge
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  // chefck images

  // req.body express deta h , multer hume req.files ka access deta h

  // multiple files ka access h and avatar is file name

  // first property i.e [0] and we need its path that multer uploaded

  const avatarLocalPath = req.files?.avatar[0]?.path;

  console.log(req.files);

  // const coverImageLocalPath=req.files?.coverImage[0]?.path;  // as if coverImage is not given so error
  let coverImageLocalPath;
  // isArray tells array aya h ya nhi

  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }
  // avatar is required

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath); // as time lgega so use await
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  // i.e avatar uploaded on clodunary or not

  if (!avatar) {
    throw new ApiError(400, "Avatar file is required");
  }

  // now make a object and do entry in db

  // user.create(object)

  // now this object with these keys and values will be stored in monogdb

  // user variable will have reference to the db

  const user = await User.create({
    fullName,
    avatar: avatar.url, // avatar is response of cloudinary,
    coverImage: coverImage?.url || "", // this means we have not checked coverImage is there or not so check it using operational chaining , if there pass it else pass empty string
    email,
    password,
    username: username.toLowerCase(),
  });

  // apne ap mongodb har ek entry k sath _id nam ka field create kr skta h , db ka reference is in user

  // select method se vi field select kro jo select krne h but usme ye likhne h jo nhi chahie

  // "-field" means field which is not required

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wring while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered succesfully"));
  // hta to hum user se bhi skte h but  created user me hum
});

const loginUser = asyncHandler(async (req, res) => {
  // req body se data le ao

  // username ,email h ?

  // find the user

  // password check

  // access and refresh Token both genrate(we genrated in user.models.js)

  // send token in cookies

  // return response

  const { email, username, password } = req.body;

  // if(!username && !email)

  if (!username && !email) {
    throw new ApiError(400, "Username or password is required");
  }

  // ya to email dhundo ya username dhundo jo pehle mil gya hume value vapis miljegi

  const user = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  // User   ka object h so it uses mongoose wale function

  // but jo humne method bnaya h isPassword correct , etc. vo humare user me available h
  // password check

  const isPasswordValid = await user.isPasswordCorrect(password); // ye humara khud ka bnaya method h

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid User Credentials");
  }

  // access and refresh tokens

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  ); // ye cheezen user ko nhi bhejni soselect method se subtract krdo

  // send in form of cookies : cookies behejne k lie we have to design options to send cookies

  const options = {
    // server sirf modify krega these cookies and frontend se modifiable nhi hongi

    httpOnly: true,
    secure: true,
  };

  // setting cookies using .cookie and jitni mazi cookies set ho skti h using .cookie .cookie krke and iske andar ek key , ke value and ek options paramter hota h

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken, // ye alad se cookies and referesh Token islie bheje h (pehle cookies me sert krdie the) to handle case if user need cookies , he might want to save on local storage or might be developing mobile app as wahn pe cookies set nhi hongi
        },
        "User logged in Successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  // clear cookies
  // db me se refreshToken reset krdo
  // as pehle verify JWT middleware chla h and req.user is added and we come to this methid so so this(importnat)

  // ye method lete h  i.e 1) find kaise krna h user ko 2) update krdo like done down

  // req.user ae hai by
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        // this operator asks which field to update and usme jake voupdate jrdega

        refreshToken: undefined,
      },
    },
    {
      new: true, // isse hume jo return me response milega usme new updated value milegi
    }
  );

  // clear cookies

  const options = {
    // server sirf modify krega these cookies and frontend se modifiable nhi hongi

    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options) // name of cookie should be same
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

// refresh access token

const refreshAccessToken = asyncHandler(async (req, res) => {
  // refresh token cookies se access hojega

  try {
    const incomingRefreshToken =
      req.cookies.refreshToken || req.body.refreshToken; // ya to cookies me hogya ya fir agar koi mobile app use kr rha to can be send in body

    if (incomingRefreshToken) {
      throw new ApiError(401, "Unauthorized request");
    }

    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    // match that token jo user ne bhejra h and jo user ke andar db me refreshToken pda h

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expires or used");
    }

    // now generate new token and send in cookies

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, newRefreshToken } =
      await generateAccessAndRefreshTokens(user._id);

    // new RerfreshToken is taken as can be error due to same name

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(401,error?.message || "Invalid refresh Token")
  }
});

export { registerUser, loginUser, logoutUser,refreshAccessToken};
