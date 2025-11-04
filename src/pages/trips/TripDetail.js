import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Power,
  MapPin,
  DollarSign,
  Calendar,
} from "lucide-react";
import "./TripDetail.css";
import {
  deleteTrip,
  getTripById,
  toggleTripStatus,
} from "../../services/admin";
import Loader2 from "../../components/loader/Loader2";

const TripDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTripDetail();
  }, [id]);

  const fetchTripDetail = async () => {
    try {
      setLoading(true);
      setError("");
      const tripData = await getTripById(id);
      setTrip(tripData);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching trip:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    navigate(`/dashboard/trips/edit/${id}`);
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this trip?")) {
      try {
        await deleteTrip(id);
        alert("Trip deleted successfully");
        navigate("/dashboard/trips");
      } catch (err) {
        alert("Error deleting trip: " + err.message);
      }
    }
  };

  const handleToggleStatus = async () => {
    try {
      const updatedTrip = await toggleTripStatus(id);
      setTrip(updatedTrip.trip);
      alert(
        `Trip ${
          updatedTrip.trip.isActive ? "activated" : "deactivated"
        } successfully`
      );
    } catch (err) {
      alert("Error toggling trip status: " + err.message);
    }
  };

  const handleBack = () => {
    navigate("/dashboard/trips");
  };

  if (loading) {
    return (
      <div className="trip-detail-container">
        <div className="loading">
          <Loader2 />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="trip-detail-container">
        <div className="error">
          Error: {error}
          <button onClick={fetchTripDetail} className="retry-btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="trip-detail-container">
        <div className="error">Trip not found</div>
      </div>
    );
  }

  return (
    <div className="trip-detail-container">
      <div className="trip-detail-header">
        <button className="back-btn" onClick={handleBack}>
          <ArrowLeft size={20} />
          Back to Trips
        </button>
        <div className="header-actions">
          <button className="trip-action-btn edit" onClick={handleEdit}>
            <Edit size={18} />
            Edit
          </button>
          <button
            className="trip-action-btn toggle"
            onClick={handleToggleStatus}
          >
            <Power size={18} />
            {trip.isActive ? "Deactivate" : "Activate"}
          </button>
          <button className="trip-action-btn delete" onClick={handleDelete}>
            <Trash2 size={18} />
            Delete
          </button>
        </div>
      </div>

      <div className="trip-detail-content">
        <div className="trip-image-section">
          <img src={trip.image} alt={trip.name} className="trip-detail-image" />
          <span
            className={`status-badge ${trip.isActive ? "active" : "inactive"}`}
          >
            {trip.isActive ? "Active" : "Inactive"}
          </span>
        </div>

        <div className="trip-info-section">
          <h1 className="trip-title">{trip.name}</h1>

          <div className="trip-meta">
            <div className="meta-item">
              <MapPin className="meta-icon" />
              <div className="meta-content">
                <span className="meta-label">Destination</span>
                <span className="meta-value">{trip.destination}</span>
              </div>
            </div>

            <div className="meta-item">
              <DollarSign className="meta-icon" />
              <div className="meta-content">
                <span className="meta-label">Price</span>
                <span className="meta-value">${trip.price}</span>
              </div>
            </div>

            <div className="meta-item">
              <Calendar className="meta-icon" />
              <div className="meta-content">
                <span className="meta-label">Created On</span>
                <span className="meta-value">
                  {new Date(trip.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>

            {trip.updatedAt && trip.updatedAt !== trip.createdAt && (
              <div className="meta-item">
                <Calendar className="meta-icon" />
                <div className="meta-content">
                  <span className="meta-label">Last Updated</span>
                  <span className="meta-value">
                    {new Date(trip.updatedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="trip-details-card">
            <h3>Trip Details</h3>
            <div className="detail-row">
              <span className="detail-label">Trip ID:</span>
              <span className="detail-value">{trip._id}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Status:</span>
              <span
                className={`detail-value status ${
                  trip.isActive ? "active" : "inactive"
                }`}
              >
                {trip.isActive ? "Available for Booking" : "Not Available"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripDetail;
