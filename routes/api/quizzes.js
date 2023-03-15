//Define imports (require)
const express = require("express");
const quizCollection = require("../../src/database/schemas/quizCollection");
const router = express.Router();



//Get all quizzes
router.get('/', async (req, res) => {
    const data = await quizCollection.find()
        //Check if there any quizzes in the database
        if (await quizCollection.count() === 0) {
            return res.json({ error: "No quizzes found!" })
        }
        else {
            return res.send(data)
        }
    })


//Sort quizzes by date (newest first)
router.get('/sortByDate', async (req, res) => {
    const data = await quizCollection.find().sort('-created')
    //Check if there any quizzes in the database
    if (await quizCollection.count() === 0) {
        return res.json({ error: "No quizzes found!" })
    }
    else {
        return res.send(data)
    }
})

//Get quizzes by category
router.get('/category/:id', async (req, res) => {
    const data = await quizCollection.find({ category: req.params.id })
    //Check if there any quizzes with the requested category name in the database
    if (data === null) {
        return res.json({ error: "No quizzes found!" })
    }
    else {
        return res.send(data)
    }
})


//Get quiz by name
router.get('/:id', async (req, res) => {
    const data = await quizCollection.findOne({ name: req.params.id })
    if (data === null) {
        return res.json({ error: "No quiz with the requested name found!" })
    }
    else {
        return res.send(data)
    }
})


module.exports = router;