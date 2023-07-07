import "./App.css";
import SideMenu, { menuItems } from "./components/SideMenu";
import Dashboard from "./components/Dashboard";
import ProgressTracker from "./components/ProgressTracker";
import WeightTable from "./components/WeightTable";
import CalorieTable from "./components/CalorieTable";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { useState } from "react";

const App = () => {
  const [inactive, setInactive] = useState(false);

  return (
    <div className="App">
      <Router>
        <SideMenu
          onCollapse={(inactive) => {
            console.log(inactive);
            setInactive(inactive);
          }}
        />
        <div className={`container ${inactive ? "inactive" : ""}`}>
          <Route exact path="/" component={Dashboard} />
          <Route path="/Progress-Tracker" component={ProgressTracker} />
          <Route path="/Weight-Table" component={WeightTable} />
          <Route path="/Calorie-Table" component={CalorieTable} />
        </div>
      </Router>
    </div>
  );
};

export default App;
