const express = require("express");
const router = express.Router();

const authenticateToken = require("../middleware/authenticateToken");
const { downloadFile } = require("../controllers/fileConroller");
// GET /secure-file/:filename
router.get("/secure-file/:filename", authenticateToken, downloadFile);


module.exports = router;
