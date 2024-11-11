// multerConfig.js
import multer from 'multer';
import { diskStorage } from 'multer';
import { extname } from 'path';

// Configure storage with destination and filename functions
const storage = diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Set upload directory
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${extname(file.originalname)}`); // Unique filename with original extension
  }
});

// Configure file filter for specific file types
const fileFilter = (req, file, cb) => {
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.mp4', '.mov', '.avi'];
  const ext = extname(file.originalname).toLowerCase();

  // Check if the file extension is allowed
  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('File type is not supported'), false);
  }
};

// Create upload instance with storage and file filter
const upload = multer({ storage, fileFilter });

export default upload;
