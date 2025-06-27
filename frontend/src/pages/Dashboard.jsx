import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, FileText, DollarSign, TrendingUp, Download, ChevronDown } from 'lucide-react';
import { customerAPI, invoiceAPI, downloadPDF } from '../services/api';

function Dashboard() {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalInvoices: 0,
    totalRevenue: 0,
    pendingInvoices: 0
  });
  const [recentInvoices, setRecentInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloadingPDF, setDownloadingPDF] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [customersRes, invoicesRes] = await Promise.all([
          customerAPI.getAll(),
          invoiceAPI.getAll()
        ]);

        const customers = customersRes.data.data;
        const invoices = invoicesRes.data.data;

        const totalRevenue = invoices.reduce((sum, invoice) => {
          return invoice.status === 'paid' ? sum + invoice.total : sum;
        }, 0);

        const pendingInvoices = invoices.filter(invoice => invoice.status === 'pending').length;

        setStats({
          totalCustomers: customers.length,
          totalInvoices: invoices.length,
          totalRevenue,
          pendingInvoices
        });

        // Get recent invoices (last 5)
        const recent = invoices
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5);
        setRecentInvoices(recent);

      } catch (err) {
        setError('Failed to load dashboard data');
        console.error('Dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

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
        // Update the recent invoices list
        setRecentInvoices(recentInvoices.map(invoice => 
          invoice._id === invoiceId 
            ? { ...invoice, status: newStatus }
            : invoice
        ));

        // Recalculate stats
        const updatedInvoices = recentInvoices.map(invoice => 
          invoice._id === invoiceId 
            ? { ...invoice, status: newStatus }
            : invoice
        );

        const totalRevenue = updatedInvoices.reduce((sum, invoice) => {
          return invoice.status === 'paid' ? sum + invoice.total : sum;
        }, 0);

        const pendingInvoices = updatedInvoices.filter(invoice => invoice.status === 'pending').length;

        setStats(prevStats => ({
          ...prevStats,
          totalRevenue,
          pendingInvoices
        }));
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
    return <div className="loading">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="card stat-card">
          <div className="stat-content">
            <Users size={24} className="stat-icon" style={{ color: 'var(--primary)' }} />
            <div>
              <h3 className="stat-number">{stats.totalCustomers}</h3>
              <p className="stat-label">Total Customers</p>
            </div>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-content">
            <FileText size={24} className="stat-icon" style={{ color: 'var(--success)' }} />
            <div>
              <h3 className="stat-number">{stats.totalInvoices}</h3>
              <p className="stat-label">Total Invoices</p>
            </div>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-content">
            <DollarSign size={24} className="stat-icon" style={{ color: 'var(--text-primary)' }} />
            <div>
              <h3 className="stat-number">${stats.totalRevenue.toFixed(2)}</h3>
              <p className="stat-label">Total Revenue</p>
            </div>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-content">
            <TrendingUp size={24} className="stat-icon" style={{ color: 'var(--warning)' }} />
            <div>
              <h3 className="stat-number">{stats.pendingInvoices}</h3>
              <p className="stat-label">Pending Invoices</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Invoices */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Recent Invoices</h2>
          <Link to="/invoices" className="btn btn-primary">
            View All
          </Link>
        </div>

        {recentInvoices.length === 0 ? (
          <div className="empty-state">
            <p className="empty-state-message">
              No invoices found. <Link to="/invoices/create" className="btn btn-primary">Create your first invoice</Link>
            </p>
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Invoice #</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentInvoices.map((invoice) => (
                  <tr key={invoice._id}>
                    <td>{invoice.invoiceNumber}</td>
                    <td>{invoice.customer?.name || 'N/A'}</td>
                    <td>${invoice.total.toFixed(2)}</td>
                    <td>
                      <span 
                        className="status-badge"
                        style={{ 
                          backgroundColor: getStatusColor(invoice.status),
                          color: 'white'
                        }}
                      >
                        {invoice.status}
                      </span>
                    </td>
                    <td>{new Date(invoice.createdAt).toLocaleDateString()}</td>
                    <td className="table-actions">
                      <Link to={`/invoices/${invoice._id}`} className="btn btn-secondary">
                        View
                      </Link>
                      <button
                        onClick={() => handleDownloadPDF(invoice)}
                        disabled={downloadingPDF === invoice._id}
                        className="btn btn-primary"
                      >
                        {downloadingPDF === invoice._id ? 'Downloading...' : 'Download'}
                      </button>
                      {invoice.status === 'pending' && (
                        <button
                          onClick={() => handleStatusUpdate(invoice._id, 'paid')}
                          disabled={updatingStatus === invoice._id}
                          className="btn btn-success"
                        >
                          {updatingStatus === invoice._id ? 'Updating...' : 'Mark Paid'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '2rem' }}>
        <Link to="/customers/create" className="btn btn-primary" style={{ justifyContent: 'center' }}>
          <Users size={16} />
          Add Customer
        </Link>
        <Link to="/invoices/create" className="btn btn-primary" style={{ justifyContent: 'center' }}>
          <FileText size={16} />
          Create Invoice
        </Link>
      </div>
    </div>
  );
}

export default Dashboard; 