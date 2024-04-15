const {getTopics} = require('./models')

function getAllTopics(req, res, next){
    getTopics().then((result) =>{
        res.status(200).send({topics: result.rows}) 
    }).catch((err) =>{
        next(err)
    }) 
}
module.exports = {getAllTopics}