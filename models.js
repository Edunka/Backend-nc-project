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


function getArticleAndSort(sort_by = 'created_at', order = 'desc'){
    const validSortBys = ['created_at']
        
    if (!validSortBys.includes(sort_by)) {
        return Promise.reject({ status: 400, message: 'invalid query value'})
    }
    
        
    let sqlString = `SELECT *, (SELECT COUNT(*) FROM comments WHERE comments.article_id = articles.article_id) AS comment_count FROM articles `;
    sqlString += `ORDER BY ${sort_by} `;
    sqlString += `${order.toUpperCase()}`;

    return db.query(sqlString).then(({rows}) =>{
        return rows
    })
}

function getCommentsForArticle(article_id, sort_by = 'created_at', order = 'desc'){
    const validSortBys = ['created_at']

    if (!validSortBys.includes(sort_by)) {
        return Promise.reject({ status: 400, message: 'invalid query value'})
    }

    let sqlString = `SELECT * FROM comments WHERE article_id = $1 `;
    sqlString += `ORDER BY ${sort_by} ${order.toUpperCase()}`;

    return db.query(sqlString, [article_id])
        .then(({ rows }) => {
            if (rows.length === 0) {
                return Promise.reject({ status: 404, message: "Article not found" });
            }
            return rows;
        })

}
module.exports={getTopics, getAllEndPoints, getArtcileById, getArticleAndSort, getCommentsForArticle}