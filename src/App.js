import React, { useState, useEffect, useRef } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ReferenceLine } from "recharts";
import { saveAs } from "file-saver";
import "./App.css";

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

const App = () => {
  const [weights, setWeights] = useLocalStorage("weights", []);
  const [currentWeight, setCurrentWeight] = useState("");
  const [isDataCleared, setIsDataCleared] = useState(false);
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
  <div className="App">
      <h1 className="Header">Weight Tracker</h1>

      <div className="InputBar">
  <input type="number" className="InputField" value={currentWeight} onChange={handleWeightChange} />
  <button className="AddButton" onClick={addWeight}>Add</button>
  </div>

      <div className="ButtonDivider">

      <button className="Buttons" onClick={downloadData}>Download Data</button>
      <button className="Buttons" onClick={clearData}>Clear Data</button>
      <input ref={fileInputRef} type="file" accept=".json" style={{ display: "none" }} onChange={handleFileUpload} />
      <button className="Buttons" onClick={handleUploadButtonClick}>Upload Data</button>
      </div>
      
      {!isDataCleared && (
        <div className="Graph">
          <LineChart width={1000} height={600} data={weights}>
            <XAxis dataKey="name" />
            <YAxis domain={[170, 215]} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="weight" stroke="#2b8df0" strokeWidth={2} />
            <ReferenceLine y={210} label="Goal" stroke="#fb6b30" strokeWidth={4}/>
          </LineChart>
        </div>
      )}
    </div>
  );
};

export default App;
