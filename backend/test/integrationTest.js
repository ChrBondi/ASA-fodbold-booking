const app = require('../server.js');
const request = require('supertest');

let chai = require('chai');
let chaiHttp = require('chai-http');
let assert = chai.assert;

describe('integration test - async', function () {
   it("get('/') test", async  function () {
       await request(app)
           .get('/')
           .expect(200)
           .expect('Content-Type', /html/);
   });

   it("get('/session') test", async  function () {
       const res = await request (app)
           .get('/session')
           .expect(200)
           .expect('Content-Type', /html/);
   });

    it("get('/session') test", async  function () {
        const name = 'nn';
        const res = await request (app)
            .get('/session')
            .expect(200)
            .expect('Content-Type', /html/);
        assert.isNotNull(res.text.includes('Ingen'));
    });

   it("post(/login) korrekt login - test", async function (){
       const res = await request(app)
           .post('/login')
           .send({name: 'nn', password: 'pp'})
           .expect(200)
           .expect('Content-Type', /json/);

       assert.equal(res.body.ok, true);

   });

    it("post(/login) forkert login - test", async function () {
        const res = await request(app)
            .post('/login')
            .send({name: 'pp', password: 'nn'})
            .expect(200)
            .expect('Content-Type', /json/);
        assert.equal(res.body.ok, false);
    });

});