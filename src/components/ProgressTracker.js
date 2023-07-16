import React, { useState, useEffect, useRef } from "react";
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
  const [savedCalories] = useLocalStorage("calories", []);
  const [targetWeight, setTargetWeight] = useLocalStorage("targetWeight", 210);
  const [minYAxis, setMinYAxis] = useLocalStorage("minYAxis", 170);
  const chartWeightRef = useRef(null);
  const chartCalorieRef = useRef(null);

  useEffect(() => {
    const processedWeightData = savedWeights.map((weight) => {
      const date = new Date(weight.name);
      return [date, weight.weight];
    });

    const chartOptions = {
      series: [
        {
          name: "Weight",
          data: processedWeightData,
        },
      ],
      stroke: {
        curve: "smooth",
        width: "4",
        colors: "#1d89ef",
      },
      chart: {
        type: "line",
        height: 375,
      },
      xaxis: {
        type: "datetime",
        labels: {
          show: true,
          style: {
            fontSize: "16px",
            color: "#fff",
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
        min: minYAxis,
        max: targetWeight + 5,
        labels: {
          style: {
            fontSize: "16px",
            color: "#fff",
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
        show: false,
      },
      annotations: {
        yaxis: [
          {
            y: targetWeight,
            borderColor: "red",
            label: {
              borderColor: "red",
              style: {
                color: "#fff",
                background: "red",
              },
              text: "Target Weight",
            },
          },
        ],
      },
      legend: {
        position: "top",
        horizontalAlign: "center",
      },
    };

    chartWeightRef.current = new ApexCharts(document.getElementById("weight-chart"), chartOptions);
    chartWeightRef.current.render();
    return () => {
      chartWeightRef.current.destroy();
    };
  }, [savedWeights, targetWeight, minYAxis]);

  useEffect(() => {
    const processedCalorieData = savedCalories.map((calories) => {
      const date = new Date(calories.name);
      return [date, calories.calories];
    });

    const chartCalorieOptions = {
      series: [
        {
          name: "Calories",
          data: processedCalorieData,
        },
      ],
      stroke: {
        curve: "smooth",
        width: "4",
        colors: "#1def90",
      },
      chart: {
        type: "line",
        height: 375,
      },
      xaxis: {
        type: "datetime",
        labels: {
          show: true,
          style: {
            fontSize: "16px",
            color: "#fff",
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
        labels: {
          style: {
            fontSize: "16px",
            color: "#fff",
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
        show: false,
      },
      legend: {
        position: "top",
        horizontalAlign: "center",
      },
      markers: {
        colors: ["#1def90"],
      },
      dataLabels: {
        style: {
          colors: ["#1def90"],
        },
      },
    };

    chartCalorieRef.current = new ApexCharts(document.getElementById("calorie-chart"), chartCalorieOptions);
    chartCalorieRef.current.render();
    return () => {
      chartCalorieRef.current.destroy();
    };
  }, [savedCalories]);

  return (
    <div>
      <div id="weight-chart" />
      <div id="calorie-chart" />
      <div className="progresstracker">
        <h3 className="targetheader">Target Weight:</h3>
        <input
          className="inputtargetweight"
          type="number"
          value={targetWeight}
          onChange={(e) => setTargetWeight(parseInt(e.target.value))}
          placeholder="Target Weight"
        />
        <h3 className="targetmin">Minimum Weight Graph Value:</h3>
        <input
          className="inputmin"
          type="number"
          value={minYAxis}
          onChange={(e) => setMinYAxis(parseInt(e.target.value))}
          placeholder="Min Y-Axis"
        />
      </div>
    </div>
  );
};

export default ProgressTracker;
