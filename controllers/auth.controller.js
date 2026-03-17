const User = require("../models/user.model");

const get = (req, res) => {
  res.redirect("/login");
};

const getLogin = (req, res) => {
  res.render("login", { error: null });
};

const login = async (req, res) => {};

const getSignup = (req, res) => {
  res.render("signup", { error: null });
};

const signup = async (req, res) => {
  const fullname = req.body.fullname;
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmpassword;
  const user = new User(fullname, email, password);
  const exists = await user.alreadyExists();
  if (exists) {
    res.render("signup", { error: "User already exists" });
    return;
  }
  if (password !== confirmPassword) {
    res.render("signup", { error: "Passwords do not match" });
    return;
  }
  await user.createUser();
  res.redirect("/login");
};

const getDashboard = (req, res) => {
  if (!req.session.user) {
    res.redirect("/login");
    return;
  }
  res.render("dashboard");
};

module.exports = {
  get,
  getLogin,
  login,
  getSignup,
  signup,
  getDashboard,
};
