let express = require('express');
const app = express();
const fetch = require('node-fetch');
const hbs = require('hbs');

app.use(express.json());
app.use(express.static(__dirname + '/frontend'));
app.set('view engine', 'hbs');
app.set('views', 'frontend');
hbs.registerPartials('frontend');
app.set('views', __dirname + '/frontend', "views");

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
    comment : String
});

let booking = mongoose.model('Bookinger', bookingSchema);

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
        response.render('dashboard', {name});
    }
    else {
        response.redirect('/');
    }
});

app.get('/booking', function(request, response){
    response.render('bookingForm');
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

app.post('/api/bookings', function(request, response) {
    booking.create({
        startDate : request.body.startDate,
        endDate : request.body.endDate,
        footballField : request.body.footballField,
        light : request.body.light,
        lockerRoom : request.body.lockerRoom,
        renter : request.body.renter,
        contactPerson : request.body.contactPerson,
        mail : request.body.mail,
        phone : request.body.phone,
        comment : request.body.comment
    }).then(res => {
        response.json(res);
    })
})


app.listen(8080);

module.exports = app;

console.log('Lytter på port 8080 ...');