import multer from 'multer';
import { diskStorage } from 'multer';
import { extname } from 'path';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure the uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log(`Uploads directory created at: ${uploadDir}`);
}

// Configure storage with destination and filename functions
const storage = diskStorage({
  destination: (req, file, cb) => {
    const resolvedPath = uploadDir;
    console.log(`Resolved upload path: ${resolvedPath}`);
    cb(null, resolvedPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}${extname(file.originalname)}`;
    console.log(`Generated filename: ${uniqueName}`);
    cb(null, uniqueName);
  }
});

// Configure file filter for specific file types
const fileFilter = (req, file, cb) => {
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.mp4', '.mov', '.avi', '.docx'];
  const ext = extname(file.originalname).toLowerCase();
  console.log(`Uploaded file extension: ${ext}`);

  // Check if the file extension is allowed
  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    console.error(`File type not supported: ${ext}`);
    cb(new Error('File type is not supported'), false);
  }
};

// Create Multer instance with storage and file filter
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // Optional: Set file size limit (5 MB in this case)
});

export default upload;
