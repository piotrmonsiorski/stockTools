class CurrentDate {
  constructor() {
    const date = new Date();
    this.day = date.getDate().toString().padStart(2,0);
    this.month = (date.getMonth()+1).toString().padStart(2,0);
    this.year = date.getFullYear().toString().padStart(4,0);
  }

  makeDate(addYear, addMonth, addDay) {
    let day = Number(this.day) + addDay;
    let month = Number(this.month) + addMonth - 1;
    let year = Number(this.year) + addYear;

    // let date = new Date(`${year}-${month}-${day}`);
    let date = new Date;
    date.setYear(year);
    date.setMonth(month);
    date.setDate(day);

    day = date.getDate();
    month = date.getMonth()+1;
    year = date.getFullYear();
    return {
      'day': day,
      'month': month,
      'year': year
    }
  }
}
