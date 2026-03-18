const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");

router.get("/", authController.get);

router.get("/login", authController.getLogin);

router.get("/signup", authController.getSignup);

router.post("/login", authController.login);

router.post("/signup", authController.signup);

router.get("/logout", authController.getLogout);

router.get("/dashboard", authController.getDashboard);

module.exports = router;
