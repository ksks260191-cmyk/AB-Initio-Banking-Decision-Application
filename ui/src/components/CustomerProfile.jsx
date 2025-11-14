import React, { useState, useEffect } from 'react';
import { getCustomerProfile, getCustomerTransactions } from '../services/api';

const CustomerProfile = () => {
  const [customerId, setCustomerId] = useState('C123456');
  const [profile, setProfile] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCustomerData();
  }, [customerId]);

  const loadCustomerData = async () => {
    setLoading(true);
    try {
      const profileData = await getCustomerProfile(customerId);
      const transactionData = await getCustomerTransactions(customerId);
      setProfile(profileData);
      setTransactions(transactionData);
      setLoading(false);
    } catch (error) {
      console.error('Error loading customer data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container">
        <div className="alert alert-warning">
          Customer not found. Please try a different Customer ID.
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Customer 360° Profile</h1>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <input
            type="text"
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            placeholder="Enter Customer ID"
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              border: '1px solid #d1d5db',
              fontSize: '0.875rem'
            }}
          />
          <button className="btn btn-primary" onClick={loadCustomerData}>
            Load Profile
          </button>
        </div>
      </div>

      <div className="profile-grid">
        {/* Sidebar */}
        <div className="profile-sidebar">
          <div className="profile-avatar">
            {profile.firstName[0]}{profile.lastName[0]}
          </div>
          <div className="profile-name">
            {profile.firstName} {profile.lastName}
          </div>
          <div className="profile-id">{profile.customerId}</div>

          <div style={{ marginTop: '1.5rem' }}>
            <div className="profile-detail">
              <span className="profile-detail-label">Customer Since</span>
              <span className="profile-detail-value">{profile.customerSince}</span>
            </div>
            <div className="profile-detail">
              <span className="profile-detail-label">Tier</span>
              <span className="profile-detail-value">
                <span className={`badge badge-${profile.tierBadge}`}>
                  {profile.tier}
                </span>
              </span>
            </div>
            <div className="profile-detail">
              <span className="profile-detail-label">Credit Score</span>
              <span className="profile-detail-value">{profile.creditScore}</span>
            </div>
            <div className="profile-detail">
              <span className="profile-detail-label">Life Stage</span>
              <span className="profile-detail-value">{profile.lifeStage}</span>
            </div>
            <div className="profile-detail">
              <span className="profile-detail-label">Lifetime Value</span>
              <span className="profile-detail-value">₹{profile.lifetimeValue.toLocaleString()}</span>
            </div>
            <div className="profile-detail" style={{ borderBottom: 'none' }}>
              <span className="profile-detail-label">Annual Income</span>
              <span className="profile-detail-value">₹{profile.annualIncome.toLocaleString()}</span>
            </div>
          </div>

          <div style={{ marginTop: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '1rem' }}>Contact</h3>
            <div className="profile-detail">
              <span className="profile-detail-label">Email</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.75rem' }}>
              {profile.email}
            </div>
            <div className="profile-detail">
              <span className="profile-detail-label">Phone</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.75rem' }}>
              {profile.phone}
            </div>
            <div className="profile-detail">
              <span className="profile-detail-label">Location</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
              {profile.city}, {profile.state}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div>
          {/* Product Holdings */}
          <div className="card">
            <div className="card-header">
              <div>
                <h2 className="card-title">Product Holdings</h2>
                <p className="card-subtitle">Active accounts and products</p>
              </div>
            </div>
            <div className="metrics-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
              {profile.products.map((product, index) => (
                <div key={index} style={{
                  padding: '1rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                    {product.type}
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.25rem' }}>
                    ₹{product.balance.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                    {product.accountNumber}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Financial Summary */}
          <div className="card">
            <div className="card-header">
              <div>
                <h2 className="card-title">Financial Summary</h2>
                <p className="card-subtitle">Total assets and liabilities</p>
              </div>
            </div>
            <div className="metrics-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
              <div>
                <div className="metric-label">Total Assets</div>
                <div className="metric-value" style={{ fontSize: '1.5rem' }}>
                  ₹{profile.totalAssets.toLocaleString()}
                </div>
              </div>
              <div>
                <div className="metric-label">Total Liabilities</div>
                <div className="metric-value" style={{ fontSize: '1.5rem' }}>
                  ₹{profile.totalLiabilities.toLocaleString()}
                </div>
              </div>
              <div>
                <div className="metric-label">Net Worth</div>
                <div className="metric-value" style={{ fontSize: '1.5rem', color: '#10b981' }}>
                  ₹{profile.netWorth.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="card">
            <div className="card-header">
              <div>
                <h2 className="card-title">Recent Transactions</h2>
                <p className="card-subtitle">Last 10 transactions</p>
              </div>
            </div>
            <div>
              {transactions.map((txn, index) => (
                <div key={index} className="transaction-item">
                  <div className="transaction-info">
                    <div className={`transaction-icon ${txn.iconClass}`}>
                      {txn.icon}
                    </div>
                    <div className="transaction-details">
                      <h4>{txn.description}</h4>
                      <p>{txn.date} • {txn.accountType}</p>
                    </div>
                  </div>
                  <div>
                    <div className={`transaction-amount ${txn.amountClass}`}>
                      {txn.amount}
                    </div>
                    <div style={{ textAlign: 'right', marginTop: '0.25rem' }}>
                      <span className={`badge badge-${txn.statusBadge}`}>
                        {txn.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Behavior & Risk Profile */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="card">
              <div className="card-header">
                <div>
                  <h2 className="card-title">Behavior Profile</h2>
                </div>
              </div>
              <div>
                <div className="profile-detail">
                  <span className="profile-detail-label">Digital Engagement</span>
                  <span className="profile-detail-value">
                    <span className="badge badge-success">High</span>
                  </span>
                </div>
                <div className="profile-detail">
                  <span className="profile-detail-label">Mobile Banking</span>
                  <span className="profile-detail-value">87%</span>
                </div>
                <div className="profile-detail">
                  <span className="profile-detail-label">Branch Visits</span>
                  <span className="profile-detail-value">2/month</span>
                </div>
                <div className="profile-detail" style={{ borderBottom: 'none' }}>
                  <span className="profile-detail-label">Product Affinity</span>
                  <span className="profile-detail-value">Investment</span>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <div>
                  <h2 className="card-title">Risk Profile</h2>
                </div>
              </div>
              <div>
                <div className="profile-detail">
                  <span className="profile-detail-label">Fraud Risk</span>
                  <span className="profile-detail-value">
                    <span className="badge badge-success">Low</span>
                  </span>
                </div>
                <div className="profile-detail">
                  <span className="profile-detail-label">Credit Risk</span>
                  <span className="profile-detail-value">
                    <span className="badge badge-success">Low</span>
                  </span>
                </div>
                <div className="profile-detail">
                  <span className="profile-detail-label">Payment History</span>
                  <span className="profile-detail-value">100% On-Time</span>
                </div>
                <div className="profile-detail" style={{ borderBottom: 'none' }}>
                  <span className="profile-detail-label">Churn Risk</span>
                  <span className="profile-detail-value">
                    <span className="badge badge-success">Low (12%)</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerProfile;
