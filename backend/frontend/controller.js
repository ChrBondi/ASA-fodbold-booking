const calendar = new Calendar();
let bookingsList;

onload = async () => {

    const button = document.querySelector('#button');
    if (button) {
        button.onclick = login;
    }

    loadCalendar();

    Handlebars.registerHelper('formatBooking', booking => {
        let start = new Date(booking.startDate);
        let end = new Date(booking.endDate);
        return `Lejer: ${booking.renter}
        Klokken: ${start.getHours()}:${start.getMinutes()} - ${end.getHours()}:${end.getMinutes()}`;
    });

    Handlebars.registerHelper('formatDate', date => {
        return `${date.getFullYear()}`;
    });

    Handlebars.registerHelper('formatMonth', date => {
        let locale = "da-DK";
        return date.toLocaleString(locale, {
            month: "long"
        });
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

function prevMonth() {
    calendar.previousMonth();
    refreshCalendarTemplate(calendar.days, null, calendar.currentDate, null);
}

function nextMonth() {
    calendar.nextMonth();
    refreshCalendarTemplate(calendar.days, null, calendar.currentDate, null);
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
    if (answer.ok) {
        window.location.href = "/session";
    }
    else {
        error.innerHTML = "Login fejl!";
    }

}

function logout() {
    window.location.href = '/logout';
}

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

async function loadCalendar() {
    const template = await fetch('/calendar.hbs');
    const templateText = await template.text();
    compiledCalendar = Handlebars.compile(templateText);
    refreshCalendarTemplate(calendar.days, null, calendar.currentDate, null);
}

async function bookingThisDay(day) {
    const temp = day;
    const currentDate = calendar.currentDate;
    if (day.toString().length < 2) day = '0' + day;

    let currentMonth = currentDate.getMonth() + 1;
    if(currentMonth.toString().length < 2) currentMonth = '0'+ currentMonth;

    const bookings = await fetch(`/api/bookingsCalender/${currentDate.getFullYear()}-${currentMonth}-${day}T00:00:00`);
    console.log(bookings);
    const fields = await bookings.json();

    refreshCalendarTemplate(calendar.days, fields, currentDate, temp);
}


function refreshCalendarTemplate(days, fields, currentDay, day) {
    document.getElementById('calendar').innerHTML = compiledCalendar({
        currentDay, fields, days
    });

    if (day !== null) {
        const temp = Array.from(document.querySelectorAll('.day'));
        temp.find(i => i.innerHTML == day).className += " active";
    }
}

async function createBooking() {
    const date = document.getElementById("date").value;
    const date2 = document.getElementById("date2").value;
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

    if (date !== "" && startTime !== "" && endTime !== "" && footballField !== "" && renter !== "" && contactPerson !== "" && (mail !== "" || phone !== "")) {
        const timeReqex = /^([01]\d|2[0-3]):?([0-5]\d)$/;
        const dateReqex = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/;
        if (timeReqex.test(startTime) && timeReqex.test(endTime) && dateReqex.test(date)) {
            const s = date.split("-");
            const ss = date2.split("-");
            const st = startTime.split(":");
            const et = endTime.split(":");
            let startDate = new Date();
            startDate.setFullYear(s[2], s[1] - 1, s[0]);
            startDate.setHours(st[0], st[1], 0, 0);
            let endDate = new Date();
            endDate.setFullYear(s[2], s[1] - 1, s[0]);
            endDate.setHours(et[0], et[1], 0, 0);
            let data = {
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
            if (date === date2) {
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
                const daysBetween = Math.round(Math.abs((new Date(s[2], s[1] - 1, s[0]).getTime() - new Date(ss[2], ss[1] - 1, ss[0]).getTime()) / (86400000)));
                for (let i = 0; i <= daysBetween; i = i + 7) {
                    const res = await fetch('/api/bookings', {
                        method: "POST",
                        body: JSON.stringify(data),
                        headers: {
                            "Content-Type": 'application/json'
                        }
                    })
                    data.startDate.setDate(data.startDate.getDate() + 7);
                    data.endDate.setDate(data.endDate.getDate() + 7);
                    console.log(data);
                }
            }
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
    document.getElementById("datoInf").innerHTML =(startDate.getDate()) + "-" + (startDate.getMonth() + 1);
    document.getElementById("startTimeInf").innerHTML = startDate.getHours() + ":" + startDate.getMinutes();
    document.getElementById("endTimeInf").innerHTML = endDate.getHours() + ":" + endDate.getMinutes();
    document.getElementById("renterInf").innerHTML = booking.renter;
    document.getElementById("contactPersonInf").innerHTML = booking.contactPerson;
    document.getElementById("mailInf").innerHTML = booking.mail;
    document.getElementById("phoneInf").innerHTML = booking.phone;
    document.getElementById("commentsInf").innerHTML = booking.comment;
    let lightS;
    if (booking.light)
        lightS = "Ja"
    else
        lightS = "Nej"

    document.getElementById("lightInf").innerHTML = lightS;
    let lockerRoomS;
    if (booking.lockerRoom)
        lockerRoomS = "Ja"
    else
        lockerRoomS = "Nej"

    document.getElementById("lockerRoomInf").innerHTML = lockerRoomS;

    const btn = document.getElementById("deleteBtn");
    btn.onclick = function () {
        deleteBooking(id)
    };
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
                document.getElementById("datoInf").innerHTML = "";
            document.getElementById("startTimeInf").innerHTML = "";
            document.getElementById("endTimeInf").innerHTML = "";
            document.getElementById("renterInf").innerHTML = "";
            document.getElementById("contactPersonInf").innerHTML = "";
            document.getElementById("mailInf").innerHTML = "";
            document.getElementById("phoneInf").innerHTML = "";
            document.getElementById("commentsInf").innerHTML = "";
            document.getElementById("lightInf").innerHTML = "";
            document.getElementById("lockerRoomInf").innerHTML = "";
            const p = document.getElementById(id);
            p.parentNode.removeChild(p);
            return resultat.json();
        })
        .catch(fejl => console.log('Fejl: ' + fejl));
}

function copyText () {
    document.getElementById("date2").value = document.getElementById("date").value;
}

