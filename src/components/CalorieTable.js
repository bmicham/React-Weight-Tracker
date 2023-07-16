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

const CalorieTable = () => {
  const [calories, setCalories] = useLocalStorage("calories", []);
  const [currentCalories, setCurrentCalories] = useState("");
  const [selectedCalorieIndex, setSelectedCalorieIndex] = useState(null);

  const handleCalorieChange = (event) => {
    setCurrentCalories(event.target.value);
  };

  const editCalories = (index) => {
    setSelectedCalorieIndex(index);
    setCurrentCalories(calories[index].calories.toString());
  };

  const saveEdit = () => {
    if (currentCalories !== "" && selectedCalorieIndex !== null) {
      const updatedCalories = [...calories];
      updatedCalories[selectedCalorieIndex] = {
        ...updatedCalories[selectedCalorieIndex],
        calories: parseFloat(currentCalories),
      };
      setCalories(updatedCalories);
      setCurrentCalories("");
      setSelectedCalorieIndex(null);
    }
  };

  const cancelEdit = () => {
    setCurrentCalories("");
    setSelectedCalorieIndex(null);
  };

  return (
    <div className="calorietable-container">
    <div className="calorietable">
      <table className="table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Calories</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {calories.map((calories, index) => (
            <tr key={index}>
              <td>{calories.name}</td>
              <td>
                {selectedCalorieIndex === index ? (
                  <input
                    type="number"
                    className="inputfield-calories"
                    value={currentCalories}
                    onChange={handleCalorieChange}
                  />
                ) : (
                  <span className="CalorieValue DarkWeight">{calories.calories}</span>
                )}
              </td>
              <td>
                {selectedCalorieIndex === index ? (
                  <div>
                    <button className="savebutton" onClick={saveEdit}>
                      Save
                    </button>
                    <button className="cancelbutton" onClick={cancelEdit}>
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button className="editbutton" onClick={() => editCalories(index)}>
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

export default CalorieTable;