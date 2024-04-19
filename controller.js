const {getTopics, getAllEndPoints, getArtcileById, getArticleAndSort, getCommentsForArticle, addCommentForArticle, updateVote, deleteComment, getAllUsers, filterByTopic} = require('./models')
const endpoints = require('./endpoints.json')

function getAllTopics(req, res, next){
    getTopics().then((result) =>{
        res.status(200).send({topics: result.rows}) 
    }).catch((err) =>{
        next(err)
    }) 
}

function getApi(req, res, next) {
    getAllEndPoints().then(endpoints => {
        res.status(200).json(endpoints);
    }).catch(err => {
        next(err);
    });
}
//here
function articleId(req, res, next) {
    const { article_id } = req.params;
    getArtcileById(article_id)
    .then((article) => {
        res.status(200).send({ article });
    }).catch((err) => {
        next(err);
    });
}

function getArticleSort(req, res, next) {
    const { sort_by } = req.query
    const { order } = req.query
    const {topic} = req.query
    getArticleAndSort(sort_by, order, topic).then((articles) => {
        res.status(200).send({ articles });
    }).catch((err) => {
        next(err);
    })
};

function getComments(req, res, next){
    const { article_id } = req.params;
    const {sort_by} = req.query
    const {order} = req.query
    getCommentsForArticle(article_id, sort_by, order).then((article) =>{
        res.status(200).send({article})
    }).catch((err) =>{
        next(err)
    })
}   

function addComment(req, res, next) {
    const newComment = {
        username: req.body.username,
        body: req.body.body,
        article_id: req.params.article_id
    };
    addCommentForArticle(newComment)
        .then((result) => {
            const comment = result.rows[0];
            res.status(201).send({ comment });
        })
        .catch((err) => {
            next(err);
        });
}

function updateVoteCount(req, res, next){
    const newVote = req.body;
    updateVote(newVote).then((vote) => {
        res.status(200).send({vote})
    }).catch((err) =>{
        next(err)
    })
}


function deleteCommentById(req, res, next){
    const {comment_id} = req.params;
    deleteComment(comment_id).then(() =>{
        res.status(204).send();
    }).catch((err) =>{
        next(err)
    });
}



function getUsers(req, res, next){
    getAllUsers().then((result) =>{
        res.status(200).send({users: result.rows})
    }).catch((err) =>{
        next(err)
    })
}

module.exports = {getAllTopics, getApi, articleId, getArticleSort, getComments, addComment, updateVoteCount, deleteCommentById, getUsers}