const userCollection = require('../database/schemas/userCollection');
const bcrypt = require('bcrypt');
const crypto = require('crypto')

//Signup
module.exports = async (req, res) => {
    //Defining user object
    const user = {
      username: req.body.username,
      email: req.body.email,
      uuid: crypto.randomUUID(),
      password: req.body.password,
      profilePic: "https://source.unsplash.com/random"
    };
    //Checking if a user with the same username or email exists
    const checkUsername = await userCollection.exists({ username: req.body.username });
    const checkEmail = await userCollection.exists({ email: req.body.email });
    //If the user doesn't exist, insert into the database
    if (checkUsername === null && checkEmail === null) {
      //Hash password
      user.password = await bcrypt.hash(user.password, 10);
      await userCollection.insertMany([user]);
      //Delete local user object
      delete user;
      res.status(201);
      res.redirect('/login');
    } else {
      //Error if username or E-mail is in use
      return res.json({ error: "Username or E-mail already in use!" });
    }
  };