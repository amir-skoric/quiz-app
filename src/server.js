//Load environment variables from .env
require("dotenv").config();

//Define imports (require)
const express = require("express");
const sessions = require("express-session");
const exphbs = require("express-handlebars");

//Database
const database = require("./database/database");
const userCollection = require("./database/schemas/userCollection");
const quizCollection = require("./database/schemas/quizCollection");

const path = require("path");
const morgan = require('morgan');
const uuid = require('uuid')
//Middleware imports
const auth = require('./middleware/auth')
const noCache = require('./middleware/noCache')
const redirectToIndexIfLoggedIn = require('./middleware/redirectToIndexIfLoggedIn')

//"Initialize" express
const app = express();

//Middlewarez
//For importing CSS
app.use("/public", express.static("public"));

//Middleware for Express JSON
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Sessions
app.use(
  sessions({
    genid: (req) => {
      return uuid.v4();
    },
    secret: process.env.KEY,
    saveUninitialized: false,
    resave: true,
    rolling: true,
    cookie: {
      maxAge: 180000,
    },
  })
);

//App listener (start server)
app.listen(process.env.DEV_PORT, () =>
  console.log("Started server on localhost:" + process.env.DEV_PORT)
);

//Morgan (logging middleware)
app.use(morgan('dev'))

//Handlebars middleware
app.engine(
  ".hbs",
  exphbs.engine({
    extname: ".hbs",
    defaultLayout: "",
    layoutsDir: "",
    partialsDir: [path.join(__dirname, "../views/partials")],
  })
);
app.set("view engine", ".hbs");

//Routes
app.get('/', auth, noCache, async (req, res) => {
  //Initialize database user finding yes
  const user = await userCollection.findOne({ username: req.session.userid });
  //Get quizzes from database
  const allQuizzes = await quizCollection.find().lean();
  const yourQuizzes = await quizCollection.find({ user: req.session.userid}).lean();
  console.log(yourQuizzes)
  res.render('index', { user: user.username, allQuizzes: allQuizzes, yourQuizzes: yourQuizzes})
});

//Middleware function for redirectToIndexIfLoggedIn
app.get('/', redirectToIndexIfLoggedIn);

//login route
app.get('/login', noCache, redirectToIndexIfLoggedIn, (req, res) => {
  res.render("login");
});

//Signup route
app.get('/signup', noCache, redirectToIndexIfLoggedIn, (req, res) => {
  res.render("signup");
});

//Account page
app.get('/account', auth, noCache, async (req, res) => {
    const user = await userCollection.findOne( { username: req.session.userid });
    res.render('account', { user: user.username, email: user.email, password: user.password, profilePic: user.profilePic});
})

//Add quiz page
app.get('/addQuiz', auth, noCache, async (req, res) => {
  res.render('addQuiz')
})

//Account routes
//Signup
app.post('/signup', require('./controller/signup'))

//Login
app.post('/login', require('./controller/login'))

//Update account
app.post('/updateUser', require('./controller/updateUser'))

//Delete account
app.post('/deleteUser', require('./controller/deleteUser'))

//Sign-out (delete session)
app.get('/signout', require('./controller/signout'))

//Quiz routes
//Add quiz
app.post('/addQuiz', require('./controller/addQuiz'))

//Quiz API routes
app.use('/api/quizzes', require('../routes/api/quizzes'))

//404 ROUTE (ALWAYS LAST)
app.get('*', function(req, res){
  res.json({ error: "Bad request :("})
});