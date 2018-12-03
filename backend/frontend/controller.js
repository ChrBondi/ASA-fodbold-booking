let compiledBookingPerDate;

onload = async () => {
    const template = await fetch('/bookingPerDate.hbs');
    const templateText = await template.text();
    compiledBookingPerDate = Handlebars.compile(templateText);
    console.log(compiledBookingPerDate);

    const button = document.querySelector('#button');
    if (button) {
        button.onclick = login;
    }
};

async function login() {
    const name = document.querySelector('#name');
    const password = document.querySelector('#password');
    const error = document.querySelector('#error');
    const data = { name: name.value, password: password.value };

    const result = await fetch("/login", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' }
    });
    const answer = await result.json();
    if (answer.ok)
        window.location.href = "/session";
    else {
        error.innerHTML = "Login fejl!";
    }
};

function getBookings(bane) {
    const date1 = new Date('November 28, 2018 12:00:00');
    const date2 = new Date('November 30, 2018 12:00:00');

    fetch('/api/bookings/' + bane)
        .then(res => res.json())
        .then(async (bookings) => {
            console.log(bookings);
            console.log(compiledBookingPerDate({ bookings }));
            document.querySelector('#bookings').innerHTML = compiledBookingPerDate({ bookings });
        })
}

function createBooking() {

    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;
    const footballField = document.getElementById("footballField").value;
    const light = document.getElementById("light").checked;
    const lockerRoom = document.getElementById("lockerroom").checked;
    const renter = document.getElementById("renter").value;
    const contactPerson = document.getElementById("contactPerson").value;
    const mail = document.getElementById("mail").value;
    const phone = document.getElementById("phone").value;
    const comment = document.getElementById("comment").value;

    if (startDate != "" && endDate != "" && footballField != "" && renter != "" && contactPerson != "" && (mail != "" || phone != "")) {
        const data = {
            startDate : startDate,
            endDate : endDate,
            footballField : footballField,
            light : light,
            lockerRoom : lockerRoom,
            renter : renter,
            contactPerson : contactPerson,
            mail : mail,
            phone : phone,
            comment : comment
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
        console.log("fejl: påkrævende felter mangler");
    }
}