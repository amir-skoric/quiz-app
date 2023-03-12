//Load environment variables from .env
require('dotenv').config()

//Define imports (require)
const express = require('express');
const session = require('express-session');
const path = require('path');
const uuid = require('uuid');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars')

//Connect our database to our project
mongoose.connect(process.env.DATABASE_URL)
const db = mongoose.connection

//Callback functions that run upon server start
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Succesfully connected to the database'))

//"Initialize" express
const app = express();

//Port
const port = 4000;

//Middleware for Express JSON
app.use(express.json());

//App listener (start server)
app.listen(port, () => console.log("Started server on localhost:" + port));

//Handlebars middleware
app.engine('.hbs', exphbs.engine({extname: '.hbs', defaultLayout: "", layoutsDir: ""}));
app.set('view engine', '.hbs');

//Routes
app.get('/', (req, res) => {
    res.render('index')
})