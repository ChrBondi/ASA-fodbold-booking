const app = require('../server.js');
const request = require('supertest');

describe('integration test - async', function () {
   it("get('/') test", async  function () {
       await request(app)
           .get('/')
           .expect(200)
           .expect('Content-Type', /html/);
   });

   it("get('/session') test", async  function () {
       await request (app)
           .get('/session')
           .expect(200)
           .expect('Content-Type', /html/);
   })
});