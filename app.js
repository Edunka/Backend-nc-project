const express = require('express')
const app = express()
const { getAllTopics, getApi, articleId, getArticleSort, getComments, addComment}  = require('./controller')
app.use(express.json())
app.get("/api/topics", getAllTopics)

app.get('/api', getApi)


app.get('/api', (req, res, next) =>{
    res.status(200).send({endpoints})
})

app.get('/api/articles/:article_id', articleId);

app.get('/api/articles', getArticleSort)

app.get('/api/articles/:article_id/comments', getComments)

app.post('/api/articles/:article_id/comments', addComment);

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