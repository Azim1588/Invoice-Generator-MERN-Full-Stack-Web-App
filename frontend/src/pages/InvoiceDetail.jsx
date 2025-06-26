import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Download, Trash2 } from 'lucide-react';
import { invoiceAPI, downloadPDF, businessProfileAPI, getLogoUrl } from '../services/api';

function InvoiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloadingPDF, setDownloadingPDF] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [businessProfile, setBusinessProfile] = useState(null);
  const [logoUrl, setLogoUrl] = useState(null);

  useEffect(() => {
    fetchInvoice();
    fetchBusinessProfile();
  }, [id]);

  const fetchInvoice = async () => {
    try {
      setLoading(true);
      const response = await invoiceAPI.getById(id);
      setInvoice(response.data.data);
    } catch (err) {
      setError('Failed to load invoice');
      console.error('Invoice fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBusinessProfile = async () => {
    try {
      const response = await businessProfileAPI.get();
      const profile = response.data.data;
      setBusinessProfile(profile);
      
      // Get logo URL if logo exists
      if (profile.logo) {
        const url = await getLogoUrl();
        if (url) {
          setLogoUrl(url);
        }
      }
    } catch (err) {
      setBusinessProfile(null);
      setLogoUrl(null);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      setDownloadingPDF(true);
      const result = await downloadPDF(invoice._id, invoice.invoiceNumber);
      
      if (!result.success) {
        setError(result.error || 'Failed to download PDF');
      }
    } catch (err) {
      setError('Failed to download PDF');
      console.error('PDF download error:', err);
    } finally {
      setDownloadingPDF(false);
    }
  };

  const handleDelete = async () => {
    try {
      await invoiceAPI.delete(id);
      navigate('/invoices');
    } catch (err) {
      setError('Failed to delete invoice');
      console.error('Delete error:', err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'success';
      case 'pending': return 'warning';
      case 'overdue': return 'danger';
      case 'cancelled': return 'secondary';
      default: return 'secondary';
    }
  };

  if (loading) {
    return <div className="loading">Loading invoice...</div>;
  }

  if (error) {
    return (
      <div>
        <div className="error">{error}</div>
        <Link to="/invoices" className="btn btn-secondary">
          <ArrowLeft size={16} />
          Back to Invoices
        </Link>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div>
        <div className="error">Invoice not found</div>
        <Link to="/invoices" className="btn btn-secondary">
          <ArrowLeft size={16} />
          Back to Invoices
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Show business logo and info if available */}
      {businessProfile && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          {logoUrl && (
            <img src={logoUrl} alt="Business Logo" style={{ maxWidth: 80, maxHeight: 60, borderRadius: 8 }} />
          )}
          <div>
            <h2 style={{ margin: 0 }}>{businessProfile.businessName}</h2>
            <div style={{ color: '#64748b', fontSize: '0.95rem' }}>{businessProfile.fullBusinessAddress}</div>
            <div style={{ color: '#64748b', fontSize: '0.95rem' }}>{businessProfile.businessEmail}</div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link to="/invoices" className="btn btn-secondary">
            <ArrowLeft size={16} />
            Back
          </Link>
          <h1 className="page-title">Invoice {invoice.invoiceNumber}</h1>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Link 
            to={`/invoices/${id}/edit`} 
            className="btn btn-primary"
          >
            <Edit size={16} />
            Edit
          </Link>
          <button
            onClick={handleDownloadPDF}
            className="btn btn-success"
            disabled={downloadingPDF}
          >
            <Download size={16} />
            {downloadingPDF ? 'Downloading...' : 'Download PDF'}
          </button>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="btn btn-danger"
          >
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      </div>

      {/* Invoice Details */}
      <div className="card">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          {/* Left Column */}
          <div>
            <h3>Invoice Information</h3>
            <div style={{ marginBottom: '1rem' }}>
              <strong>Invoice Number:</strong> {invoice.invoiceNumber}
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <strong>Date:</strong> {new Date(invoice.date).toLocaleDateString()}
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <strong>Due Date:</strong> {new Date(invoice.dueDate).toLocaleDateString()}
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <strong>Status:</strong>
              <span className={`status-badge status-${getStatusColor(invoice.status)}`}>
                {invoice.status}
              </span>
            </div>
            {invoice.notes && (
              <div style={{ marginBottom: '1rem' }}>
                <strong>Notes:</strong>
                <p style={{ marginTop: '0.5rem', color: '#6b7280' }}>{invoice.notes}</p>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div>
            <h3>Customer Information</h3>
            <div style={{ marginBottom: '1rem' }}>
              <strong>Name:</strong> {invoice.customerName}
            </div>
            {invoice.customerId && typeof invoice.customerId === 'object' && (
              <>
                <div style={{ marginBottom: '1rem' }}>
                  <strong>Email:</strong> {invoice.customerId.email}
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <strong>Phone:</strong> {invoice.customerId.phone}
                </div>
                {invoice.customerId.address && (
                  <div style={{ marginBottom: '1rem' }}>
                    <strong>Address:</strong>
                    <p style={{ marginTop: '0.5rem', color: '#6b7280' }}>
                      {invoice.customerId.address.street}<br />
                      {invoice.customerId.address.city}, {invoice.customerId.address.state} {invoice.customerId.address.zipCode}<br />
                      {invoice.customerId.address.country}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="card" style={{ marginTop: '1rem' }}>
        <h3>Items</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Description</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, index) => (
              <tr key={index}>
                <td>{item.description}</td>
                <td>{item.quantity}</td>
                <td>${item.unitPrice.toFixed(2)}</td>
                <td>${item.total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="card" style={{ marginTop: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ width: '300px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span>Subtotal:</span>
              <span>${invoice.subtotal.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span>Tax (10%):</span>
              <span>${invoice.tax.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #e5e7eb', paddingTop: '0.5rem', fontWeight: 'bold', fontSize: '1.1rem' }}>
              <span>Total:</span>
              <span>${invoice.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
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
            <p>Are you sure you want to delete invoice {invoice.invoiceNumber}? This action cannot be undone.</p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
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

export default InvoiceDetail; 