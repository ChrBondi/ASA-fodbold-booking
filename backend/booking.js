
class Booking {
    constructor(date, startTime, endTime, footballField, light, lockerRoom, renter, contactPerson, mail, phone, comment) {
        this.date = date;
        this.startDate = startDate;
        this.endDate = endDate;
        this.footballField = footballField;
        this.light = light;
        this.lockerRoom = lockerRoom;
        this.renter = renter;
        this.contactPerson = contactPerson;
        this.mail = mail;
        this.phone = phone;
        this.comment = comment;
    }

    getPrice() {
        return 10;
    }
}

const priceList = { kunst11m: 650, kunst8m: 325, kunst5m: 200, kunst3m: 150, kunstFutsall: 150 };