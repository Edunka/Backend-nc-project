const express = require('express')
const cors = require("cors")
const app = express()
const { getAllTopics, getApi, articleId, getArticleSort, getComments, addComment, updateVoteCount, deleteCommentById, getUsers}  = require('./controller')
app.use(express.json())
app.use(cors())


app.get("/api/topics", getAllTopics)

app.get('/api', getApi)


app.get('/api', (req, res, next) =>{
    res.status(200).send({endpoints})
})

app.get('/api/articles/:article_id', articleId);

app.get('/api/articles', getArticleSort)

app.get('/api/articles/:article_id/comments', getComments)

app.post('/api/articles/:article_id/comments', addComment);

app.patch('/api/articles/:articles_id', updateVoteCount)

app.delete('/api/comments/:comment_id', deleteCommentById)


app.get('/api/users', getUsers)




app.use((err, req, res, next) => {
    if (err.status && err.message) {
        res.status(err.status).send({ message: err.message });
    } else if (err.code === '23502') {
        res.status(400).send({ message: 'Bad request' });
    } else {
        res.status(500).send({ message: 'Internal server error' });
    }
});


module.exports = app