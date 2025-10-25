import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../home/Home";
import Footer from "../../components/footer/Footer";
import Header from "../../components/header/Header";
import Loader from "../../components/loader/Loader";
import Users from "../all-users/Users";
import Bookings from "../bookings/Bookings";
import NewBooking from "../bookings/NewBooking";
import Trips from "../trips/Trips";
import TripForm from "../trips/TripForm";
import TripDetail from "../trips/TripDetail";

function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleLoad = () => setIsLoading(false);

    if (document.readyState === "complete") {
      setIsLoading(false);
    } else {
      window.addEventListener("load", handleLoad);
      return () => window.removeEventListener("load", handleLoad);
    }
  }, []);

  return (
    <>
      {isLoading && <Loader />}

      <div className={`home ${isLoading ? "content-loading" : ""}`}>
        <div className="dashboard-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/users" element={<Users />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/new-booking" element={<NewBooking />} />
            <Route path="/trips" element={<Trips />} />
            <Route path="/trips/new" element={<TripForm />} />
            <Route path="/trips/edit/:id" element={<TripForm />} />
            <Route path="/trips/:id" element={<TripDetail />} />

            {/* Add more routes as needed */}
          </Routes>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
