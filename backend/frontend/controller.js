let compiledBookingPerDate;

onload = async () => {
    const template = await fetch('/bookingPerDate.hbs');
    const templateText = await template.text();
    compiledBookingPerDate = Handlebars.compile(templateText);
    console.log(compiledBookingPerDate);
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