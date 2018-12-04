
const Booking = require('../booking');
const request = require('supertest');

const should = require('should');

let bookingTest1 = new Booking("19:00","20:15","kunst11m",true,true,"Fede Fredes Fodboldklub", "Freddy G", "FredeFup@fredemail.frede", "12344321", "Ingen kommentar")
describe('booking-test', function () {
    it("price-test1", function () {
        booking.price.should.be.equal(1000); //De andre tests skal have ændret sine prices
    })});

let bookingTest2 = new Booking("01:00","00:00","kunst11m",true,false,"Fede Fredes Fodboldklub", "Freddy G", "FredeFup@fredemail.frede", "12344321", "Ingen kommentar")
describe('booking-test', function () {
    it("price-test2", function () {
        booking.price.should.be.equal(1000);
    })});

let bookingTest3 = new Booking("09:00","23:59","kunst11m",false,false,"Fede Fredes Fodboldklub", "Freddy G", "FredeFup@fredemail.frede", "12344321", "Ingen kommentar")
describe('booking-test', function () {
    it("price-test3", function () {
        booking.price.should.be.equal(1000);
    })});

let bookingTest4 = new Booking("15:00","14:00","kunst11m",true,false,"Fede Fredes Fodboldklub", "Freddy G", "FredeFup@fredemail.frede", "12344321", "Ingen kommentar")
describe('booking-test', function () {
    it("price-test4", function () {
        booking.price.should.be.equal(1000);
    })});

