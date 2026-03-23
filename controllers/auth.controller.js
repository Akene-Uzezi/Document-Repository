const User = require("../models/user.model");
const Uploads = require("../models/uploads.model");

const get = (req, res) => {
  if (req.session.user) {
    res.redirect("/dashboard");
    return;
  }
  res.redirect("/login");
};

const getLogin = (req, res) => {
  if (req.session.user) {
    res.redirect("/dashboard");
    return;
  }
  res.render("user/login", { error: null });
};

const login = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const user = await User.findByEmail(email);
  if (!user) {
    res.render("user/login", { error: "Invalid email" });
    return;
  }
  try {
    const passwordMatch = await User.comparePassword(password, user.password);
    if (!passwordMatch) {
      res.render("user/login", { error: "Invalid username or password" });
      return;
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.render("user/login", { error: "An error occurred. Please try again." });
    return;
  }

  req.session.user = {
    id: user._id,
    email: user.email,
    isAdmin: user.isAdmin,
    name: user.name,
  };
  res.locals.user = {
    id: user._id,
    isAdmin: user.isAdmin,
  };

  if (user.isAdmin) {
    res.redirect("/admin/dashboard");
    return;
  }
  res.redirect("/dashboard");
};

const getDashboard = async (req, res) => {
  if (!req.session.user) {
    res.redirect("/login");
    return;
  }
  if (req.session.user && req.session.user.isAdmin) {
    res.redirect("/admin/dashboard");
    return;
  }
  const files = await Uploads.getRecentFiles(req.session.user.id);
  res.render("user/dashboard", { files, user: req.session.user.name });
};

const getLogout = (req, res) => {
  req.session.destroy();
  res.redirect("/login");
};

module.exports = {
  get,
  getLogin,
  login,
  getDashboard,
  getLogout,
};
