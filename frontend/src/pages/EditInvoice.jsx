import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { invoiceAPI, customerAPI } from '../services/api';

function EditInvoice() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchInvoice();
    fetchCustomers();
  }, [id]);

  const fetchInvoice = async () => {
    try {
      const response = await invoiceAPI.getById(id);
      setInvoice(response.data.data);
    } catch (err) {
      setError('Failed to load invoice');
      console.error('Invoice fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await customerAPI.getAll();
      setCustomers(response.data.data);
    } catch (err) {
      console.error('Customers fetch error:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInvoice(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleItemChange = (index, field, value) => {
    setInvoice(prev => {
      const newItems = [...prev.items];
      newItems[index] = {
        ...newItems[index],
        [field]: field === 'quantity' || field === 'unitPrice' ? parseFloat(value) || 0 : value
      };
      
      // Recalculate item total
      newItems[index].total = newItems[index].quantity * newItems[index].unitPrice;
      
      return {
        ...prev,
        items: newItems
      };
    });
  };

  const addItem = () => {
    setInvoice(prev => ({
      ...prev,
      items: [
        ...prev.items,
        {
          description: '',
          quantity: 1,
          unitPrice: 0,
          total: 0
        }
      ]
    }));
  };

  const removeItem = (index) => {
    setInvoice(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (invoice.items.length === 0) {
      setError('At least one item is required');
      return;
    }

    // Validate items
    for (const item of invoice.items) {
      if (!item.description || item.quantity <= 0 || item.unitPrice <= 0) {
        setError('All items must have description, quantity > 0, and unit price > 0');
        return;
      }
    }

    try {
      setSaving(true);
      setError(null);
      
      await invoiceAPI.update(id, invoice);
      navigate(`/invoices/${id}`);
    } catch (err) {
      setError('Failed to update invoice');
      console.error('Update error:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading invoice...</div>;
  }

  if (error && !invoice) {
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
      <div className="page-header">
        <Link to={`/invoices/${id}`} className="btn btn-secondary">
          <ArrowLeft size={16} />
          Back
        </Link>
        <h1 className="page-title">Edit Invoice {invoice.invoiceNumber}</h1>
      </div>

      {error && <div className="error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="card">
          <h3>Invoice Details</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label>Date</label>
              <input
                type="date"
                name="date"
                value={invoice.date ? new Date(invoice.date).toISOString().split('T')[0] : ''}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label>Due Date</label>
              <input
                type="date"
                name="dueDate"
                value={invoice.dueDate ? new Date(invoice.dueDate).toISOString().split('T')[0] : ''}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label>Status</label>
            <select name="status" value={invoice.status} onChange={handleInputChange}>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label>Notes</label>
            <textarea
              name="notes"
              value={invoice.notes || ''}
              onChange={handleInputChange}
              rows="3"
              placeholder="Additional notes..."
            />
          </div>
        </div>

        <div className="card" style={{ marginTop: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3>Items</h3>
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

          {invoice.items.map((item, index) => (
            <div key={index} style={{ 
              border: '1px solid #e5e7eb', 
              borderRadius: '0.5rem', 
              padding: '1rem', 
              marginBottom: '1rem',
              backgroundColor: '#f9fafb'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr auto', gap: '1rem', alignItems: 'end' }}>
                <div>
                  <label>Description</label>
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                    placeholder="Item description"
                    required
                  />
                </div>
                <div>
                  <label>Quantity</label>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label>Unit Price</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.unitPrice}
                    onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label>Total</label>
                  <input
                    type="number"
                    value={item.total.toFixed(2)}
                    readOnly
                    style={{ backgroundColor: '#f3f4f6' }}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="btn btn-danger"
                  style={{ padding: '0.5rem' }}
                  disabled={invoice.items.length === 1}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
          <Link to={`/invoices/${id}`} className="btn btn-secondary">
            Cancel
          </Link>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditInvoice; 