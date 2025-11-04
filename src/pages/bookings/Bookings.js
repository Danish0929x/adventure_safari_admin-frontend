import React, { useState, useMemo, useEffect } from "react";
import CustomTable from "../../components/custome-table/CustomTable";
import { getAllBookings } from "../../services/admin";
import "./Bookings.css";
import { useNavigate } from "react-router-dom";
import Loader2 from "../../components/loader/Loader2";

// ✅ React Icons
import {
  FaCheckCircle,
  FaHourglassHalf,
  FaTimesCircle,
  FaDollarSign,
  FaPlus,
} from "react-icons/fa";
import { FaEye } from "react-icons/fa";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({
    confirmed: 0,
    pending: 0,
    cancelled: 0,
    revenue: 0,
  });

  const navigate = useNavigate();

  // Fetch bookings from API
  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError("");
      const bookingsData = await getAllBookings();
      console.log("Fetched bookings:", bookingsData);
      setBookings(bookingsData);

      // Calculate statistics
      calculateStats(bookingsData);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate booking statistics
  const calculateStats = (bookingsData) => {
    const confirmed = bookingsData.filter(
      (b) => b.bookingStatus?.toLowerCase() === "confirmed"
    ).length;

    const pending = bookingsData.filter(
      (b) => b.bookingStatus?.toLowerCase() === "pending"
    ).length;

    const cancelled = bookingsData.filter(
      (b) => b.bookingStatus?.toLowerCase() === "cancelled"
    ).length;

    const revenue = bookingsData.reduce((total, b) => {
      if (b.bookingStatus?.toLowerCase() !== "cancelled") {
        if (
          b.registrationPaymentDetails?.amount &&
          b.registrationPaymentDetails?.status === "paid"
        ) {
          return total + b.registrationPaymentDetails.amount;
        }
      }
      return total;
    }, 0);

    setStats({ confirmed, pending, cancelled, revenue });
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const getRandomProgress = () => {
    const options = [20, 40, 60, 80];
    return options[Math.floor(Math.random() * options.length)];
  };

  // ✅ Define table columns
  const columns = useMemo(
    () => [
      {
        Header: "Booking ID",
        accessor: "bookingId",
        Cell: ({ value }) => value || "N/A",
      },
      { Header: "Customer Name", accessor: (row) => row.userId?.name || "N/A" },
      { Header: "Email", accessor: (row) => row.userId?.email || "N/A" },
      { Header: "Trip", accessor: (row) => row.tripId?.name || "Trip Deleted" },
      {
        Header: "View",
        accessor: "_id",
        Cell: ({ value }) => (
          <button
            className="action-btn view"
            onClick={() => navigate(`/dashboard/booking-details/${value}`)}
            title="View Details"
          >
            <FaEye size={18} />
          </button>
        ),
      },
      {
        Header: "Destination",
        accessor: (row) => row.tripId?.destination || "N/A",
      },
      {
        Header: "Booking Date",
        accessor: "bookingDate",
        Cell: ({ value }) =>
          value ? new Date(value).toLocaleDateString() : "N/A",
      },
      {
        Header: "Guests",
        accessor: "guests",
        Cell: ({ value }) => (Array.isArray(value) ? value.length : 0),
      },
      {
        Header: "Status",
        accessor: "bookingStatus",
        Cell: ({ value }) => {
          const status = value?.toLowerCase() || "pending";
          let progress = 0;

          if (status === "pending") progress = getRandomProgress();
          else if (status === "confirmed") progress = 100;
          else if (status === "cancelled") progress = 0;

          return (
            <div className="status-container">
              <div className="status-progress-bar">
                <div
                  className={`progress-fill ${status}`}
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <span className={`status-text ${status}`}>
                {value || "Pending"} ({progress}%)
              </span>
            </div>
          );
        },
      },
      {
        Header: "Payment Status",
        accessor: "paymentStatus",
        Cell: ({ value }) => (
          <span className={`payment-badge ${value?.toLowerCase()}`}>
            {value || "Pending"}
          </span>
        ),
      },
      {
        Header: "Registration Fee",
        accessor: (row) => row.registrationPaymentDetails?.amount || 0,
        Cell: ({ value }) => `$${value}`,
      },
      {
        Header: "Trip Price",
        accessor: (row) => row.tripId?.price || 0,
        Cell: ({ value }) => `$${value}`,
      },
      {
        Header: "Created On",
        accessor: "createdAt",
        Cell: ({ value }) =>
          value ? new Date(value).toLocaleDateString() : "N/A",
      },
    ],
    [navigate]
  );

  const handleNewBooking = () => navigate("/dashboard/new-booking");

  if (loading) {
    return (
      <div className="bookings-container">
        <div className="bookings-header">
          <h1>Booking Management</h1>
        </div>
        <div className="loading">
          <Loader2 />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bookings-container">
        <div className="bookings-header">
          <h1>Booking Management</h1>
          <p>View and manage all customer bookings</p>
        </div>
        <div className="error">
          Error: {error}
          <button onClick={fetchBookings} className="retry-btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bookings-container">
      <div className="bookings-header">
        <div className="header-top">
          <div className="header-text">
            <h1>Booking Management</h1>
            <p>View and manage all customer bookings</p>
          </div>
          <button onClick={handleNewBooking} className="new-booking-btn">
            <FaPlus size={16} /> New Booking
          </button>
        </div>
      </div>

      <div className="bookings-content">
        {/* ✅ Stats Section */}
        <div className="bookings-stats">
          <div className="stat-card">
            <div className="stat-icon confirmed">
              <FaCheckCircle />
            </div>
            <div className="stat-info">
              <h3>{stats.confirmed}</h3>
              <p>Confirmed Bookings</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon pending">
              <FaHourglassHalf />
            </div>
            <div className="stat-info">
              <h3>{stats.pending}</h3>
              <p>Pending Bookings</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon cancelled">
              <FaTimesCircle />
            </div>
            <div className="stat-info">
              <h3>{stats.cancelled}</h3>
              <p>Cancelled Bookings</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon revenue">
              <FaDollarSign />
            </div>
            <div className="stat-info">
              <h3>${stats.revenue}</h3>
              <p>Total Revenue</p>
            </div>
          </div>
        </div>

        {/* ✅ Table */}
        <CustomTable
          columns={columns}
          data={bookings}
          heading={`All Bookings (${bookings.length})`}
          showSearch={true}
          showEntries={true}
          showPagination={true}
        />
      </div>
    </div>
  );
};

export default Bookings;
