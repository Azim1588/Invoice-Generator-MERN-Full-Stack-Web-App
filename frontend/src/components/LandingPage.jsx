import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { 
  FileText, 
  Download, 
  Users, 
  TrendingUp, 
  Palette, 
  CheckCircle, 
  ArrowRight,
  Zap,
  Clock,
  DollarSign,
  Shield,
  Play,
  ChevronRight,
  Sparkles,
  BarChart3,
  CreditCard,
  Globe,
  Smartphone,
  Mail
} from 'lucide-react';

const LandingPage = () => {
  const [currentFeature, setCurrentFeature] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: <Sparkles size={28} />,
      title: "AI-Powered Templates",
      description: "Smart templates that adapt to your business and automatically suggest the best layouts"
    },
    {
      icon: <BarChart3 size={28} />,
      title: "Real-time Analytics",
      description: "Track payment status, client behavior, and revenue insights with detailed dashboards"
    },
    {
      icon: <Globe size={28} />,
      title: "Multi-currency Support",
      description: "Create invoices in any currency with automatic exchange rate calculations"
    },
    {
      icon: <Smartphone size={28} />,
      title: "Mobile-First Design",
      description: "Create and manage invoices on any device with our responsive interface"
    },
    {
      icon: <Mail size={28} />,
      title: "Automated Follow-ups",
      description: "Set up automatic payment reminders and follow-up emails to get paid faster"
    },
    {
      icon: <CreditCard size={28} />,
      title: "Payment Integration",
      description: "Accept payments directly through your invoices with secure payment gateways"
    }
  ];

  return (
    <div className={`landing-page ${isVisible ? 'visible' : ''}`} style={{ background: 'var(--bg-secondary)' }}>
      {/* Navigation */}
      <nav className="landing-nav" style={{ background: 'var(--bg-primary)' }}>
        <div className="nav-container">
          <div className="nav-brand">
            <div className="brand-logo" style={{ background: 'var(--restaurant-orange)', color: '#fff' }}>
              <Sparkles size={24} />
            </div>
            <span>InvoicePro</span>
          </div>
          <div className="nav-actions">
            <Link to="/login" className="nav-link">Sign In</Link>
            <Link to="/register" className="btn btn-primary">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background">
          <div className="gradient-orb orb-1" style={{ background: 'var(--restaurant-orange)' }}></div>
          <div className="gradient-orb orb-2" style={{ background: 'var(--restaurant-green)' }}></div>
          <div className="gradient-orb orb-3" style={{ background: 'var(--restaurant-cream)' }}></div>
        </div>
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <div className="hero-badge" style={{ background: 'var(--restaurant-orange)', color: '#fff' }}>
                <Sparkles size={16} />
                <span>Trusted by 15,000+ businesses worldwide</span>
              </div>
              <h1 className="hero-title">
                Create Professional Invoices in
                <span className="gradient-text"> Seconds</span>
              </h1>
              <p className="hero-subtitle">
                Transform your billing process with our intelligent invoice generator. 
                Beautiful templates, automated workflows, and instant payments.
              </p>
              <div className="hero-cta">
                <Link to="/register" className="btn btn-primary btn-large">
                  <span>Start Creating Invoices</span>
                  <ArrowRight size={20} />
                </Link>
                <button 
                  onClick={() => setShowVideoModal(true)}
                  className="btn btn-secondary btn-large"
                >
                  <Play size={20} />
                  <span>Watch Demo</span>
                </button>
              </div>
            </div>
            <div className="hero-visual">
              <div className="invoice-showcase" style={{ 
                background: isDarkMode ? '#1a1a1a' : 'var(--restaurant-cream)', 
                borderRadius: 16 
              }}>
                <div className="invoice-card" style={{ 
                  background: isDarkMode ? '#1a1a1a' : 'var(--restaurant-cream)', 
                  color: isDarkMode ? '#ffffff' : 'var(--text-primary)' 
                }}>
                  <div className="invoice-header">
                    <div className="company-info">
                      <div className="company-logo" style={{ background: 'var(--restaurant-orange)', color: '#fff' }}>
                        <Sparkles size={24} />
                      </div>
                      <div>
                        <h4>Acme Corporation</h4>
                        <p>123 Business St, City, State</p>
                      </div>
                    </div>
                    <div className="invoice-meta">
                      <h2>INVOICE</h2>
                      <p>#INV-2024-001</p>
                      <p>Due: Dec 15, 2024</p>
                    </div>
                  </div>
                  <div className="invoice-body">
                    <div className="invoice-item">
                      <span>Web Development</span>
                      <span>$2,500.00</span>
                    </div>
                    <div className="invoice-item">
                      <span>UI/UX Design</span>
                      <span>$1,200.00</span>
                    </div>
                    <div className="invoice-total">
                      <span>Total</span>
                      <span>$3,700.00</span>
                    </div>
                  </div>
                </div>
                <div className="floating-elements">
                  <div className="floating-card card-1" style={{ background: 'var(--restaurant-green)', color: '#fff' }}>
                    <CheckCircle size={16} />
                    <span>Payment Received</span>
                  </div>
                  <div className="floating-card card-2" style={{ background: 'var(--restaurant-orange)', color: '#fff' }}>
                    <Download size={16} />
                    <span>PDF Generated</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">Features</div>
            <h2 className="section-title">
              Everything you need to invoice like a
              <span className="gradient-text"> professional</span>
            </h2>
            <p className="section-subtitle">
              Powerful tools designed to streamline your invoicing workflow and get you paid faster
            </p>
          </div>
          
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">
                  {feature.icon}
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
                <div className="feature-arrow">
                  <ChevronRight size={16} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">How It Works</div>
            <h2 className="section-title">
              Get started in
              <span className="gradient-text"> 3 simple steps</span>
            </h2>
          </div>
          
          <div className="steps-container">
            <div className="step-card">
              <div className="step-number">01</div>
              <div className="step-icon">
                <Users size={24} />
              </div>
              <h3>Set Up Your Business</h3>
              <p>Add your company details, logo, and customize your branding preferences</p>
            </div>
            
            <div className="step-connector">
              <ArrowRight size={24} />
            </div>
            
            <div className="step-card">
              <div className="step-number">02</div>
              <div className="step-icon">
                <FileText size={24} />
              </div>
              <h3>Create Your Invoice</h3>
              <p>Select clients, add items, and customize your invoice with our beautiful templates</p>
            </div>
            
            <div className="step-connector">
              <ArrowRight size={24} />
            </div>
            
            <div className="step-card">
              <div className="step-number">03</div>
              <div className="step-icon">
                <Download size={24} />
              </div>
              <h3>Send & Get Paid</h3>
              <p>Send professional PDF invoices to your clients and track payments in real-time</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <div className="cta-badge">
              <Sparkles size={16} />
              <span>Ready to get started?</span>
            </div>
            <h2>Transform your invoicing today</h2>
            <p>Join thousands of professionals who have streamlined their billing process</p>
            <div className="cta-buttons">
              <Link to="/register" className="btn btn-primary btn-large">
                <span>Start Free Trial</span>
                <ArrowRight size={20} />
              </Link>
              <Link to="/login" className="btn btn-secondary btn-large">
                <span>Sign In</span>
              </Link>
            </div>
            <p className="cta-note">No credit card required • 14-day free trial</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="brand-logo">
                <Sparkles size={24} />
              </div>
              <span>InvoicePro</span>
            </div>
            <div className="footer-links">
              <div className="footer-column">
                <h4>Product</h4>
                <a href="#features">Features</a>
                <a href="#pricing">Pricing</a>
                <a href="#templates">Templates</a>
              </div>
              <div className="footer-column">
                <h4>Company</h4>
                <a href="#about">About</a>
                <a href="#contact">Contact</a>
                <a href="#blog">Blog</a>
              </div>
              <div className="footer-column">
                <h4>Support</h4>
                <a href="#help">Help Center</a>
                <a href="#docs">Documentation</a>
                <a href="#status">Status</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 InvoicePro. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Video Modal */}
      {showVideoModal && (
        <div className="video-modal-overlay" onClick={() => setShowVideoModal(false)}>
          <div className="video-modal" onClick={(e) => e.stopPropagation()}>
            <button 
              className="video-modal-close" 
              onClick={() => setShowVideoModal(false)}
            >
              ×
            </button>
            <div className="video-container">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/YOUR_VIDEO_ID?autoplay=1"
                title="Invoice Generator Demo"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage; 