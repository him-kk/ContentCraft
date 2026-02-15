const multer = require('multer');
const path = require('path');
const ErrorResponse = require('../utils/errorResponse');

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.env.UPLOAD_PATH || './uploads');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp|mp4|mov|avi/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new ErrorResponse('Only image and video files are allowed', 400));
  }
};

// Configure upload
const upload = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB
  },
  fileFilter,
});

// Single image upload
const uploadSingle = upload.single('image');

// Multiple images upload (max 5)
const uploadMultiple = upload.array('images', 5);

// Handle upload errors
const handleUpload = (req, res, next) => {
  uploadSingle(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return next(new ErrorResponse('File size too large', 400));
      }
      return next(new ErrorResponse(err.message, 400));
    } else if (err) {
      return next(err);
    }
    next();
  });
};

module.exports = { upload, uploadSingle, uploadMultiple, handleUpload };