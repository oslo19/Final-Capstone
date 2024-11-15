import ApexCharts from 'apexcharts';

function getMainChartOptions() {
  return {
    series: [{
      name: 'Sales',
      data: [45, 52, 38, 45, 19, 23, 2]
    }],
    chart: {
      type: 'line',
      height: 350,
      fontFamily: 'Inter, sans-serif',
      foreColor: '#4B5563'
    },
    stroke: {
      width: 7,
      curve: 'smooth'
    },
    xaxis: {
      type: 'datetime',
      categories: [
        "2023-02-01T00:00:00.000Z",
        "2023-02-02T00:00:00.000Z",
        "2023-02-03T00:00:00.000Z",
        "2023-02-04T00:00:00.000Z",
        "2023-02-05T00:00:00.000Z",
        "2023-02-06T00:00:00.000Z",
        "2023-02-07T00:00:00.000Z"
      ]
    }
  };
}

export function initializeCharts() {
  if (document.getElementById('main-chart')) {
    const mainChart = new ApexCharts(document.getElementById('main-chart'), getMainChartOptions());
    mainChart.render();
    document.addEventListener('dark-mode', function () {
      mainChart.updateOptions(getMainChartOptions());
    });
  }

  if (document.getElementById('new-products-chart')) {
    const options = {
      colors: ['#1A56DB', '#FDBA8C'],
      series: [{
        name: 'Quantity',
        color: '#1A56DB',
        data: [
          { x: '01 Feb', y: 170 },
          { x: '02 Feb', y: 180 },
          { x: '03 Feb', y: 164 },
          { x: '04 Feb', y: 145 },
          { x: '05 Feb', y: 194 },
          { x: '06 Feb', y: 170 },
          { x: '07 Feb', y: 155 }
        ]
      }],
      chart: {
        type: 'bar',
        height: '140px',
        fontFamily: 'Inter, sans-serif',
        foreColor: '#4B5563',
        toolbar: {
          show: false
        }
      },
      plotOptions: {
        bar: {
          columnWidth: '90%',
          borderRadius: 3
        }
      },
      tooltip: {
        shared: false,
        intersect: false,
        style: {
          fontSize: '14px',
          fontFamily: 'Inter, sans-serif'
        }
      },
      states: {
        hover: {
          filter: {
            type: 'darken',
            value: 1
          }
        }
      },
      stroke: {
        show: true,
        width: 5,
        colors: ['transparent']
      },
      grid: {
        show: false
      },
      dataLabels: {
        enabled: false
      },
      legend: {
        show: false
      },
      xaxis: {
        floating: false,
        labels: {
          show: false
        },
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        }
      },
      yaxis: {
        show: false
      },
      fill: {
        opacity: 1
      }
    };

    const productsChart = new ApexCharts(document.getElementById('new-products-chart'), options);
    productsChart.render();
  }
  if (document.getElementById('sales-by-category')) {
	const options = {
		colors: ['#1A56DB', '#FDBA8C'],
		series: [
			{
				name: 'Desktop PC',
				color: '#1A56DB',
				data: [
					{ x: '01 Feb', y: 170 },
					{ x: '02 Feb', y: 180 },
					{ x: '03 Feb', y: 164 },
					{ x: '04 Feb', y: 145 },
					{ x: '05 Feb', y: 194 },
					{ x: '06 Feb', y: 170 },
					{ x: '07 Feb', y: 155 },
				]
			},
			{
				name: 'Phones',
				color: '#FDBA8C',
				data: [
					{ x: '01 Feb', y: 120 },
					{ x: '02 Feb', y: 294 },
					{ x: '03 Feb', y: 167 },
					{ x: '04 Feb', y: 179 },
					{ x: '05 Feb', y: 245 },
					{ x: '06 Feb', y: 182 },
					{ x: '07 Feb', y: 143 }
				]
			},
			{
				name: 'Gaming/Console',
				color: '#17B0BD',
				data: [
					{ x: '01 Feb', y: 220 },
					{ x: '02 Feb', y: 194 },
					{ x: '03 Feb', y: 217 },
					{ x: '04 Feb', y: 279 },
					{ x: '05 Feb', y: 215 },
					{ x: '06 Feb', y: 263 },
					{ x: '07 Feb', y: 183 }
				]
			}
		],
		chart: {
			type: 'bar',
			height: '420px',
			fontFamily: 'Inter, sans-serif',
			foreColor: '#4B5563',
			toolbar: {
				show: false
			}
		},
		plotOptions: {
			bar: {
				columnWidth: '90%',
				borderRadius: 3
			}
		},
		tooltip: {
			shared : true,
			intersect: false,
			style: {
				fontSize: '14px',
				fontFamily: 'Inter, sans-serif'
			},
		},
		states: {
			hover: {
				filter: {
					type: 'darken',
					value: 1
				}
			}
		},
		stroke: {
			show: true,
			width: 5,
			colors: ['transparent']
		},
		grid: {
			show: false
		},
		dataLabels: {
			enabled: false
		},
		legend: {
			show: false
		},
		xaxis: {
			floating: false,
			labels: {
				show: false
			},
			axisBorder: {
				show: false
			},
			axisTicks: {
				show: false
			},
		},
		yaxis: {
			show: false
		},
		fill: {
			opacity: 1
		}
	};

	const chart = new ApexCharts(document.getElementById('sales-by-category'), options);
	chart.render();
}

}
