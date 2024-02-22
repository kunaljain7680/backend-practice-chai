import mongoose from "mongoose"
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema=new mongoose.Schema(
    {
        videoFile:{
            type:String,  // cloudinary url
            requires:true
        },
        thumbnail:{
            type:String, // cloudinary url
            required:true,
        },
        title:{
            
            type:String, 
            required:true,
            
        },
        description:{
            type:String,
            required:true,
        },
        duration:{
            type:Number, // cloudinary url (cloudinary bhejega video ka duration once uploaded)
            required:true,
        },
        views:{
            type:Number,
            default:0
        },
        isPublished:{
            type:Boolean,
            default:true,
        },

        // har video ka ek owner from user model

        owner:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    },  

    {timestamps:true}
)

// use aggreagatePaginate before exporting

videoSchema.plugin(mongooseAggregatePaginate); // now we can write aggregation queries
export const Video=mongoose.model("Video",videoSchema);