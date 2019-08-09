// @koala-prepend "functions.js"
// @koala-prepend "classes.js"
// @koala-prepend "charts.js"

// @koala-append "buttons.js"

const currentDateObj = new CurrentDate();
const todayObj = currentDateObj.makeDate(0, 0, 0);
const lastWeekObj = currentDateObj.makeDate(0, 0, -7);
const lastMonthObj = currentDateObj.makeDate(0, -1, 0);
const lastYearObj = currentDateObj.makeDate(-1, 0, 0);

const startDate = lastYearObj;
const endDate = currentDateObj;

let apiStartDate = `${startDate.year}-${startDate.month}-${startDate.day}`;
let apiEndDate = `${endDate.year}-${endDate.month}-${endDate.day}`;

// console.log(currentDate)
let goldDataset = [];
const currencyDatasets = [];
let currencyList = [];

let chartdataList = [];

initBoard();
