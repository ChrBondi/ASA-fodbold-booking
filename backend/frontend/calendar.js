class Calendar {
    constructor() {
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

    previousMonth() {
        this.currentDate.setDate(0);
        this.getDays();
    }

    nextMonth() {
        this.currentDate.setDate(32);
        this.getDays();
    }
}
