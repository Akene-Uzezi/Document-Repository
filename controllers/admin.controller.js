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
      suspended: user.suspended,
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

const updateUser = async (req, res, next) => {
  const { id } = req.params;
  const { name, email } = req.body;
  try {
    await User.updateUser(id, name, email);
    const user = await User.findById(id);
    await User.sendUpdateUserEmail(user);
  } catch (err) {
    next(err);
  }

  res.redirect("/admin/dashboard");
};

const getDeleteUser = async (req, res, next) => {
  const { id } = req.params;
  try {
    await User.deleteUser(id);
  } catch (err) {
    next(err);
  }
  res.redirect("/admin/dashboard");
};

const getResetUser = async (req, res, next) => {
  let user;
  try {
    const { id } = req.params;
    user = await User.findById(id);
  } catch (err) {
    next(err);
  }
  if (!user) {
    res.render("admin/reset-user-password", {
      error: "user with that id does not exist",
      user: {
        _id: "",
        email: "",
      },
    });
    return;
  }
  res.render("admin/reset-user-password", { error: null, user });
};

const resetPassword = async (req, res) => {
  const { id } = req.params;
  const { password, confirmpassword } = req.body;
  const user = await User.findById(id);
  if (password !== confirmpassword) {
    res.render("admin/reset-user-password", {
      error: "Passwords do not match",
      user,
    });
    return;
  }
  await User.updatePassword(id, password);
  await User.sendResetPasswordEmail(user, password);
  res.redirect("/admin/dashboard");
};

const suspendUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  await User.suspendUser(id);
  await User.sendSuspendEmail(user);
  res.redirect("/admin/dashboard");
};

const restoreUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  await User.restoreUser(id);
  await User.sendRestoreEmail(user);
  res.redirect("/admin/dashboard");
};

module.exports = {
  getDashboard,
  getCreateUser,
  createUser,
  getUpdateUser,
  getDeleteUser,
  updateUser,
  getResetUser,
  resetPassword,
  suspendUser,
  restoreUser,
};
