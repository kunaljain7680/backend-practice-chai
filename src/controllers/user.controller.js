import {asyncHandler} from "../utils/asyncHandler.js"

// registerUser is a method which registers users

const registerUser=asyncHandler(async(req,res)=>{

    return res.status(200).json({
        message:"ok"
    })
})

export {registerUser}