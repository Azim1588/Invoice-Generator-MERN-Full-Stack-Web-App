import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { invoiceAPI, customerAPI, businessProfileAPI, getLogoUrl } from '../services/api';
import { useAuth } from '../context/AuthContext';

function CreateInvoice() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [businessProfile, setBusinessProfile] = useState(null);
  const [logoUrl, setLogoUrl] = useState(null);
  const [formData, setFormData] = useState({
    // Sender (business) info
    senderName: '',
    senderAddress: '',
    senderPhone: '',
    senderEmail: '',
    // Bill to (buyer) info
    billToName: '',
    billToAddress: '',
    billToPhone: '',
    billToEmail: '',
    customerId: '',
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'pending',
    items: [
      {
        description: '',
        quantity: 1,
        unitPrice: 0
      }
    ],
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCustomers();
    fetchBusinessProfile();
    // Pre-fill sender info from user profile
    if (user) {
      setFormData(prev => ({
        ...prev,
        senderName: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.username || '',
        senderAddress: user.address || '',
        senderPhone: user.phone || '',
        senderEmail: user.email || ''
      }));
    }
  }, [user]);

  const fetchCustomers = async () => {
    try {
      const response = await customerAPI.getAll();
      setCustomers(response.data.data);
    } catch (err) {
      setError('Failed to load customers');
      console.error('Customers error:', err);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // When customer is selected, pre-fill bill to info but allow editing
  const handleCustomerChange = (e) => {
    const customerId = e.target.value;
    setFormData(prev => ({ ...prev, customerId }));
    const customer = customers.find(c => c._id === customerId);
    if (customer) {
      setFormData(prev => ({
        ...prev,
        billToName: customer.name || '',
        billToAddress: customer.address ? `${customer.address.street}, ${customer.address.city}, ${customer.address.state} ${customer.address.zipCode}` : '',
        billToPhone: customer.phone || '',
        billToEmail: customer.email || ''
      }));
    }
  };

  const handleItemChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { description: '', quantity: 1, unitPrice: 0 }]
    }));
  };

  const removeItem = (index) => {
    if (formData.items.length > 1) {
      setFormData(prev => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index)
      }));
    }
  };

  const calculateTotals = () => {
    const subtotal = formData.items.reduce((sum, item) => {
      return sum + (item.quantity * item.unitPrice);
    }, 0);
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + tax;
    return { subtotal, tax, total };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.customerId) {
      setError('Please select a customer');
      return;
    }
    if (formData.items.some(item => !item.description || item.quantity <= 0 || item.unitPrice <= 0)) {
      setError('Please fill in all item details correctly');
      return;
    }
    try {
      setLoading(true);
      setError(null);
      await invoiceAPI.create(formData);
      navigate('/invoices');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create invoice');
      console.error('Create invoice error:', err);
    } finally {
      setLoading(false);
    }
  };

  const { subtotal, tax, total } = calculateTotals();

  return (
    <div>
      {/* Show business logo if available */}
      {logoUrl && (
        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <img src={logoUrl} alt="Business Logo" style={{ maxWidth: 120, maxHeight: 80, borderRadius: 8 }} />
        </div>
      )}
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            onClick={() => navigate('/invoices')}
            className="btn btn-secondary"
            style={{ padding: '0.5rem' }}
          >
            <ArrowLeft size={16} />
          </button>
          <h1 className="page-title">Create Invoice</h1>
        </div>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="card">
        <form onSubmit={handleSubmit}>
          {/* Sender (business) info */}
          <h3 style={{ marginBottom: 0 }}>Your Business Info</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            <input type="text" name="senderName" value={formData.senderName} onChange={handleChange} className="form-input" placeholder="Your name/business name" />
            <input type="text" name="senderAddress" value={formData.senderAddress} onChange={handleChange} className="form-input" placeholder="Your address" />
            <input type="text" name="senderPhone" value={formData.senderPhone} onChange={handleChange} className="form-input" placeholder="Your phone number" />
            <input type="email" name="senderEmail" value={formData.senderEmail} onChange={handleChange} className="form-input" placeholder="Your email" />
          </div>

          {/* Bill to (buyer) info */}
          <h3 style={{ marginBottom: 0 }}>Bill To</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            <select
              name="customerId"
              value={formData.customerId}
              onChange={handleCustomerChange}
              className="form-input"
              required
            >
              <option value="">Select a customer</option>
              {customers.map(customer => (
                <option key={customer._id} value={customer._id}>
                  {customer.name}
                </option>
              ))}
            </select>
            <input type="text" name="billToName" value={formData.billToName} onChange={handleChange} className="form-input" placeholder="Buyer name/business name" />
            <input type="text" name="billToAddress" value={formData.billToAddress} onChange={handleChange} className="form-input" placeholder="Buyer address" />
            <input type="text" name="billToPhone" value={formData.billToPhone} onChange={handleChange} className="form-input" placeholder="Buyer phone number" />
            <input type="email" name="billToEmail" value={formData.billToEmail} onChange={handleChange} className="form-input" placeholder="Buyer email" />
          </div>

          {/* Invoice Details */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            <div className="form-group">
              <label className="form-label">Invoice Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Due Date</label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="form-input"
              >
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
          </div>

          {/* Invoice Items */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, color: '#1e293b' }}>Invoice Items</h3>
              <button
                type="button"
                onClick={addItem}
                className="btn btn-secondary"
                style={{ padding: '0.5rem 1rem' }}
              >
                <Plus size={16} />
                Add Item
              </button>
            </div>
            <table className="table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Quantity</th>
                  <th>Unit Price</th>
                  <th>Total</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {formData.items.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                        className="form-input"
                        placeholder="Item description"
                        style={{ margin: 0 }}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                        className="form-input"
                        min="1"
                        style={{ margin: 0 }}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={item.unitPrice}
                        onChange={(e) => handleItemChange(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                        className="form-input"
                        min="0"
                        step="0.01"
                        style={{ margin: 0 }}
                      />
                    </td>
                    <td>
                      <strong>${(item.quantity * item.unitPrice).toFixed(2)}</strong>
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="btn btn-danger"
                        style={{ padding: '0.25rem 0.5rem' }}
                        disabled={formData.items.length === 1}
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Notes */}
          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label className="form-label">Notes / Terms</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="form-input"
              rows={3}
              placeholder="Terms and conditions go here"
            />
          </div>

          {/* Totals */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', marginBottom: '2rem' }}>
            <div style={{ minWidth: 250 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span>Tax (10%):</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span><strong>Total:</strong></span>
                <span><strong>${total.toFixed(2)}</strong></span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem' }}>
            <button
              type="button"
              onClick={() => navigate('/invoices')}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              <Save size={16} />
              {loading ? 'Creating...' : 'Create Invoice'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateInvoice; 