"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// Configure storage options
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path_1.default.join(__dirname, '../../uploads');
        if (!fs_1.default.existsSync(uploadPath)) {
            console.log(`Creating upload directory: ${uploadPath}`);
            fs_1.default.mkdirSync(uploadPath, { recursive: true });
        }
        else {
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
const fileFilter = (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|pdf/;
    const extname = filetypes.test(path_1.default.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    console.log(`File extension valid: ${extname}, MIME type valid: ${mimetype}`);
    if (extname && mimetype) {
        return cb(null, true);
    }
    else {
        console.error('Invalid file type');
        cb(new Error('Invalid file type'));
    }
};
// Initialize the multer middleware
const upload = (0, multer_1.default)({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 1024 * 1024 * 5 } // Set file size limit to 5MB
});
exports.default = upload;
