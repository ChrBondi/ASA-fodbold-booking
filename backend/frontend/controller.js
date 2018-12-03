let compiledDashboard;
const footballFields = ['kunst3m1', 'kunst3m2', 'kunst3m3', 'kunst3m4',
                        'kunst5m1', 'kunst5m2', 'kunst8m1', 'kunst8m2', 'kunst11m1', 'futsal'];
onload = async () => {
    const template = await fetch('/dashboard.hbs');
    const templateText = await template.text();
    compiledDashboard = Handlebars.compile(templateText);

    const button = document.querySelector('#button');
    if (button) {
        button.onclick = login;
    }
};

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
            console.log(booking);
            const template = await fetch('/bookingPerDate.hbs');
            const templateText = await template.text();
            compiledBookings = Handlebars.compile(templateText);
            document.querySelector('#bookings').innerHTML = compiledBookings({
                booking
            });
        })
}

function createBooking() {
    const date = document.getElementById("date").value;
    const startTime = document.getElementById("startDate").value;
    const endTime = document.getElementById("endDate").value;
    const footballField = document.getElementById("footballField").value;
    const light = document.getElementById("light").checked;
    const lockerRoom = document.getElementById("lockerroom").checked;
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
            const startDate = new Date(s[2] + "-" + s[1] + "-" + s[0] + "T" + startTime + ":00");
            const endDate = new Date(s[2] + "-" + s[1] + "-" + s[0] + "T" + endTime + ":00");
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
