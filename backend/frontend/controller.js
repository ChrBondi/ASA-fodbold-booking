class Calendar {
    constructor(){
        this.currentDate = new Date();
        this.days = this.getDays();
    }

    getDays() {
        let days = [];

        let tempDate = new Date(this.currentDate);
        tempDate.setDate(1);
        let weekDay = tempDate.getDay() - 1;
        if (weekDay < 0) {
            weekDay = 6;
        }

        for (let i = 0; i < weekDay; i++) {
            days.push(" ");
        }

        const daysInM = this.daysInMonth(this.currentDate.getMonth() + 1, this.currentDate.getFullYear());
        for (let i = 1; i <= daysInM; i++) {
            days.push(`${i}`);
        }

        this.days = days;
        return days;
    }

    daysInMonth(month, year) {
        return new Date(year, month, 0).getDate();
    }

    previousMonth(){
        this.currentDate.setDate(0);
        this.getDays();
    }

    nextMonth(){
        this.currentDate.setDate(32);
        this.getDays();
    }
}

const calendar = new Calendar();
let compiledDashboard;
let bookingsList;

onload = async () => {
    //const template = await fetch('/dashboard.hbs');
    //const templateText = await template.text();
    //compiledDashboard = Handlebars.compile(templateText);

    const button = document.querySelector('#button');
    if (button) {
        button.onclick = login;
    }

    Handlebars.registerHelper('formatBooking', booking => {
        return `${booking.startDate}`;
    });
};

Handlebars.registerHelper('bookingDate1', date => {
    startDate = new Date(date);
    return "Dato: " + startDate.getDate() + "-" + (startDate.getMonth() + 1) + "      kl: " + startDate.getHours() + ":" + startDate.getMinutes() + "-";
});

Handlebars.registerHelper('bookingDate2', date => {
    endDate = new Date(date);
    return endDate.getHours() + ":" + endDate.getMinutes();
});

function prevMonth(){
    calendar.previousMonth();
    refreshCalendarTemplate(calendar.days);
}

function nextMonth(){
    calendar.nextMonth();
    refreshCalendarTemplate(calendar.days);
}

async function login() {
    const name = document.querySelector('#name');
    const password = document.querySelector('#password');
    const error = document.querySelector('#error');
    const data = {
        name: name.value,
        password: password.value
    };

    const result = await fetch("/login", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const answer = await result.json();
    if (answer.ok)
        window.location.href = "/session";
    else {
        error.innerHTML = "Login fejl!";
    }
};

function getBookings(bane) {
    fetch('/api/bookings/' + bane)
        .then(res => res.json())
        .then(async (booking) => {
            bookingsList = booking;
            console.log(booking);
            const template = await fetch('/bookingPerDate.hbs');
            const templateText = await template.text();
            const compiledBookings = Handlebars.compile(templateText);
            document.querySelector('#bookings').innerHTML = compiledBookings({
                booking
            });
        });
}
let compiledCalendar;
let days;
async function loadCalendar() {
    const template = await fetch('/calendar.hbs');
    const templateText = await template.text();
    compiledCalendar = Handlebars.compile(templateText);
    refreshCalendarTemplate(calendar.days);
}

async function bookingThisDay(day) {
    const month = document.body.querySelector('#month').value;
    const year = document.body.querySelector('#year').innerHTML;
    console.log()
    console.log(day + " " + day.length + " " + typeof day);

    if (day.toString().length < 2) day = '0' + day;
    console.log(day + " " + day.length);

    const bookings = await fetch(`/api/bookingsCalender/${year}-${month}-${day}T00:00:00`);
    console.log(bookings);
    const fields = await bookings.json();
    document.getElementById('calendar').innerHTML = compiledCalendar({
        fields, days
    });
    console.log(day);
}

function createBooking() {
    const date = document.getElementById("date").value;
    const startTime = document.getElementById("startDate").value;
    const endTime = document.getElementById("endDate").value;
    const footballField = document.getElementById("footballField").value;
    const light = document.getElementById("light").checked;
    const lockerRoom = document.getElementById("lockerRoom").checked;
    const renter = document.getElementById("renter").value;
    const contactPerson = document.getElementById("contactPerson").value;
    const mail = document.getElementById("mail").value;
    const phone = document.getElementById("phone").value;
    const comment = document.getElementById("comment").value;

    if (date != "" && startTime != "" && endTime != "" && footballField != "" && renter != "" && contactPerson != "" && (mail != "" || phone != "")) {
        const timeReqex = /^([01]\d|2[0-3]):?([0-5]\d)$/
        const dateReqex = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/;
        if (timeReqex.test(startTime) && timeReqex.test(endTime) && dateReqex.test(date)) {
            const s = date.split("-");
            const st = startTime.split(":")
            const et = endTime.split(":");
            const startDate = new Date();
            startDate.setFullYear(s[2], s[1] - 1, s[0]);
            startDate.setHours(st[0], st[1], 0, 0);
            const endDate = new Date();
            endDate.setFullYear(s[2], s[1] - 1, s[0]);
            endDate.setHours(et[0], et[1], 0, 0);
            const data = {
                startDate: startDate,
                endDate: endDate,
                footballField: footballField,
                light: light,
                lockerRoom: lockerRoom,
                renter: renter,
                contactPerson: contactPerson,
                mail: mail,
                phone: phone,
                comment: comment
            }

            fetch('/api/bookings', {
                method: "POST",
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": 'application/json'
                }
            })
                .then(resultat => {
                    if (resultat.status >= 400)
                        throw new Error(resultat.status);
                    else {
                        return resultat.json();
                    }
                })
        } else {
            console.log("fejl ikke tid")
        }
    } else {
        console.log("fejl: påkrævende felter mangler");
    }
}

