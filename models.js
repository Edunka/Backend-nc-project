const db = require('./db/connection')
const fs = require('fs')

function getTopics(){
    return db.query("SELECT * FROM topics").then((result) =>{
        return result;
    })
}

function getAllEndPoints() {
    return new Promise((resolve, reject) => {
        fs.readFile('endpoints.json', 'utf-8', (err, data) => {
            if (err) {
                reject(new Error('Error reading endpoints.json'));
            } else {
                resolve(JSON.parse(data));
            }
        });
    });
}

function getArtcileById(article_id) {
    return db.query("SELECT * FROM articles WHERE article_id = $1", [article_id])
    .then((result) => {
        if (result.rows.length === 0) {
            return Promise.reject({ status: 404, message: "Article not found" });
        }
        return result.rows[0];
    });
}
module.exports={getTopics, getAllEndPoints, getArtcileById}