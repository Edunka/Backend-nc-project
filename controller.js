const {getTopics, getAllEndPoints, getArtcileById, getArticleAndSort} = require('./models')
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
    getArticleAndSort(sort_by, order).then((articles) => {
        res.status(200).send({ articles });
    }).catch((err) => {
        next(err);
    })
};
module.exports = {getAllTopics, getApi, articleId, getArticleSort}