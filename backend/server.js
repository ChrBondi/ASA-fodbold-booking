let express = require('express');
const app = express();
const fetch = require('node-fetch');
const hbs = require('hbs');

app.use(express.json());
app.use(express.static(__dirname + '/frontend'));
app.set('view engine', 'hbs');
app.set('views', 'templates');

let mongoose = require('mongoose');
mongoose.connect('mongodb://admin:admin123@ds026018.mlab.com:26018/asa_fodbold', {useNewUrlParser: true});

const morgan = require('morgan');
const session = require('express-session');
app.use(morgan('tiny'));
app.use(session({secret: 'hemmelig', saveUninitialized: true, resave: true}));

let bookingSchema = new mongoose.Schema({
    date : String,
    footballField : String,
    startTime : String,
    endTime : String,
    light : Boolean,
    lockerRoom : Boolean,
    renter : String,
    contatctPerson : String,
    mail : String,
    phone: String,
    price : Number,
    comment : String
});

let booking = mongoose.model('Bookinger', bookingSchema);

/* booking.create({
    date : "29-11-2018",
    footballField : "kunst5m1",
    startTime : "15:00",
    endTime : "17:00",
    light : true,
    lockerRoom: false,
    renter : "AAAA",
    contatctPerson : "BBBB",
    mail : "aaaa@live.com",
    phone : null,
    price : 200,
    comment : null
})

booking.create({
    date : "29-11-2018",
    footballField : "kunst5m1",
    startTime : "13:00",
    endTime : "15:00",
    light : true,
    lockerRoom: false,
    renter : "CCCC",
    contatctPerson : "DDDD",
    mail : "CCCC@live.com",
    phone : null,
    price : 200,
    comment : null
})

booking.create({
    date : "29-11-2018",
    footballField : "kunst5m2",
    startTime : "17:00",
    endTime : "19:00",
    light : true,
    lockerRoom: false,
    renter : "EEEE",
    contatctPerson : "FFFF",
    mail : "EEEE@live.com",
    phone : null,
    price : 200,
    comment : null
}) */

app.post('/login', function (request, response) {
    const {name, password} = request.body;
    if (name === 'nn' && password === 'pp') {
        request.session.name = name;
        response.send({ok: true});
    } else {
        response.send({ok: false});
    }
});

app.get('/session', function (request, response) {
    const name = request.session.name;
    // render('') henviser til handlebars. TODO handlebars eller html til render
    if (name) {
        response.render('session', {name});
    }
    else {
        response.render('login');
    }
});

app.get('/logout', function (request, response) {
    request.session.destroy(function (err) {
        if (err) {
            console.log(err);
        }
        else {
            response.redirect('/');
        }
    });
});


app.listen(8080);
app.set('views', __dirname + '/templates', "views");

module.exports = app;

console.log('Lytter på port 8080 ...');