const chartSettings = {
  minGold: 100,
  maxGold: 200,
  minCurrency: 2,
  maxCurrency: 5
}

document.querySelector('[name="goldMin"]').value = chartSettings.minGold;
document.querySelector('[name="goldMax"]').value = chartSettings.maxGold;
document.querySelector('[name="currencyMin"]').value = chartSettings.minCurrency;
document.querySelector('[name="currencyMax"]').value = chartSettings.maxCurrency;

function drawChart(_canvas = 'chartMain', _startDate = apiStartDate, _endDate = apiEndDate) {
  let canvasNode = document.querySelector(`#${_canvas}`);
  canvasNode.parentNode.innerHTML = `<canvas id="${_canvas}">`; // remove previous chart if exists
  canvasNode = document.querySelector(`#${_canvas}`);
  const canvasCtx = canvasNode.getContext('2d');

  // correct format to YYYY-MM-DD
  let startDate = setDateFormat(_startDate);
  let endDate = setDateFormat(_endDate);

  // set to closest working day
  let startIndex = goldDataset.findIndex( val => val.data >= startDate );
  let endIndex = goldDataset.findIndex( (val,idx) => {
    // console.log(val.data, endDate, idx);
    return val.data > endDate}
  );
  endIndex == -1 ? endIndex = goldDataset.length : false; // in case currentDay is not on the list

  const datasets = [];
  for (let chart of chartdataList) {
    const chartData = chart.dataset.reduce( (acc, val, idx) => {
      acc.push(val.cena);
      return acc;
    }, []) // reduce to 1 dim array
      .slice(startIndex, endIndex);

    let label = chart.type == 'gold' ? 'gold' : 'currency';

    datasets.push({
      data: chartData,
      yAxisID: label,
      backgroundColor: 'transparent',
      borderColor: chart.color,
      borderWidth: 2,
      lineTension: 0
    });
  }

  const chartLabels = chartdataList[0].dataset.reduce( (acc, val, idx) => {
    acc.push(val.data);
    return acc;
  }, []) // reduce to 1 dim array
    .slice(startIndex, endIndex);

  const minTicksGold = chartSettings.minGold;
  const maxTicksGold = chartSettings.maxGold;
  const minTicksCurrency = chartSettings.minCurrency;
  const maxTicksCurrency = chartSettings.maxCurrency;


  // const minTick = Math.round( ([...chartData].sort( (a,b) => a - b )[0] - 10) / 10 ) * 10; // 168 - 160
  // const maxTick = Math.round( ([...chartData].sort( (a,b) => b - a )[0] + 10) / 10 ) * 10; // 179 - 190

  // const minTick = Math.round( [...chartData].sort( (a,b) => a - b )[0] * 0.975 );
  // const maxTick = Math.round( [...chartData].sort( (a,b) => b - a )[0] * 1.025 );

  let aspectRatio = 3;



  const mainChart = new Chart(canvasCtx, {
    type: 'line',
    data: {
      labels: chartLabels,
      datasets: datasets
    },
    options: {
      aspectRatio: aspectRatio,
      legend: {
        display: false
      },
      scales: {
        yAxes: [{
          id: 'gold',
          position: 'left',
          ticks: {
            min: minTicksGold,
            max: maxTicksGold,
            beginAtZero: false,
          }
        },{
          id: 'currency',
          position: 'right',
          ticks: {
            min: minTicksCurrency,
            max: maxTicksCurrency,
            beginAtZero: false,
          }
        }],
        xAxes: [{
          ticks: {
          },
          gridLines: {
            display: false
          }
        }]
      }
    }
  });
  // console.log(mainChart);
}
