import React, { useState, useEffect } from 'react';
import { getDashboardMetrics } from '../services/api';

const Dashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMetrics();
    const interval = setInterval(loadMetrics, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const loadMetrics = async () => {
    try {
      const data = await getDashboardMetrics();
      setMetrics(data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading metrics:', error);
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

  return (
    <div className="container">
      <h1 style={{ marginBottom: '2rem' }}>Real-Time Decision Automation Dashboard</h1>

      {/* Key Metrics */}
      <div className="metrics-grid">
        <div className="metric-card success">
          <div className="metric-label">Transactions Today</div>
          <div className="metric-value">{metrics.transactionsToday.toLocaleString()}</div>
          <div className="metric-change positive">
            ↑ {metrics.transactionGrowth}% vs yesterday
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-label">Decisions Made</div>
          <div className="metric-value">{metrics.decisionsMade.toLocaleString()}</div>
          <div className="metric-change positive">
            ↑ {metrics.decisionsGrowth}% vs yesterday
          </div>
        </div>

        <div className="metric-card warning">
          <div className="metric-label">Fraud Blocked</div>
          <div className="metric-value">₹{(metrics.fraudBlocked / 10000000).toFixed(2)}Cr</div>
          <div className="metric-change">
            {metrics.fraudCount} transactions
          </div>
        </div>

        <div className="metric-card success">
          <div className="metric-label">Cross-Sell Revenue</div>
          <div className="metric-value">₹{(metrics.crossSellRevenue / 10000000).toFixed(2)}Cr</div>
          <div className="metric-change positive">
            ↑ {metrics.revenueGrowth}% conversion
          </div>
        </div>
      </div>

      {/* System Health */}
      <div className="card">
        <div className="card-header">
          <div>
            <h2 className="card-title">System Health</h2>
            <p className="card-subtitle">Real-time platform performance</p>
          </div>
        </div>
        <div className="metrics-grid">
          <div>
            <div className="metric-label">API Response Time</div>
            <div className="metric-value" style={{ fontSize: '1.5rem' }}>
              {metrics.apiResponseTime}ms
            </div>
            <div className="metric-change positive">P95 Latency</div>
          </div>
          <div>
            <div className="metric-label">Decision Engine Throughput</div>
            <div className="metric-value" style={{ fontSize: '1.5rem' }}>
              {metrics.throughput.toLocaleString()}/sec
            </div>
            <div className="metric-change">Current load</div>
          </div>
          <div>
            <div className="metric-label">System Uptime</div>
            <div className="metric-value" style={{ fontSize: '1.5rem' }}>
              {metrics.uptime}%
            </div>
            <div className="metric-change positive">Last 30 days</div>
          </div>
          <div>
            <div className="metric-label">Active Users</div>
            <div className="metric-value" style={{ fontSize: '1.5rem' }}>
              {metrics.activeUsers.toLocaleString()}
            </div>
            <div className="metric-change">Online now</div>
          </div>
        </div>
      </div>

      {/* Recent Decisions */}
      <div className="card">
        <div className="card-header">
          <div>
            <h2 className="card-title">Recent Decision Outcomes</h2>
            <p className="card-subtitle">Last 10 automated decisions</p>
          </div>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Time</th>
                <th>Customer ID</th>
                <th>Decision Type</th>
                <th>Outcome</th>
                <th>Confidence</th>
                <th>Latency</th>
              </tr>
            </thead>
            <tbody>
              {metrics.recentDecisions.map((decision, index) => (
                <tr key={index}>
                  <td>{decision.time}</td>
                  <td>{decision.customerId}</td>
                  <td>{decision.type}</td>
                  <td>
                    <span className={`badge badge-${decision.badgeClass}`}>
                      {decision.outcome}
                    </span>
                  </td>
                  <td>{decision.confidence}%</td>
                  <td>{decision.latency}ms</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Fraud Alerts */}
      <div className="card">
        <div className="card-header">
          <div>
            <h2 className="card-title">Active Fraud Alerts</h2>
            <p className="card-subtitle">Transactions flagged for review</p>
          </div>
          <button className="btn btn-primary">View All</button>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Alert Time</th>
                <th>Customer</th>
                <th>Transaction</th>
                <th>Amount</th>
                <th>Risk Score</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {metrics.fraudAlerts.map((alert, index) => (
                <tr key={index}>
                  <td>{alert.time}</td>
                  <td>{alert.customerName}<br/><small>{alert.customerId}</small></td>
                  <td>{alert.transaction}</td>
                  <td>₹{alert.amount.toLocaleString()}</td>
                  <td>
                    <span className={`badge badge-${alert.riskBadge}`}>
                      {alert.riskScore}%
                    </span>
                  </td>
                  <td>
                    <span className={`badge badge-${alert.statusBadge}`}>
                      {alert.status}
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-secondary" style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}>
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Cross-Sell Offers */}
      <div className="card">
        <div className="card-header">
          <div>
            <h2 className="card-title">Top Performing Cross-Sell Offers</h2>
            <p className="card-subtitle">Highest conversion rates today</p>
          </div>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Offers Sent</th>
                <th>Conversions</th>
                <th>Conversion Rate</th>
                <th>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {metrics.topOffers.map((offer, index) => (
                <tr key={index}>
                  <td>{offer.product}</td>
                  <td>{offer.sent}</td>
                  <td>{offer.conversions}</td>
                  <td>
                    <span className="badge badge-success">
                      {offer.conversionRate}%
                    </span>
                  </td>
                  <td>₹{offer.revenue.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
