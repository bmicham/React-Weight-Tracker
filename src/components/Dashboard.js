import React, { useState, useEffect, useRef } from "react";
import { saveAs } from "file-saver";

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

const Dashboard = () => {
  const [weights, setWeights] = useLocalStorage("weights", []);
  const [currentWeight, setCurrentWeight] = useState("");
  const [isWeightDataCleared, setWeightIsDataCleared] = useState(false);

  const [calories, setCalories] = useLocalStorage("calories", []);
  const [currentCalories, setCurrentCalories] = useState("");
  const [isCalorieDataCleared, setCalorieIsDataCleared] = useState(false);

  const fileInputRefWeight = useRef(null);
  const fileInputRefCalorie = useRef(null);

  const getWeightChange = () => {
    if (weights.length < 2) {
      return null;
    }

    const latestWeight = weights[weights.length - 1].weight;
    const previousWeight = weights[weights.length - 2].weight;
    const weightChange = latestWeight - previousWeight;

    const weightChangeText = `${Math.abs(weightChange).toFixed(2)} lbs`;
    const weightChangeClass = weightChange > 0 ? "weight-increase" : "weight-decrease";

    return (
      <div className="weight-change">
        <span className={weightChangeClass}>
          {weightChange > 0 ? <i className="bi bi-arrow-up-right"></i> : <i className="bi bi-arrow-down-left"></i>}
          {weightChangeText}
        </span>
      </div>
    );
  };

  const handleWeightChange = (event) => {
    setCurrentWeight(event.target.value);
  };

  const handleCalorieChange = (event) => {
    setCurrentCalories(event.target.value);
  };

  const addWeight = () => {
    if (currentWeight !== "") {
      const newWeights = [...weights, { name: new Date().toLocaleString("en-US", { dateStyle: "short" }), weight: parseFloat(currentWeight) }];
      setWeights(newWeights);
      setWeightIsDataCleared(false);
      setCurrentWeight("");
    }
  };

  const addCalories = () => {
    if (currentCalories !== "") {
      const newCalories = [...calories, { name: new Date().toLocaleString("en-US", { dateStyle: "short" }), calories: parseFloat(currentCalories) }];
      setCalories(newCalories);
      setCalorieIsDataCleared(false);
      setCurrentCalories("");
    }
  };

  const downloadData = () => {
    const jsonData = JSON.stringify(weights);
    const blob = new Blob([jsonData], { type: "application/json" });
    saveAs(blob, "weight_data.json");
  };

  const downloadCalorieData = () => {
    const jsonData = JSON.stringify(calories);
    const blob = new Blob([jsonData], { type: "application/json" });
    saveAs(blob, "calorie_data.json");
  };

  const clearData = () => {
    localStorage.clear();
    setWeights([]);
    setWeightIsDataCleared(true);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const contents = e.target.result;
      const parsedData = JSON.parse(contents);
      setWeights(parsedData);
    };

    reader.readAsText(file);
  };

  const handleCalorieFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const contents = e.target.result;
      const parsedData = JSON.parse(contents);
      setCalories(parsedData);
    };

    reader.readAsText(file);
  };

  const handleWeightUploadButtonClick = () => {
    fileInputRefWeight.current.click();
  };

  const handleCalorieUploadButtonClick = () => {
    fileInputRefCalorie.current.click();
  };

  return (
    <div className="Dashboard">
      <div className="left-side">
        <div className="inputbar-weight">
          <input type="number" onFocus={(e) => e.target.placeholder = ""} onBlur={(e) => e.target.placeholder = "Weight"} className="inputfield" placeholder="Weight" value={currentWeight} onChange={handleWeightChange} />
          <button className="addweightbutton" onClick={addWeight}>Add</button>
        </div>
        <div className="databuttondivider">
          <button className="databuttons" onClick={downloadData}>Download Weight Data</button>
          <input ref={fileInputRefWeight} type="file" accept=".json" style={{ display: "none" }} onChange={handleFileUpload} />
          <button className="databuttons" onClick={handleWeightUploadButtonClick}>Upload Weight Data</button>
        </div>
      </div>
      <div className="center">
        <button className="clear-data-button" onClick={clearData}>Clear All Data</button>
      </div>
      <div className="right-side">
        <div className="inputbar-calories">
          <input type="number" onFocus={(e) => e.target.placeholder = ""} onBlur={(e) => e.target.placeholder = "Calories"} className="inputfield" placeholder="Calories" value={currentCalories} onChange={handleCalorieChange} />
          <button className="addweightbutton" onClick={addCalories}>Add</button>
        </div>
        <div className="databuttondivider">
          <button className="databuttons" onClick={downloadCalorieData}>Download Calorie Data</button>
          <input ref={fileInputRefCalorie} type="file" accept=".json" style={{ display: "none" }} onChange={handleCalorieFileUpload} />
          <button className="databuttons" onClick={handleCalorieUploadButtonClick}>Upload Calorie Data</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;