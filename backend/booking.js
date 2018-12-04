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
        let hours = (this.startTime.getTime()-this.endTime.getTime()) / 1000 / 60 / 60;
        let lightsPrice = 100;
        for(let i = 0; i < priceList.size; i++) {
            if(priceList[this.footballField]) {
                let price = priceList[this.footballField];
                if(this.light === true) {
                    lightsPrice = lightsPrice * hours;
                    price = (price * hours) + lightsPrice;
                } else {
                    price = price * hours
                }
            }
        }

    }

}

const priceList = { kunst11m: 650, kunst8m: 325, kunst5m: 200, kunst3m: 150, kunstFutsall: 150 };



