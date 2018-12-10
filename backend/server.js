let express = require('express');
const app = express();
const fetch = require('node-fetch');
const hbs = require('hbs');

app.use(express.json());
app.use(express.static(__dirname + '/frontend'));
app.set('view engine', 'hbs');
app.set('views', __dirname + '/frontend', "views");
//app.set('views', 'frontend');
hbs.registerPartials('frontend/templates');

let mongoose = require('mongoose');
mongoose.connect('mongodb://admin:admin123@ds026018.mlab.com:26018/asa_fodbold', { useNewUrlParser: true });

const morgan = require('morgan');
const session = require('express-session');
app.use(morgan('tiny'));
app.use(session({ secret: 'secret', saveUninitialized: true, resave: true }));

let bookingSchema = new mongoose.Schema({
    startDate: Date,
    endDate: Date,
    footballField: String,
    light: Boolean,
    lockerRoom: Boolean,
    renter: String,
    contactPerson: String,
    mail: String,
    phone: String,
    comment: String
});

let booking = mongoose.model('Bookinger', bookingSchema);

app.post('/login', function (request, response) {
    const { name, password } = request.body;
    if (name === 'asaaph' && password === 'asafodbold') {
        request.session.name = name;
        response.send({ ok: true });
    } else {
        response.send({ ok: false });
    }
});

const options = ['kunst3m1', 'kunst3m2', 'kunst3m3', 'kunst3m4',
    'kunst5m1', 'kunst5m2', 'kunst8m1', 'kunst8m2', 'kunst11m1', 'futsal'];

/*
dateformat i param: '1995-12-17T00:00:00'
 */
app.get('/api/bookingsCalender/:date', function (request, response) {
    const start = new Date(request.params.date);
    const end = new Date(start);
    end.setHours(23);

    booking.find().where({ startDate: { $gte: start, $lt: end } })
        .then(result => {
            let object = {};
            options.forEach(option => {
                object[option] = [];

            });
            result.forEach(booking => {
                object[booking.footballField].push(booking);
            });
            response.json(object);
        })
});

app.get('/session', function (request, response) {
    const name = request.session.name;
    // render('') henviser til handlebars.
    if (name) {
        response.render('dashboard', { options });
    }
    else {
        response.redirect('/');
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

app.get('/api/bookings/:name', function (request, response) {
    booking.find({ footballField: request.params.name }).sort([['startDate', 1]])
        .then(result => response.json(result))
});

app.post('/api/bookings', async function (request, response) {
    const name = request.session.name;
    if (name) {
    let unavailable = true;
    const startDate = new Date(request.body.startDate);
    const endDate = new Date(request.body.endDate)
    if (request.body.footballField === "kunst8m1" || request.body.footballField === "kunst8m2") {
        const bookings = await booking.find().or([{ footballField: "kunst11m1" }, { footballField: request.body.footballField }])
        unavailable = checkBookings(startDate, endDate, bookings);
    } else if (request.body.footballField === "kunst11m1") {
        const bookings = await booking.find().or([{ footballField: "kunst8m1" }, { footballField: "kunst8m2" }, { footballField: request.body.footballField }])
        unavailable = checkBookings(startDate, endDate, bookings);
    } else {
        const bookings = await booking.find({ footballField: request.body.footballField })
        unavailable = checkBookings(startDate, endDate, bookings);
    }
    if (!unavailable) {
        booking.create({
            startDate: request.body.startDate,
            endDate: request.body.endDate,
            footballField: request.body.footballField,
            light: request.body.light,
            lockerRoom: request.body.lockerRoom,
            renter: request.body.renter,
            contactPerson: request.body.contactPerson,
            mail: request.body.mail,
            phone: request.body.phone,
            comment: request.body.comment
        }).then(res => {
            response.json({succes : true, message: "Booking oprettet"});
        })
    } else {
        response.json({succes: false, message: "Tid er taget"});
    }
}  else {
    response.json({message : "Lorte spambot"})
}

})

app.delete('/api/bookings/:id', function (request, response) {
    booking.findOneAndDelete({
        _id: request.params.id
    }).exec()
        .then(v => response.json(v));
});

app.listen(process.env.PORT || 8080);

function isTimeUnavailable(startDate, endDate, bstartDate, bendDate) {
    return ((startDate.getTime() >= bstartDate.getTime() && startDate.getTime() < bendDate.getTime())
        || (endDate.getTime() < bstartDate.getTime() && endDate.getTime() >= bendDate.getTime())
        || (startDate.getTime() <= bstartDate.getTime() && endDate.getTime() >= bendDate.getTime()))
}

function checkBookings(startDate, endDate, bookings) {
    return bookings.some(b => {
        return isTimeUnavailable(startDate, endDate, b.startDate, b.endDate);
    })
}

module.exports = app;
