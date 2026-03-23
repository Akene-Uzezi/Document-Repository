const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const fileUploadMiddleware = require("../middlewares/file-upload-middleware");

router.post("/upload", fileUploadMiddleware, userController.uploadFile);

module.exports = router;
