class ChartData {
  constructor(type, color, dataset) {
    this.type = type;
    this.color = color;
    this.dataset = dataset;
  }
  getColor() {
    let color = this.color;

    switch(color) {
      case 'red':
        color = '#bc1d28'; break;
      case 'blue':
        color = '#394fb2'; break;
      case 'violet':
        color = '#8a20c0'; break;
      case 'green':
        color = '#1f821b'; break;
      case 'orange':
        color = '#e08e19'; break;
      case 'grey':
        color = '#6b6b6b'; break;
      case 'black':
      default:
        color = '#22222'; break;
    }

    return color;
  }
}

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
