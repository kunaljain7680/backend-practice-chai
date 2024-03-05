// method runs when url is hitted
// user ke bad jo methods likhen hn vo is file me likhe jaenge

import { Router } from "express";
import { loginUser, logoutUser, registerUser } from "../controllers/user.controller.js"; // this type of import is done when export is not default i.e as export {registerUser}

import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

// kis route pe user ko leke jana h

// router ko ek route btaya and furtrher post method me registerUser  call kiya

// register route pe request ane se pehle middleware lga do

router.route("/register").post(

    // middleware is applied 

    //  array ek field me multiple files leta h

    // fields accepts array

    // The Request object will be populated with a files object which maps each field name to an array of the associated file information objects.

    // upload.single is designed for a single field and expects one file.
// upload.fields can handle multiple fields and each field can have multiple files.
  upload.fields([
    { 
        name: "avatar",
        maxCount:1 // accept only 1 files at max

    }, // first file ka name will be avatar and frotend me bhi avatar rakna pdega nam

    {
        name:"coverImage",
        maxCount:1
    },
  ]), // middleware upload.fields accept array  ( here we will take two objects)

//   after the file is uploded then ca;; for registerUser method
  registerUser
);

// agar /login pe aye to post method me loginUser run krna chahie
router.route("/login").post(loginUser);

// secured routes

router.route("/logout").post(verifyJWT,logoutUser);  // means logoutUser pe jane se pehle verifyJWT chalado to check if user is logged in and that's why next is written to go to another method here it is logoutUser

export default router;
