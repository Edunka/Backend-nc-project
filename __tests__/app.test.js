const request = require('supertest')
const app = require('../app')
const db = require('../db/connection')
const data = require('../db/data/test-data/index')
const seed = require('../db/seeds/seed')
const fs = require('fs')

afterAll(() => {
    db.end();
});
  
  
beforeEach(() => {
    return seed(data);
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
            });
    
    });
    test('GET:404 sends an appropriate status and error message when given a valid but non-existent id', () => {
        return request(app)
          .post('/api/articles/999/comments')
          .expect(400)
          .then((response) => {
            expect(response.body.message).toBe('Bad request');
          });
      });
    
});
