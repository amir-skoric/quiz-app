//Load environment variables from .env
require('dotenv').config()

const mongoose = require('mongoose');
//Connect our database to our project
mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;

//Callback functions that run upon server start
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Succesfully connected to the database'));

//Schemas
const schLogin = new mongoose.Schema( {
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    uuid: {
        type: String,
        required: true
    }
})

const userCollection = new mongoose.model("users", schLogin);

module.exports = userCollection