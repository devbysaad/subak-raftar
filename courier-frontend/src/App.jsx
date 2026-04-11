import React from 'react';
import { 
  Package, 
  ShoppingCart, 
  MapPin, 
  TrendingUp, 
  ArrowRight,
  Zap,
  ShieldCheck,
  Truck
} from 'lucide-react';
import './App.css';

function App() {
  return (
    <div className="app-container">
      {/* Background decoration */}
      <div className="bg-blob blob-1"></div>
      <div className="bg-blob blob-2"></div>

      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-brand">
          <Truck size={28} />
          Subak Raftar
        </div>
        <div className="nav-links">
          <a href="#features" className="nav-link">Features</a>
          <a href="#about" className="nav-link">Solutions</a>
          <a href="#pricing" className="nav-link">Pricing</a>
        </div>
        <div className="nav-actions">
          <button className="btn-primary">Go to Portal</button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="hero">
        <div className="hero-badge">
          <Zap size={14} />
          <span>The next generation logistics platform</span>
        </div>
        
        <h1 className="hero-title">
          Manage your <span className="text-gradient">e-commerce</span> <br />work effortlessly
        </h1>
        
        <p className="hero-subtitle">
          An all-in-one portal designed to streamline your business. Process orders, track shipments in real-time, and monitor your profits from a single unified dashboard.
        </p>

        <div className="hero-actions">
          <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            Get Started <ArrowRight size={18} />
          </button>
          <button className="btn-secondary">View Documentation</button>
        </div>

        {/* Dashboard preview decoration */}
        <div className="dashboard-preview">
          <div className="dashboard-header">
            <div className="mac-dot red"></div>
            <div className="mac-dot yellow"></div>
            <div className="mac-dot green"></div>
          </div>
          {/* Abstract representation of a dashboard inside */}
        </div>
      </main>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="features-header">
          <h2 className="features-title">Everything you need to scale</h2>
          <p className="hero-subtitle" style={{ margin: '0 auto' }}>
            Powerful tools connected into one seamless workflow.
          </p>
        </div>

        <div className="features-grid">
          <div className="feature-card glass-card">
            <div className="feature-icon-wrapper">
              <ShoppingCart size={32} />
            </div>
            <h3 className="feature-title">Receive Orders</h3>
            <p className="feature-desc">
              Automatically sync orders from multiple storefronts like Shopify and WooCommerce perfectly into your fulfillment queue.
            </p>
          </div>

          <div className="feature-card glass-card">
            <div className="feature-icon-wrapper">
              <Package size={32} />
            </div>
            <h3 className="feature-title">Shipment Management</h3>
            <p className="feature-desc">
              Create, review, and print shipping labels in bulk. Connect with top logistics providers through a single integration.
            </p>
          </div>

          <div className="feature-card glass-card">
            <div className="feature-icon-wrapper">
              <MapPin size={32} />
            </div>
            <h3 className="feature-title">Real-time Tracking</h3>
            <p className="feature-desc">
              Monitor parcel movement with live status updates. Keep your customers informed with automated branded tracking notifications.
            </p>
          </div>

          <div className="feature-card glass-card">
            <div className="feature-icon-wrapper">
              <TrendingUp size={32} />
            </div>
            <h3 className="feature-title">Revenue & Profits</h3>
            <p className="feature-desc">
              Detailed financial reports giving you clarity on shipping costs, Cash on Delivery (COD) remittances, and net profit streams.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
