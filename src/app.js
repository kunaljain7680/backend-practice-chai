import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

// cookie parser se hum server se user ke browser pe cookies access kr pau and set bhi kr pau i.e perform CRUD operations on cookies
const app=express();

app.use(cors({
    origin:process.env.CORS_ORIGIN,   // mtlb issi origin se request accept krni h vohi eg ghar k andar allow krna h k nhi 
    credentials:true
}));  // use method is used for middlewares and configurations

app.use(express.json({limit:"16kb"})); // accepting json when data comes from different souces like form upto limit size of 16kb

// url se jb data aega to usko smjhne k l ie express ko btana pdega

app.use(express.urlencoded({extended:true,limit:"16kb"}));  // extended means nested objects de skto ho

// kai bar hum pdf,images store krna chte h in our server , we will make public folder that they are public assets and koi bhi access kr skta h

app.use(express.static("public "));

app.use(cookieParser());

// routes import

// This line imports the exported value from user.routes.js and assigns it to the variable named userRouter.
// : After the import, the userRouter variable becomes a reference to the exported Router object from user.routes.js

// user router is just a variable given by us and it can be done only when export is default

import userRouter from "./routes/user.routes.js"

// routes declaration ( as we have taken router alg so use app.get ki jagah app.use)

// /api/v1 means api ka version 1 use it is just a way to call
// this means that we will call http://localhost:8000/api/v1/users/register and user is prefix and age ise UserRouter pe register laya hua h aur bhi lgaya ja skta h

app.use("/api/v1/users",userRouter);  // when a user hits a users api then control goes to userRouter i.e route in user.route.js


export {app}