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


export {app}