const Upload = require("../models/uploads.model");
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

module.exports = {
  uploadFile,
};
