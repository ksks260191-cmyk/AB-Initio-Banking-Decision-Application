// API Service Layer
// Handles all API calls to the AB Initio decision engine
// Currently uses mock data - replace with actual API calls in production

import {
  mockCustomers,
  mockTransactions,
  generateMockDashboardMetrics,
  generateMockCustomerTransactions,
  generateMockDecisionInsights
} from './mockData';

// Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';
const USE_MOCK_DATA = process.env.REACT_APP_USE_MOCK !== 'false'; // Default to mock data

// Helper function to simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// API Functions

export const getDashboardMetrics = async () => {
  if (USE_MOCK_DATA) {
    await delay(300);
    return generateMockDashboardMetrics();
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/metrics/dashboard`);
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const getCustomerProfile = async (customerId) => {
  if (USE_MOCK_DATA) {
    await delay(200);
    const customer = mockCustomers.find(c => c.customerId === customerId);
    return customer || mockCustomers[0]; // Default to first customer if not found
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/customers/${customerId}`);
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const getCustomerTransactions = async (customerId) => {
  if (USE_MOCK_DATA) {
    await delay(200);
    return generateMockCustomerTransactions(customerId);
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/customers/${customerId}/transactions`);
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const getTransactionStream = async (filter = 'all') => {
  if (USE_MOCK_DATA) {
    await delay(100);
    let transactions = [...mockTransactions];
    
    // Apply filters
    if (filter === 'approved') {
      transactions = transactions.filter(t => t.status === 'APPROVED');
    } else if (filter === 'blocked') {
      transactions = transactions.filter(t => t.status === 'BLOCKED');
    } else if (filter === 'pending') {
      transactions = transactions.filter(t => t.status === 'PENDING' || t.status === 'REVIEW');
    } else if (filter === 'high-risk') {
      transactions = transactions.filter(t => t.riskScore >= 70);
    }
    
    // Simulate real-time updates by randomizing timestamps
    const now = new Date();
    transactions = transactions.map(t => ({
      ...t,
      time: `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`
    }));
    
    return transactions;
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/transactions/stream?filter=${filter}`);
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const getDecisionInsights = async (timeRange = 'today') => {
  if (USE_MOCK_DATA) {
    await delay(300);
    return generateMockDecisionInsights(timeRange);
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/decisions/insights?range=${timeRange}`);
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const approveDecision = async (decisionId) => {
  if (USE_MOCK_DATA) {
    await delay(200);
    return { success: true, decisionId, status: 'APPROVED' };
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/decisions/${decisionId}/approve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const rejectDecision = async (decisionId, reason) => {
  if (USE_MOCK_DATA) {
    await delay(200);
    return { success: true, decisionId, status: 'REJECTED', reason };
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/decisions/${decisionId}/reject`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reason })
    });
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// WebSocket connection for real-time updates (optional)
export const connectToRealTimeStream = (onMessage) => {
  if (USE_MOCK_DATA) {
    // Simulate real-time updates with mock data
    const interval = setInterval(() => {
      const mockUpdate = {
        type: 'TRANSACTION',
        data: mockTransactions[Math.floor(Math.random() * mockTransactions.length)]
      };
      onMessage(mockUpdate);
    }, 5000);
    
    return () => clearInterval(interval);
  }
  
  const ws = new WebSocket(`${API_BASE_URL.replace('http', 'ws')}/stream`);
  
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    onMessage(data);
  };
  
  ws.onerror = (error) => {
    console.error('WebSocket Error:', error);
  };
  
  return () => ws.close();
};

const api = {
  getDashboardMetrics,
  getCustomerProfile,
  getCustomerTransactions,
  getTransactionStream,
  getDecisionInsights,
  approveDecision,
  rejectDecision,
  connectToRealTimeStream
};

export default api;
