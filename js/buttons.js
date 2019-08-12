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


const btnChartAdd = document.querySelector('button[name="chartAdd"]');
const btnDataAdd = document.querySelector('button[name="dataAdd"]');
const btnDataSave = document.querySelector('button[name="dataSave"]');
const btnDataRemove = document.querySelector('button[name="dataRemove"]');
const btnsDataCancel = document.querySelectorAll('button[name="dataCancel"]');

const inpEditTypeSelect = document.querySelector('.data-edit [name="typeSelect"]');
const inpEditTypeEdited = document.querySelector('.data-edit [name="typeEdited"]');
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


function clearTooltips() {
  tooltipStartDate.classList.remove('visible');
  tooltipEndDate.classList.remove('visible');
  tooltipSwapDates.classList.remove('visible');

  tooltipTypeSelectEdit.classList.remove('visible');
  tooltipColorSelectEdit.classList.remove('visible');
  tooltipDataEdit.classList.remove('visible');

  tooltipTypeSelectAdd.classList.remove('visible');
  tooltipColorSelectAdd.classList.remove('visible');
  tooltipDataAdd.classList.remove('visible');
}



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
  clearTooltips();

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


const dataEditNode = document.querySelector('.data-edit');
const dataAddNode = document.querySelector('.data-add');

btnChartAdd.addEventListener('click', () => {
  dataEditNode.classList.add('hidden');
  dataAddNode.classList.remove('hidden');
});

inpAddTypeSelect.addEventListener('change', () => {
  clearTooltips();
  dataAddError = false;
  if( !chartdataList.every( chart => chart.type != inpAddTypeSelect.value ) ) {
    tooltipTypeSelectAdd.classList.add('visible');
    dataAddError = true;
  }
});
inpEditTypeSelect.addEventListener('change', () => {
  clearTooltips();
  dataEditError = false;
  if ( inpEditTypeSelect.value == inpEditTypeEdited.value ) {
    dataEditError = false;
  }
  else if( !chartdataList.every( chart => chart.type != inpEditTypeSelect.value ) ) {
    tooltipTypeSelectEdit.classList.add('visible');
    dataEditError = true;
  }
});

inpAddColorSelect.addEventListener('change', () => {
  clearTooltips();
  dataAddError = false;
  if( !chartdataList.every( chart => chart.color != inpAddColorSelect.value ) ) {
    tooltipColorSelectAdd.classList.add('visible');
    dataAddError = true;
  }
});
inpEditColorSelect.addEventListener('change', () => {
  clearTooltips();
  dataEditError = false;
  if( !chartdataList.every( chart => chart.color != inpEditColorSelect.value ) ) {
    tooltipColorSelectEdit.classList.add('visible');
    dataEditError = true;
  }
});

btnDataAdd.addEventListener('click', () => {
  clearTooltips();

  const dataType = inpAddTypeSelect.value;
  const dataColor = inpAddColorSelect.value;

  checkTypeSelect(inpAddTypeSelect, 'add');

  if(dataType == 'gold') {
    chartdataList.push( new ChartData(dataType, dataColor, goldDataset) );
    updateChart();
    updateButtons();
  }
  else if( !dataAddError ) {
    addData(dataType, dataColor);
  }
  else {
    console.log('error!');
  }
});

btnDataSave.addEventListener('click', () => {
  clearTooltips();

  const dataType = inpEditTypeSelect.value;
  const dataTypeEdited = inpEditTypeEdited.value;
  const dataColor = inpEditColorSelect.value;

  checkTypeSelect(inpEditTypeSelect, 'edit'); // add 'edit' to function

  const dataIndex = chartdataList.findIndex( chart => chart.type == dataTypeEdited );

  if( !dataEditError ) {
    editData(dataType, dataColor, dataIndex);
  }
  else {
    console.log('error!');
  }
});

btnDataRemove.addEventListener('click', () => {
  clearTooltips();
  removeData(inpEditTypeEdited.value);
});

btnsDataCancel.forEach( button => {
  button.addEventListener('click', () => {
    clearTooltips();
    dataEditNode.classList.add('hidden');
    dataAddNode.classList.add('hidden');
  });
});
