//Load environment variables from .env
require("dotenv").config();

//Define imports (require)
const express = require("express");
const sessions = require("express-session");
const exphbs = require("express-handlebars");
const userCollection = require("./database/schemas/userCollection");
const path = require("path");

//"Initialize" express
const app = express();

//For importing CSS
app.use("/public", express.static("public"));

//Middleware for Express JSON
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Sessions
app.use(
  sessions({
    secret: process.env.KEY,
    saveUninitialized: true,
    resave: true,
    cookie: {
      maxAge: 3600000,
    },
  })
);

//App listener (start server)
app.listen(process.env.DEV_PORT, () =>
  console.log("Started server on localhost:" + process.env.DEV_PORT)
);

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

//Middleware function that makes sure that you can't "back-track" on the website
function noCache(req, res, next) {
  res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
  res.header("Expires", "-1");
  res.header("Pragma", "no-cache");
  next();
}

//Login authentication
function auth(req, res, next) {
  if (req.session.isAuthenticated) {
    next();
  } else {
    res.redirect("/login");
  }
}

//Redirect if logged in
function redirectToIndexIfLoggedIn(req, res, next) {
  if (req.session.isAuthenticated) {
    res.redirect("/");
  }
  next();
}

//Page routes
//Frontpage (if logged in)
app.get('/', auth, noCache, redirectToIndexIfLoggedIn, async (req, res) => {
  const user = await userCollection.findOne({ username: req.session.userid });
  res.render('index', { user: user.username });
});
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
    res.render('account', { user: user.username, email: user.email, password: user.password});
})

//Add quiz page
app.get('/addQuiz', auth, noCache, async (req, res) => {
  res.render('addQuiz')
})

//API Routes
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

//Members api routes
app.use('/api/members', require('../routes/api/members'))

//404 ROUTE (ALWAYS LAST)
app.get('*', function(req, res){
  res.status(404);
  res.render('404');
});