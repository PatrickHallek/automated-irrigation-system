/** @jsx jsx */
import { jsx } from "theme-ui";
import React, { useState, useEffect } from 'react'
import "../style.css";
import { Line } from "react-chartjs-2";

const LineChart = () => {
  const chartRef = React.createRef();
  const initialData = {
    labels: [],
    datasets: [{
      label: 'Irrigation',
      fill: true,
      data: [],
      borderWidth: 2,
      backgroundColor: 'rgba(4, 214, 144, 0.1)',
      borderColor: 'rgba(4, 214, 143, 1)',
    }]
  }
  const options = {
    responsive: true,
    scales: {
      yAxes: [
        {
          ticks: {
            fontColor: "#5C657C",
            maxTicksLimit: 10
          },
          id: 'y-axis-0',
          position: 'left',
        },
      ],
      xAxes: [{
        gridLines: {
          display: false,
        },
        ticks: {
          fontColor: "#5C657C",
          maxTicksLimit: 10
        },
        type: 'time',
        distribution: 'linear',
        time: {
          displayFormats: {
            quarter: 'MMM YYYY',
          }
        }
      }]
    },
    legend: {
      display: false,
    },
    tooltips: {
      enabled: false,
    },
  };
  const [chartData, setChartData] = useState(initialData);

  useEffect(() => {
    loadData()
    setInterval(() => {
      loadData()
    }, 10000)
  }, [setChartData])

  const loadData = () => {
    fetch("http://localhost:3000/measurements/minute")
      .then(res => res.json())
      .then(
        async (liveData) => {
          const timestamps = liveData.map(data => data.timestamp)
          const capacities = liveData.map(data => data.capacity)
          setChartData({
            labels: timestamps,
            datasets: [{
              label: 'Irrigation',
              fill: true,
              data: capacities,
              borderWidth: 2,
              backgroundColor: 'rgba(4, 214, 144, 0.1)',
              borderColor: 'rgba(4, 214, 143, 1)',
            }],
          })
        },
        (error) => {
          console.log(`Coudn't fetch data. Error: ${error}`)
        }
      )
  }

  return (
    <div className="line-chart">
      {chartData.dataset ? <div /> : <Line ref={chartRef} data={chartData} options={options} />}
    </div>
  );
};

export default LineChart;
