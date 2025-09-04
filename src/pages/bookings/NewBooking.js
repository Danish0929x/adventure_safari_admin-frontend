import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import './NewBooking.css';
import { getAllUsers, getAllTrips, createBooking } from '../../services/admin';

function NewBooking() {
  const [formData, setFormData] = useState({
    userId: '',
    tripId: '',
    guests: [{ name: '', age: '', passport: '' }],
    travelDate: ''
  });
  const [users, setUsers] = useState([]);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const usersData = await getAllUsers();
        setUsers(usersData);
      } catch (err) {
        toast.error('Failed to fetch users');
      }
      try {
        const tripsData = await getAllTrips();
        setTrips(tripsData);
      } catch (err) {
        toast.error('Failed to fetch trips');
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGuestChange = (index, field, value) => {
    const updatedGuests = [...formData.guests];
    updatedGuests[index][field] = value;
    setFormData(prev => ({
      ...prev,
      guests: updatedGuests
    }));
  };

  const addGuest = () => {
    setFormData(prev => ({
      ...prev,
      guests: [...prev.guests, { name: '', age: '', passport: '' }]
    }));
  };

  const removeGuest = (index) => {
    if (formData.guests.length > 1) {
      const updatedGuests = formData.guests.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        guests: updatedGuests
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Validate form data
      if (!formData.userId || !formData.tripId || !formData.travelDate) {
        toast.error('Please fill in all required fields');
        setSubmitting(false);
        return;
      }

      // Validate guest information
      for (let i = 0; i < formData.guests.length; i++) {
        const guest = formData.guests[i];
        if (!guest.name || !guest.age || !guest.passport) {
          toast.error(`Please fill in all details for Guest ${i + 1}`);
          setSubmitting(false);
          return;
        }
      }

      // Create booking using the service
      const bookingData = {
        userId: formData.userId,
        tripId: formData.tripId,
        guests: formData.guests,
        travelDate: formData.travelDate
      };

      const result = await createBooking(bookingData);
      
      toast.success('Booking created successfully!');
      navigate('/dashboard/bookings');
    } catch (error) {
      console.error('Booking creation error:', error);
      toast.error(error.message || 'Failed to create booking. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="new-booking-container">
      <div className="header-section">
        <button className="back-button" onClick={() => navigate('/dashboard/bookings')}>
          <i className="fas fa-arrow-left"></i>
          Back to Bookings
        </button>
        <h1>Create New Booking</h1>
        <p>Fill in the details to create a new booking</p>
      </div>

      {loading && users.length === 0 && (
        <div className="loading-message">Loading data...</div>
      )}

      <div className="form-container">
        <form onSubmit={handleSubmit}>
          {/* Booking Information */}
          <div className="form-section">
            <h2>Booking Information</h2>
            
            <div className="form-grid">
              <div className="form-field">
                <label htmlFor="userId">Select Customer *</label>
                <select
                  id="userId"
                  name="userId"
                  value={formData.userId}
                  onChange={handleInputChange}
                  required
                  disabled={submitting}
                >
                  <option value="">Choose a customer</option>
                  {users.map(user => (
                    <option key={user._id} value={user._id}>
                      {user.name} ({user.email})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <label htmlFor="tripId">Select Trip *</label>
                <select
                  id="tripId"
                  name="tripId"
                  value={formData.tripId}
                  onChange={handleInputChange}
                  required
                  disabled={submitting}
                >
                  <option value="">Choose a trip</option>
                  {trips.map(trip => (
                    <option key={trip._id} value={trip._id}>
                      {trip.name} - {trip.destination} (${trip.price})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <label htmlFor="travelDate">Travel Date *</label>
                <input
                  type="date"
                  id="travelDate"
                  name="travelDate"
                  value={formData.travelDate}
                  onChange={handleInputChange}
                  required
                  min={new Date().toISOString().split('T')[0]}
                  disabled={submitting}
                />
              </div>
            </div>
          </div>

          {/* Guest Information */}
          <div className="form-section">
            <div className="section-header">
              <h2>Guest Information</h2>
              <button 
                type="button" 
                onClick={addGuest} 
                className="add-button"
                disabled={submitting}
              >
                <i className="fas fa-plus"></i>
                Add Guest
              </button>
            </div>

            <div className="guests-container">
              {formData.guests.map((guest, index) => (
                <div key={index} className="guest-card">
                  <div className="guest-header">
                    <h3>Guest {index + 1}</h3>
                    {formData.guests.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeGuest(index)}
                        className="remove-button"
                        disabled={submitting}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    )}
                  </div>

                  <div className="guest-form-grid">
                    <div className="form-field">
                      <label htmlFor={`name-${index}`}>Full Name *</label>
                      <input
                        type="text"
                        id={`name-${index}`}
                        placeholder="Enter full name"
                        value={guest.name}
                        onChange={(e) => handleGuestChange(index, 'name', e.target.value)}
                        required
                        disabled={submitting}
                      />
                    </div>

                    <div className="form-field">
                      <label htmlFor={`age-${index}`}>Age *</label>
                      <input
                        type="number"
                        id={`age-${index}`}
                        placeholder="Enter age"
                        min="1"
                        max="120"
                        value={guest.age}
                        onChange={(e) => handleGuestChange(index, 'age', e.target.value)}
                        required
                        disabled={submitting}
                      />
                    </div>

                    <div className="form-field">
                      <label htmlFor={`passport-${index}`}>Passport Number *</label>
                      <input
                        type="text"
                        id={`passport-${index}`}
                        placeholder="Enter passport number"
                        value={guest.passport}
                        onChange={(e) => handleGuestChange(index, 'passport', e.target.value)}
                        required
                        disabled={submitting}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/dashboard/bookings')}
              className="cancel-button"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || loading}
              className="submit-button"
            >
              {submitting ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Creating Booking...
                </>
              ) : (
                <>
                  <i className="fas fa-check"></i>
                  Create Booking
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewBooking;