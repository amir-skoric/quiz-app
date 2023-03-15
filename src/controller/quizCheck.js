module.exports = async (req, res) => {
    res.redirect('/results/' + req.body.quizID + '&' + req.body.answer)
}