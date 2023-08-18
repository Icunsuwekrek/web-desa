const multer = require("multer");
const path = require("path");
const ImageKit = require("imagekit");

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  /**filter uploaded file */
  fileFilter: (req, file, cb) => {
    /**filter type of file */
    const acceptedType = ["image/jpg", "image/jpeg", "image/png"];
    if (!acceptedType.includes(file.mimetype)) {
      cb(null, false); // refuse upload
      return cb(`Invalid file type(${file.mimetype})`);
    }
    /**filter size of file */
    const fileSize = req.headers["content-length"];
    const maxSize = 10 * 1024 * 1024; // max 10mb
    if (fileSize > maxSize) {
      cb(null, false); // refuse upload
      return cb("Ukuran file terlalu besar");
    }
    cb(null, true);
  },
});

const handleImageUpload = (file, folder, callback) => {
  const uploadOptions = {
    folder: `desa-pendil/${folder}`,
    file: file.buffer,
    fileName: `thumbnail-${Date.now()}${path.extname(file.originalname)}`,
  };

  imagekit.upload(uploadOptions, (err, result) => {
    if (err) {
      callback(err);
    } else {
      callback(null, result); // Return the URL of the uploaded image
    }
  });
};

const handleDeleteImage = (fileId, callback) => {
  imagekit.deleteFile(fileId, (err) => {
    if (err) {
      console.log("Error deleting image from ImageKit:", err);
    }
    callback(err);
  });
};

module.exports = {
  upload,
  handleImageUpload,
  handleDeleteImage,
};
