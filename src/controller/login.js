const userCollection = require('../database/schemas/userCollection')
const bcrypt = require("bcrypt");

//Login
module.exports = async (req, res) => {
    try {
      //Check database for matching username
      const user = await userCollection.findOne({ username: req.body.username });
  
      //if no user is found, an epic fail will ensue
      if (!user) {
        return res.json({ error: "Wrong user credentials!" });
      } else {
        //Comparing the hashed passwords, and if they match, set the session
        if (await bcrypt.compare(req.body.password, user.password)) {
          req.session.userid = req.body.username;
          req.session.isAuthenticated = true;
          res.redirect("/");
        }
        else {
          return res.json({ error: "Wrong user credentials!" });
        }
      }
    } catch {
      return res.json({ error: "Wrong user credentials!" });
    }
  };