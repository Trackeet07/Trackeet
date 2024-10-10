import multer, { diskStorage } from 'multer';
import { extname } from 'path';

// Multer config for images and videos
const storage = diskStorage({
  fileFilter: (req, file, cb) => {
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.mp4', '.mov', '.avi'];

    let ext = extname(file.originalname);

    // Check if the file extension is allowed
    if (allowedExtensions.includes(ext.toLowerCase())) {
      cb(null, true);
    } else {
      cb(new Error('File type is not supported'), false);
    }
  },
});

const upload = multer({ storage });

export default upload;