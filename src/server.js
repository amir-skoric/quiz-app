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

//Middleware for Express JSON
app.use(express.json());
app.use(express.urlencoded ({extended: false}))

//Sessions
app.use(sessions({
    secret: process.env.KEY,
    saveUninitialized: true,
    cookie: { 
        maxAge: 10000 },
    resave: false 
}));

//Session variable
var session;

//App listener (start server)
app.listen(process.env.DEV_PORT, () => console.log("Started server on localhost:" + process.env.DEV_PORT));

//Handlebars middleware
app.engine('.hbs', exphbs.engine({extname: '.hbs', defaultLayout: "", layoutsDir: ""}));
app.set('view engine', '.hbs');

//Login authentication
function auth (req, res, next) {
    if (req.session.authenticated) {
        res.redirect('/')
    }
    else {
        res.redirect('/login')
    }
}

//Routes
app.get('/', auth, (req, res) => {
    res.render('index')
})

app.get('/login', (req, res) => {
    res.render('login')
})

app.get('/signup', (req, res) => {
    res.render('signup')
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
    const checkUsername = await userCollection.exists({username: req.body.username})
    const checkEmail = await userCollection.exists({email: req.body.email})
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
        res.send('Username or E-mail already in use!')
    }
})

//Login
app.post('/login', async (req, res) => {
    try {
        const user = await userCollection.findOne({username: req.body.username})
    
    //if no user is found, an epic fail will ensue
    if (!user) {
        return res.send("Wrong user credentials!")
    }
    else {
    //Comparing the hashed passwords, and if they match, set the session
    if ((await bcrypt.compare(req.body.password, user.password))) {
        req.session.userid = req.body.username;
        req.session.authenticated = true;
        res.redirect('/')
        }
    }
    }
    catch {
        res.send("Wrong user credentials!")
    }
})

//Sign-out (delete session)
app.get('/signout', (req, res) => {
    req.session.destroy();
    res.redirect('/login')
})