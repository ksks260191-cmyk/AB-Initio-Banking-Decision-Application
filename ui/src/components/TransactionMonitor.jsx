import React, { useState, useEffect } from 'react';
import { getTransactionStream } from '../services/api';

const TransactionMonitor = () => {
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState('all');
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    loadTransactions();
    
    if (autoRefresh) {
      const interval = setInterval(loadTransactions, 3000); // Refresh every 3 seconds
      return () => clearInterval(interval);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoRefresh, filter]);

  const loadTransactions = async () => {
    try {
      const data = await getTransactionStream(filter);
      setTransactions(data);
    } catch (error) {
      console.error('Error loading transactions:', error);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      'APPROVED': 'success',
      'BLOCKED': 'danger',
      'PENDING': 'warning',
      'REVIEW': 'warning'
    };
    return badges[status] || 'secondary';
  };

  const getRiskBadge = (risk) => {
    if (risk >= 80) return 'danger';
    if (risk >= 50) return 'warning';
    return 'success';
  };

  return (
    <div className="container">
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Real-Time Transaction Monitor</h1>
          <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>
            Live transaction stream with fraud detection
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
            />
            Auto-refresh
          </label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              border: '1px solid #d1d5db',
              fontSize: '0.875rem'
            }}
          >
            <option value="all">All Transactions</option>
            <option value="approved">Approved</option>
            <option value="blocked">Blocked</option>
            <option value="pending">Pending Review</option>
            <option value="high-risk">High Risk</option>
          </select>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="metrics-grid" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
        <div className="metric-card success">
          <div className="metric-label">Approved</div>
          <div className="metric-value" style={{ fontSize: '1.5rem' }}>
            {transactions.filter(t => t.status === 'APPROVED').length}
          </div>
        </div>
        <div className="metric-card danger">
          <div className="metric-label">Blocked</div>
          <div className="metric-value" style={{ fontSize: '1.5rem' }}>
            {transactions.filter(t => t.status === 'BLOCKED').length}
          </div>
        </div>
        <div className="metric-card warning">
          <div className="metric-label">Pending</div>
          <div className="metric-value" style={{ fontSize: '1.5rem' }}>
            {transactions.filter(t => t.status === 'PENDING').length}
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Avg. Latency</div>
          <div className="metric-value" style={{ fontSize: '1.5rem' }}>42ms</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Throughput</div>
          <div className="metric-value" style={{ fontSize: '1.5rem' }}>5.2K/s</div>
        </div>
      </div>

      {/* Transaction Stream */}
      <div className="card">
        <div className="card-header">
          <div>
            <h2 className="card-title">Live Transaction Stream</h2>
            <p className="card-subtitle">
              Showing {transactions.length} transactions • Updated every 3 seconds
            </p>
          </div>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Time</th>
                <th>Transaction ID</th>
                <th>Customer</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Location</th>
                <th>Risk Score</th>
                <th>Status</th>
                <th>Latency</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((txn, index) => (
                <tr key={index}>
                  <td>{txn.time}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                    {txn.transactionId}
                  </td>
                  <td>
                    {txn.customerName}
                    <br />
                    <small style={{ color: '#6b7280' }}>{txn.customerId}</small>
                  </td>
                  <td>{txn.type}</td>
                  <td style={{ fontWeight: '600' }}>₹{txn.amount.toLocaleString()}</td>
                  <td>{txn.location}</td>
                  <td>
                    <span className={`badge badge-${getRiskBadge(txn.riskScore)}`}>
                      {txn.riskScore}%
                    </span>
                  </td>
                  <td>
                    <span className={`badge badge-${getStatusBadge(txn.status)}`}>
                      {txn.status}
                    </span>
                  </td>
                  <td>{txn.latency}ms</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Fraud Detection Insights */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div className="card">
          <div className="card-header">
            <div>
              <h2 className="card-title">Fraud Detection Rules Triggered</h2>
              <p className="card-subtitle">Top rules in last hour</p>
            </div>
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Rule</th>
                  <th>Count</th>
                  <th>Block Rate</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Geographic Anomaly</td>
                  <td>47</td>
                  <td><span className="badge badge-danger">89%</span></td>
                </tr>
                <tr>
                  <td>Velocity Check Failed</td>
                  <td>32</td>
                  <td><span className="badge badge-danger">94%</span></td>
                </tr>
                <tr>
                  <td>Unusual Merchant</td>
                  <td>28</td>
                  <td><span className="badge badge-warning">45%</span></td>
                </tr>
                <tr>
                  <td>High Amount Alert</td>
                  <td>19</td>
                  <td><span className="badge badge-warning">52%</span></td>
                </tr>
                <tr>
                  <td>Device Mismatch</td>
                  <td>15</td>
                  <td><span className="badge badge-danger">87%</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <h2 className="card-title">Geographic Distribution</h2>
              <p className="card-subtitle">Transaction origins</p>
            </div>
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Location</th>
                  <th>Transactions</th>
                  <th>Fraud Rate</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Mumbai, MH</td>
                  <td>1,247</td>
                  <td><span className="badge badge-success">1.2%</span></td>
                </tr>
                <tr>
                  <td>Bangalore, KA</td>
                  <td>892</td>
                  <td><span className="badge badge-success">0.9%</span></td>
                </tr>
                <tr>
                  <td>Pune, MH</td>
                  <td>634</td>
                  <td><span className="badge badge-success">1.1%</span></td>
                </tr>
                <tr>
                  <td>Delhi, DL</td>
                  <td>445</td>
                  <td><span className="badge badge-warning">2.8%</span></td>
                </tr>
                <tr>
                  <td>International</td>
                  <td>178</td>
                  <td><span className="badge badge-danger">8.4%</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionMonitor;
