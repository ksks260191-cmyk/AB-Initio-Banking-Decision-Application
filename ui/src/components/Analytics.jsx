import React from 'react';

const Analytics = () => {
  return (
    <div className="container">
      <h1 style={{ marginBottom: '2rem' }}>Analytics & Reporting</h1>

      {/* Customer Segmentation */}
      <div className="card">
        <div className="card-header">
          <div>
            <h2 className="card-title">Customer Segmentation Overview</h2>
            <p className="card-subtitle">Distribution across tiers</p>
          </div>
        </div>
        <div className="metrics-grid">
          <div>
            <div className="metric-label">Total Customers</div>
            <div className="metric-value" style={{ fontSize: '1.5rem' }}>2.4M</div>
            <div className="metric-change positive">↑ 5.2% YoY</div>
          </div>
          <div>
            <div className="metric-label">Active (30 days)</div>
            <div className="metric-value" style={{ fontSize: '1.5rem' }}>1.8M</div>
            <div className="metric-change">75% of total</div>
          </div>
          <div>
            <div className="metric-label">Avg. Products/Customer</div>
            <div className="metric-value" style={{ fontSize: '1.5rem' }}>3.2</div>
            <div className="metric-change positive">↑ 0.3 vs last quarter</div>
          </div>
          <div>
            <div className="metric-label">Avg. Lifetime Value</div>
            <div className="metric-value" style={{ fontSize: '1.5rem' }}>₹2.1L</div>
            <div className="metric-change positive">↑ 12% YoY</div>
          </div>
        </div>
      </div>

      {/* Tier Distribution */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div className="card">
          <div className="card-header">
            <div>
              <h2 className="card-title">Customer Tier Distribution</h2>
            </div>
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Tier</th>
                  <th>Customers</th>
                  <th>% of Total</th>
                  <th>Avg. LTV</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><span className="badge badge-warning">Private Banking</span></td>
                  <td>24,000</td>
                  <td>1%</td>
                  <td>₹42.5L</td>
                </tr>
                <tr>
                  <td><span className="badge badge-info">Platinum</span></td>
                  <td>120,000</td>
                  <td>5%</td>
                  <td>₹12.8L</td>
                </tr>
                <tr>
                  <td><span className="badge badge-success">Gold</span></td>
                  <td>480,000</td>
                  <td>20%</td>
                  <td>₹4.2L</td>
                </tr>
                <tr>
                  <td><span className="badge badge-secondary">Silver</span></td>
                  <td>960,000</td>
                  <td>40%</td>
                  <td>₹1.8L</td>
                </tr>
                <tr>
                  <td><span className="badge badge-secondary">Basic</span></td>
                  <td>816,000</td>
                  <td>34%</td>
                  <td>₹0.9L</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <h2 className="card-title">Product Penetration</h2>
            </div>
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Customers</th>
                  <th>Penetration</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Checking</td>
                  <td>2.3M</td>
                  <td><span className="badge badge-success">96%</span></td>
                </tr>
                <tr>
                  <td>Savings</td>
                  <td>1.9M</td>
                  <td><span className="badge badge-success">79%</span></td>
                </tr>
                <tr>
                  <td>Credit Card</td>
                  <td>1.4M</td>
                  <td><span className="badge badge-info">58%</span></td>
                </tr>
                <tr>
                  <td>Loans</td>
                  <td>720K</td>
                  <td><span className="badge badge-warning">30%</span></td>
                </tr>
                <tr>
                  <td>Investment</td>
                  <td>480K</td>
                  <td><span className="badge badge-warning">20%</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Channel Performance */}
      <div className="card">
        <div className="card-header">
          <div>
            <h2 className="card-title">Channel Usage & Performance</h2>
            <p className="card-subtitle">Transaction volume by channel</p>
          </div>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Channel</th>
                <th>Transactions</th>
                <th>Volume</th>
                <th>Avg. Transaction</th>
                <th>Growth</th>
                <th>Satisfaction</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ fontWeight: '600' }}>Mobile App</td>
                <td>8.4M</td>
                <td>₹12,450Cr</td>
                <td>₹1,483</td>
                <td><span className="badge badge-success">↑ 34%</span></td>
                <td>4.7/5.0</td>
              </tr>
              <tr>
                <td style={{ fontWeight: '600' }}>Online Banking</td>
                <td>5.2M</td>
                <td>₹18,290Cr</td>
                <td>₹3,517</td>
                <td><span className="badge badge-success">↑ 12%</span></td>
                <td>4.5/5.0</td>
              </tr>
              <tr>
                <td style={{ fontWeight: '600' }}>ATM</td>
                <td>3.8M</td>
                <td>₹3,160Cr</td>
                <td>₹833</td>
                <td><span className="badge badge-warning">↓ 8%</span></td>
                <td>4.2/5.0</td>
              </tr>
              <tr>
                <td style={{ fontWeight: '600' }}>Branch</td>
                <td>1.2M</td>
                <td>₹24,580Cr</td>
                <td>₹20,483</td>
                <td><span className="badge badge-danger">↓ 15%</span></td>
                <td>4.6/5.0</td>
              </tr>
              <tr>
                <td style={{ fontWeight: '600' }}>Call Center</td>
                <td>890K</td>
                <td>₹4,170Cr</td>
                <td>₹4,685</td>
                <td><span className="badge badge-warning">↓ 5%</span></td>
                <td>4.3/5.0</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Revenue Attribution */}
      <div className="card">
        <div className="card-header">
          <div>
            <h2 className="card-title">Revenue Attribution by Decision Type</h2>
            <p className="card-subtitle">Impact of automated decisions on revenue</p>
          </div>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Decision Type</th>
                <th>Decisions Made</th>
                <th>Success Rate</th>
                <th>Revenue Impact</th>
                <th>Cost Savings</th>
                <th>ROI</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ fontWeight: '600' }}>Cross-Sell Offers</td>
                <td>247,000</td>
                <td><span className="badge badge-success">28%</span></td>
                <td>₹458Cr</td>
                <td>₹82Cr</td>
                <td><span className="badge badge-success">560%</span></td>
              </tr>
              <tr>
                <td style={{ fontWeight: '600' }}>Fraud Prevention</td>
                <td>1,240,000</td>
                <td><span className="badge badge-success">94%</span></td>
                <td>₹375Cr</td>
                <td>₹125Cr</td>
                <td><span className="badge badge-success">400%</span></td>
              </tr>
              <tr>
                <td style={{ fontWeight: '600' }}>Credit Decisioning</td>
                <td>89,000</td>
                <td><span className="badge badge-success">87%</span></td>
                <td>₹1,250Cr</td>
                <td>₹45Cr</td>
                <td><span className="badge badge-success">2,780%</span></td>
              </tr>
              <tr>
                <td style={{ fontWeight: '600' }}>Service Routing</td>
                <td>456,000</td>
                <td><span className="badge badge-success">89%</span></td>
                <td>-</td>
                <td>₹156Cr</td>
                <td><span className="badge badge-success">-</span></td>
              </tr>
              <tr>
                <td style={{ fontWeight: '600' }}>Retention Offers</td>
                <td>34,000</td>
                <td><span className="badge badge-warning">45%</span></td>
                <td>₹290Cr</td>
                <td>₹32Cr</td>
                <td><span className="badge badge-success">906%</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* System Performance */}
      <div className="card">
        <div className="card-header">
          <div>
            <h2 className="card-title">Platform Performance Metrics</h2>
            <p className="card-subtitle">Last 30 days</p>
          </div>
        </div>
        <div className="metrics-grid">
          <div>
            <div className="metric-label">Total Transactions</div>
            <div className="metric-value" style={{ fontSize: '1.5rem' }}>1.2B</div>
            <div className="metric-change positive">↑ 18% vs previous period</div>
          </div>
          <div>
            <div className="metric-label">Avg. Latency (P95)</div>
            <div className="metric-value" style={{ fontSize: '1.5rem' }}>47ms</div>
            <div className="metric-change positive">↓ 8ms improvement</div>
          </div>
          <div>
            <div className="metric-label">System Uptime</div>
            <div className="metric-value" style={{ fontSize: '1.5rem' }}>99.97%</div>
            <div className="metric-change positive">Target: 99.95%</div>
          </div>
          <div>
            <div className="metric-label">Error Rate</div>
            <div className="metric-value" style={{ fontSize: '1.5rem' }}>0.02%</div>
            <div className="metric-change positive">↓ 0.01% improvement</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
