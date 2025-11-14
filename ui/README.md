# AB Initio Banking Decision Automation - Web UI

## Overview
This is a React-based web dashboard that visualizes the real-time decision automation platform built with AB Initio. It provides insights into customer profiles, transaction monitoring, fraud detection, and cross-sell recommendations.

## Features

### 1. **Dashboard Overview**
- Real-time transaction metrics
- Decision automation statistics
- System health indicators
- Performance KPIs

### 2. **Customer 360° View**
- Complete customer profile across all business units
- Transaction history and patterns
- Product holdings and relationships
- Risk assessment and credit scores

### 3. **Real-Time Transaction Monitor**
- Live transaction stream
- Fraud detection alerts
- Decision outcomes (approve/block/review)
- Geographic visualization

### 4. **Decision Insights**
- Cross-sell offer recommendations
- Decision history and outcomes
- Conversion rates and revenue impact
- A/B testing results

### 5. **Analytics & Reporting**
- Customer segmentation
- Product performance
- Channel analytics
- Revenue attribution

## Getting Started

### Prerequisites
- Node.js 16+ and npm 8+
- Access to AB Initio decision engine APIs (or use mock data)

### Installation

```bash
# Navigate to UI directory
cd ui

# Install dependencies
npm install

# Start development server
npm start
```

The application will open at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build/` directory.

## Project Structure

```
ui/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── Dashboard.jsx
│   │   ├── CustomerProfile.jsx
│   │   ├── TransactionMonitor.jsx
│   │   ├── DecisionInsights.jsx
│   │   └── Analytics.jsx
│   ├── services/
│   │   ├── api.js
│   │   └── mockData.js
│   ├── styles/
│   │   └── App.css
│   ├── App.jsx
│   └── index.js
├── package.json
└── README.md
```

## API Integration

### Mock Mode (Default)
The UI runs with mock data by default for demonstration purposes.

### Production Mode
To connect to actual AB Initio APIs, update `src/services/api.js`:

```javascript
const API_BASE_URL = 'http://your-api-gateway:8080';
```

### API Endpoints Expected

- `GET /api/customers/:id` - Get customer 360° profile
- `GET /api/transactions/stream` - Real-time transaction feed (SSE/WebSocket)
- `GET /api/decisions/recent` - Recent decision history
- `GET /api/offers/:customerId` - Get cross-sell offers
- `GET /api/metrics/dashboard` - Dashboard metrics
- `POST /api/decisions/approve` - Approve pending decisions

## Configuration

Edit `src/services/api.js` to configure:
- API endpoints
- Authentication tokens
- WebSocket URLs
- Refresh intervals

## Technologies Used

- **React 18** - UI framework
- **React Router** - Navigation
- **Recharts** - Data visualization
- **Axios** - HTTP client
- **Lucide React** - Icons
- **date-fns** - Date formatting

## Development

### Available Scripts

- `npm start` - Run development server (port 3000)
- `npm build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

### Mock Data

Mock data is generated in `src/services/mockData.js` to simulate:
- Customer profiles from sample CSV data
- Real-time transaction events
- Fraud detection alerts
- Cross-sell offers
- Decision outcomes

## Deployment

### Docker Deployment

```bash
# Build Docker image
docker build -t ab-initio-ui:latest .

# Run container
docker run -p 3000:3000 ab-initio-ui:latest
```

### Azure/AWS Deployment

The production build can be deployed to:
- Azure Static Web Apps
- AWS S3 + CloudFront
- Azure App Service
- Any static hosting service

## Security Considerations

- Implement authentication (OAuth 2.0/JWT)
- Use HTTPS in production
- Sanitize all user inputs
- Implement RBAC for sensitive features
- Store API keys in environment variables

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

Internal use only - Proprietary
