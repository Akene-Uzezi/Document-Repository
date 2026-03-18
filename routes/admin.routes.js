const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controller");

router.get("/dashboard", adminController.getDashboard);

router.get("/new-user", adminController.getCreateUser);

router.post("/new-user", adminController.createUser);

router.get("/update/:id", adminController.getUpdateUser);

router.get("/delete/:id", adminController.getDeleteUser);

module.exports = router;
