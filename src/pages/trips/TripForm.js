import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createTrip, updateTrip, getTripById } from '../../services/admin';
import { ArrowLeft } from 'lucide-react';
import './TripForm.css';

const TripForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    destination: '',
    price: '',
    image: '',
    isActive: true
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch trip data if editing
  useEffect(() => {
    if (isEditMode) {
      fetchTripData();
    }
  }, [id]);

  const fetchTripData = async () => {
    try {
      setLoading(true);
      const trip = await getTripById(id);
      setFormData({
        name: trip.name || '',
        destination: trip.destination || '',
        price: trip.price || '',
        image: trip.image || '',
        isActive: trip.isActive !== undefined ? trip.isActive : true
      });
    } catch (err) {
      setError(err.message);
      console.error('Error fetching trip:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.name || !formData.destination || !formData.price || !formData.image) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.price <= 0) {
      setError('Price must be greater than 0');
      return;
    }

    try {
      setLoading(true);
      
      const tripData = {
        name: formData.name,
        destination: formData.destination,
        price: parseFloat(formData.price),
        image: formData.image,
        isActive: formData.isActive
      };

      if (isEditMode) {
        await updateTrip(id, tripData);
        alert('Trip updated successfully!');
      } else {
        await createTrip(tripData);
        alert('Trip created successfully!');
      }
      
      navigate('/dashboard/trips');
    } catch (err) {
      setError(err.message);
      console.error('Error saving trip:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard/trips');
  };

  if (loading && isEditMode) {
    return (
      <div className="trip-form-container">
        <div className="loading">Loading trip data...</div>
      </div>
    );
  }

  return (
    <div className="trip-form-container">
      <div className="trip-form-header">
        <h1>{isEditMode ? 'Edit Trip' : 'Create New Trip'}</h1>
        <button className="back-btn" onClick={handleCancel}>
          <ArrowLeft size={20} />
          Back to Trips
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <form className="trip-form" onSubmit={handleSubmit}>
        <div className="form-section">
          <h3>Trip Information</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Trip Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., African Safari Adventure"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="destination">Destination *</label>
              <input
                type="text"
                id="destination"
                name="destination"
                value={formData.destination}
                onChange={handleChange}
                placeholder="e.g., Kenya, Tanzania"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="price">Price ($) *</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="e.g., 2500"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="isActive">Status</label>
              <div className="checkbox-wrapper">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                />
                <label htmlFor="isActive" className="checkbox-label">
                  Active (Trip is available for booking)
                </label>
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group full-width">
              <label htmlFor="image">Image URL *</label>
              <input
                type="url"
                id="image"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                required
              />
              {formData.image && (
                <div className="image-preview">
                  <img src={formData.image} alt="Trip preview" />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={handleCancel}>
            Cancel
          </button>
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Saving...' : (isEditMode ? 'Update Trip' : 'Create Trip')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TripForm;    