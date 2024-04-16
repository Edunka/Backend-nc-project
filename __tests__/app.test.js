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