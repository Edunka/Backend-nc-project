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
//here
function getArtcileById(article_id) {
    return db.query(`SELECT articles.*, COUNT(comments.comment_id) AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id`, [article_id])
    .then((result) => {
        if (result.rows.length === 0) {
            return Promise.reject({ status: 404, message: "Article not found" });
        }
        return result.rows[0];
    });
}


function getArticleAndSort(sort_by = 'created_at', order = 'desc', topic) {
    const validSortBys = ['created_at', 'votes', 'comment_count'];
    const validOrders = ['asc', 'desc'];
    const params = [];

    if (!validSortBys.includes(sort_by)) {
        return Promise.reject({ status: 400, message: 'invalid query value' });
    }

    if (!validOrders.includes(order.toLowerCase())) {
        return Promise.reject({ status: 400, message: 'Invalid query value for order' });
    }

    let sqlString = `SELECT articles.*, (SELECT COUNT(*) FROM comments WHERE comments.article_id = articles.article_id) AS comment_count FROM articles`;

    if (topic) {
        return db.query('SELECT DISTINCT topic FROM articles WHERE topic = $1', [topic])
            .then(({ rows }) => {
                if (rows.length === 0) {
                    return Promise.reject({ status: 400, message: 'topic doesnt exist' });
                }
                sqlString += ` WHERE articles.topic = $1`;
                params.push(topic);
            })
            .then(() => {
                sqlString += ` ORDER BY articles.${sort_by} ${order.toUpperCase()}`;
                return db.query(sqlString, params).then(({ rows }) => rows);
            });
    } else {
        sqlString += ` ORDER BY articles.${sort_by} ${order.toUpperCase()}`;
        return db.query(sqlString).then(({ rows }) => rows);
    }
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

function addCommentForArticle(newComment) {
    const { username, body, article_id } = newComment;
    const votesValue = newComment.votes || 0;
    return db.query(
        `INSERT INTO comments (author, body, article_id, votes) VALUES ($1, $2, $3, $4) RETURNING *;`,
        [username, body, article_id, votesValue]
    )
}


function updateVote(newVote) {
    if(!newVote.article_id){
        return Promise.reject({status: 400, message: 'Missing article ID'})
    }
    if (isNaN(newVote.inc_votes)) {
        return Promise.reject({ status: 400, message: 'Vote must be a number' });
    }
    return db.query(`UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING votes`,
        [newVote.inc_votes, newVote.article_id]
    )
    .then((result) =>{
        if(result.rows.length === 0){
            return Promise.reject({status: 404, message: 'Article not found'})
        }
        return result.rows[0].votes
    })
}

function deleteComment(comment_id){
    if(isNaN(comment_id)){
        return Promise.reject({status: 400, message: 'Comment ID must be a number'})
    }
    return db.query(
        `DELETE FROM comments WHERE comment_id = $1`, [comment_id]
    ).then((result) =>{
        return result.rows
    })
}


function getAllUsers(){
    return db.query('SELECT * FROM users').then((results) =>{
        return results
    })
}

module.exports={getTopics, getAllEndPoints, getArtcileById, getArticleAndSort, getCommentsForArticle, addCommentForArticle, updateVote, deleteComment, getAllUsers}