// require('dotenv').config({path:'./env})  path means root directeory k andar humne env variable liya h yahan se sb kuj le lena
// but here we are using import syntax

import dotenv from "dotenv"
import connectDB from "./db/index.js"; // db k andar index file me extension lagao i.e index.js 

dotenv.config({
    path:'./env'
})

// Aproach-1 (sara db ka code in another folder)

// as connectDB() is async method so it returns a promise when completes
connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000,()=>{
        console.log(`Server is running at port ${process.env.PORT}`)
    })
})
.catch((err)=>{
    console.log("MONGO db connection failed !!!",err)
})

// Approach-2(sb kuch index file me)

// import express from "express";

// const app = express();

// efi concept means function ko immediately execute krdo

// (()=>{})() // arrow function h and usko immediately execute krdia which is same as function connectDB()

// semicolon iswriiten before efis as for cleaning purposes as pehle ; na lgya ho pichli line me

// (async () => {
//   try {
//     await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`); // DB_NAME sidha hi .env me likhlo withurl nahi to ese krlo bith are correct

    // listeners are there with app and this evnet specifies db connects but app can't talk to db
//     app.on("error", () => {
//       console.log("ERROR", error);
//       throw error;
//     });

//     app.listen(process.env.PORT, () => {
//       console.log(`App is listening on port ${process.env.PORT}`);
//     });

//   } catch (error) {
//     console.error("ERROR: ", error);
//     throw err;
//   }
// })();

// efi or this method
// async function connectDB(){

//     try {
//         await mongoose.connect(`${process.env.MONGODB_URI}`)
//     } catch (error) {
//         console.error("ERROR",error)
//         throw err
//     }
// }

// connectDB();
