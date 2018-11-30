let express = require('express');
const app = express();
const fetch = require('node-fetch');
const hbs = require('hbs');

app.use(express.json());
app.use(express.static(__dirname + '/frontend'));
app.set('view engine', 'hbs');
app.set('views', 'templates');
hbs.registerPartials('templates');

let mongoose = require('mongoose');
mongoose.connect('mongodb://admin:admin123@ds026018.mlab.com:26018/asa_fodbold', {useNewUrlParser: true});

const morgan = require('morgan');
const session = require('express-session');
app.use(morgan('tiny'));
app.use(session({secret: 'secret', saveUninitialized: true, resave: true}));

let bookingSchema = new mongoose.Schema({
    startDate : Date,
    endDate : Date,
    footballField : String,
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

    booking.create({
    startDate : new Date('November 29, 2018 12:00:00'),
    endDate : new Date('November 29, 2018 15:00:00'),
    footballField : "kunst5m1",
    light : true,
    lockerRoom: false,
    renter : "AAAA",
    contatctPerson : "BBBB",
    mail : "aaaa@live.com",
    phone : null,
    price : 200,
    comment : null
});

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
    // render('') henviser til handlebars.
    if (name) {
        response.render('frontpage', {name});
    }
    else {
        response.render('login');
    }
});

app.get('/booking', function(request, response){
    response.render('booking');
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

app.get('/api/bookings/:name', function(request, response) {
    booking.find({footballField: request.params.name})
    .then(result => response.json(result))
});


app.listen(8080);
app.set('views', __dirname + '/templates', "views");

module.exports = app;

console.log('Lytter på port 8080 ...');