import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { Home, Users, FileText, Plus, LogOut, User, Menu, X, Settings } from 'lucide-react';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import ThemeToggle from './components/ThemeToggle';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Pages
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import Invoices from './pages/Invoices';
import InvoiceDetail from './pages/InvoiceDetail';
import EditInvoice from './pages/EditInvoice';
import CreateInvoice from './pages/CreateInvoice';
import CreateCustomer from './pages/CreateCustomer';
import CustomerDetail from './pages/CustomerDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import LandingPage from './components/LandingPage';
import BusinessProfile from './pages/BusinessProfile';
import EditCustomer from './pages/EditCustomer';

// Separate component for the main app content
function AppContent() {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  console.log('🏠 AppContent: Current user state:', user ? { name: user.name, email: user.email } : 'null');
  console.log('📍 Current location:', location.pathname);

  const handleLogout = () => {
    logout(() => {
      // Redirect to landing page after logout
      window.location.href = '/';
    });
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    console.log('🔧 Sidebar: Closing sidebar');
    setSidebarOpen(false);
  };

  const isActive = (path) => {
    const active = location.pathname === path;
    console.log(`🔧 Navigation: ${path} is ${active ? 'active' : 'inactive'}`);
    return active;
  };

  return (
    <div className="App">
      {user && (
        <div className="app-layout">
          {/* Mobile Menu Toggle */}
          <button 
            className="mobile-menu-toggle" 
            onClick={toggleSidebar}
            aria-label="Toggle navigation menu"
          >
            <Menu size={20} />
          </button>

          {/* Mobile Overlay */}
          <div 
            className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`}
            onClick={closeSidebar}
          />

          {/* Vertical Sidebar */}
          <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
            <div className="sidebar-header">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link to="/dashboard" className="sidebar-brand" onClick={closeSidebar}>
                  Invoice Generator
                </Link>
                <button 
                  className="close-btn"
                  onClick={closeSidebar}
                  aria-label="Close navigation menu"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
            
            <nav className="sidebar-nav">
              <ul className="sidebar-nav-list">
                <li>
                  <Link 
                    to="/dashboard" 
                    className={`sidebar-nav-link ${isActive('/dashboard') ? 'active' : ''}`} 
                    onClick={closeSidebar}
                  >
                    <Home size={20} />
                    <span>Dashboard</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/customers" 
                    className={`sidebar-nav-link ${isActive('/customers') ? 'active' : ''}`} 
                    onClick={closeSidebar}
                  >
                    <Users size={20} />
                    <span>Customers</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/invoices" 
                    className={`sidebar-nav-link ${isActive('/invoices') ? 'active' : ''}`} 
                    onClick={closeSidebar}
                  >
                    <FileText size={20} />
                    <span>Invoices</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/business-profile" 
                    className={`sidebar-nav-link ${isActive('/business-profile') ? 'active' : ''}`} 
                    onClick={closeSidebar}
                  >
                    <Settings size={20} />
                    <span>Business Profile</span>
                  </Link>
                </li>
              </ul>
            </nav>

            <div className="sidebar-footer">
              <div className="user-info">
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem',
                  color: 'var(--text-secondary)',
                  fontSize: '0.875rem',
                  marginBottom: '1rem'
                }}>
                  <User size={16} />
                  <span>{user?.name}</span>
                </div>
              </div>
              
              <div className="sidebar-actions">
                <ThemeToggle />
                <button
                  onClick={handleLogout}
                  className="btn btn-secondary sidebar-logout-btn"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="main-content">
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/customers/create" element={<CreateCustomer />} />
              <Route path="/customers/:id" element={<CustomerDetail />} />
              <Route path="/customers/:id/edit" element={<EditCustomer />} />
              <Route path="/invoices" element={<Invoices />} />
              <Route path="/invoices/create" element={<CreateInvoice />} />
              <Route path="/invoices/:id" element={<InvoiceDetail />} />
              <Route path="/invoices/:id/edit" element={<EditInvoice />} />
              <Route path="/business-profile" element={<BusinessProfile />} />
              <Route path="/login" element={<Navigate to="/dashboard" replace />} />
              <Route path="/register" element={<Navigate to="/dashboard" replace />} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </main>
        </div>
      )}

      {!user && (
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      )}
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App; 