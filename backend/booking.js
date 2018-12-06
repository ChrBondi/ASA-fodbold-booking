class Booking {
    constructor(startTime, endTime, footballField, light, lockerRoom, renter, contactPerson, mail, phone, comment) {
        this.startTime = startTime;
        this.endTime = endTime;
        this.footballField = footballField;
        this.light = light;
        this.lockerRoom = lockerRoom;
        this.renter = renter;
        this.contactPerson = contactPerson;
        this.mail = mail;
        this.phone = phone;
        this.comment = comment;
    }

    get price(){
        let hours = (this.endTime.getTime()-this.startTime.getTime()) / 1000 / 60 / 60;
        const lightsPrice = 150; 
        const elevenPrice = 650;
        const restPrice = 325;
        let totalPrice = 0;
        if (this.footballField === "kunst11m1") {
            totalPrice += elevenPrice;
        } else {
            totalPrice += restPrice;
        }
        if (light) {
            totalPrice += lightsPrice;
        }
        totalPrice *= hours;
        return totalPrice;
    }

}

