//Middleware function that makes sure that you can't "back-track" on the website
module.exports = function noCache(req, res, next) {
    res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
    res.header("Expires", "-1");
    res.header("Pragma", "no-cache");
    next();
  }