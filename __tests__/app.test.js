const request = require('supertest')
const app = require('../app')
const db = require('../db/connection')
const data = require('../db/data/test-data/index')
const seed = require('../db/seeds/seed')

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
            console.log(body)
            const { topics } = body;
            console.log(topics)
            expect(topics.length).toBe(3);
                topics.forEach((topic) =>{
                expect(topic).toHaveProperty('slug');
                expect(topic).toHaveProperty('description');
                })
            }
        )
    })
})


