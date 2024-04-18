const request = require('supertest')
const app = require('../app')
const db = require('../db/connection')
const data = require('../db/data/test-data/index')
const seed = require('../db/seeds/seed')
const fs = require('fs')


  
  
beforeEach(() => {
    return seed(data);
});
afterAll(() => {
    db.end();
});
describe('/api/topics', () =>{
    test('GET 200: responds with status code 200', () =>{
        return request(app).get('/api/topics').expect(200)
    })
})

describe('/api/topics', () =>{
    test('GET 200: Responds with an array of topics objects', () =>{
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then(({body}) =>{
            const { topics } = body;
            expect(topics.length).toBe(3);
                topics.forEach((topic) =>{
                expect(topic).toHaveProperty('slug');
                expect(topic).toHaveProperty('description');
                })
            }
        )
    })
})
describe('GET /api endpoint', () =>{
    test('Responds with a JSON object containing all of the available endpoints', () =>{
        const endpointData = fs.readFileSync('endpoints.json', 'utf-8');
        const expectedEndpoints = JSON.parse(endpointData);

        return request(app)
        .get('/api')
        .expect(200)
        .then(response =>{
            expect(response.body).toEqual(expectedEndpoints)
        })
    })
})
describe('GET /api/articles/article_id', () =>{
    test('Responds with the correct article based on the passed article ID', () =>{
        return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then(({body}) =>{
            const {article} = body
            expect(article).toHaveProperty('author')
            expect(article).toHaveProperty('title')
            expect(article).toHaveProperty('article_id')
            expect(article).toHaveProperty('body')
            expect(article).toHaveProperty('topic')
            expect(article).toHaveProperty('created_at')
            expect(article).toHaveProperty('votes')
            expect(article).toHaveProperty('article_img_url')
        })
    })
    test('GET:404 sends an appropriate status and error message when given a non-existent id', () => {
        return request(app)
          .get('/api/articles/999')
          .expect(404)
          .then((article) => {
            expect(article.body.message).toBe('Article not found');
          });
      });
})

describe('GET /api/articles', () =>{
    test('returns an array of article objects', () =>{
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({body}) =>{
            const { articles } = body
            articles.forEach((article) =>{
                expect(article).toMatchObject({
                    author: expect.any(String),
                    title: expect.any(String),
                    article_id: expect.any(Number),
                    topic: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                    article_img_url: expect.any(String),
                    comment_count: expect.any(String),
                    
                })
            })
        })
    })
    test('returns 400 for invalid sort_by parameter', () => {
        return request(app)
        .get('/api/articles?sort_by=invalid_sort')
        .expect(400)
        .then((response) => {
            expect(response.body.message).toBe('invalid query value');
        });
    })
})

describe('GET /api/articles/:article_id/comments', () =>{
    test('GET 200 returns an array of comments from an article ID sorted in descending order', () =>{
        return request(app)
        .get('/api/articles/5/comments')
        .expect(200)
        .then(({ body }) => {
          const comments = body.article;
          comments.forEach(comment => {
            expect(comment).toHaveProperty('comment_id');
            expect(comment).toHaveProperty('votes');
            expect(comment).toHaveProperty('created_at');
            expect(comment).toHaveProperty('author');
            expect(comment).toHaveProperty('body');
            expect(comment).toHaveProperty('article_id');
          });
        });
    })
    test('returns 400 for invalid sort_by parameter', () => {
        return request(app)
        .get('/api/articles?sort_by=invalid_sort')
        .expect(400)
        .then((response) => {
            expect(response.body.message).toBe('invalid query value');
        });
    })
    test('GET:404 sends an appropriate status and error message when given a non-existent id', () => {
        return request(app)
          .get('/api/articles/21/comments')
          .expect(404)
          .then((article) => {
            expect(article.body.message).toBe('Article not found');
          });
      });
})

describe('POST /api/articles/:article_id/comments', () => {
    test('POST 201: adds a comment for an article', () => {
        const newComment = {
            username: 'butter_bridge',
            body: 'This is a test comment'
        };
        const article_id = 1;
        return request(app)
            .post(`/api/articles/${article_id}/comments`) 
            .send(newComment)
            .expect(201)
            .then(({ body }) => {
                const { comment } = body;
                expect(comment.body).toBe('This is a test comment');
                expect(comment.author).toBe('butter_bridge')
                expect(comment.votes).toBe(0)
                expect(comment.article_id).toBe(1)
                
            });
    
    });
    test('GET:400 sends an appropriate status and error message when given a valid but non-existent id', () => {
        return request(app)
          .post('/api/articles/999/comments')
          .expect(400)
          .then((response) => {
            expect(response.body.message).toBe('Bad request');
          });
      });
});

describe('PATCH /api/articles/:articles_id', () =>{
    test('PATCH 200: change vote count by increment for article by article_id', () =>{
        const newVote = {
            inc_votes: 100,
            article_id: 1
        }
        return request(app)
        .patch(`/api/articles/${newVote.article_id}`)
        .send(newVote)
        .expect(200)
        .then((response) =>{
            const {vote} = response.body;
            expect(vote).toBe(200)
        })
    })
    test('PATCH 200: change vote count by decrement for article by article_id', () =>{
        const newVote = {
            inc_votes: -200,
            article_id: 1
        }
        return request(app)
        .patch(`/api/articles/${newVote.article_id}`)
        .send(newVote)
        .expect(200)
        .then((response) =>{
            const {vote} = response.body;
            expect(vote).toBe(-100)
        })
    })
    test('PATCH 404: article_id not found', () => {
        const newVote = {
            inc_votes: 100,
            article_id: 9999
        }
        return request(app)
            .patch(`/api/articles/${newVote.article_id}`)
            .send(newVote)
            .expect(404)
            .then((response) =>{
                expect(response.body.message).toBe('Article not found')
            })
    })
    test('PATCH 400: invalid vote', () => {
        const newVote = {
            inc_votes: 'not a number',
            article_id: 1
        }
        return request(app)
            .patch(`/api/articles/${newVote.article_id}`)
            .send(newVote)
            .expect(400)
            .then((response) =>{
                expect(response.body.message).toBe('Vote must be a number')
            })
    });
    test('PATCH 400: missing article id', () => {
        const newVote = {
            inc_votes: 'not a number'
        }
        return request(app)
            .patch(`/api/articles/${newVote.article_id}`)
            .send(newVote)
            .expect(400)
            .then((response) =>{
                expect(response.body.message).toBe('Missing article ID')
            })
    });
})

describe('DELETE /api/comments/:comment_id', () => {
    test('DELETE 204: deletes a comment from the comment table via the provided comment ID but does not send no body back', () => {
        return request(app)
            .delete('/api/comments/1')
            .expect(204);
    });
    test('DELETE 400: responds with an appropriate status and error message when given a invalid id', () =>{
        return request(app)
        .delete('/api/comments/not-an-id')
        .expect(400)
        .then((response) =>{
            expect(response.body.message).toBe('Comment ID must be a number')
        })
    })
});

describe('GET 200: /api/users', () =>{
    test('GET 200: responds with an array of objects containing all users', () =>{
        return request(app)
        .get('/api/users')
        .expect(200)
        .then(({body}) =>{
            const {users} = body;
            users.forEach((user) =>{
               expect(user).toHaveProperty('username')
               expect(user).toHaveProperty('name')
               expect(user).toHaveProperty('avatar_url') 
            })
            
        })
    })
})