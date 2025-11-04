import React from "react";
import "./Loader2.css";

function Loader2({ overlay = false }) {
  return (
    <div className={overlay ? "loader2-overlay" : "loader2-container"}>
      <div className="loader2-bouncing-squares">
        <div className="loader2-square loader2-square-1"></div>
        <div className="loader2-square loader2-square-2"></div>
        <div className="loader2-square loader2-square-3"></div>
      </div>
    </div>
  );
}

export default Loader2;
