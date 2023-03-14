const userCollection = require('../database/schemas/userCollection');
const bcrypt = require('bcrypt');

module.exports = async (req, res) => {
    //Find the current user that is logged
    const user = await userCollection.findOne( { username: req.session.userid });
    user.username = req.body.username;
    user.email = req.body.email;
    user.password = req.body.password;
    const checkUsername = await userCollection.exists({ username: req.body.username });
    const checkEmail = await userCollection.exists({ email: req.body.email });
    //If the user doesn't exist, insert into the database
    if (checkUsername === null && checkEmail === null) {
      //Hash password
      user.password = await bcrypt.hash(user.password, 10);
      await user.save();
      //delete local user object
      delete user;
      req.session.isAuthenticated = false;
      res.redirect('/');
      //Update current user
      }
      else {
        return res.json( { error: "User with the same e-mail or username already exists!"})
      }
  }