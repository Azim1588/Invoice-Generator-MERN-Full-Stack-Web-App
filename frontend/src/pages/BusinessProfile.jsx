import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Upload, Trash2, Settings, Palette, FileText } from 'lucide-react';
import { businessProfileAPI, getLogoUrl } from '../services/api';
import { useAuth } from '../context/AuthContext';

function BusinessProfile() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  
  const [formData, setFormData] = useState({
    businessName: '',
    businessAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'USA'
    },
    businessPhone: '',
    businessEmail: '',
    taxId: '',
    website: ''
  });

  const [invoiceSettings, setInvoiceSettings] = useState({
    defaultTaxRate: 10,
    currency: 'USD',
    paymentTerms: 'Net 30',
    invoicePrefix: 'INV'
  });

  const [branding, setBranding] = useState({
    primaryColor: '#F97316',
    secondaryColor: '#1e293b',
    fontFamily: 'Helvetica'
  });

  useEffect(() => {
    fetchBusinessProfile();
  }, []);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const fetchBusinessProfile = async () => {
    try {
      setLoading(true);
      const response = await businessProfileAPI.get();
      const profile = response.data.data;
      
      setFormData({
        businessName: profile.businessName || '',
        businessAddress: profile.businessAddress || {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: 'USA'
        },
        businessPhone: profile.businessPhone || '',
        businessEmail: profile.businessEmail || '',
        taxId: profile.taxId || '',
        website: profile.website || ''
      });

      setInvoiceSettings(profile.invoiceSettings || {
        defaultTaxRate: 10,
        currency: 'USD',
        paymentTerms: 'Net 30',
        invoicePrefix: 'INV'
      });

      setBranding(profile.branding || {
        primaryColor: '#F97316',
        secondaryColor: '#1e293b',
        fontFamily: 'Helvetica'
      });

      // Set logo preview if exists
      if (profile.logo) {
        const logoUrl = await getLogoUrl();
        if (logoUrl) {
          setLogoPreview(logoUrl);
        }
      }
    } catch (err) {
      setError('Failed to load business profile');
      console.error('Business profile error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      businessAddress: {
        ...prev.businessAddress,
        [name]: value
      }
    }));
  };

  const handleInvoiceSettingsChange = (e) => {
    const { name, value } = e.target;
    setInvoiceSettings(prev => ({
      ...prev,
      [name]: name === 'defaultTaxRate' ? parseFloat(value) : value
    }));
  };

  const handleBrandingChange = (e) => {
    const { name, value } = e.target;
    setBranding(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Logo file size must be less than 5MB');
        return;
      }

      setLogoFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoUpload = async () => {
    if (!logoFile) {
      setError('Please select a logo file first');
      return;
    }
    try {
      setLoading(true);
      setError('');
      
      const formDataToSend = new FormData();
      formDataToSend.append('logo', logoFile);
      
      await businessProfileAPI.uploadLogo(formDataToSend);
      setSuccess('Logo uploaded successfully!');
      setLogoFile(null);
      await fetchBusinessProfile(); // Refresh info and logo
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to upload logo');
    } finally {
      setLoading(false);
    }
  };

  const handleLogoDelete = async () => {
    try {
      setLoading(true);
      setError('');
      await businessProfileAPI.deleteLogo();
      setLogoPreview(null);
      setLogoFile(null);
      setSuccess('Logo deleted successfully!');
      await fetchBusinessProfile(); // Refresh info and logo
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete logo');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      setError('');
      await businessProfileAPI.update(formData);
      setSuccess('Business profile updated successfully!');
      await fetchBusinessProfile(); // Refresh info
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update business profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveInvoiceSettings = async () => {
    try {
      setLoading(true);
      setError('');
      await businessProfileAPI.updateInvoiceSettings({ invoiceSettings });
      setSuccess('Invoice settings updated successfully!');
      await fetchBusinessProfile(); // Refresh info
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update invoice settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveBranding = async () => {
    try {
      setLoading(true);
      setError('');
      await businessProfileAPI.updateBranding({ branding });
      setSuccess('Branding updated successfully!');
      await fetchBusinessProfile(); // Refresh info
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update branding');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !formData.businessName) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <div>Loading business profile...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            onClick={() => navigate('/dashboard')}
            className="btn btn-secondary"
            style={{ padding: '0.5rem' }}
          >
            <ArrowLeft size={16} />
          </button>
          <h1 className="page-title">Business Profile</h1>
        </div>
      </div>

      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      {/* Business Information Section */}
      <div className="card">
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <Settings size={20} />
          Business Information
        </h3>
        
        <form onSubmit={(e) => { e.preventDefault(); handleSaveProfile(); }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <label>Business Name *</label>
              <input
                type="text"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                placeholder="Your Business Name"
                required
                className="form-input"
              />
            </div>
            
            <div>
              <label>Business Phone</label>
              <input
                type="tel"
                name="businessPhone"
                value={formData.businessPhone}
                onChange={handleChange}
                placeholder="(555) 123-4567"
                className="form-input"
              />
            </div>
            
            <div>
              <label>Business Email</label>
              <input
                type="email"
                name="businessEmail"
                value={formData.businessEmail}
                onChange={handleChange}
                placeholder="business@example.com"
                className="form-input"
              />
            </div>
            
            <div>
              <label>Tax ID</label>
              <input
                type="text"
                name="taxId"
                value={formData.taxId}
                onChange={handleChange}
                placeholder="12-3456789"
                className="form-input"
              />
            </div>
            
            <div>
              <label>Website</label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://www.yourbusiness.com"
                className="form-input"
              />
            </div>
          </div>

          <h4 style={{ marginBottom: '1rem' }}>Business Address</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <label>Street Address *</label>
              <input
                type="text"
                name="street"
                value={formData.businessAddress.street}
                onChange={handleAddressChange}
                placeholder="123 Business Ave"
                required
                className="form-input"
              />
            </div>
            
            <div>
              <label>City *</label>
              <input
                type="text"
                name="city"
                value={formData.businessAddress.city}
                onChange={handleAddressChange}
                placeholder="Business City"
                required
                className="form-input"
              />
            </div>
            
            <div>
              <label>State *</label>
              <input
                type="text"
                name="state"
                value={formData.businessAddress.state}
                onChange={handleAddressChange}
                placeholder="BC"
                required
                className="form-input"
              />
            </div>
            
            <div>
              <label>ZIP Code *</label>
              <input
                type="text"
                name="zipCode"
                value={formData.businessAddress.zipCode}
                onChange={handleAddressChange}
                placeholder="12345"
                required
                className="form-input"
              />
            </div>
            
            <div>
              <label>Country</label>
              <input
                type="text"
                name="country"
                value={formData.businessAddress.country}
                onChange={handleAddressChange}
                placeholder="USA"
                className="form-input"
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Save size={16} />
            {loading ? 'Saving...' : 'Save Business Information'}
          </button>
        </form>
      </div>

      {/* Logo Upload Section */}
      <div className="card" style={{ marginTop: '1.5rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <Upload size={20} />
          Business Logo
        </h3>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '1.5rem' }}>
          {logoPreview && (
            <div style={{ textAlign: 'center' }}>
              <img 
                src={logoPreview} 
                alt="Business Logo" 
                style={{ 
                  maxWidth: '120px', 
                  maxHeight: '80px', 
                  borderRadius: '8px',
                  border: '2px solid #e5e7eb'
                }} 
              />
              <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#64748b' }}>
                Current Logo
              </p>
            </div>
          )}
          
          <div style={{ flex: 1 }}>
            <label>Upload New Logo</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              className="form-input"
              style={{ padding: '0.5rem' }}
            />
            <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.25rem' }}>
              Accepted formats: JPG, PNG, GIF. Max size: 5MB
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          {logoFile && (
            <button
              onClick={handleLogoUpload}
              className="btn btn-primary"
              disabled={loading}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Upload size={16} />
              {loading ? 'Uploading...' : 'Upload Logo'}
            </button>
          )}
          
          {logoPreview && (
            <button
              onClick={handleLogoDelete}
              className="btn btn-danger"
              disabled={loading}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Trash2 size={16} />
              {loading ? 'Deleting...' : 'Delete Logo'}
            </button>
          )}
        </div>
      </div>

      {/* Invoice Settings Section */}
      <div className="card" style={{ marginTop: '1.5rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <FileText size={20} />
          Invoice Settings
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <label>Default Tax Rate (%)</label>
            <input
              type="number"
              name="defaultTaxRate"
              value={invoiceSettings.defaultTaxRate}
              onChange={handleInvoiceSettingsChange}
              min="0"
              max="100"
              step="0.1"
              className="form-input"
            />
          </div>
          
          <div>
            <label>Currency</label>
            <select
              name="currency"
              value={invoiceSettings.currency}
              onChange={handleInvoiceSettingsChange}
              className="form-input"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="CAD">CAD (C$)</option>
              <option value="AUD">AUD (A$)</option>
            </select>
          </div>
          
          <div>
            <label>Payment Terms</label>
            <select
              name="paymentTerms"
              value={invoiceSettings.paymentTerms}
              onChange={handleInvoiceSettingsChange}
              className="form-input"
            >
              <option value="Net 15">Net 15</option>
              <option value="Net 30">Net 30</option>
              <option value="Net 45">Net 45</option>
              <option value="Net 60">Net 60</option>
              <option value="Due on Receipt">Due on Receipt</option>
            </select>
          </div>
          
          <div>
            <label>Invoice Prefix</label>
            <input
              type="text"
              name="invoicePrefix"
              value={invoiceSettings.invoicePrefix}
              onChange={handleInvoiceSettingsChange}
              placeholder="INV"
              className="form-input"
            />
          </div>
        </div>

        <button
          onClick={handleSaveInvoiceSettings}
          className="btn btn-primary"
          disabled={loading}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Save size={16} />
          {loading ? 'Saving...' : 'Save Invoice Settings'}
        </button>
      </div>

      {/* Branding Section */}
      <div className="card" style={{ marginTop: '1.5rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <Palette size={20} />
          Branding & Colors
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <label>Primary Color</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="color"
                name="primaryColor"
                value={branding.primaryColor}
                onChange={handleBrandingChange}
                style={{ width: '50px', height: '40px', border: 'none', borderRadius: '4px' }}
              />
              <input
                type="text"
                name="primaryColor"
                value={branding.primaryColor}
                onChange={handleBrandingChange}
                className="form-input"
                style={{ flex: 1 }}
              />
            </div>
          </div>
          
          <div>
            <label>Secondary Color</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="color"
                name="secondaryColor"
                value={branding.secondaryColor}
                onChange={handleBrandingChange}
                style={{ width: '50px', height: '40px', border: 'none', borderRadius: '4px' }}
              />
              <input
                type="text"
                name="secondaryColor"
                value={branding.secondaryColor}
                onChange={handleBrandingChange}
                className="form-input"
                style={{ flex: 1 }}
              />
            </div>
          </div>
          
          <div>
            <label>Font Family</label>
            <select
              name="fontFamily"
              value={branding.fontFamily}
              onChange={handleBrandingChange}
              className="form-input"
            >
              <option value="Helvetica">Helvetica</option>
              <option value="Arial">Arial</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Georgia">Georgia</option>
              <option value="Verdana">Verdana</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleSaveBranding}
          className="btn btn-primary"
          disabled={loading}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Save size={16} />
          {loading ? 'Saving...' : 'Save Branding'}
        </button>
      </div>
    </div>
  );
}

export default BusinessProfile; 