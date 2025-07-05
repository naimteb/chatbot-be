const {
  getFileByFilename,
  saveUploadedFile,
} = require("../models/uploadModel");

exports.processUploadedFiles = async (files, chatSessionId) => {
  console.log("files", files);
  if (!files || files.length === 0) {
    return [];
  }
  const savedFiles = [];
  for (const file of files) {
    const saved = await saveUploadedFile(file, chatSessionId);
    savedFiles.push(saved);
  }
  return savedFiles;
};

exports.findFileByFilename = async (filename) => {
  const fileRecord = await getFileByFilename(filename);
  return fileRecord;
};
