import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import './style.css'; // Import the CSS file
import { getDashboardStats } from "../../services/dashboard";

function Home() {
  const [cardData, setCardData] = useState([
    { title: "Total Users", value: "0", icon: "👥" },
    { title: "Users Registered Today", value: "0", icon: "✨" },
    { title: "Total Bookings", value: "0", icon: "📋" },
    { title: "Today's Bookings", value: "0", icon: "📅" }
  ]);

  const [userGrowthData, setUserGrowthData] = useState([]);
  const [bookingData, setBookingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const data = await getDashboardStats();

        setCardData(data.cardData);
        setUserGrowthData(data.userGrowthData);
        setBookingData(data.weeklyBookingsData);
        setError(null);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError(err.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Dashboard</h1>
          <p className="dashboard-subtitle">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Dashboard</h1>
          <p className="dashboard-subtitle" style={{ color: 'red' }}>Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <h1 className="dashboard-title">Dashboard</h1>
        <p className="dashboard-subtitle">Overview of users and bookings</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        {cardData.map((card, index) => (
          <div key={index} className="stat-card">
            <div className="stat-card-header">
              <h3 className="stat-card-title">{card.title}</h3>
              <span className="stat-card-icon">{card.icon}</span>
            </div>
            <div className="stat-card-value">{card.value}</div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="charts-grid">
        {/* User Growth Chart */}
        <div className="chart-container">
          <h3 className="chart-title">User Growth Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={userGrowthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 12, fill: '#666' }}
                stroke="#ccc"
              />
              <YAxis 
                tick={{ fontSize: 12, fill: '#666' }}
                stroke="#ccc"
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e5e5',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="users" 
                stroke="#fbaf3f" 
                strokeWidth={3}
                dot={{ fill: '#fbaf3f', strokeWidth: 2, r: 5 }}
                activeDot={{ r: 7, fill: '#473d34' }}
                name="Total Users"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Weekly Bookings Chart */}
        <div className="chart-container">
          <h3 className="chart-title">Weekly Bookings</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={bookingData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="day" 
                tick={{ fontSize: 12, fill: '#666' }}
                stroke="#ccc"
              />
              <YAxis 
                tick={{ fontSize: 12, fill: '#666' }}
                stroke="#ccc"
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e5e5',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              />
              <Legend />
              <Bar 
                dataKey="bookings" 
                fill="#473d34"
                name="Daily Bookings"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default Home;