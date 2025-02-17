import cloudinary from "cloudinary";
import dotenv from "dotenv";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load env vars with absolute path
dotenv.config({ path: join(__dirname, '../config/config.env') });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const upload_file = (file, folder) => {
    /* 
        - Basically a single upload function wrapped in a Promise.
    */
    return new Promise((resolve, reject) => {
        /* 
            - Takes, the file, a callback to process the result and an object with the resource_type(image, video) and foldername.
        */
      cloudinary.uploader.upload(
        file,
        (result) => {
          resolve({
            /* 
                - The URL is the thing, we send to the frontend to load the image there.
                - And the public_id helps us to delete the image in the future.
            */
            public_id: result.public_id,
            url: result.url,
          });
        },
        {
          resource_type: "auto",
          folder,
        }
      );
   });
};
  
export const delete_file = async (file) => {
    /* 
        - Single function with file url as parameter
    */
    const res = await cloudinary.uploader.destroy(file);
    if (res?.result === "ok") return true;
};