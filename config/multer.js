import multer from 'multer';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); 
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

// Initialize multer with the custom storage configuration
const upload = multer({ storage: storage });

export default upload;