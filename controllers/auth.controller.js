const getLogin = (req, res) => {
  res.render("login", { error: null });
};

const getSignup = (req, res) => {
  res.render("signup", { error: null });
};

const getDashboard = (req, res) => {
  if (!req.session.user) {
    res.redirect("/login");
    return;
  }
  res.render("dashboard");
};

module.exports = {
  getLogin,
  getSignup,
  getDashboard,
};
