import React, { useState, useEffect } from 'react';
import { getDecisionInsights } from '../services/api';

const DecisionInsights = () => {
  const [insights, setInsights] = useState(null);
  const [timeRange, setTimeRange] = useState('today');

  useEffect(() => {
    loadInsights();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRange]);

  const loadInsights = async () => {
    try {
      const data = await getDecisionInsights(timeRange);
      setInsights(data);
    } catch (error) {
      console.error('Error loading insights:', error);
    }
  };

  if (!insights) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="container">
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Decision Insights & Analytics</h1>
          <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>
            Cross-sell performance and decision outcomes
          </p>
        </div>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '6px',
            border: '1px solid #d1d5db',
            fontSize: '0.875rem'
          }}
        >
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="quarter">This Quarter</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="metrics-grid">
        <div className="metric-card success">
          <div className="metric-label">Total Offers Sent</div>
          <div className="metric-value">{insights.totalOffers.toLocaleString()}</div>
          <div className="metric-change positive">↑ 23% vs last period</div>
        </div>
        <div className="metric-card success">
          <div className="metric-label">Conversion Rate</div>
          <div className="metric-value">{insights.conversionRate}%</div>
          <div className="metric-change positive">↑ 5.2% vs last period</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Revenue Generated</div>
          <div className="metric-value">₹{(insights.revenue / 10000000).toFixed(2)}Cr</div>
          <div className="metric-change positive">↑ 34% vs last period</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Avg. Offer Value</div>
          <div className="metric-value">₹{insights.avgOfferValue.toLocaleString()}</div>
          <div className="metric-change">Per conversion</div>
        </div>
      </div>

      {/* Cross-Sell Performance by Product */}
      <div className="card">
        <div className="card-header">
          <div>
            <h2 className="card-title">Cross-Sell Performance by Product</h2>
            <p className="card-subtitle">Conversion rates and revenue</p>
          </div>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Offers Sent</th>
                <th>Accepted</th>
                <th>Conversion Rate</th>
                <th>Revenue</th>
                <th>Avg. Value</th>
                <th>ROI</th>
              </tr>
            </thead>
            <tbody>
              {insights.productPerformance.map((product, index) => (
                <tr key={index}>
                  <td style={{ fontWeight: '600' }}>{product.name}</td>
                  <td>{product.sent.toLocaleString()}</td>
                  <td>{product.accepted}</td>
                  <td>
                    <span className={`badge badge-${product.conversionBadge}`}>
                      {product.conversionRate}%
                    </span>
                  </td>
                  <td>₹{product.revenue.toLocaleString()}</td>
                  <td>₹{product.avgValue.toLocaleString()}</td>
                  <td>
                    <span className="badge badge-success">{product.roi}x</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Offer Performance by Channel */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div className="card">
          <div className="card-header">
            <div>
              <h2 className="card-title">Performance by Channel</h2>
              <p className="card-subtitle">Channel effectiveness</p>
            </div>
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Channel</th>
                  <th>Offers</th>
                  <th>Conv. Rate</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Mobile App</td>
                  <td>3,247</td>
                  <td><span className="badge badge-success">32%</span></td>
                </tr>
                <tr>
                  <td>Email</td>
                  <td>2,891</td>
                  <td><span className="badge badge-warning">18%</span></td>
                </tr>
                <tr>
                  <td>Online Banking</td>
                  <td>1,456</td>
                  <td><span className="badge badge-success">27%</span></td>
                </tr>
                <tr>
                  <td>SMS</td>
                  <td>987</td>
                  <td><span className="badge badge-warning">15%</span></td>
                </tr>
                <tr>
                  <td>Branch</td>
                  <td>634</td>
                  <td><span className="badge badge-success">45%</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <h2 className="card-title">Performance by Customer Tier</h2>
              <p className="card-subtitle">Segmentation results</p>
            </div>
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Tier</th>
                  <th>Offers</th>
                  <th>Conv. Rate</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Private Banking</td>
                  <td>412</td>
                  <td><span className="badge badge-success">58%</span></td>
                </tr>
                <tr>
                  <td>Platinum</td>
                  <td>1,247</td>
                  <td><span className="badge badge-success">41%</span></td>
                </tr>
                <tr>
                  <td>Gold</td>
                  <td>3,891</td>
                  <td><span className="badge badge-success">29%</span></td>
                </tr>
                <tr>
                  <td>Silver</td>
                  <td>2,634</td>
                  <td><span className="badge badge-warning">19%</span></td>
                </tr>
                <tr>
                  <td>Basic</td>
                  <td>1,031</td>
                  <td><span className="badge badge-warning">12%</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Recent Successful Offers */}
      <div className="card">
        <div className="card-header">
          <div>
            <h2 className="card-title">Recent Successful Conversions</h2>
            <p className="card-subtitle">Latest accepted offers</p>
          </div>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Time</th>
                <th>Customer</th>
                <th>Product Offered</th>
                <th>Channel</th>
                <th>Value</th>
                <th>Decision Time</th>
              </tr>
            </thead>
            <tbody>
              {insights.recentConversions.map((conversion, index) => (
                <tr key={index}>
                  <td>{conversion.time}</td>
                  <td>
                    {conversion.customerName}
                    <br />
                    <small style={{ color: '#6b7280' }}>{conversion.customerId}</small>
                  </td>
                  <td style={{ fontWeight: '600' }}>{conversion.product}</td>
                  <td>{conversion.channel}</td>
                  <td style={{ fontWeight: '600', color: '#10b981' }}>
                    ₹{conversion.value.toLocaleString()}
                  </td>
                  <td>{conversion.decisionTime}ms</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DecisionInsights;
