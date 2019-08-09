const navTabs = document.querySelectorAll('.navbar-tabs .tab');


const btnChartSettings = document.querySelector('[name="chartSettings"]');
const btnSettingsSave = document.querySelector('[name="settingsSave"]')
const btnSettingsCancel = document.querySelector('[name="settingsCancel"]')


const btnChartWeek = document.querySelector('#btnChartWeek');
const btnChartMonth = document.querySelector('#btnChartMonth');
const btnChartYear = document.querySelector('#btnChartYear');
const btnChartFull = document.querySelector('#btnChartFull');
const btnOwnUnfold = document.querySelector('#chartOwn');
const btnOwnSet = document.querySelector('#chartOwnSet');
const btnSwapDates = document.querySelector('#swapDates');

const inpStartDay = document.querySelector('[name="startDay"]');
const inpStartMonth = document.querySelector('[name="startMonth"]');
const inpStartYear = document.querySelector('[name="startYear"]');
const inpEndDay = document.querySelector('[name="endDay"]');
const inpEndMonth = document.querySelector('[name="endMonth"]');
const inpEndYear = document.querySelector('[name="endYear"]');

const tooltipStartDate = document.querySelector('.tooltip[name="startDate"]');
const tooltipEndDate = document.querySelector('.tooltip[name="endDate"]');
const tooltipSwapDates = document.querySelector('.tooltip[name="swapDates"]');


const btnChartAdd = document.querySelector('#chartAdd');
const btnDataAdd = document.querySelector('#dataAdd');
const btnsDataCancel = document.querySelectorAll('[name="dataCancel"]');

const inpEditTypeSelect = document.querySelector('.data-edit [name="typeSelect"]');
const inpEditColorSelect = document.querySelector('.data-edit [name="colorSelect"]');
const inpAddTypeSelect = document.querySelector('.data-add [name="typeSelect"]');
const inpAddColorSelect = document.querySelector('.data-add [name="colorSelect"]');

const tooltipDataEdit = document.querySelector('.tooltip[name="dataEdit"]');
const tooltipDataAdd = document.querySelector('.tooltip[name="dataAdd"]');
const tooltipTypeSelectEdit = document.querySelector('.tooltip[name="dataEditType"]');
const tooltipTypeSelectAdd = document.querySelector('.tooltip[name="dataAddType"]');
const tooltipColorSelectEdit = document.querySelector('.tooltip[name="dataEditColor"]');
const tooltipColorSelectAdd = document.querySelector('.tooltip[name="dataAddColor"]');

let dataEditError = false;
let dataAddError = false;



// - - - - - - -
// CHART SETTINGS
// - - - - - - -

btnChartSettings.addEventListener('click', () => {
  document.querySelector('.chart-settings').classList.remove('hidden');
});

btnSettingsSave.addEventListener('click', () => {
  const inpGoldMin = document.querySelector('[name="goldMin"]');
  const inpGoldMax = document.querySelector('[name="goldMax"]');
  const inpCurrencyMin = document.querySelector('[name="currencyMin"]');
  const inpCurrencyMax = document.querySelector('[name="currencyMax"]');

  // - - - - - - -
  // add < 0 check
  // - - - - - - -

  const goldMin = inpGoldMin.value ? inpGoldMin.value : chartSettings.minGold;
  const goldMax = inpGoldMax.value ? inpGoldMax.value : chartSettings.maxGold;
  const currencyMin = inpCurrencyMin.value ? inpCurrencyMin.value : chartSettings.minCurrency;
  const currencyMax = inpCurrencyMax.value ? inpCurrencyMax.value : chartSettings.maxCurrency;

  chartSettings.minGold = Number(goldMin);
  chartSettings.maxGold = Number(goldMax);
  chartSettings.minCurrency = Number(currencyMin);
  chartSettings.maxCurrency = Number(currencyMax);

  document.querySelector('.chart-settings').classList.add('hidden');
  updateChart();
});

btnSettingsCancel.addEventListener('click', () => {
  document.querySelector('.chart-settings').classList.add('hidden');
});


// - - - - - - -
// CHART RANGES
// - - - - - - -

btnChartWeek.addEventListener('click', () => {
  apiStartDate = `${lastWeekObj.year}-${lastWeekObj.month}-${lastWeekObj.day}`;
  apiEndDate = apiMaxDate;
  updateChartRanges();
  updateChart();
});

btnChartMonth.addEventListener('click', () => {
  apiStartDate = `${lastMonthObj.year}-${lastMonthObj.month}-${lastMonthObj.day}`;
  apiEndDate = apiMaxDate;
  updateChartRanges();
  updateChart();
});

btnChartYear.addEventListener('click', () => {
  apiStartDate = `${lastYearObj.year}-${lastYearObj.month}-${lastYearObj.day}`;
  apiEndDate = apiMaxDate;
  updateChartRanges();
  updateChart();
});

btnChartFull.addEventListener('click', () => {
  apiStartDate = apiMinDate;
  apiEndDate = apiMaxDate;
  updateChartRanges();
  updateChart();
});

btnOwnUnfold.addEventListener('click', () => {
  document.querySelector('.own-wrap').classList.toggle('closed');
  event.target.classList.toggle('btn-outline');
});

// init range inputs values
updateChartRanges();

