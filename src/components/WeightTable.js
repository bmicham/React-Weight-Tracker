import React, { useState, useEffect } from "react";

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

const WeightTable = () => {
  const [weights, setWeights] = useLocalStorage("weights", []);
  const [currentWeight, setCurrentWeight] = useState("");
  const [selectedWeightIndex, setSelectedWeightIndex] = useState(null);

  const handleWeightChange = (event) => {
    setCurrentWeight(event.target.value);
  };

  const editWeight = (index) => {
    setSelectedWeightIndex(index);
    setCurrentWeight(weights[index].weight.toString());
  };

  const saveEdit = () => {
    if (currentWeight !== "" && selectedWeightIndex !== null) {
      const updatedWeights = [...weights];
      updatedWeights[selectedWeightIndex] = {
        ...updatedWeights[selectedWeightIndex],
        weight: parseFloat(currentWeight),
      };
      setWeights(updatedWeights);
      setCurrentWeight("");
      setSelectedWeightIndex(null);
    }
  };

  const cancelEdit = () => {
    setCurrentWeight("");
    setSelectedWeightIndex(null);
  };

  return (
    <div className="weighttable-container">
    <div className="weighttable">
      <table className="table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Weight</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {weights.map((weight, index) => (
            <tr key={index}>
              <td>{weight.name}</td>
              <td>
                {selectedWeightIndex === index ? (
                  <input
                    type="number"
                    className="inputfield-weight"
                    value={currentWeight}
                    onChange={handleWeightChange}
                  />
                ) : (
                  <span className="WeightValue DarkWeight">{weight.weight}</span>
                )}
              </td>
              <td>
                {selectedWeightIndex === index ? (
                  <div>
                    <button className="savebutton" onClick={saveEdit}>
                      Save
                    </button>
                    <button className="cancelbutton" onClick={cancelEdit}>
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button className="editbutton" onClick={() => editWeight(index)}>
                    Edit
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
  );
};

export default WeightTable;