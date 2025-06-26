import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye, Download, ChevronDown } from 'lucide-react';
import { invoiceAPI, downloadPDF } from '../services/api';

function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [downloadingPDF, setDownloadingPDF] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(null);

  useEffect(() => {
    console.log('📄 Invoices: Component mounted, fetching invoices...');
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      console.log('📄 Invoices: Fetching invoices from API...');
      const response = await invoiceAPI.getAll();
      console.log('📄 Invoices: API response received:', response.data.data.length, 'invoices');
      setInvoices(response.data.data);
    } catch (err) {
      console.error('📄 Invoices: Error fetching invoices:', err);
      setError('Failed to load invoices');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await invoiceAPI.delete(id);
      setInvoices(invoices.filter(invoice => invoice._id !== id));
      setDeleteId(null);
    } catch (err) {
      setError('Failed to delete invoice');
      console.error('Delete error:', err);
    }
  };

  const handleDownloadPDF = async (invoice) => {
    try {
      setDownloadingPDF(invoice._id);
      const result = await downloadPDF(invoice._id, invoice.invoiceNumber);
      
      if (!result.success) {
        setError(result.error || 'Failed to download PDF');
      }
    } catch (err) {
      setError('Failed to download PDF');
      console.error('PDF download error:', err);
    } finally {
      setDownloadingPDF(null);
    }
  };

  const handleStatusUpdate = async (invoiceId, newStatus) => {
    try {
      setUpdatingStatus(invoiceId);
      const response = await invoiceAPI.update(invoiceId, { status: newStatus });
      
      if (response.data.success) {
        setInvoices(invoices.map(invoice => 
          invoice._id === invoiceId 
            ? { ...invoice, status: newStatus }
            : invoice
        ));
      }
    } catch (err) {
      setError('Failed to update invoice status');
      console.error('Status update error:', err);
    } finally {
      setUpdatingStatus(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'var(--status-paid)';
      case 'pending': return 'var(--status-pending)';
      case 'overdue': return 'var(--status-overdue)';
      default: return 'var(--text-secondary)';
    }
  };

  if (loading) {
    return <div className="loading">Loading invoices...</div>;
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Invoices</h1>
        <Link to="/invoices/create" className="btn btn-primary">
          <Plus size={16} />
          Create Invoice
        </Link>
      </div>

      {error && <div className="error">{error}</div>}

      {invoices.length === 0 ? (
        <div className="card">
          <p style={{ color: '#6b7280', textAlign: 'center', padding: '2rem' }}>
            No invoices found. <Link to="/invoices/create" className="btn btn-primary" style={{ marginLeft: '0.5rem' }}>Create your first invoice</Link>
          </p>
        </div>
      ) : (
        <div className="card">
          <table className="table">
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Due Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice._id}>
                  <td>
                    <strong>{invoice.invoiceNumber}</strong>
                  </td>
                  <td>{invoice.customerName}</td>
                  <td>{new Date(invoice.date).toLocaleDateString()}</td>
                  <td>{new Date(invoice.dueDate).toLocaleDateString()}</td>
                  <td>${invoice.total.toFixed(2)}</td>
                  <td>
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                      <select
                        value={invoice.status}
                        onChange={(e) => handleStatusUpdate(invoice._id, e.target.value)}
                        disabled={updatingStatus === invoice._id}
                        style={{
                          padding: '0.25rem 0.5rem',
                          borderRadius: '0.25rem',
                          border: '1px solid var(--border-color)',
                          backgroundColor: 'var(--bg-primary)',
                          color: getStatusColor(invoice.status),
                          fontSize: '0.75rem',
                          fontWeight: '500',
                          cursor: 'pointer',
                          appearance: 'none',
                          paddingRight: '1.5rem'
                        }}
                      >
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="overdue">Overdue</option>
                      </select>
                      <ChevronDown 
                        size={12} 
                        style={{ 
                          position: 'absolute', 
                          right: '0.25rem', 
                          top: '50%', 
                          transform: 'translateY(-50%)',
                          pointerEvents: 'none',
                          color: 'var(--text-secondary)'
                        }} 
                      />
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <Link 
                        to={`/invoices/${invoice._id}`} 
                        className="btn btn-secondary"
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                      >
                        <Eye size={14} />
                      </Link>
                      <Link 
                        to={`/invoices/${invoice._id}/edit`} 
                        className="btn btn-secondary"
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                      >
                        <Edit size={14} />
                      </Link>
                      <button
                        onClick={() => handleDownloadPDF(invoice)}
                        className="btn btn-success"
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                        disabled={downloadingPDF === invoice._id}
                        title="Download PDF"
                      >
                        <Download size={14} />
                      </button>
                      <button
                        onClick={() => setDeleteId(invoice._id)}
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
            <p>Are you sure you want to delete this invoice? This action cannot be undone.</p>
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

export default Invoices; 