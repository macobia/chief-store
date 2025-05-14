import fs from 'fs/promise';
import multer from 'multer';

const cloudinaryUpload = async (req, res, next) => {
    const singleUpload = upload.single('image');
  
    singleUpload(req, res, async (err) => {
      if (err) {
        if (err instanceof multer.MulterError) {
          if (err.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({ error: "File too large. Max 5MB allowed." });
          }
        }
        return res.status(400).json({ error: err.message });
      }
  
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }
  
      try {
        const result = await cloudinaryUploadPromisified(req.file.path, {
          folder: 'products',
          allowed_formats: ['jpg', 'png', 'jpeg'],
        });
  
        req.file.cloudinaryUrl = result.secure_url;
        req.file.publicId = result.public_id;
  
        await fs.unlink(req.file.path);
         // Delete temp file
  
        next();
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Cloudinary upload failed' });
      }
    });
  };
  
  export default cloudinaryUpload; 