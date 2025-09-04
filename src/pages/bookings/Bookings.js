import React, { useState, useMemo, useEffect } from 'react';
import CustomTable from '../../components/custome-table/CustomTable';
import { getAllBookings } from '../../services/admin';
import './Bookings.css';
import { useNavigate } from 'react-router-dom';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    confirmed: 0,
    pending: 0,
    cancelled: 0,
    revenue: 0
  });
  
  const navigate = useNavigate();

  // Fetch bookings from API
  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError('');
      const bookingsData = await getAllBookings();
      setBookings(bookingsData);
      
      // Calculate statistics
      calculateStats(bookingsData);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate booking statistics
  const calculateStats = (bookingsData) => {
    const confirmed = bookingsData.filter(booking => 
      booking.bookingStatus === 'Confirmed' || booking.status === 'confirmed'
    ).length;
    
    const pending = bookingsData.filter(booking => 
      booking.bookingStatus === 'Pending' || booking.status === 'pending'
    ).length;
    
    const cancelled = bookingsData.filter(booking => 
      booking.bookingStatus === 'Cancelled' || booking.status === 'cancelled'
    ).length;
    
    const revenue = bookingsData.reduce((total, booking) => {
      if (booking.bookingStatus !== 'Cancelled' && booking.status !== 'cancelled') {
        return total + (booking.totalAmount || 0);
      }
      return total;
    }, 0);

    setStats({ confirmed, pending, cancelled, revenue });
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Function to generate random progress for pending status (multiple of 20)
  const getRandomProgress = () => {
    const progressOptions = [20, 40, 60, 80];
    return progressOptions[Math.floor(Math.random() * progressOptions.length)];
  };

  // Define table columns
  const columns = useMemo(() => [
    {
      Header: 'Customer Name',
      accessor: row => row.userId?.name || row.customerName || 'N/A',
    },
    {
      Header: 'Trip',
      accessor: row => row.tripId?.name || row.service || 'N/A',
    },
    {
      Header: 'Destination',
      accessor: row => row.tripId?.destination || 'N/A',
    },
    {
      Header: 'Travel Date',
      accessor: 'travelDate',
      Cell: ({ value }) => value ? new Date(value).toLocaleDateString() : 'N/A',
    },
    {
      Header: 'Guests',
      accessor: 'guests',
      Cell: ({ value }) => Array.isArray(value) ? value.length : value || 0,
    },
    {
      Header: 'Status',
      accessor: 'bookingStatus',
      Cell: ({ value }) => {
        const status = value?.toLowerCase() || 'pending';
        let progress = 0;
        
        if (status === 'pending') {
          progress = getRandomProgress();
        } else if (status === 'confirmed') {
          progress = 100;
        } else if (status === 'cancelled') {
          progress = 0;
        }
        
        return (
          <div className="status-container">
            <div className="status-progress-bar">
              <div 
                className={`progress-fill ${status}`}
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <span className={`status-text ${status}`}>
              {value || 'Pending'} ({progress}%)
            </span>
          </div>
        );
      },
    },
    {
      Header: 'Total Amount',
      accessor: 'totalAmount',
      Cell: ({ value }) => `$${value || 0}`,
    },
    {
      Header: 'Booked On',
      accessor: 'createdAt',
      Cell: ({ value }) => value ? new Date(value).toLocaleDateString() : 'N/A',
    },

  ], []);

  const handleNewBooking = () => {
    navigate('/dashboard/new-booking');
  };

  if (loading) {
    return (
      <div className="bookings-container">
        <div className="bookings-header">
          <h1>Booking Management</h1>
          <p>View and manage all customer bookings</p>
        </div>
        <div className="loading">Loading bookings...</div>
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
          <button className="new-booking-btn" onClick={handleNewBooking}>
            <span className="icon">+</span>
            New Booking
          </button>
        </div>
      </div>
      
      <div className="bookings-content">
        <div className="bookings-stats">
          <div className="stat-card">
            <div className="stat-icon confirmed">
              <span className="icon">✓</span>
            </div>
            <div className="stat-info">
              <h3>{stats.confirmed}</h3>
              <p>Confirmed Bookings</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon pending">
              <span className="icon">⏱️</span>
            </div>
            <div className="stat-info">
              <h3>{stats.pending}</h3>
              <p>Pending Bookings</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon cancelled">
              <span className="icon">✕</span>
            </div>
            <div className="stat-info">
              <h3>{stats.cancelled}</h3>
              <p>Cancelled Bookings</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon revenue">
              <span className="icon">$</span>
            </div>
            <div className="stat-info">
              <h3>${stats.revenue}</h3>
              <p>Total Revenue</p>
            </div>
          </div>
        </div>

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