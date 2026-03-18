const User = require("../models/user.model");

const get = (req, res) => {
  res.redirect("/login");
};

const getLogin = (req, res) => {
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
  };
  res.redirect("/dashboard");
};

const getDashboard = (req, res) => {
  if (!req.session.user) {
    res.redirect("/login");
    return;
  }
  res.render("user/dashboard");
};

const getSignup = (req, res) => {
  res.render("user/signup", { error: null });
};

const signup = async (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmpassword;
  const user = new User(name, email, password);
  const exists = await user.alreadyExists();
  if (exists) {
    res.render("user/signup", { error: "Email already exists" });
    return;
  }
  if (password !== confirmPassword) {
    res.render("user/signup", { error: "Passwords do not match" });
    return;
  }
  await user.createUser();
  res.redirect("/login");
};

module.exports = {
  get,
  getLogin,
  login,
  getDashboard,
  getSignup,
  signup,
};
