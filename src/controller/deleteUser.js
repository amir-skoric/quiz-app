const userCollection = require('../database/schemas/userCollection')
const quizCollection = require("../database/schemas/quizCollection");

module.exports = async (req, res) => {
    try {
      //Delete the current users quizzes
      await quizCollection.deleteMany({ user: req.session.userid })
      //Delete the current user that is logged in 
      await userCollection.findOneAndDelete({ username: req.session.userid });
      req.session.destroy();
      res.redirect("/login")
  }
    catch {
      return res.json( { error: "An unexpected error occured!"})
    }
  }