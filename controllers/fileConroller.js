// controllers/fileController.js

const path = require("path");
const fs = require("fs");
const { findFileByFilename } = require("../services/uploadService");

exports.downloadFile = async (req, res) => {
  const { filename } = req.params;

  const fileRecord = await findFileByFilename(filename);

  if (!fileRecord) {
    return res.status(404).json({ message: "Metadata not found" });
  }

  const filePath = path.join(__dirname, "../uploads", filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: "File not found on disk" });
  }
  console.log("original filename ", fileRecord.originalname);
  res.download(filePath, fileRecord.originalname);
};
