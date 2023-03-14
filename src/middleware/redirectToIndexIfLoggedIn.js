//Redirect if logged in
module.exports = function redirectToIndexIfLoggedIn(req, res, next) {
    if (req.session.isAuthenticated) {
      res.redirect("/");
    }
    next();
  }
  