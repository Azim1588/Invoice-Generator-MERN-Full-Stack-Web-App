import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { customerAPI } from '../services/api';

function CustomerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    fetchCustomer();
  }, [id]);

  const fetchCustomer = async () => {
    try {
      const response = await customerAPI.getById(id);
      setCustomer(response.data.data);
    } catch (err) {
      setError('Failed to fetch customer details');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await customerAPI.delete(id);
      navigate('/customers');
    } catch (err) {
      setError('Failed to delete customer');
      console.error('Delete error:', err);
    }
  };

  if (loading) {
    return <div className="loading">Loading customer details...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!customer) {
    return <div className="error">Customer not found</div>;
  }

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <Link to="/customers" className="btn btn-secondary">
            <ArrowLeft size={16} />
            Back to Customers
          </Link>
          <h1 className="page-title">Customer Details</h1>
        </div>
        <div className="page-actions">
          <Link to={`/customers/${id}/edit`} className="btn btn-primary">
            <Edit size={16} />
            Edit Customer
          </Link>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="btn btn-danger"
          >
            <Trash2 size={16} />
            Delete Customer
          </button>
        </div>
      </div>

      <div className="card">
        <div className="customer-details">
          <div className="detail-section">
            <h3>Basic Information</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <label>Name:</label>
                <span>{customer.name}</span>
              </div>
              <div className="detail-item">
                <label>Email:</label>
                <span>{customer.email}</span>
              </div>
              <div className="detail-item">
                <label>Phone:</label>
                <span>{customer.phone || 'Not provided'}</span>
              </div>
            </div>
          </div>

          {customer.address && (
            <div className="detail-section">
              <h3>Address</h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <label>Street:</label>
                  <span>{customer.address.street}</span>
                </div>
                <div className="detail-item">
                  <label>City:</label>
                  <span>{customer.address.city}</span>
                </div>
                <div className="detail-item">
                  <label>State:</label>
                  <span>{customer.address.state}</span>
                </div>
                <div className="detail-item">
                  <label>ZIP Code:</label>
                  <span>{customer.address.zipCode}</span>
                </div>
              </div>
            </div>
          )}

          <div className="detail-section">
            <h3>Additional Information</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <label>Created:</label>
                <span>{new Date(customer.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="detail-item">
                <label>Last Updated:</label>
                <span>{new Date(customer.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
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
                onClick={() => setShowDeleteModal(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
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

export default CustomerDetail; 