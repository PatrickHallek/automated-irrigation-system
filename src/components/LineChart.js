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

  const [chartData, setChartData] = useState(initialData);

  useEffect(() => {
    loadData()
    setInterval(() => {
      loadData()
    }, 1000)
  }, [setChartData])

  const loadData = () => {
    const liveData = [{
      capacity: Math.random() * 20,
      timestamp: "2018-06-13T12:11:13+05:30"
    }, {
      capacity: Math.random() * 20,
      timestamp: "2019-06-13T12:11:13+05:30"
    }, {
      capacity: Math.random() * 20,
      timestamp: "2020-06-13T12:11:13+05:30"
    }, {
      capacity: Math.random() * 20,
      timestamp: "2021-06-13T12:11:13+05:30"
    }, {
      capacity: Math.random() * 20,
      timestamp: "2022-06-13T12:11:13+05:30"
    }]
    setChartData({
      labels: liveData.map(data => data.timestamp),
      datasets: [{
        label: 'Irrigation',
        fill: true,
        data: liveData.map(data => data.capacity),
        borderWidth: 2,
        backgroundColor: 'rgba(4, 214, 144, 0.1)',
        borderColor: 'rgba(4, 214, 143, 1)',
      }],
    })
  }

  const options = {
    responsive: true,
    scales: {
      yAxes: [
        {
          ticks: {
            fontColor: "#5C657C", // this here
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
          fontColor: "#5C657C", // this here
        },
        type: 'time',
        distribution: 'series',
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

  return (
    <div className="line-chart">
      {chartData.dataset ? <div /> : <Line ref={chartRef} data={chartData} options={options} />}
    </div>
  );
};

export default LineChart;
