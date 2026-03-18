const User = require("../models/user.model");
const db = require("../database/documentRepository.db");
const getDashboard = async (req, res) => {
  if (!req.session.user || !req.session.user.isAdmin) {
    res.redirect("/login");
    return;
  }
  const users = await db.getDb().collection("users").find().toArray();
  const newUsers = users.map((user) => {
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    };
  });
  res.render("admin/admin-dashboard", { users: newUsers });
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

const getUpdateUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  res.render("admin/update-user", { error: null, user });
};

module.exports = {
  getDashboard,
  getCreateUser,
  createUser,
  getUpdateUser,
};
