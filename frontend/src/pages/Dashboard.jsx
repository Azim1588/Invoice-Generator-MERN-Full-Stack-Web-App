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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Users size={24} style={{ color: 'var(--primary)' }} />
            <div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '700', margin: 0, color: 'var(--text-primary)' }}>{stats.totalCustomers}</h3>
              <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Total Customers</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <FileText size={24} style={{ color: 'var(--success)' }} />
            <div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '700', margin: 0, color: 'var(--text-primary)' }}>{stats.totalInvoices}</h3>
              <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Total Invoices</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <DollarSign size={24} style={{ color: 'var(--text-primary)' }} />
            <div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '700', margin: 0, color: 'var(--text-primary)' }}>${stats.totalRevenue.toFixed(2)}</h3>
              <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Total Revenue</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <TrendingUp size={24} style={{ color: 'var(--warning)' }} />
            <div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '700', margin: 0, color: 'var(--text-primary)' }}>{stats.pendingInvoices}</h3>
              <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Pending Invoices</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Invoices */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ margin: 0, color: 'var(--text-primary)' }}>Recent Invoices</h2>
          <Link to="/invoices" className="btn btn-primary">
            View All
          </Link>
        </div>

        {recentInvoices.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem' }}>
            No invoices found. <Link to="/invoices/create" className="btn btn-primary" style={{ marginLeft: '0.5rem' }}>Create your first invoice</Link>
          </p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentInvoices.map((invoice) => (
                <tr key={invoice._id}>
                  <td>{invoice.invoiceNumber}</td>
                  <td>{invoice.customerName}</td>
                  <td>{new Date(invoice.date).toLocaleDateString()}</td>
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
                        <FileText size={14} />
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
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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