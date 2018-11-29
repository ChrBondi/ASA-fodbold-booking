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
       //TODO session name mangler
       const res = await request(app)
           .get('/session')
           .expect(200)
           .expect('Content-Type', /html/);

       assert.equal(res.text.includes('Velkommen'), true);
   });

    it("get('/session') test", async  function () {
        const res = await request (app)
            .get('/session')
            .expect(200)
            .expect('Content-Type', /html/);

        /* Tester om det html (hbs-fil der er renderet) der bliver modtaget hos klienten indeholder
         * substring('Ingen'). Det er for at tjekke, at det er 'login.hbs' filen som bliver renderet.
         * Optimalt ville vi tjekke om det er den rigtige fil der bliver brugt. */

        assert.equal(res.text.includes('Ingen'), true);
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