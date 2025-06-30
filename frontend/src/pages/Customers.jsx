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
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await customerAPI.getAll();
      setCustomers(response.data.data);
    } catch (err) {
      setError('Failed to fetch customers');
      console.error('Fetch error:', err);
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
        <div className="page-actions">
          <Link to="/customers/create" className="btn btn-primary">
            <Plus size={16} />
            Add Customer
          </Link>
        </div>
      </div>

      {error && <div className="error">{error}</div>}

      {customers.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <p className="empty-state-message">
              No customers found. <Link to="/customers/create" className="btn btn-primary">Add your first customer</Link>
            </p>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="table-container">
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
                          <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                            {customer.address.city}, {customer.address.state} {customer.address.zipCode}
                          </div>
                        </div>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td>{new Date(customer.createdAt).toLocaleDateString()}</td>
                    <td className="table-actions">
                      <Link 
                        to={`/customers/${customer._id}`} 
                        className="btn btn-secondary"
                      >
                        <Eye size={14} />
                        View
                      </Link>
                      <Link 
                        to={`/customers/${customer._id}/edit`} 
                        className="btn btn-secondary"
                      >
                        <Edit size={14} />
                        Edit
                      </Link>
                      <button
                        onClick={() => setDeleteId(customer._id)}
                        className="btn btn-danger"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3 className="modal-title">Confirm Delete</h3>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete this customer? This action cannot be undone.</p>
            </div>
            <div className="modal-footer">
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