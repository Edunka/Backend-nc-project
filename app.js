const express = require('express')
const app = express()

app.use(express.json())
const { getAllTopics } = require('./controller')

app.get("/api/topics", getAllTopics)

app.use((err, req, res, next) => {
    if (err.status && err.message) {
        res.status(err.status).send({ message: err.message})
    }
})

app.use((err, req, res, next) => {
    res.status(500).send({ message: "internal server error"})
})

module.exports = app