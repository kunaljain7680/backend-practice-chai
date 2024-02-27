import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/apiError.js"
// registerUser is a method which registers users

import {User} from "../models/user.model.js"
import {UploadOnCloudinary, uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/apiResponse.js"

const registerUser=asyncHandler(async(req,res)=>{

    // get user details from frontend
    // validation - not empty fields
    // check if user already exists: check wwith username or email
    // cehck for images,check for avatar
    // upload them to cloudinary,check if avatar uploaded
    // create a user object - from making entry in mongodb (as no sql db so accepts objects)
    // remove password and refreshToken field from response
    // check for user creation i.e null response or not
    // return res

    const {fullName,username,email,password}=req.body;
    console.log(fullName,username,email);

    // if(fullName===""){
        
    //     // throw errr

    //     throw new ApiError(400,"fullname is required") // it accepts status codes and message
    // }

    // or

    // some k upar condition lgake check kro and it return true or false 

    if(
        [fullName,email,username.password].some((field)=>field ?.trim() === "")  // if filed h to trim krdo and agar trim krne k bad bhi empty h then return true
    ){
        throw new ApiError(400,"All fields are requried")
    }

    // find user in db :  we will use findOne i.e pehle jouser find hoga vo return hoga

    const existedUser=User.findOne({

        // this means ya to username mil je ya fir email mil je then hum response bhejenge 
        $or:[{username},{email}]
    })
    
    if(existedUser){
        throw new ApiError(409,"User with email or username already exists")
    }

    // chefck images

    // req.body express deta h , multer hume req.files ka access deta h

    // multiple files ka access h and avatar is file name

    // first property i.e [0] and we need its path that multer uploaded

    const avatarLocalPath=req.files?.avatar[0]?.path;

    console.log(req.files);

    const coverImageLocalPath=req.files?.coverImage[0]?.path;

    // avatar is required

    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar file is required");
    }

    const avatar=await uploadOnCloudinary(avatarLocalPath);  // as time lgega so use await
    const coverImage=await uploadOnCloudinary(coverImageLocalPath);

    // i.e avatar uploaded on clodunary or not
    
    if(!avatar){
        throw new ApiError(400,"Avatar file is required");
    }

    // now make a object and do entry in db

    // user.create(object)

    // now this object with these keys and values will be stored in monogdb

    // user variable will have reference to the db 

    const user=await User.create({
        fullName,
        avatar:avatar.url,  // avatar is response of cloudinary,
        coverImage:coverImage?.url|| "",  // this means we have not checked coverImage is there or not so check it using operational chaining , if there pass it else pass empty string
        email,
        password,
        username:username.toLowerCase()
    })

    // apne ap mongodb har ek entry k sath _id nam ka field create kr skta h , db ka reference is in user

    // select method se vi field select kro jo select krne h but usme ye likhne h jo nhi chahie

    // "-field" means field which is not required

    const createdUser=await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500,"Something went wring while registering the user")
    }

    return res.status(201).json(
        
        new ApiResponse(200,createdUser,"User registered succesfully")
    )
    // hta to hum user se bhi skte h but  created user me hum
})

export {registerUser}