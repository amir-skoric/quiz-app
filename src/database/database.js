//Load environment variables from .env
require('dotenv').config()

const mongoose = require('mongoose');
//Connect our database to our project
mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;

//Callback functions that run upon server start
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Succesfully connected to the database'));