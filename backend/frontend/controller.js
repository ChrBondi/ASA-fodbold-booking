let compiledBookingPerDate;

onload = async () => {
    const template = await fetch('/bookingPerDate.hbs');
    const templateText = await template.text();
    compiledBookingPerDate = Handlebars.compile(templateText);
    console.log(compiledBookingPerDate);

    // const name = document.querySelector('#name');
    // const password = document.querySelector('#password');
    // const button = document.querySelector('#button');
    // const error = document.querySelector('#error');
    //
    // button.onclick = async () => {
    //     const data = {name: name.value, password: password.value};
    //     const result = await fetch("/login", {
    //         method: "POST",
    //         body: JSON.stringify(data),
    //         headers: {'Content-Type': 'application/json'}
    //     });
    //     const answer = await result.json();
    //     if (answer.ok)
    //         window.location.href = "/session";
    //     else {
    //         error.innerHTML = "Login fejl!";
    //     }
    // }
};

function login() {
    const name = document.querySelector('#name');
    const password = document.querySelector('#password');
    const button = document.querySelector('#button');
    const error = document.querySelector('#error');

    button.onclick = async () => {
        const data = {name: name.value, password: password.value};
        const result = await fetch("/login", {
            method: "POST",
            body: JSON.stringify(data),
            headers: {'Content-Type': 'application/json'}
        });
        const answer = await result.json();
        if (answer.ok)
            window.location.href = "/session";
        else {
            error.innerHTML = "Login fejl!";
        }
    }
};

function getBookings(bane){
    const date1 = new Date('November 28, 2018 12:00:00');
    const date2 = new Date('November 30, 2018 12:00:00');

    fetch('/api/bookings/' + bane)
        .then(res => res.json())
        .then(async (bookings) => {
            console.log(bookings);
            console.log(compiledBookingPerDate({bookings}));
            document.querySelector('#bookings').innerHTML = compiledBookingPerDate({bookings});
        })
}

function createBooking() {
    let data = {
        startDate : document.getElementById("startDate").value,
        endDate : document.getElementById("endDate").value,
        footballField : document.getElementById("footballField").value,
        light : document.getElementById("light").checked,
        lockerRoom : document.getElementById("lockerroom").checked,
        renter : document.getElementById("renter").value,
        contactPerson : document.getElementById("contactPerson").value,
        mail : document.getElementById("mail").value,
        phone : document.getElementById("phone").value,
        comment : document.getElementById("comment").value 
    };

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
}