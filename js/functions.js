// const fmpAPI = "https://financialmodelingprep.com/api/v3/";
const nbpAPI = 'https://api.nbp.pl/api/';
const format = '?format=json';
// http://api.nbp.pl/

const currentDate = new Date();
const minDate = new Date('2013-01-01'); // nbpAPI doesn't support previous data
minDate.setHours(0,0,0);
const apiMaxDays = 367;

const apiMinDate = `${minDate.getFullYear()}-${minDate.getMonth()+1}-${minDate.getDate()}`;
const apiMaxDate = `${currentDate.getFullYear()}-${currentDate.getMonth()+1}-${currentDate.getDate()}`;

async function getGold(apiStartDate, apiEndDate) {
  // let response = await fetch(`${fmpAPI}/company/stock/list`);
  let response = await fetch(`${nbpAPI}cenyzlota/${apiStartDate}/${apiEndDate}${format}`);
  let json = await response.json();
  return json;
}

function initCharts() {
  updateFullChart(); // also updates mainChart
}

function updateMainChart(apiStartDate = apiInitStartDate, apiEndDate = apiInitEndDate) {
  // correct format to YYYY-MM-DD
  apiStartDate = setDateFormat(apiStartDate);
  apiEndDate = setDateFormat(apiEndDate);

  // set to closest working day
  let startIndex = goldDataset.findIndex( val => val.data >= apiStartDate );
  let endIndex = goldDataset.findIndex( val => val.data > apiEndDate );
  endIndex == -1 ? endIndex = goldDataset.length : false; // in case currentDay is not on the list
  apiStartDate = goldDataset[startIndex];
  apiEndDate = goldDataset[endIndex];

  const goldDatasetPiece = goldDataset.slice(startIndex, endIndex);
  drawChart('goldMain', goldDatasetPiece);
}

async function updateFullChart(apiStartDate = apiMinDate, apiEndDate = apiMaxDate) {
  // correct format to YYYY-MM-DD
  apiStartDate = setDateFormat(apiStartDate);
  apiEndDate = setDateFormat(apiEndDate);

  const startDate = apiStartDate.split('-');
  const endDate = apiEndDate.split('-');

  const years = endDate[0] - startDate[0];

  const timeSpans = [];
  for(let i = 0; i < years; i++) {
    timeSpans.push([`${Number(startDate[0])+i}-01-01` , `${Number(startDate[0])+i}-12-31`]);
  }
  timeSpans.push([`${endDate[0]}-01-01` , apiEndDate])

  const dataPromises = [];
  timeSpans.forEach( (span, index) => {
    dataPromises.push(getGold(span[0], span[1]));
  })

  Promise.all(dataPromises)
    .then( result => {
      goldDataset.push(result);
    })
    .then( () => {
      goldDataset = goldDataset[0].reduce( (acc,val,idx) => acc.concat(val), [] );
      drawChart('goldFull', goldDataset)
    })
    .then( () => {
      updateMainChart();
    });
}

function setDateFormat(date) {
  const dateArr = date.split('-')
  dateArr[0] = dateArr[0].padStart(4,0) // year
  dateArr[1] = dateArr[1].padStart(2,0) // month
  dateArr[2] = dateArr[2].padStart(2,0) // day
  return dateArr.join('-');
}
