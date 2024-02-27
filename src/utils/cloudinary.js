import {v2 as cloudinary} from "cloudinary"  // v2 ko rename clodinary krdia
import fs from "fs"  // f s is file system in node js helps in read,write ,remove

cloudinary.config({ 
  cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
  api_key:process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// local file path is a parameter which will contain url of local file

const uploadOnCloudinary=async (localFilePath)=>{

  try {
    
    if(!localFilePath)return null ;

    // upload the file on cloudinary(see from cloudinary site)
    
    const response=await cloudinary.uploader.upload(localFilePath,{
      resource_type:"auto"  // detect typeof file
    })

    // file has been uploaded successfull
    
    // console.log("File is uploaded on cloudinary",response.url);

    fs.unlinkSync(localFilePath);  // agar succesfully uploded then also remove from server
    
    console.log(response);
    
    return response;

  } catch (error) {
    
    // hume pta h ki humari file server pe to h as if local file path was not there it would already have returned null
    // but it is not uploaded so there is problem so we have to remove it from server for safe cleaning purpose us fs.unlinkSync in synchronus way i.e is kam hone k bad age process kro
    
    fs.unlinkSync(localFilePath)  // remove the locally saved temporary file as the  upload operation got failed

    return null;
  }
}

export {uploadOnCloudinary}