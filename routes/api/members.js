//Define imports (require)
const express = require("express");
const userCollection = require("../../src/database/database");
const router = express.Router();

//get all users
router.get('/users', (req, res) => {
    userCollection.find((err, result) => {
        if (err) throw err;
        res.send(result)
    })
})

module.exports = router;