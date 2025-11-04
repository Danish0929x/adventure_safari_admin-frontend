import React, { useState, useMemo, useEffect } from "react";
import CustomTable from "../../components/custome-table/CustomTable";
import "./Trips.css";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  Edit,
  Trash2,
  Plus,
  Power,
  Globe2,
  CheckCircle,
  XCircle,
  DollarSign,
} from "lucide-react";
import {
  deleteTrip,
  getAllTrips,
  toggleTripStatus,
} from "../../services/admin";
import Loader2 from "../../components/loader/Loader2";

const Trips = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    totalRevenue: 0,
  });

  const navigate = useNavigate();

  // Fetch trips from API
  const fetchTrips = async () => {
    try {
      setLoading(true);
      setError("");
      const tripsData = await getAllTrips();
      setTrips(tripsData);

      // Calculate statistics
      calculateStats(tripsData);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching trips:", err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate trip statistics
  const calculateStats = (tripsData) => {
    const total = tripsData.length;
    const active = tripsData.filter((trip) => trip.isActive).length;
    const inactive = tripsData.filter((trip) => !trip.isActive).length;
    const totalRevenue = tripsData.reduce(
      (sum, trip) => sum + (trip.price || 0),
      0
    );

    setStats({ total, active, inactive, totalRevenue });
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  // Handle delete trip
  const handleDelete = async (tripId) => {
    if (window.confirm("Are you sure you want to delete this trip?")) {
      try {
        await deleteTrip(tripId);
        const updatedTrips = trips.filter((trip) => trip._id !== tripId);
        setTrips(updatedTrips);
        calculateStats(updatedTrips);
        alert("Trip deleted successfully");
      } catch (err) {
        alert("Error deleting trip: " + err.message);
      }
    }
  };

  // Handle toggle status
  const handleToggleStatus = async (tripId) => {
    try {
      const updatedTrip = await toggleTripStatus(tripId);
      const updatedTrips = trips.map((trip) =>
        trip._id === tripId ? updatedTrip.trip : trip
      );
      setTrips(updatedTrips);
      calculateStats(updatedTrips);
      alert(
        `Trip ${
          updatedTrip.trip.isActive ? "activated" : "deactivated"
        } successfully`
      );
    } catch (err) {
      alert("Error toggling trip status: " + err.message);
    }
  };

  // Define table columns
  const columns = useMemo(
    () => [
      {
        Header: "Image",
        accessor: "image",
        Cell: ({ value }) => (
          <img
            src={value || "https://via.placeholder.com/50"}
            alt="Trip"
            style={{
              width: "50px",
              height: "50px",
              objectFit: "cover",
              borderRadius: "8px",
            }}
          />
        ),
      },
      { Header: "Trip Name", accessor: "name" },
      { Header: "Destination", accessor: "destination" },
      {
        Header: "Price",
        accessor: "price",
        Cell: ({ value }) => `$${value || 0}`,
      },
      {
        Header: "Status",
        accessor: "isActive",
        Cell: ({ value }) => (
          <span className={`status ${value ? "active" : "inactive"}`}>
            {value ? "Active" : "Inactive"}
          </span>
        ),
      },
      {
        Header: "Created",
        accessor: "createdAt",
        Cell: ({ value }) =>
          value ? new Date(value).toLocaleDateString() : "N/A",
      },
      {
        Header: "Actions",
        accessor: "_id",
        Cell: ({ value, row }) => (
          <div className="action-buttons">
            <button
              className="action-btn view"
              onClick={() => navigate(`/dashboard/trips/${value}`)}
              title="View Details"
            >
              <Eye size={20} strokeWidth={2.3} />
            </button>
            <button
              className="action-btn edit"
              onClick={() => navigate(`/dashboard/trips/edit/${value}`)}
              title="Edit Trip"
            >
              <Edit size={20} strokeWidth={2.3} />
            </button>
            <button
              className="action-btn toggle"
              onClick={() => handleToggleStatus(value)}
              title={row.original.isActive ? "Deactivate" : "Activate"}
            >
              <Power size={20} strokeWidth={2.3} />
            </button>
            <button
              className="action-btn delete"
              onClick={() => handleDelete(value)}
              title="Delete Trip"
            >
              <Trash2 size={20} strokeWidth={2.3} />
            </button>
          </div>
        ),
      },
    ],
    [trips, navigate]
  );

  const handleNewTrip = () => navigate("/dashboard/trips/new");

  if (loading) {
    return (
      <div className="trips-container">
        <div className="trips-header">
          <h1>Trip Management</h1>
        </div>
        <div className="loading">
          <Loader2 />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="trips-container">
        <div className="trips-header">
          <h1>Trip Management</h1>
          <p>Manage all your travel destinations and packages</p>
        </div>
        <div className="error">
          Error: {error}
          <button onClick={fetchTrips} className="retry-btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="trips-container">
      <div className="trips-header">
        <div className="header-top">
          <div className="header-text">
            <h1>Trip Management</h1>
            <p>Manage all your travel destinations and packages</p>
          </div>
          <button className="new-trip-btn" onClick={handleNewTrip}>
            <Plus size={20} />
            Add New Trip
          </button>
        </div>
      </div>

      <div className="trips-content">
        {/* Trip Statistics */}
        <div className="trips-stats">
          <div className="stat-card">
            <div className="stat-icon total">
              <Globe2 size={26} />
            </div>
            <div className="stat-info">
              <h3>{stats.total}</h3>
              <p>Total Trips</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon active">
              <CheckCircle size={26} />
            </div>
            <div className="stat-info">
              <h3>{stats.active}</h3>
              <p>Active Trips</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon inactive">
              <XCircle size={26} />
            </div>
            <div className="stat-info">
              <h3>{stats.inactive}</h3>
              <p>Inactive Trips</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon revenue">
              <DollarSign size={26} />
            </div>
            <div className="stat-info">
              <h3>${stats.totalRevenue}</h3>
              <p>Total Value</p>
            </div>
          </div>
        </div>

        {/* Table */}
        <CustomTable
          columns={columns}
          data={trips}
          heading={`All Trips (${trips.length})`}
          showSearch={true}
          showEntries={true}
          showPagination={true}
        />
      </div>
    </div>
  );
};

export default Trips;
