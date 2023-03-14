const userCollection = require('../database/schemas/userCollection')

module.exports = async (req, res) => {
    try {
      //Delete the current user that is logged in 
      await userCollection.findOneAndDelete({ username: req.session.userid });
      req.session.destroy();
      res.redirect("/login")
  }
    catch {
      return res.json( { error: "An unexpected error occured!"})
    }
  }