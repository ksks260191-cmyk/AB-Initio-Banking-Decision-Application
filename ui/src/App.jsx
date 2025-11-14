import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import CustomerProfile from './components/CustomerProfile';
import TransactionMonitor from './components/TransactionMonitor';
import DecisionInsights from './components/DecisionInsights';
import Analytics from './components/Analytics';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <div className="navbar-content">
            <div className="navbar-brand">
              <div>
                <div>AB Initio Banking</div>
                <div className="navbar-brand-subtitle">Real-Time Decision Automation Platform</div>
              </div>
            </div>
            <ul className="navbar-links">
              <li>
                <Link 
                  to="/" 
                  className={`navbar-link ${activeTab === 'dashboard' ? 'active' : ''}`}
                  onClick={() => setActiveTab('dashboard')}
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link 
                  to="/customers" 
                  className={`navbar-link ${activeTab === 'customers' ? 'active' : ''}`}
                  onClick={() => setActiveTab('customers')}
                >
                  Customers
                </Link>
              </li>
              <li>
                <Link 
                  to="/transactions" 
                  className={`navbar-link ${activeTab === 'transactions' ? 'active' : ''}`}
                  onClick={() => setActiveTab('transactions')}
                >
                  Transactions
                </Link>
              </li>
              <li>
                <Link 
                  to="/decisions" 
                  className={`navbar-link ${activeTab === 'decisions' ? 'active' : ''}`}
                  onClick={() => setActiveTab('decisions')}
                >
                  Decisions
                </Link>
              </li>
              <li>
                <Link 
                  to="/analytics" 
                  className={`navbar-link ${activeTab === 'analytics' ? 'active' : ''}`}
                  onClick={() => setActiveTab('analytics')}
                >
                  Analytics
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/customers" element={<CustomerProfile />} />
          <Route path="/transactions" element={<TransactionMonitor />} />
          <Route path="/decisions" element={<DecisionInsights />} />
          <Route path="/analytics" element={<Analytics />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
