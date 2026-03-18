const User = require("../models/user.model");
const getDashboard = (req, res) => {
  if (!req.session.user || !req.session.user.isAdmin) {
    res.redirect("/login");
    return;
  }
  res.render("admin/admin-dashboard");
};

const getCreateUser = (req, res) => {
  res.render("admin/new-user", { error: null });
};

const createUser = async (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmpassword;
  const user = new User(name, email, password);
  const exists = await user.alreadyExists();
  if (exists) {
    res.render("admin/new-user", { error: "Email already exists" });
    return;
  }
  if (password !== confirmPassword) {
    res.render("admin/new-user", { error: "Passwords do not match" });
    return;
  }
  await user.createUser();
  res.redirect("/admin/dashboard");
};

module.exports = {
  getDashboard,
  getCreateUser,
  createUser,
};
