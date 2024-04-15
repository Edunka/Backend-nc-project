const express = require('express')
const app = express()
app.use(express.json())
const { getAllTopics, getApi} = require('./controller')

app.get("/api/topics", getAllTopics)

app.get('/api', getApi)


app.get('/api', (req, res, next) =>{
    res.status(200).send({endpoints})
})

app.use((err, req, res, next) => {
    if (err.status && err.message) {
        res.status(err.status).send({ message: err.message})
    }
})

app.use((err, req, res, next) => {
    res.status(500).send({ message: "internal server error"})
})

module.exports = app