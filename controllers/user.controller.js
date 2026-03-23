const Upload = require("../models/uploads.model");
const path = require("path");
const fs = require("fs");
const uploadFile = async (req, res) => {
  const sizeKB = (req.file.size / 1024).toFixed(2);
  const sizeMB = (req.file.size / (1024 * 1024)).toFixed(2);
  const fileData = {
    user: req.session.user.id,
    name: req.file.originalname,
    mimetype: req.file.mimetype,
    path: req.file.path,
    sizeKB,
    sizeMB,
    date: new Date(),
  };
  await Upload.upload(fileData);
  res.redirect("/dashboard");
};

const downloadFile = async (req, res) => {
  if (!req.session.user) {
    res.status(401).send("not authenticated");
    return;
  }
  const { id } = req.params;
  const file = await Upload.findFileById(id);
  if (file.user.toString() !== req.session.user.id.toString()) {
    res.status(403).send("not authorized");
    return;
  }
  const filePath = path.join(__dirname, "..", file.path.toString());
  res.download(filePath, file.name);
};

const viewFile = async (req, res) => {
  if (!req.session.user) {
    res.status(401).send("not authenticated");
    return;
  }
  const { id } = req.params;
  const file = await Upload.findFileById(id);
  if (file.user.toString() !== req.session.user.id.toString()) {
    res.status(403).send("not authorized");
    return;
  }
  const filePath = path.join(__dirname, "..", file.path.toString());
  res.sendFile(filePath);
};

const deleteFile = async (req, res) => {
  if (!req.session.user) {
    res.status(401).send("not authenticated");
    return;
  }
  const { id } = req.params;
  const file = await Upload.findFileById(id);
  if (file.user.toString() !== req.session.user.id.toString()) {
    res.status(403).send("not authorized");
    return;
  }
  const filePath = path.join(__dirname, "..", file.path.toString());
  await Upload.deleteFile(id);
  fs.unlink(filePath, (err) => {
    if (err) {
      console.log("error deleting file err:", err);
    }
  });
  res.redirect("/dashboard");
};

module.exports = {
  uploadFile,
  downloadFile,
  viewFile,
  deleteFile,
};
