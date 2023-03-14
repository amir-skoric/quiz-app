//Login authentication
module.exports = function auth(req, res, next) {
    if (req.session.isAuthenticated) {
      next();
    } else {
      res.redirect("/login");
    }
  }