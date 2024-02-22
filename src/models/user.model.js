import mongoose,{Schema} from "mongoose"
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"

const userSchema=new Schema(

    {
        username:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
            index:true  // kisi bhi field ko searchable bnana h taki ye db ki searching me aje (optimised)
        },
        email:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
           
        },
        fullName:{
            type:String,
            required:true,
            trim:true,
            index:true  // kisi bhi field ko searchable bnana h taki ye db ki searching me aje (optimised)
        },
        avatar:{
            type:String,  // cloudinary ka url
            required:true,
        },
        coverImage:{
            type:String,  // cloudinary url
        },
        watchHistory:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"Video"
            }
           
        ],
        password:{
            type:String,
            required:[true,"Password is required"]   // true field k sath ek custom error message 
        },
        refreshToken:{
            type:String,
        }
    },

    {
        timestamps:true
    }

);


// here in this approach we have problem that if we change the user photo after encrypting password and click on save button pre middleware  will again encrypt password and change it so to handle it run it when password field is modified
// pre hook is a middleware

// save functionality pe callback na lagao ( ()=>{} as this arrow fxn has no context i.e user ki details ka accss nhi hota so write like this) 
// as middleware h so next should be there 

// pre k pass sare objects ka access h db me save hone se pehle bhi bad bhi similarly with methods
userSchema.pre("save",async function (next){

    if(! this.isModified("password"))return next(); // agar password field not modified then don't encrypt password and call next()

    this.password=bcrypt.hash(this.password,10);   // encrypt password using bcrypt 's hash fxn which takes params as hash(lisko krna h , kitne rounds dena h/salt)  
    next()                     // as we have used function so this will have access of password field
})

// custom methods designing

// user schema k andar object methods and iske andar ek method

// pasword is parameter when fxn runs

userSchema.methods.isPasswordCorrect=async function(password){

    // return true or false

    return await bcrypt.compare(password,this.password); // password h jo user ne bhra h and dusra password database me jo encrypted password h
}

// dono jwt tokens h

userSchema.methods.generateAccessToken=function(){
    // jwt.sign({payload},access token,expiry object) payload means data

    // this will generate access token of jwt

    return jwt.sign(
        {
            _id:this._id,  // function method have access to info saved in db
            email:this.email,
            username:this.username,
            fullName:this.fullName  // abc:this.xyz where xyz is info from db and abc is name of key
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}


// refresh token me info kam hoti h i.e only id
userSchema.methods.generateRefreshToken=function(){
    return jwt.sign(
        {
            _id:this._id  // function method have access to info saved in db
        },
           
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User=mongoose.model("User",userSchema);
