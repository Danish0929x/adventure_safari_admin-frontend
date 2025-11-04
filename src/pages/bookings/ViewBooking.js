import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBookingById } from "../../services/admin";
import "./ViewBooking.css";
import Loader2 from "../../components/loader/Loader2";

const ViewBooking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBookingDetails();
  }, [id]);

  const fetchBookingDetails = async () => {
    try {
      setLoading(true);
      setError("");
      const bookingData = await getBookingById(id);
      console.log("Booking details:", bookingData);
      setBooking(bookingData);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching booking details:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => navigate("/dashboard/bookings");

  const displayValue = (value) => {
    if (value === null || value === undefined || value === "") return "Pending";
    return value;
  };

  const formatDate = (date) => {
    if (!date) return "Pending";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateTime = (date) => {
    if (!date) return "Pending";
    return new Date(date).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    const s = status?.toLowerCase();
    switch (s) {
      case "confirmed":
      case "paid":
        return "confirmed";
      case "pending":
        return "pending";
      case "cancelled":
      case "refunded":
        return "cancelled";
      case "completed":
        return "completed";
      default:
        return "pending";
    }
  };

  if (loading)
    return (
      <div className="view-booking-container">
        <div className="loading">
          <Loader2 />
        </div>
      </div>
    );

  if (error)
    return (
      <div className="view-booking-container">
        <div className="error">
          <p>Error: {error}</p>
          <button onClick={fetchBookingDetails} className="retry-btn">
            Try Again
          </button>
          <button onClick={handleBack} className="back-btn-error">
            Back to Bookings
          </button>
        </div>
      </div>
    );

  if (!booking)
    return (
      <div className="view-booking-container">
        <div className="error">Booking not found</div>
      </div>
    );

  return (
    <div className="view-booking-container">
      {/* Header */}
      <div className="view-booking-header">
        <button onClick={handleBack} className="back-btn">
          <span>←</span> Back to Bookings
        </button>

        <div className="header-info">
          <h1>Booking Details</h1>
          <p className="booking-id">ID: {displayValue(booking.bookingId)}</p>
        </div>

        <div
          className={`status-badge ${getStatusColor(booking.bookingStatus)}`}
        >
          {displayValue(booking.bookingStatus)}
        </div>
      </div>

      {/* Main Content */}
      <div className="booking-details-content">
        {/* Customer Info */}
        <div className="details-section">
          <h2 className="section-title">Customer Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <label>User ID</label>
              <p>{displayValue(booking.userId?._id)}</p>
            </div>
            <div className="info-item">
              <label>Name</label>
              <p>{displayValue(booking.userId?.name)}</p>
            </div>
            <div className="info-item">
              <label>Email</label>
              <p>{displayValue(booking.userId?.email)}</p>
            </div>
            <div className="info-item">
              <label>Phone</label>
              <p>{displayValue(booking.userId?.phone)}</p>
            </div>
          </div>
        </div>

        {/* Trip Info */}
        <div className="details-section">
          <h2 className="section-title">Trip Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <label>Trip ID</label>
              <p>{displayValue(booking.tripId?._id)}</p>
            </div>
            <div className="info-item">
              <label>Trip Name</label>
              <p>{displayValue(booking.tripId?.name)}</p>
            </div>
            <div className="info-item">
              <label>Destination</label>
              <p>{displayValue(booking.tripId?.destination)}</p>
            </div>
            <div className="info-item">
              <label>Trip Price (per person)</label>
              <p className="price">${displayValue(booking.tripId?.price)}</p>
            </div>
          </div>
        </div>

        {/* Booking Info */}
        <div className="details-section">
          <h2 className="section-title">Booking Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <label>MongoDB ID</label>
              <p>{displayValue(booking._id)}</p>
            </div>
            <div className="info-item">
              <label>Booking ID</label>
              <p>{displayValue(booking.bookingId)}</p>
            </div>
            <div className="info-item">
              <label>Booking Date</label>
              <p>{formatDate(booking.bookingDate)}</p>
            </div>
            <div className="info-item">
              <label>Total Guests</label>
              <p>{displayValue(booking.guests?.length)}</p>
            </div>
            <div className="info-item">
              <label>Booking Status</label>
              <p>
                <span
                  className={`status-badge ${getStatusColor(
                    booking.bookingStatus
                  )}`}
                >
                  {displayValue(booking.bookingStatus)}
                </span>
              </p>
            </div>
            <div className="info-item">
              <label>Payment Status</label>
              <p>
                <span
                  className={`payment-badge ${getStatusColor(
                    booking.paymentStatus
                  )}`}
                >
                  {displayValue(booking.paymentStatus)}
                </span>
              </p>
            </div>
            <div className="info-item">
              <label>Acknowledged</label>
              <p>
                <span
                  className={`acknowledge-badge ${
                    booking.acknowledge ? "yes" : "no"
                  }`}
                >
                  {booking.acknowledge ? "Yes" : "No"}
                </span>
              </p>
            </div>
            <div className="info-item">
              <label>Created At</label>
              <p>{formatDateTime(booking.createdAt)}</p>
            </div>
            <div className="info-item">
              <label>Last Updated</label>
              <p>{formatDateTime(booking.updatedAt)}</p>
            </div>
            <div className="info-item">
              <label>Version</label>
              <p>{displayValue(booking.__v)}</p>
            </div>
          </div>
        </div>

        {/* Payment Info */}
        <div className="details-section payment-section">
          <h2 className="section-title">Registration Payment Details</h2>
          <div className="info-grid">
            <div className="info-item">
              <label>Transaction ID</label>
              <p>
                {displayValue(
                  booking.registrationPaymentDetails?.transactionId
                )}
              </p>
            </div>
            <div className="info-item">
              <label>Payment Status</label>
              <p>
                <span
                  className={`payment-badge ${getStatusColor(
                    booking.registrationPaymentDetails?.status
                  )}`}
                >
                  {displayValue(booking.registrationPaymentDetails?.status)}
                </span>
              </p>
            </div>
            <div className="info-item">
              <label>Amount</label>
              <p className="price">
                {displayValue(
                  booking.registrationPaymentDetails?.currency || "USD"
                )}{" "}
                ${displayValue(booking.registrationPaymentDetails?.amount)}
              </p>
            </div>
            <div className="info-item">
              <label>Payment Date</label>
              <p>
                {formatDateTime(
                  booking.registrationPaymentDetails?.paymentDate
                )}
              </p>
            </div>
            <div className="info-item">
              <label>Payer Name</label>
              <p>
                {displayValue(booking.registrationPaymentDetails?.payerName)}
              </p>
            </div>
            <div className="info-item">
              <label>Payer Email</label>
              <p>
                {displayValue(booking.registrationPaymentDetails?.payerEmail)}
              </p>
            </div>
          </div>
        </div>

        {/* Guest Info */}
        <div className="details-section guests-section">
          <h2 className="section-title">
            Guest Details ({booking.guests?.length || 0})
          </h2>
          <div className="guests-list">
            {booking.guests && booking.guests.length > 0 ? (
              booking.guests.map((guest, index) => (
                <div key={guest._id || index} className="guest-card">
                  <div className="guest-header">
                    <h3>Guest {index + 1}</h3>
                    <span className="guest-age">
                      Age: {displayValue(guest.age)}
                    </span>
                  </div>

                  <div className="guest-details">
                    {/* Basic Info */}
                    <div className="guest-subsection">
                      <h4>Basic Information</h4>
                      <div className="guest-info-grid">
                        <div className="guest-info-item">
                          <label>Guest ID</label>
                          <p>{displayValue(guest._id)}</p>
                        </div>
                        <div className="guest-info-item">
                          <label>Name</label>
                          <p>{displayValue(guest.name)}</p>
                        </div>
                        <div className="guest-info-item">
                          <label>Age</label>
                          <p>{displayValue(guest.age)}</p>
                        </div>
                        <div className="guest-info-item">
                          <label>Gender</label>
                          <p className="capitalize">
                            {displayValue(guest.gender)}
                          </p>
                        </div>
                        <div className="guest-info-item">
                          <label>Phone</label>
                          <p>{displayValue(guest.phone)}</p>
                        </div>
                        <div className="guest-info-item">
                          <label>Country</label>
                          <p>{displayValue(guest.country)}</p>
                        </div>
                        <div className="guest-info-item">
                          <label>State</label>
                          <p>{displayValue(guest.state)}</p>
                        </div>
                        <div className="guest-info-item full-width">
                          <label>Address</label>
                          <p>{displayValue(guest.address)}</p>
                        </div>
                        <div className="guest-info-item">
                          <label>Created At</label>
                          <p>{formatDateTime(guest.createdAt)}</p>
                        </div>
                        <div className="guest-info-item">
                          <label>Updated At</label>
                          <p>{formatDateTime(guest.updatedAt)}</p>
                        </div>
                      </div>
                    </div>

                    {/* Passport Info - ALWAYS SHOW */}
                    <div className="guest-subsection">
                      <h4>Passport Information</h4>
                      <div className="guest-info-grid">
                        <div className="guest-info-item">
                          <label>Passport Number</label>
                          <p>{displayValue(guest.passportNumber)}</p>
                        </div>
                        <div className="guest-info-item">
                          <label>Passport Country</label>
                          <p>{displayValue(guest.passportCountry)}</p>
                        </div>
                        <div className="guest-info-item">
                          <label>Issued On</label>
                          <p>{formatDate(guest.passportIssuedOn)}</p>
                        </div>
                        <div className="guest-info-item">
                          <label>Expires On</label>
                          <p>{formatDate(guest.passportExpiresOn)}</p>
                        </div>
                      </div>
                    </div>

                    {/* Emergency Contact - ALWAYS SHOW */}
                    <div className="guest-subsection">
                      <h4>Emergency Contact</h4>
                      <div className="guest-info-grid">
                        <div className="guest-info-item">
                          <label>Contact Name</label>
                          <p>{displayValue(guest.emergencyContactName)}</p>
                        </div>
                        <div className="guest-info-item">
                          <label>Contact Number</label>
                          <p>{displayValue(guest.emergencyContactNumber)}</p>
                        </div>
                      </div>
                    </div>

                    {/* Uploaded Documents - ALWAYS SHOW */}
                    <div className="guest-subsection">
                      <h4>Uploaded Documents</h4>
                      <div className="documents-grid">
                        <div className="document-item">
                          <label>Passport Copy</label>
                          {guest.passport ? (
                            <a
                              href={guest.passport}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="document-link"
                            >
                              View Document →
                            </a>
                          ) : (
                            <p>Pending</p>
                          )}
                        </div>
                        <div className="document-item">
                          <label>Medical Certificate</label>
                          {guest.medicalCertificate ? (
                            <a
                              href={guest.medicalCertificate}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="document-link"
                            >
                              View Document →
                            </a>
                          ) : (
                            <p>Pending</p>
                          )}
                        </div>
                        <div className="document-item">
                          <label>Travel Insurance</label>
                          {guest.travelInsurance ? (
                            <a
                              href={guest.travelInsurance}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="document-link"
                            >
                              View Document →
                            </a>
                          ) : (
                            <p>Pending</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-guests">No guest information available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewBooking;
