// method runs when url is hitted 
// user ke bad jo methods likhen hn vo is file me likhe jaenge

import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";  // this type of import is done when export is not default i.e as export {registerUser}

const router=Router();

// kis route pe user ko leke jana h

// router ko ek route btaya and furtrher post method me registerUser  call kiya 

router.route("/register").post(registerUser)

export default router 