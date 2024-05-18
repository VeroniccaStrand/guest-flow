import multer, { FileFilterCallback } from 'multer';
import { Request } from 'express';
import path from 'path';
import fs from 'fs';

// Configure storage options
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadPath)) {
      console.log(`Creating upload directory: ${uploadPath}`);
      fs.mkdirSync(uploadPath, { recursive: true });
    } else {
      console.log(`Upload directory already exists: ${uploadPath}`);
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const fileName = `${Date.now()}-${file.originalname}`;
    console.log(`Generated filename: ${fileName}`);
    cb(null, fileName);
  }
});

// Optional file filter to check file type
const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  const filetypes = /jpeg|jpg|png|pdf|svg/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
  console.log(`File extension valid: ${extname}, MIME type valid: ${mimetype}`);
  if (extname && mimetype) {
    return cb(null, true);
  } else {
    console.error('Invalid file type');
    cb(new Error('Invalid file type'));
  }
};

// Initialize the multer middleware
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 } // Set file size limit to 5MB
});

export default upload;
