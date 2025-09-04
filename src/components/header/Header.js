import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./style.css";

function Header() {

  return (
    <>
      <div className="home-top">
        <div className="home-top-in max">
          <h3>#987981</h3>
          <h1>SOUTH AFRICA</h1>
          <h3>12 days Flying Safari</h3>
          <p>12 - September 23. 2025</p>
        </div>
      </div>

      <div className="guest-name">
        <div className="guest-name-in max">
          <span className="guest">Guest Name 1</span>
          <span className="guest">Guest Name 2</span>
        </div>
      </div>


    </>
  );
}

export default Header;