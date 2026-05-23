import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.js";

// configure storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "notes_app_uploads", // folder name in cloudinary
    allowed_formats: ["jpg", "png", "jpeg", "pdf", "mp4"], // restrict formats
    resource_type: "auto", // detect type automatically (image, video, raw)
  },
});

const upload = multer({ storage });

export default upload;
