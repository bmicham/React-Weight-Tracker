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
    const [isDataCleared, setIsDataCleared] = useState(false);
    const [selectedWeightIndex, setSelectedWeightIndex] = useState(null);
    const fileInputRef = useRef(null);

  const handleWeightChange = (event) => {
    setCurrentWeight(event.target.value);
  };

  const addWeight = () => {
    if (currentWeight !== "") {
      const newWeights = [...weights, { name: new Date().toLocaleString("en-US", { dateStyle: "short" }), weight: parseFloat(currentWeight) }];
      setWeights(newWeights);
      setIsDataCleared(false);
      setCurrentWeight("");
    }
  };

  const downloadData = () => {
    const jsonData = JSON.stringify(weights);
    const blob = new Blob([jsonData], { type: "application/json" });
    saveAs(blob, "weight_data.json");
  };

  const clearData = () => {
    localStorage.clear();
    setWeights([]);
    setIsDataCleared(true);
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

  const handleUploadButtonClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="Dashboard">
        <div className="inputbar">
            <input type="number" onFocus={(e) => e.target.placeholder = ""} onBlur={(e) => e.target.placeholder = "Weight"} className="inputfield" placeholder="Weight" value={currentWeight} onChange={handleWeightChange} />
            <button className="addweightbutton" onClick={addWeight}>Add</button>
        </div>
        <div className="databuttondivider">
            <button className="databuttons" onClick={downloadData}>Download Data</button>
            <button className="databuttons" onClick={clearData}>Clear Data</button>
            <input ref={fileInputRef} type="file" accept=".json" style={{ display: "none" }} onChange={handleFileUpload} />
            <button className="databuttons" onClick={handleUploadButtonClick}>Upload Data</button>
        </div>
    </div>
  );
};

export default Dashboard;