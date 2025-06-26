import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { customerAPI } from '../services/api';

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    console.log('👥 Customers: Component mounted, fetching customers...');
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      console.log('👥 Customers: Fetching customers from API...');
      const response = await customerAPI.getAll();
      console.log('👥 Customers: API response received:', response.data.data.length, 'customers');
      setCustomers(response.data.data);
    } catch (err) {
      console.error('👥 Customers: Error fetching customers:', err);
      setError('Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await customerAPI.delete(id);
      setCustomers(customers.filter(customer => customer._id !== id));
      setDeleteId(null);
    } catch (err) {
      setError('Failed to delete customer');
      console.error('Delete error:', err);
    }
  };

  if (loading) {
    return <div className="loading">Loading customers...</div>;
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Customers</h1>
        <Link to="/customers/create" className="btn btn-primary">
          <Plus size={16} />
          Add Customer
        </Link>
      </div>

      {error && <div className="error">{error}</div>}

      {customers.length === 0 ? (
        <div className="card">
          <p style={{ color: '#6b7280', textAlign: 'center', padding: '2rem' }}>
            No customers found. <Link to="/customers/create" className="btn btn-primary" style={{ marginLeft: '0.5rem' }}>Add your first customer</Link>
          </p>
        </div>
      ) : (
        <div className="card">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer._id}>
                  <td>
                    <strong>{customer.name}</strong>
                  </td>
                  <td>{customer.email}</td>
                  <td>{customer.phone || '-'}</td>
                  <td>
                    {customer.address ? (
                      <div>
                        <div>{customer.address.street}</div>
                        <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                          {customer.address.city}, {customer.address.state} {customer.address.zipCode}
                        </div>
                      </div>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td>{new Date(customer.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <Link 
                        to={`/customers/${customer._id}`} 
                        className="btn btn-secondary"
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                      >
                        <Eye size={14} />
                      </Link>
                      <Link 
                        to={`/customers/${customer._id}/edit`} 
                        className="btn btn-secondary"
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                      >
                        <Edit size={14} />
                      </Link>
                      <button
                        onClick={() => setDeleteId(customer._id)}
                        className="btn btn-danger"
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="card" style={{ maxWidth: '400px', margin: '1rem' }}>
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete this customer? This action cannot be undone.</p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setDeleteId(null)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="btn btn-danger"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Customers; 