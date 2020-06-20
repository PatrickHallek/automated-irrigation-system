/** @jsx jsx */
import { jsx, useThemeUI } from "theme-ui";
import React, { useState, useEffect } from 'react'
import { Line } from "react-chartjs-2";
import "./LineChart.css";

const LineChart = props => {
  const sensorName = props.sensorInFocus
  const capacityFactor = 100000
  const requestIntervall = 1000
  const context = useThemeUI()
  const chartRef = React.createRef();
  const [dataFilter, setDataFilter] = useState("day");
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{
      label: 'Irrigation',
      fill: true,
      data: [],
      borderWidth: 2,
      backgroundColor: 'rgba(4, 214, 144, 0.1)',
      borderColor: 'rgba(4, 214, 143, 1)',
    }]
  });
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 300,
      easing: 'linear'
    },
    elements: {
      point: {
        radius: 0
      }
    },
    scales: {
      yAxes: [
        {
          ticks: {
            fontColor: context.theme.colors.text,
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
          fontColor: context.theme.colors.text,
          maxTicksLimit: 4,
          maxRotation: 0,
          minRotation: 0,
          callback: function (value) {
            if (dataFilter === "minute") return new Date(value).toLocaleTimeString('en', { second: 'numeric' }) + 's';
            if (dataFilter === "hour") return new Date(value).toLocaleTimeString('en', { minute: 'numeric' }) + 'min';
            if (dataFilter === "day") return new Date(value).toLocaleTimeString('en', { hour: 'numeric' });
            if (dataFilter === "week") return new Date(value).toLocaleDateString('en', { day: 'numeric', month: 'short' });
            if (dataFilter === "month") return new Date(value).toLocaleDateString('en', { day: 'numeric', month: 'short' });
          },
        },
      }]
    },
    legend: {
      display: false,
    },
    tooltips: {
      enabled: false,
    },
  };

  useEffect(() => {
    const loadData = () => {
      fetch(`${process.env.REACT_APP_BACKEND_URL}/measurements/${dataFilter}/${sensorName}`)
        .then(res => res.json())
        .then(
          async (liveData) => {
            const timestamps = liveData.map(data => data.timestamp)
            const capacities = liveData.map(data => capacityFactor / data.capacity)
            setChartData({
              labels: timestamps,
              datasets: [{
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

    loadData()
    const intervall = setInterval(() => {
      loadData()
    }, requestIntervall)

    return () => clearInterval(intervall);
  }, [setChartData, dataFilter, sensorName])

  const selectFilter = (filter) => {
    setDataFilter(filter)
  }

  return (
    <div className="line-chart">
      <select sx={{ color: "text" }} onChange={(e) => selectFilter(e.target.value)} className="chart-drop-down" value={dataFilter}>
        <option value="minute">Last Minute</option>
        <option value="hour">Last Hour</option>
        <option value="day">Last Day</option>
        <option value="week">Last Week</option>
        <option value="month">Last Month</option>
        <option value="all">All</option>
      </select>
      {chartData.dataset ? <div /> : <Line ref={chartRef} data={chartData} options={options} />}
    </div>
  );
};

export default LineChart;
