const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const fileUploadMiddleware = require("../middlewares/file-upload-middleware");

router.post("/upload", fileUploadMiddleware, userController.uploadFile);

router.get("/download/:id", userController.downloadFile);

router.get("/view/:id", userController.viewFile);

router.get("/delete/:id", userController.deleteFile);

module.exports = router;
