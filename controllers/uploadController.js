// // controllers/uploadController.js

// const { processUploadedFiles } = require("../services/uploadService");

// exports.handleUpload = (req, res) => {
//   try {
//     console.log("Files received by multer:", req.files);
//     const result = processUploadedFiles(req.files);
//     res.status(200).json(result);
//   } catch (error) {
//     console.error("Upload error:", error);
//     res.status(400).json({ error: error.message || "Upload failed" });
//   }
// };
