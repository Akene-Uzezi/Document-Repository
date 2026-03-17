const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");

router.get("/", (req, res) => {
  res.redirect("/login");
});

router.get("/login", authController.getLogin);

router.get("/signup", authController.getSignup);

router.get("/dashboard", authController.getDashboard);

module.exports = router;
