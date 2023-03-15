const quizCollection = require('../database/schemas/quizCollection');
const userCollection = require('../database/schemas/userCollection');

//Add Quiz
module.exports = async (req, res) => {
    //Defining user object
    const quiz = {
      name: req.body.quizName,
      category: req.body.category,
      uuid: crypto.randomUUID(),
      user: null,
      question: req.body.question
    };
    //Checking if a quiz with the same name exists
    const checkQuiz = await quizCollection.exists({ name: req.body.quizName });
    //Get user from other collection
    const user = await userCollection.findOne( { username: req.session.userid })
    //Assign username to quiz insertion
    quiz.user = user.username;
    //If the user doesn't exist, insert into the database
    if (checkQuiz === null) {
      //Insert to database
      await quizCollection.insertMany([quiz]);
      //delete local user object
      delete quiz;
      res.status(201);
      res.redirect('/');
    } else {
      //error if quiz with same name exists
      return res.json({ error: "A quiz with the same name already exists!" });
    }
  };