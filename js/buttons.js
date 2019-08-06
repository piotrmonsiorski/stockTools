const btnChartWeek = document.querySelector('#chartWeek');
const btnChartMonth = document.querySelector('#chartMonth');
const btnChartYear = document.querySelector('#chartYear');
const btnChartFull = document.querySelector('#chartFull');
const btnOwnUnfold = document.querySelector('#chartOwn');
const btnOwnSet = document.querySelector('#chartOwnSet');
const btnSwapDates = document.querySelector('#swapDates');

const inpStartDay = document.querySelector('[name="startDay"]');
const inpStartMonth = document.querySelector('[name="startMonth"]');
const inpStartYear = document.querySelector('[name="startYear"]');
const inpEndDay = document.querySelector('[name="endDay"]');
const inpEndMonth = document.querySelector('[name="endMonth"]');
const inpEndYear = document.querySelector('[name="endYear"]');

const tooltipStartDate = document.querySelector('#ownStart .tooltip');
const tooltipEndDate = document.querySelector('#ownEnd .tooltip');
const tooltipSwapDates = document.querySelector('#swapDates .tooltip');

btnChartWeek.addEventListener('click', () => {
  apiStartDate = `${lastWeekObj.year}-${lastWeekObj.month}-${lastWeekObj.day}`;
  updateMainChart(apiStartDate, apiMaxDate);
});

btnChartMonth.addEventListener('click', () => {
  apiStartDate = `${lastMonthObj.year}-${lastMonthObj.month}-${lastMonthObj.day}`;
  updateMainChart(apiStartDate, apiMaxDate);
});

btnChartYear.addEventListener('click', () => {
  apiStartDate = `${lastYearObj.year}-${lastYearObj.month}-${lastYearObj.day}`;
  updateMainChart(apiStartDate, apiMaxDate);
});

btnChartFull.addEventListener('click', () => {
  updateMainChart(apiMinDate, apiMaxDate);
});

btnOwnUnfold.addEventListener('click', () => {
  document.querySelector('.own-wrap').classList.toggle('closed');
  event.target.classList.toggle('open');
});

btnOwnSet.addEventListener('click', () => {
  // tooltipStartDate.innerHTML = '';
  // tooltipEndDate.innerHTML = '';
  // tooltipSwapDates.innerHTML = '';
  tooltipStartDate.classList.remove('visible');
  tooltipEndDate.classList.remove('visible');
  tooltipSwapDates.classList.remove('visible');

  let formError = false;

  const startDay = inpStartDay.value;
  const startMonth = inpStartMonth.value;
  const startYear = inpStartYear.value;
  const endDay = inpEndDay.value;
  const endMonth = inpEndMonth.value;
  const endYear = inpEndYear.value;

  let startDate = new Date(`${startYear}-${startMonth}-${startDay}`);
  let endDate = new Date(`${endYear}-${endMonth}-${endDay}`);

  // check dates format
  if(startDate == 'Invalid Date') {
    tooltipStartDate.innerHTML = 'Niepoprawny format daty';
    tooltipStartDate.classList.add('visible');
    formError = true;
  }
  if(endDate == 'Invalid Date') {
    tooltipEndDate.innerHTML = 'Niepoprawny format daty';
    tooltipEndDate.classList.add('visible');
    formError = true;
  }

  // check if dates are in order
  if(!formError && startDate.getTime() > endDate.getTime()) {
    tooltipSwapDates.innerHTML = 'Niedprawidłowa kolejność dat';
    tooltipSwapDates.classList.add('visible');
    formError = true;
  }

  // check if startDate isn't before borderDate
  if(!formError && startDate.getTime() < minDate.getTime()) {
    tooltipStartDate.innerHTML = 'Niebsługiwana data';
    tooltipStartDate.classList.add('visible');
    formError = true;
  }

  // check if endDate isn't after currentDate
  if(!formError && endDate.getTime() > currentDate.getTime()) {
    tooltipEndDate.innerHTML = 'Data w przyszłości';
    tooltipEndDate.classList.add('visible');
    formError = true;
  }

  // check for apiMaxDays
  // if(!formError) {
  //   const setTime = (endDate.getTime() - startDate.getTime()) / 86400000; // convert ms to days
  //   if (setTime > apiMaxDays) {
  //     tooltipEndDate.innerHTML = 'Zbyt długi przedział czasu';
  //     tooltipEndDate.classList.add('visible');
  //     formError = true;
  //   }
  // }

  // set time if form is validated
  if(!formError) {
    apiStartDate = `${startYear}-${startMonth}-${startDay}`;
    apiEndDate = `${endYear}-${endMonth}-${endDay}`;
    updateMainChart(apiStartDate, apiEndDate);
  }
});

btnSwapDates.addEventListener('click', () => {
  const startDay = inpStartDay.value;
  const startMonth = inpStartMonth.value;
  const startYear = inpStartYear.value;

  inpStartDay.value = inpEndDay.value;
  inpStartMonth.value = inpEndMonth.value;
  inpStartYear.value = inpEndYear.value;

  inpEndDay.value = startDay;
  inpEndMonth.value = startMonth;
  inpEndYear.value = startYear;
});
