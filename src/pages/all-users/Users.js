import React, { useState, useMemo, useEffect } from 'react';
import CustomTable from '../../components/custome-table/CustomTable';
import { getAllUsers } from '../../services/admin'; // Import the service
import './style.css';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const usersData = await getAllUsers();
      setUsers(usersData);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Define table columns
  const columns = useMemo(() => [
    {
      Header: 'Name',
      accessor: 'name',
    },
    {
      Header: 'Email',
      accessor: 'email',
    },
    {
      Header: 'Bookings',
      accessor: 'bookingCount',
      Cell: ({ value }) => (
        <span className="booking-count">{value || 0}</span>
      ),
    },
    {
      Header: 'Verified',
      accessor: 'isVerified',
      Cell: ({ value }) => (
        <span className={`status ${value ? 'verified' : 'not-verified'}`}>
          {value ? 'Yes' : 'No'}
        </span>
      ),
    },
    {
      Header: 'Payment Done',
      accessor: 'isRegistrationPayment',
      Cell: ({ value }) => (
        <span className={`status ${value ? 'completed' : 'pending'}`}>
          {value ? 'Yes' : 'No'}
        </span>
      ),
    },
    {
      Header: 'Passport Uploaded',
      accessor: 'isPasswordUpload',
      Cell: ({ value }) => (
        <span className={`status ${value ? 'uploaded' : 'not-uploaded'}`}>
          {value ? 'Yes' : 'No'}
        </span>
      ),
    },
    {
      Header: 'Joined Date',
      accessor: 'createdAt',
      Cell: ({ value }) => new Date(value).toLocaleDateString(),
    },
  ], []);

  if (loading) {
    return (
      <div className="users-container">
        <div className="users-header">
          <h1>User Management</h1>
          <p>View and manage all registered users</p>
        </div>
        <div className="loading">Loading users...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="users-container">
        <div className="users-header">
          <h1>User Management</h1>
          <p>View and manage all registered users</p>
        </div>
        <div className="error">
          Error: {error}
          <button onClick={fetchUsers} className="retry-btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="users-container">
      <div className="users-header">
        <h1>User Management</h1>
        <p>View and manage all registered users</p>
      </div>
      
      <div className="users-content">
        <CustomTable
          columns={columns}
          data={users}
          heading={`All Users (${users.length})`}
        />
      </div>
    </div>
  );
};

export default Users;