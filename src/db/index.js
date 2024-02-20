import mongoose from "mongoose"
import { DB_NAME } from "../constants.js"  // here .js likhna zrurzi nahi to error


// db is in another continent so use async-await

const connectDB=async()=>{
    
    try {

        // connectionInstance me kafi obejects hote h so we use connection object k andar host ot determine whether we are connected to production or another server
        const connectionInstance=await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`MongoDb connected !! DB HOST: ${connectionInstance.connection.host}`)
    } catch (error) {
        console.log("MONGODB connection FAILED",error);
        
        // node js hume access dete ho process ka and current jo app chl rhi hogi uska referene ha
        process.exit(1);
    }
}

// export

export default connectDB
