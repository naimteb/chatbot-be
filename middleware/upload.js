// const express = require("express");
const multer = require("multer");
const path = require("path");
// const { handleUpload } = require("../controllers/uploadController");
// const router = express.Router();
const fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, "../uploads");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const timestamp = Date.now();
    // cb(null, `${file.originalname}-${timestamp}`); // null means no error happened
    const ext = path.extname(file.originalname); //.pdf
    const base = path.basename(file.originalname, ext); //"naim tebchrany_cs "
    cb(null, `${base}-${timestamp}${ext}`);
    // always in the cb the first argument is reserved for the errors
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype.startsWith("image/") ||
    file.mimetype === "application/pdf" ||
    file.mimetype === "text/plain" ||
    file.mimetype === "application/json" ||
    file.mimetype === "application/msword" ||
    file.mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" // only .docx  no .exe and .bat
  ) {
    cb(null, true);
  } else {
    cb(new Error("Unsupported file type"), false);
  }
};
const upload = multer({ storage, fileFilter }); // multer is a factory function that returns middleware functions
// when we pass storage and fileFilter we are telling the middleware where and how files are stored in storage and wich files to accept
// router.post("/upload", upload.array("files", 10), handleUpload);
// module.exports = router;
module.exports = upload;
