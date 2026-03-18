const getDashboard = (req, res) => {
  if (!req.session.user || !req.session.user.isAdmin) {
    res.redirect("/login");
    return;
  }
  res.render("admin/admin-dashboard");
};

module.exports = {
  getDashboard,
};
