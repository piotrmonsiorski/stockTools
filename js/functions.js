// https://www.worldtradingdata.com/

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
      })
      .then( () => {
        // temp for development
        addData('USD', 'green');
        addData('EUR', 'blue');
      });

}

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
    buttonNode.dataset.type = chart.type;
    buttonNode.style.backgroundColor = chart.getColor();
    buttonNode.style.borderColor = chart.getColor();
    buttonNode.innerHTML = `${chart.type}<span class="edit"><i class="fas fa-edit"></i></span>`;
    buttonNode.addEventListener('click', showEditPanel);
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

function showEditPanel() {
  const dataEditNode = document.querySelector('.data-edit');
  const dataAddNode = document.querySelector('.data-add');
  dataEditNode.classList.remove('hidden');
  dataAddNode.classList.add('hidden');

  const datalist = chartdataList[chartdataList.findIndex( chart => chart.type == this.dataset.type )];

  const inpTypeSelect = document.querySelector('.data-edit [name="typeSelect"]');
  const inpColorSelect = document.querySelector('.data-edit [name="colorSelect"]');
  const btnDataSave = document.querySelector('[name="dataSave"]');
  const btnDataRemove = document.querySelector('[name="dataRemove"]');
  const inpTypeEdited = document.querySelector('.data-edit [name="typeEdited"]');

  inpTypeSelect.value = datalist.type;
  inpColorSelect.value = datalist.color;
  btnDataSave.style.backgroundColor = datalist.getColor();
  btnDataSave.style.borderColor = datalist.getColor();
  btnDataRemove.style.backgroundColor = datalist.getColor();
  btnDataRemove.style.borderColor = datalist.getColor();
  inpTypeEdited.value = datalist.type;
}

function addData(type, color, index = false) {
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
      if (index !== false && index > -1) {
        chartdataList[index] = new ChartData(type, color, currencyObj.dataset);
      }
      else {
        chartdataList.push( new ChartData(type, color, currencyObj.dataset) )
      }

      updateChart(apiStartDate, apiEndDate);
      updateButtons();
    });
}

function editData(type, color, index) {
  if( !(type == inpEditTypeEdited.value) ) { // if dataType is edited
    if (inpEditTypeEdited.value == 'gold') {
      chartdataList[index].type = type;
      addData(type, color, index);
    }
    else if (!currencyDatasets.every( chart => chart.type != type)) { // also type != gold
      chartdataList[index].type = type;
      chartdataList[index].dataset = currencyDatasets[currencyDatasets.findIndex(chart => chart.type == type)].dataset;
    }
    else {
      addData(type, color, index);
    }
    inpEditTypeEdited.value = type;
  }
  chartdataList[index].color = color;

  updateChart();
  updateButtons();

  const colorHex = chartdataList[index].getColor();

  btnDataSave.style.backgroundColor = colorHex;
  btnDataSave.style.borderColor = colorHex;
  btnDataRemove.style.backgroundColor = colorHex;
  btnDataRemove.style.borderColor = colorHex;

  console.log(type, color, index);

}

function removeData(type) {
  if (chartdataList.length - 1) {
    dataEditNode.classList.add('hidden');
    const index = chartdataList.findIndex( chart => chart.type == type );
    chartdataList.splice(index,1);
    updateChart();
    updateButtons();
  }
  else {
    tooltipDataEdit.innerHTML = 'na wykresie musi być przyjemniej jeden zestaw danych';
    tooltipDataEdit.classList.add('visible');
  }

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
  else if (operation == 'edit') {
    if ( nodeValue == inpEditTypeEdited.value ) {
      dataEditError = false;
    }
    else if( !chartdataList.every( chart => chart.type != nodeValue ) ) {
      tooltipTypeSelectEdit.classList.add('visible');
      dataEditError = true;
    }
    else {
      dataEditError = false;
    }
  }
}
