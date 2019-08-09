// const fmpAPI = "https://financialmodelingprep.com/api/v3/";
const nbpAPI = 'https://api.nbp.pl/api';
const format = '?format=json';
// http://api.nbp.pl/

const currentDate = new Date();
const minDate = new Date('2013-01-01'); // nbpAPI doesn't support previous data
minDate.setHours(0,0,0);
const apiMaxDays = 367;

const apiMinDate = setDateFormat(`${minDate.getFullYear()}-${minDate.getMonth()+1}-${minDate.getDate()}`);
const apiMaxDate = setDateFormat(`${currentDate.getFullYear()}-${currentDate.getMonth()+1}-${currentDate.getDate()}`);

async function getGold(apiStartDate, apiEndDate) {
  // let response = await fetch(`${fmpAPI}/company/stock/list`);
  let response = await fetch(`${nbpAPI}/cenyzlota/${apiStartDate}/${apiEndDate}${format}`);
  let json = await response.json();
  return json;
}

async function getCurrencies() {
  let response = await fetch(`${nbpAPI}/exchangerates/tables/a${format}`);
  let json = await response.json();
  return json[0].rates;
}

async function getCurrency(type, apiStartDate, apiEndDate) {
  let response = await fetch(`${nbpAPI}/exchangerates/rates/a/${type}/${apiStartDate}/${apiEndDate}${format}`);
  let json = await response.json();
  return json;
}

function initBoard() {
    let startDate = apiMinDate.split('-');
    let endDate = apiMaxDate.split('-');

    const years = endDate[0] - startDate[0];

    const timeSpans = [];
    for(let i = 0; i < years; i++) {
      timeSpans.push([`${Number(startDate[0])+i}-01-01` , `${Number(startDate[0])+i}-12-31`]);
    }
    timeSpans.push([`${endDate[0]}-01-01`, endDate.join('-')])

    startDate = startDate.join('-');
    endDate = endDate.join('-');

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
        chartdataList.push( new ChartData('gold', 'orange', goldDataset) )
        updateChart(startDate, endDate);

        updateButtons();
      });

    getCurrencies()
      .then(results => {
        const typeSelectEdit = document.querySelector('.data-edit [name="typeSelect"]');
        const typeSelectAdd = document.querySelector('.data-add [name="typeSelect"]');
        [typeSelectEdit, typeSelectAdd].forEach( node => {
          for(let result of results) {
            const optionNode = document.createElement('option');
            optionNode.value = result.code;
            optionNode.innerHTML = `${result.code} - ${result.currency}`;
            node.appendChild(optionNode);
          }
        });
      });

    // temp for development
    addData('USD', 'red');
}

// function setCurrencyList() {
//   getCurrencies()
//     .then(results => {
//       const dataSelectNode = document.querySelector('[name="dataSelect"]');
//       for(let result of results) {
//         const optionNode = document.createElement('option');
//         optionNode.value = result.code;
//         optionNode.innerHTML = `${result.code} - ${result.currency}`;
//         dataSelectNode.appendChild(optionNode);
//       }
//     });
// }

function updateChart() {
  drawChart();
}

function setDateFormat(date) {
  const dateArr = date.split('-')
  dateArr[0] = dateArr[0].padStart(4,0) // year
  dateArr[1] = dateArr[1].padStart(2,0) // month
  dateArr[2] = dateArr[2].padStart(2,0) // day
  return dateArr.join('-');
}

function updateButtons() {
  const dataButtonsNode = document.querySelector('.data-buttons');
  const dataButtons = [...document.querySelectorAll('.btn-data')];
  if(dataButtons) {
    for(let button of dataButtons) {
      button.remove();
    }
  }

  for(let chart of chartdataList) {
    const buttonNode = document.createElement('button');
    buttonNode.classList.add('btn');
    buttonNode.classList.add('btn-data');
    buttonNode.dataset.name = chart.type;
    buttonNode.style.backgroundColor = chart.getColor();
    buttonNode.style.borderColor = chart.getColor();
    buttonNode.innerHTML = `${chart.type}<span class="edit"><i class="fas fa-edit"></i></span>`;
    // buttonNode.addEventListener('click', editData);
    dataButtonsNode.appendChild(buttonNode);
  }
}

function updateChartRanges() {
  const startDate = apiStartDate.split('-');
  const endDate = apiEndDate.split('-');

  document.querySelector('[name="startDay"]').value = Number(startDate[2]);
  document.querySelector('[name="startMonth"]').value = Number(startDate[1]);
  document.querySelector('[name="startYear"]').value = Number(startDate[0]);
  document.querySelector('[name="endDay"]').value = Number(endDate[2]);
  document.querySelector('[name="endMonth"]').value = Number(endDate[1]);
  document.querySelector('[name="endYear"]').value = Number(endDate[0]);
}

function editData() {
  const dataEditNode = document.querySelector('.data-edit');
  const dataAddNode = document.querySelector('.data-add');
  dataEditNode.classList.remove('hidden');
  dataAddNode.classList.add('hidden');

  const dataName = event.target.dataset.name;

  const datalist = chartdataList[chartdataList.findIndex( chart => chart.name = dataName )];

  const inpTypeSelect = document.querySelector('.data-edit [name="typeSelect"]');
  const inpColorSelect = document.querySelector('.data-edit [name="colorSelect"]');
  const btnDataEdit = document.querySelector('#dataEdit');
  const btnDataRemove = document.querySelector('#dataRemove');

  inpTypeSelect.value = datalist.name;
  inpColorSelect.value = datalist.color;
  btnDataEdit.style.backgroundColor = datalist.color;
  btnDataEdit.style.borderColor = datalist.color;
  btnDataRemove.style.backgroundColor = datalist.color;
  btnDataRemove.style.borderColor = datalist.color;
}

function addData(type, color) {
  let startDate = apiMinDate.split('-');
  let endDate = apiMaxDate.split('-');

  const years = endDate[0] - startDate[0];

  const timeSpans = [];
  for(let i = 0; i < years; i++) {
    timeSpans.push([`${Number(startDate[0])+i}-01-01` , `${Number(startDate[0])+i}-12-31`]);
  }
  timeSpans.push([`${endDate[0]}-01-01`, endDate.join('-')])

  startDate = startDate.join('-');
  endDate = endDate.join('-');

  const dataPromises = [];
  timeSpans.forEach( (span, index) => {
    dataPromises.push(getCurrency(type, span[0], span[1]));
  })

  const currencyObj = {};
  currencyObj.type = type;
  currencyObj.dataset = [];

  Promise.all(dataPromises)
    .then( results => {
      for(let result of results) {
        currencyObj.dataset.push(result.rates);
      }
    })
    .then( () => {
      currencyObj.dataset = currencyObj.dataset.reduce( (acc,val,idx) => acc.concat(val), [] );
      currencyObj.dataset = currencyObj.dataset.map( val => {
        return {
          'data': val.effectiveDate,
          'cena': val.mid
        }
      });

      currencyDatasets.push(currencyObj);
      chartdataList.push( new ChartData(type, color, currencyObj.dataset) )
      updateChart(apiStartDate, apiEndDate);

      updateButtons();
    });


  // chartdataList.push( new ChartData(type, color, goldDataset) )
  // updateChart(apiStartDate, apiEndDate);
}

function checkTypeSelect(selectNode, operation) {
  const nodeValue = selectNode.value;

  if (operation == 'add') {
    if( !chartdataList.every( chart => chart.type != nodeValue ) ) {
      tooltipTypeSelectAdd.classList.add('visible');
      dataAddError = true;
    }
    else {
      dataAddError = false;
    }

  }
}
