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

module.exports={getTopics, getAllEndPoints}