function toggleBookingForm() {
    const form = document.getElementById('booking-form');
    if (form.style.display === 'none')
        form.style.display = 'grid';
    else
        form.style.display = 'none';
}

function information(id) {
    const booking = bookingsList.find(book => book._id === id);
    const startDate = new Date(booking.startDate);
    const endDate = new Date(booking.endDate);
    document.getElementById("datoInf").innerHTML = "Dato: " + (startDate.getDate()) + "-" + (startDate.getMonth() + 1);
    document.getElementById("startTimeInf").innerHTML = "Start tid: " + startDate.getHours() + ":" + startDate.getMinutes();
    document.getElementById("endTimeInf").innerHTML = "Slut tid: " + endDate.getHours() + ":" + endDate.getMinutes();
    document.getElementById("renterInf").innerHTML = "Lejer: " + booking.renter;
    document.getElementById("contactPersonInf").innerHTML = "Kontaktperson: " + booking.contactPerson;
    document.getElementById("mailInf").innerHTML = "Mail: " + booking.mail;
    document.getElementById("phoneInf").innerHTML = "Tlf: " + booking.phone;
    document.getElementById("commentsInf").innerHTML = "Bemærkninger: " + booking.comment;
    let lightS;
    if (booking.light)
        lightS = "Ja"
    else
        lightS = "Nej"

    document.getElementById("lightInf").innerHTML = "Lys: " + lightS;
    let lockerRoomS;
    if (booking.lockerRoom)
        lockerRoomS = "Ja"
    else
        lockerRoomS = "Nej"

    document.getElementById("lockerRoomInf").innerHTML = "Omkl: " + lockerRoomS;

    const btn = document.getElementById("deleteBtn");
    btn.onclick = function () { deleteBooking(id) };
}

function deleteBooking(id) {
    fetch('api/bookings/' + id, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(resultat => {
            if (resultat.status >= 400)
                throw new Error(resultat.status);
            else
                document.getElementById("datoInf").innerHTML = "Dato:";
                document.getElementById("startTimeInf").innerHTML = "Start tid:";
                document.getElementById("endTimeInf").innerHTML = "Slut tid:";
                document.getElementById("renterInf").innerHTML = "Lejer:";
                document.getElementById("contactPersonInf").innerHTML = "Kontaktperson:";
                document.getElementById("mailInf").innerHTML = "Mail:";
                document.getElementById("phoneInf").innerHTML = "Tlf:";
                document.getElementById("commentsInf").innerHTML = "Bemærkninger:";
                document.getElementById("lightInf").innerHTML = "Lys:";
                document.getElementById("lockerRoomInf").innerHTML = "Omkl:" ;
                const p = document.getElementById(id);
                p.parentNode.removeChild(p);
                return resultat.json();
        })
        .catch(fejl => console.log('Fejl: ' + fejl));
};
function refreshCalendarTemplate(days){
    document.getElementById('calendar').innerHTML = compiledCalendar({
        days
    });
}

