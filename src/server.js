//Load environment variables from .env
require('dotenv').config()

//Define imports (require)
const express = require('express');
const sessions = require('express-session');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const exphbs = require('express-handlebars');
const userCollection = require('./database')

//"Initialize" express
const app = express();

//For importing CSS
app.use('/public', express.static('public'))

//Middleware for Express JSON
app.use(express.json());
app.use(express.urlencoded ({extended: false}))

//Sessions
app.use(sessions({
    secret: process.env.KEY,
    saveUninitialized: true,
    resave: true,
    cookie: { 
        maxAge: 3600000
    }
}));


//App listener (start server)
app.listen(process.env.DEV_PORT, () => console.log("Started server on localhost:" + process.env.DEV_PORT));

//Handlebars middleware
app.engine('.hbs', exphbs.engine({extname: '.hbs', defaultLayout: "", layoutsDir: ""}));
app.set('view engine', '.hbs');

//Middleware function that makes sure that you can't "back-track" on the website
function noCache(req, res, next) {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    next();
  }

//Login authentication
function auth (req, res, next) {
    if (req.session.isAuthenticated) {
        next();
    }
    else {
        res.redirect('/login');
    }
}

//Routes
app.get('/', auth, noCache, async (req, res) => {
    const user = await userCollection.findOne( { username: req.session.userid});
    res.render('index', { user: user.username})
})

app.get('/login', noCache, (req, res) => {
    res.render('login');
    req.session.isAuthenticated = false;
})

app.get('/signup', noCache, (req, res) => {
    res.render('signup');
    req.session.isAuthenticated = false;
})

//Database insertions
//Signup
app.post('/signup', async (req, res) => {
//Defining user object
        const user = {
            username: req.body.username,
            email: req.body.email,
            uuid: crypto.randomUUID(),
            password: req.body.password
        }
    //Checking if a user with the same username or email exists
    const checkUsername = await userCollection.exists({username: req.body.username});
    const checkEmail = await userCollection.exists({email: req.body.email});
    //If the user doesn't exist, insert into the database
    if (checkUsername === null && checkEmail === null) {
        //Hash password
        user.password = await bcrypt.hash(user.password, 10);
        await userCollection.insertMany([user]);
        //delete local user object
        delete user;
        res.redirect('/');
    }
    else {
        //error if username or email is in use
        return res.json({ error: "Username or E-mail already in use!" });
    }
})

//Login
app.post('/login', async (req, res) => {
    try {
        const user = await userCollection.findOne({username: req.body.username});
    
    //if no user is found, an epic fail will ensue
    if (!user) {
        return res.json({ error: "Wrong user credentials!" });
    }
    else {
    //Comparing the hashed passwords, and if they match, set the session
    if ((await bcrypt.compare(req.body.password, user.password))) {
        req.session.userid = req.body.username;
        req.session.isAuthenticated = true;
        res.redirect('/');
        }
    }
    }
    catch {
        return res.json({ error: "Wrong user credentials!" });
    }
})

//Sign-out (delete session)
app.get('/signout', (req, res) => {
    req.session.destroy();
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    res.redirect('/login');
})