import React from "react";
import "./style.css";

function Footer() {
  return (
    <div className="footer">
      <div className="footer-top">
        <div className="footer-top-in max">
          <h3>Have questions? Read our FAQ’s</h3>
          <a>Find Answers</a>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="footer-bottom-in max">
        
          <div className="fbi-r">
            <ul className="fbi-links">
              <li>
                <a href="#">Privacy Policy</a>
              </li>
              <li>
                <a href="#">Terms of Service</a>
              </li>
              <li>
                <a href="#">Contact Us</a>
              </li>
              <li>
                <a href="#">Passenger Ticket Contract</a>
              </li>
              <li>
                <a href="#">Carrier Information</a>
              </li>
            </ul>
          </div>
            <div className="fbi-l">
            <p>© 2025 Flying Safari. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
