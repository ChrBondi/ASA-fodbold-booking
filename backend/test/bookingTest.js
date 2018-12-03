
const Booking = require('../booking');
const request = require('supertest');

const should = require('should');

let booking = new Booking("19:00","20:15","kunst11m",true,false,"Fede Fredes Fodboldklub", "Freddy G", "FredeFup@fredemail.frede", "12344321", "Ingen kommentar")
describe('booking-test', function () {
    it("price-test", function () {
        booking.price.should.be.equal(1000);
    })});