btnOwnSet.addEventListener('click', () => {
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
    apiStartDate = setDateFormat(`${startYear}-${startMonth}-${startDay}`);
    apiEndDate = setDateFormat(`${endYear}-${endMonth}-${endDay}`);
    updateChart();
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


// - - - - - - -
// CHARTS DATASETS
// - - - - - - -

btnChartAdd.addEventListener('click', () => {

});

const dataEditNode = document.querySelector('.data-edit');
const dataAddNode = document.querySelector('.data-add');

btnChartAdd.addEventListener('click', () => {
  dataEditNode.classList.add('hidden');
  dataAddNode.classList.remove('hidden');
});

inpAddTypeSelect.addEventListener('change', () => {
  tooltipTypeSelectAdd.classList.remove('visible');
  dataAddError = false;
  if( !chartdataList.every( chart => chart.type != inpAddTypeSelect.value ) ) {
    tooltipTypeSelectAdd.classList.add('visible');
    dataAddError = true;
  }
});
inpEditTypeSelect.addEventListener('change', () => {
  tooltipTypeSelectEdit.classList.remove('visible');
  dataEditError = false;
  if( !chartdataList.every( chart => chart.type != inpEditTypeSelect.value ) ) {
    tooltipTypeSelectEdit.classList.add('visible');
    dataEditError = true;
  }
});

inpAddColorSelect.addEventListener('change', () => {
  tooltipColorSelectAdd.classList.remove('visible');
  dataAddError = false;
  if( !chartdataList.every( chart => chart.color != inpAddColorSelect.value ) ) {
    tooltipColorSelectAdd.classList.add('visible');
    dataAddError = true;
  }
});
inpEditColorSelect.addEventListener('change', () => {
  tooltipColorSelectEdit.classList.remove('visible');
  dataEditError = false;
  if( !chartdataList.every( chart => chart.color != inpEditColorSelect.value ) ) {
    tooltipColorSelectEdit.classList.add('visible');
    dataEditError = true;
  }
});

btnDataAdd.addEventListener('click', () => {
  tooltipDataAdd.classList.remove('visible');

  const dataType = inpAddTypeSelect.value;
  const dataColor = inpAddColorSelect.value;

  checkTypeSelect(inpAddTypeSelect, 'add');

  if( !dataAddError ) {
    addData(dataType, dataColor);
  }
  else {
    console.log('error!');
  }
  // else {
  //   tooltipDataAdd.classList.add('visible');
  //   tooltipDataAdd.innerHTML = 'wykres tego typu już istnieje';
  // }
});

btnsDataCancel.forEach( button => {
  button.addEventListener('click', () => {
    dataEditNode.classList.add('hidden');
    dataAddNode.classList.add('hidden');
  });
});

//
// btnChartAdd.addEventListener('click', () => {
// });
//
// btnDataSubmit.addEventListener('click', () => {
//   // dataEditNode.classList.add('hidden');
//   tooltipDataEdit.classList.remove('visible');
//
//   if (chartsList.length < 5) {
//     const dataData = inpDataSelect.value;
//     const dataColor = inpColorSelect.value;
//
//     if(chartsList.every( chart => chart[1] != dataData )) {
//       const dataButtonsNode = document.querySelector('.data-buttons');
//
//       const buttonNode = document.createElement('button');
//       buttonNode.classList.add('btn');
//       buttonNode.classList.add('btn-data');
//       buttonNode.dataset.currency = dataData;
//       buttonNode.style.backgroundColor = dataColor;
//       buttonNode.style.borderColor = dataColor;
//       buttonNode.innerHTML = `${dataData}<span class="edit"><i class="fas fa-edit"></i></span>`;
//       buttonNode.addEventListener('click', editData);
//       dataButtonsNode.appendChild(buttonNode);
//
//       let dataType = dataData == 'gold' ? 'gold' : 'currency';
//
//       chartsList.push([dataType, dataData, dataColor]);
//     }
//     else {
//       tooltipDataEdit.innerHTML = 'jest już taki wykres';
//       tooltipDataEdit.classList.add('visible');
//     }
//
//
//   } else {
//     tooltipDataEdit.innerHTML = 'zbyt wiele wykresów';
//     tooltipDataEdit.classList.add('visible');
//   }
// })
//
// btnDataCancel.addEventListener('click', () => {
//   dataEditNode.classList.add('hidden');
//   tooltipDataEdit.classList.remove('visible');
//
//   const dataButtons = document.querySelectorAll('.data-buttons .btn-data');
//   dataButtons.forEach( button => {
//     button.classList.remove('btn-dimmed');
//   })
// })
//
// function editData() {
//   if (!event.target.classList.contains('btn-dimmed')) {
//     const data = event.target.dataset.currency;
//     const dataButtons = document.querySelectorAll('.data-buttons .btn-data');
//     dataButtons.forEach( button => {
//       button.classList.toggle('btn-dimmed');
//     })
//     event.target.classList.remove('btn-dimmed');
//     dataEditNode.classList.remove('hidden');
//
//     const chart = chartsList[0];
//     console.log(data, chartsList.findIndex( chart => chart[0] == data ) );
//
//     document.querySelector('.data-edit').classList.toggle('edit');
//     document.querySelector('[name="dataSelect"]').value = chart[0];
//     document.querySelector('[name="colorSelect"]').value = chart[1];
//
//   }
// }
// const dataButtons = document.querySelectorAll('.data-buttons .btn-data');
// dataButtons.forEach( button => {
//   button.addEventListener('click', editData);
// })
