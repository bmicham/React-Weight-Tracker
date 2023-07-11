import React, { useEffect, useState } from "react";
import logo from "../assets/logo/logo.png";
import user from "../assets/github.png";
import dashboard from "../assets/dashboard.png";

import MenuItem from "./MenuItem";

/**
 * @author
 * @function SideMenu
 **/

export const menuItems = [
  {
    name: "Dashboard",
    exact: true,
    to: "/",
    iconClassName: "bi bi-text-center",
  },
  { name: "Progress Tracker", to: `/Progress-Tracker`, iconClassName: "bi bi-graph-up" },
  { name: "Weight Table", to: `/Weight-Table`, iconClassName: "bi bi-calendar3" },
  { name: "Calorie Table", to: `/Calorie-Table`, iconClassName: "bi bi-calendar-day" },
];

const SideMenu = (props) => {
  const [inactive, setInactive] = useState(false);

  const removeActiveClassFromSubMenu = () => {
    document.querySelectorAll(".sub-menu").forEach((el) => {
      el.classList.remove("active");
    });
  };

  useEffect(() => {
    let menuItems = document.querySelectorAll(".menu-item");
    menuItems.forEach((el) => {
      el.addEventListener("click", (e) => {
        const next = el.nextElementSibling;
        removeActiveClassFromSubMenu();
        menuItems.forEach((el) => el.classList.remove("active"));
        el.classList.toggle("active");
        console.log(next);
        if (next !== null) {
          next.classList.toggle("active");
        }
      });
    });
  }, []);

  return (
    <div className={`side-menu ${inactive ? "inactive" : ""}`}>
      <div className="top-section">
        <div className="logo">
          <img src={logo} alt="webscript" />
        </div>
      </div>
      <div className="divider"></div>
      <div className="main-menu">
        <ul>
          {menuItems.map((menuItem, index) => (
            <MenuItem
              key={index}
              name={menuItem.name}
              exact={menuItem.exact}
              to={menuItem.to}
              subMenus={menuItem.subMenus || []}
              iconClassName={menuItem.iconClassName}
              onClick={(e) => {
                if (inactive) {
                  setInactive(false);
                }
              }}
            />
          ))}
        </ul>
      </div>

      <div className="side-menu-footer">
        <div className="avatar">
          <a href="https://github.com/bmicham/React-Weight-Tracker" target="_blank" rel="noreferrer">
          <img src={user} alt="user"></img>
          </a>
        </div>
      </div>
    </div>
  );
};

export default SideMenu;
