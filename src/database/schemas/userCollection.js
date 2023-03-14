const mongoose = require('mongoose');

//Login Schema
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

module.exports = userCollection;