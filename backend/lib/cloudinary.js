import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
// import { CloudinaryStorage } from 'multer-storage-cloudinary';
// import { promisify } from 'util';
import dotenv from "dotenv";
import fs from 'fs';


dotenv.config();


//cloudinary config
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
// const upload = multer({ 
//     dest: 'uploads/',
//     limits: { fileSize: 10 * 1024 * 1024 }, // max 10MB
//     fileFilter: (req, file, cb) => {
//       const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
//       if (allowedTypes.includes(file.mimetype)) {
//         cb(null, true);
//       } else {
//         cb(new Error("Only JPEG, JPG and PNG are allowed"));
//       }
//     }
//   });
  
//setup multer
// const cloudinaryUpload = multer({storage});
// const cloudinaryUploadPromisified = promisify(cloudinary.uploader.upload);
// const cloudinaryUpload = (req, res, next) => {
//     const singleUpload = upload.single('image');
  
//     singleUpload(req, res, async (err) => {
//       if (err) {
//         if (err instanceof multer.MulterError) {
//           if (err.code === "LIMIT_FILE_SIZE") {
//             return res.status(400).json({ error: "File too large. Max 5MB allowed." });
//           }
//         }
//         return res.status(400).json({ error: err.message });
//       }
  
//       if (!req.file) {
//         return res.status(400).json({ error: "No file uploaded" });
//       }
  
//       try {
//         const result =  await cloudinary.uploader.upload(req.file.path, {
//           folder: 'products',
//           resource_type: 'image',
          
//         });
  
//         req.file.cloudinaryUrl = result.secure_url;
//         req.file.publicId = result.public_id;
  
//         await fs.promises.unlink(req.file.path); // Delete temp file
  
//         next();
//       } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Cloudinary upload failed' });
//       }
//     });
//   };
export default cloudinary; 