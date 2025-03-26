import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config({ path : "./.env" });


cloudinary.config({
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
    api_key : process.env.CLOUDINARY_API_KEY,
    api_secret : process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    if (!localFilePath) {
        throw new Error("No file path provided");
    }

    try {
        const cloudinaryResponse = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
            folder : "code-to-give"
        }).catch((err) => {
            console.log("Cloudinary error : ", err);
        })

        return cloudinaryResponse; 
    } catch (err) {
        console.error(`Some error occurred at Cloudinary: ${err}`);
        throw new Error("Failed to upload file to Cloudinary");
    } finally {
        // if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath, (err) => {
                if (err) {
                    console.error("Error deleting file: ", err);
                }
            });
        // }
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