import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/change-password', data),
};

// Customer API
export const customerAPI = {
  getAll: () => api.get('/customers'),
  getById: (id) => api.get(`/customers/${id}`),
  create: (data) => api.post('/customers', data),
  update: (id, data) => api.put(`/customers/${id}`, data),
  delete: (id) => api.delete(`/customers/${id}`),
};

// Invoice API
export const invoiceAPI = {
  getAll: () => api.get('/invoices'),
  getById: (id) => api.get(`/invoices/${id}`),
  create: (data) => api.post('/invoices', data),
  update: (id, data) => api.put(`/invoices/${id}`, data),
  delete: (id) => api.delete(`/invoices/${id}`),
  getByCustomer: (customerId) => api.get(`/invoices/customer/${customerId}`),
  downloadPDF: (id) => api.get(`/invoices/${id}/pdf`, { responseType: 'blob' }),
};

// Business Profile API
export const businessProfileAPI = {
  get: () => api.get('/business-profile'),
  update: (data) => api.put('/business-profile', data),
  uploadLogo: (formData) => api.post('/business-profile/logo', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  deleteLogo: () => api.delete('/business-profile/logo'),
  getLogo: () => api.get('/business-profile/logo'),
  updateInvoiceSettings: (data) => api.put('/business-profile/invoice-settings', data),
  updateBranding: (data) => api.put('/business-profile/branding', data),
};

// Helper function to get logo URL
export const getLogoUrl = async () => {
  try {
    const response = await businessProfileAPI.getLogo();
    return response.data.data.logoUrl;
  } catch (error) {
    console.error('Error getting logo URL:', error);
    return null;
  }
};

// PDF Download Helper
export const downloadPDF = async (invoiceId, invoiceNumber) => {
  try {
    const response = await invoiceAPI.downloadPDF(invoiceId);
    // Check if the response is a PDF
    const contentType = response.headers['content-type'];
    if (contentType && contentType.includes('application/pdf')) {
      // Create blob and download
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice-${invoiceNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      return { success: true };
    } else {
      // Try to parse error message
      let errorMsg = 'Failed to download PDF';
      try {
        const text = await response.data.text();
        const json = JSON.parse(text);
        errorMsg = json.error || errorMsg;
      } catch (e) {}
      return { success: false, error: errorMsg };
    }
  } catch (error) {
    let errorMsg = 'Failed to download PDF';
    if (error.response && error.response.data) {
      try {
        const reader = new FileReader();
        reader.onload = function() {
          try {
            const json = JSON.parse(reader.result);
            errorMsg = json.error || errorMsg;
          } catch (e) {}
        };
        reader.readAsText(error.response.data);
      } catch (e) {}
    }
    console.error('PDF download error:', error);
    return { success: false, error: errorMsg };
  }
};

export default api; 