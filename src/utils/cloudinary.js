import {v2 as cloudinary} from 'cloudinary';
import fs from "fs";
import {v2 as cloudinary} from 'cloudinary';
import { response } from 'express';
          
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadOnCloudinary = async (localFilePath) => {
    try{
        if(! localFilePath ) return null
        const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type: "auto"
        })
        // file has been uploaded successfully
        console.log("File is uploaded on Cloudinary ! ",
        response.url);
        return response;

    } catch (error) {
        fs.unlinkSync(localFilePath) // remove the localy sved file as the upload operation got failed
        return null;

    }

}

export { uploadOnCloudinary }
// ============================================================================================================
// for refernce of above code 
// ------------------------------------------------------------------------------------------------------------
// cloudinary.v2.uploader.upload("https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg",
//   { public_id: "olympic_flag" }, 
//   function(error, result) {console.log(result); });