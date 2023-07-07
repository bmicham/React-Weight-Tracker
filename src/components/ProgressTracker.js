import React, { useState, useEffect } from "react";
import ApexCharts from "apexcharts";

function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(storedValue));
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}

const ProgressTracker = () => {
  const [savedWeights] = useLocalStorage("weights", []);
  const target = 210;

  useEffect(() => {
    const processedData = savedWeights.map((weight) => {
      const date = new Date(weight.name);
      return [date, weight.weight];
    });

    const chartOptions = {
      series: [
        {
          name: "Weight",
          data: processedData,
        },
      ],
      stroke: {
        curve: 'smooth',
      },
      chart: {
        type: "line",
        height: 750,
      },
      xaxis: {
        type: "datetime",
        labels: {
          show: true,
          style: {
            fontSize: "16px", // Increase the font size
            color: "#fff", // Set the color to white
          },
          datetimeFormatter: {
            month: "MMM",
          },
        },
        tooltip: {
          enabled: false,
        },
      },
      yaxis: {
        min: 170,
        max: 215,
        labels: {
          style: {
            fontSize: "16px", // Increase the font size
            color: "#fff", // Set the color to white
          },
        },
        axisTicks: {
          show: false,
        },
        axisBorder: {
          show: false,
        },
      },
      grid: {
        show: false, // Remove the y-axis gridlines
      },
      annotations: {
        yaxis: [
          {
            y: target,
            borderColor: 'red',
            label: {
              borderColor: 'red',
              style: {
                color: '#fff',
                background: 'red'
              },
              text: 'Target Weight'
            }
          }
        ],
      },
      legend: {
        position: 'top',
        horizontalAlign: 'center',
      },
    }

    const chart = new ApexCharts(document.getElementById("chart"), chartOptions);
    chart.render();

    return () => {
      chart.destroy();
    };
  }, [savedWeights]);

  return <div id="chart" />;
};

export default ProgressTracker;
