//Define imports (require)
const express = require("express");
const sessions = require("express-session");
const bcrypt = require("bcrypt");
const userCollection = require("../../src/database/database");
const router = express.Router();
const app = express();

//get all users
router.get('/users', (req, res) => {
    userCollection.find((err, result) => {
        if (err) throw err;
        res.send(result)
    })
})

module.exports = router;