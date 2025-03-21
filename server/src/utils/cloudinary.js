import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";
import { response } from "express";
dotenv.config({ path : "./.env" });


cloudinary.config({
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
    api_key : process.env.CLOUDINARY_API_KEY,
    api_secret : process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) {
            throw new Error("No file path provided");
        }


        const cloudinaryResponse = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });


        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath); 
            console.log(`File ${localFilePath} successfully deleted..`);
        }

        return cloudinaryResponse; 
    } catch (err) {
        console.error(`Some error occurred at Cloudinary: ${err}`);

        if (localFilePath && fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
            console.log(`File ${localFilePath} successfully deleted..`);
        }
        throw new Error("Failed to upload file to Cloudinary");
    }
};


const deleteFromCloudinary = async(pathId) => {
    try{
        const response = await cloudinary.uploader.destroy(
            pathId, {
                invalidate : true, resource_type : "auto"
            }
        );
        return response;
    }catch(err){
        console.log(`Error occurred while deleting file from cloduinary : ${err}`);
        return null;
    }
}




export { 
    uploadOnCloudinary,
    deleteFromCloudinary
}



