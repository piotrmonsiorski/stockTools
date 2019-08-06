// @koala-prepend "functions.js"
// @koala-prepend "classes.js"
// @koala-prepend "charts.js"

// @koala-append "buttons.js"

const currentDateObj = new CurrentDate();
const todayObj = currentDateObj.makeDate(0, 0, 0);
const lastWeekObj = currentDateObj.makeDate(0, 0, -7);
const lastMonthObj = currentDateObj.makeDate(0, -1, 0);
const lastYearObj = currentDateObj.makeDate(-1, 0, 0);

let apiInitStartDate = `${lastMonthObj.year}-${lastMonthObj.month}-${lastMonthObj.day}`;
let apiInitEndDate = `${currentDateObj.year}-${currentDateObj.month}-${currentDateObj.day}`;

// console.log(currentDate)
let goldDataset = [];
initCharts();
