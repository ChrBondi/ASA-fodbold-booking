const express = require('express');
const morgan = require('morgan');
const hbs = require('hbs');
const session = require('express-session');
const app = express();

app.use(express.json());
app.use(morgan('tiny'));
app.use(express.static('filer'));
app.set('view engine', 'hbs');
app.set('views', 'templates');
app.use(session({secret: 'hemmelig', saveUninitialized: true, resave: true}));

app.post('/login', function (request, response) {
    const {navn, password} = request.body;
    if (navn === 'nn' && password === 'pp') {
        request.session.navn = navn;
        response.send({ok: true});
    } else {
        response.send({ok: false});
    }
});

app.get('/session', function (request, response) {
    const navn = request.session.navn;
    if (navn) {
        response.render('session', {navn});
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

console.log('Lytter på port 8080 ...');
