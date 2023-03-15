//Import database collections
const quizCollection = require('../database/schemas/quizCollection');
const userCollection = require('../database/schemas/userCollection');

class Question {
  constructor(question, answers, answer) {
    this.question = question
    this.answer = answer
    this.answers = answers
  } 
}

//Add Quiz
module.exports = async (req, res) => {
    //Defining user object
    const quiz = {
      name: req.body.quizName,
      category: req.body.category,
      uuid: crypto.randomUUID(),
      user: null,
      questions: null,
    };

    //Seperate answers
    const separatedAnswers1 = req.body.answers1.split(':')
    const separatedAnswers2 = req.body.answers2.split(':')
    const separatedAnswers3 = req.body.answers3.split(':')

    //Checks if the answers is lower than 4
    if (separatedAnswers1.length < 4) {
      res.json({ error: "You need 4 or more answers!" })
      return;
    }

    if (separatedAnswers2.length < 4) {
      res.json({ error: "You need 4 or more answers!" })
      return;
    }

    if (separatedAnswers3.length < 4) {
      res.json({ error: "You need 4 or more answers!" })
      return;
    }

    if (req.body.answer1 > separatedAnswers1.length) {
      res.json ({ error: "The answer number is out of the range" })
      return;
    }

    if (req.body.answer2 > separatedAnswers2.length) {
      res.json ({ error: "The answer number is out of the range" })
      return;
    }

    if (req.body.answer3 > separatedAnswers3.length) {
      res.json ({ error: "The answer number is out of the range" })
      return;
    }

    const question1 = new Question(req.body.question1, separatedAnswers1, req.body.answer1-1)
    const question2 = new Question(req.body.question2, separatedAnswers2, req.body.answer2-1)
    const question3 = new Question(req.body.question3, separatedAnswers3, req.body.answer3-1)

    quiz.questions = [question1, question2, question3]

    //Get user from other collection
    const user = await userCollection.findOne( { username: req.session.userid })
    //Assign username to quiz insertion
    quiz.user = user.username;

    //Checking if a quiz with the same name exists
    const checkQuiz = await quizCollection.exists({ name: req.body.quizName });
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