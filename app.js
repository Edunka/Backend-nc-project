const express = require('express')
const app = express()
app.use(express.json())
const { getAllTopics, getApi, articleId, getArticleSort, getComments}  = require('./controller')

app.get("/api/topics", getAllTopics)

app.get('/api', getApi)


app.get('/api', (req, res, next) =>{
    res.status(200).send({endpoints})
})

app.get('/api/articles/:article_id', articleId);

app.get('/api/articles', getArticleSort)

app.get('/api/articles/:article_id/comments', getComments)

app.use((err, req, res, next) => {
    if (err.status && err.message) {
        res.status(err.status).send({ message: err.message})
    }
})

app.use((error, request, response, next) =>{
    if(error.code === '23502'){
      response.status(400).send({msg: 'Bad request'})
    }
    next(error)
  });

app.use((err, req, res, next) => {
    res.status(500).send({ message: "internal server error"})
})

module.exports = app