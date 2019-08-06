function drawChart(canvas, goldData) {
  let canvasNode = document.querySelector(`#${canvas}`);
  canvasNode.parentNode.innerHTML = `<canvas id="${canvas}">`; // remove previous chart if exists
  canvasNode = document.querySelector(`#${canvas}`);
  const canvasCtx = canvasNode.getContext('2d');

  const chartLabels = goldData.reduce( (acc, val, idx) => {
    acc.push(val.data);
    return acc;
  }, []);
  const chartData = goldData.reduce( (acc, val, idx) => {
    acc.push(val.cena);
    return acc;
  }, []);

  // const minTick = Math.round( ([...chartData].sort( (a,b) => a - b )[0] - 10) / 10 ) * 10; // 168 - 160
  // const maxTick = Math.round( ([...chartData].sort( (a,b) => b - a )[0] + 10) / 10 ) * 10; // 179 - 190

  const minTick = Math.round( [...chartData].sort( (a,b) => a - b )[0] * 0.975 );
  const maxTick = Math.round( [...chartData].sort( (a,b) => b - a )[0] * 1.025 );

  let aspectRatio = 2;
  switch(canvas) {
    case 'goldMain':
      aspectRatio = 2;
      break;
    case 'goldFull':
      aspectRatio = 6;
      break;
    default:
      break;
  }

  const goldMainChart = new Chart(canvasCtx, {
    type: 'line',
    data: {
      labels: chartLabels,
      datasets: [{
        data: chartData,
        backgroundColor: 'transparent',
        borderColor: [
          'rgba(255, 99, 132, 1)'
        ],
        borderWidth: 2,
        lineTension: 0
      }]
    },
    options: {
      aspectRatio: aspectRatio,
      legend: {
        display: false
      },
      scales: {
        yAxes: [{
          ticks: {
            min: minTick,
            max: maxTick,
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
}
