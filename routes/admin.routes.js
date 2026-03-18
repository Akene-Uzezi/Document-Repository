const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controller");

router.get("/dashboard", adminController.getDashboard);

router.get("/new-user", adminController.getCreateUser);

module.exports = router;
