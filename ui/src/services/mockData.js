// Mock data for the banking decision automation UI
// In production, this would be replaced with actual API calls

export const mockCustomers = [
  {
    customerId: 'C123456',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+91-22-5550-0101',
    city: 'Mumbai',
    state: 'MH',
    customerSince: '2018-03-12',
    tier: 'Gold',
    tierBadge: 'success',
    annualIncome: 7916000,
    creditScore: 780,
    lifeStage: 'Mid-Career',
    lifetimeValue: 11870000,
    totalAssets: 15000000,
    totalLiabilities: 5000000,
    netWorth: 10000000,
    products: [
      { type: 'Checking Account', balance: 1200000, accountNumber: 'CHK-123456' },
      { type: 'Savings Account', balance: 3500000, accountNumber: 'SAV-123456' },
      { type: 'Credit Card', balance: 280000, accountNumber: 'CC-123456' },
      { type: 'Investment Account', balance: 6000000, accountNumber: 'INV-123456' }
    ]
  },
  {
    customerId: 'C234567',
    firstName: 'Tom',
    lastName: 'Anderson',
    email: 'tom.anderson@email.com',
    phone: '+91-22-5550-0102',
    city: 'Mumbai',
    state: 'MH',
    customerSince: '2019-06-18',
    tier: 'Gold',
    tierBadge: 'success',
    annualIncome: 6498000,
    creditScore: 785,
    lifeStage: 'Mid-Career',
    lifetimeValue: 8199000,
    totalAssets: 12000000,
    totalLiabilities: 4200000,
    netWorth: 7800000,
    products: [
      { type: 'Checking Account', balance: 1520000, accountNumber: 'CHK-234567' },
      { type: 'Credit Card', balance: 280000, accountNumber: 'CC-234567' },
      { type: 'Auto Loan', balance: -1850000, accountNumber: 'LOAN-234567' }
    ]
  },
  {
    customerId: 'C789012',
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@email.com',
    phone: '+91-22-5550-0103',
    city: 'Mumbai',
    state: 'MH',
    customerSince: '2020-01-22',
    tier: 'Silver',
    tierBadge: 'info',
    annualIncome: 5832000,
    creditScore: 720,
    lifeStage: 'Early Career',
    lifetimeValue: 5416000,
    totalAssets: 8500000,
    totalLiabilities: 3200000,
    netWorth: 5300000,
    products: [
      { type: 'Checking Account', balance: 850000, accountNumber: 'CHK-789012' },
      { type: 'Savings Account', balance: 2100000, accountNumber: 'SAV-789012' },
      { type: 'Credit Card', balance: 150000, accountNumber: 'CC-789012' }
    ]
  },
  {
    customerId: 'C345678',
    firstName: 'Lisa',
    lastName: 'Williams',
    email: 'lisa.williams@email.com',
    phone: '+91-20-5550-0104',
    city: 'Pune',
    state: 'MH',
    customerSince: '2017-08-15',
    tier: 'Platinum',
    tierBadge: 'primary',
    annualIncome: 12499000,
    creditScore: 820,
    lifeStage: 'Mid-Career',
    lifetimeValue: 18749000,
    totalAssets: 25000000,
    totalLiabilities: 6000000,
    netWorth: 19000000,
    products: [
      { type: 'Checking Account', balance: 2500000, accountNumber: 'CHK-345678' },
      { type: 'Savings Account', balance: 5000000, accountNumber: 'SAV-345678' },
      { type: 'Credit Card', balance: 450000, accountNumber: 'CC-345678' },
      { type: 'Investment Account', balance: 12000000, accountNumber: 'INV-345678' },
      { type: 'Mortgage', balance: -5000000, accountNumber: 'MTG-345678' }
    ]
  },
  {
    customerId: 'C456789',
    firstName: 'Maria',
    lastName: 'Rodriguez',
    email: 'maria.rodriguez@email.com',
    phone: '+91-80-5550-0105',
    city: 'Bangalore',
    state: 'KA',
    customerSince: '2019-11-03',
    tier: 'Gold',
    tierBadge: 'success',
    annualIncome: 7083000,
    creditScore: 765,
    lifeStage: 'Mid-Career',
    lifetimeValue: 9583000,
    totalAssets: 14000000,
    totalLiabilities: 4800000,
    netWorth: 9200000,
    products: [
      { type: 'Checking Account', balance: 1350000, accountNumber: 'CHK-456789' },
      { type: 'Savings Account', balance: 3200000, accountNumber: 'SAV-456789' },
      { type: 'Credit Card', balance: 320000, accountNumber: 'CC-456789' },
      { type: 'Personal Loan', balance: -1200000, accountNumber: 'LOAN-456789' }
    ]
  },
  {
    customerId: 'C567890',
    firstName: 'Emily',
    lastName: 'Chen',
    email: 'emily.chen@email.com',
    phone: '+91-22-5550-0106',
    city: 'Mumbai',
    state: 'MH',
    customerSince: '2021-03-10',
    tier: 'Silver',
    tierBadge: 'info',
    annualIncome: 4999000,
    creditScore: 740,
    lifeStage: 'Early Career',
    lifetimeValue: 4166000,
    totalAssets: 6500000,
    totalLiabilities: 2100000,
    netWorth: 4400000,
    products: [
      { type: 'Checking Account', balance: 720000, accountNumber: 'CHK-567890' },
      { type: 'Savings Account', balance: 1800000, accountNumber: 'SAV-567890' },
      { type: 'Credit Card', balance: 95000, accountNumber: 'CC-567890' }
    ]
  },
  {
    customerId: 'C678901',
    firstName: 'Michael',
    lastName: 'Brown',
    email: 'michael.brown@email.com',
    phone: '+91-20-5550-0107',
    city: 'Pune',
    state: 'MH',
    customerSince: '2018-07-20',
    tier: 'Gold',
    tierBadge: 'success',
    annualIncome: 8332000,
    creditScore: 795,
    lifeStage: 'Mid-Career',
    lifetimeValue: 12499000,
    totalAssets: 16500000,
    totalLiabilities: 5200000,
    netWorth: 11300000,
    products: [
      { type: 'Checking Account', balance: 1650000, accountNumber: 'CHK-678901' },
      { type: 'Savings Account', balance: 4200000, accountNumber: 'SAV-678901' },
      { type: 'Credit Card', balance: 380000, accountNumber: 'CC-678901' },
      { type: 'Investment Account', balance: 7500000, accountNumber: 'INV-678901' }
    ]
  },
  {
    customerId: 'C890123',
    firstName: 'David',
    lastName: 'Martinez',
    email: 'david.martinez@email.com',
    phone: '+91-80-5550-0108',
    city: 'Bangalore',
    state: 'KA',
    customerSince: '2020-09-14',
    tier: 'Silver',
    tierBadge: 'info',
    annualIncome: 5416000,
    creditScore: 710,
    lifeStage: 'Early Career',
    lifetimeValue: 6249000,
    totalAssets: 9200000,
    totalLiabilities: 2800000,
    netWorth: 6400000,
    products: [
      { type: 'Checking Account', balance: 920000, accountNumber: 'CHK-890123' },
      { type: 'Savings Account', balance: 2500000, accountNumber: 'SAV-890123' },
      { type: 'Credit Card', balance: 180000, accountNumber: 'CC-890123' },
      { type: 'Auto Loan', balance: -1500000, accountNumber: 'LOAN-890123' }
    ]
  },
  {
    customerId: 'C901234',
    firstName: 'Jennifer',
    lastName: 'Garcia',
    email: 'jennifer.garcia@email.com',
    phone: '+91-22-5550-0109',
    city: 'Mumbai',
    state: 'MH',
    customerSince: '2019-04-28',
    tier: 'Gold',
    tierBadge: 'success',
    annualIncome: 7499000,
    creditScore: 775,
    lifeStage: 'Mid-Career',
    lifetimeValue: 10416000,
    totalAssets: 13500000,
    totalLiabilities: 4500000,
    netWorth: 9000000,
    products: [
      { type: 'Checking Account', balance: 1350000, accountNumber: 'CHK-901234' },
      { type: 'Savings Account', balance: 3800000, accountNumber: 'SAV-901234' },
      { type: 'Credit Card', balance: 290000, accountNumber: 'CC-901234' },
      { type: 'Investment Account', balance: 5200000, accountNumber: 'INV-901234' }
    ]
  },
  {
    customerId: 'C012345',
    firstName: 'Robert',
    lastName: 'Lee',
    email: 'robert.lee@email.com',
    phone: '+91-80-5550-0110',
    city: 'Bangalore',
    state: 'KA',
    customerSince: '2021-02-05',
    tier: 'Silver',
    tierBadge: 'info',
    annualIncome: 5832000,
    creditScore: 730,
    lifeStage: 'Early Career',
    lifetimeValue: 5833000,
    totalAssets: 8800000,
    totalLiabilities: 3100000,
    netWorth: 5700000,
    products: [
      { type: 'Checking Account', balance: 880000, accountNumber: 'CHK-012345' },
      { type: 'Savings Account', balance: 2200000, accountNumber: 'SAV-012345' },
      { type: 'Credit Card', balance: 165000, accountNumber: 'CC-012345' }
    ]
  }
];

export const mockTransactions = [
  { time: '14:23:45', transactionId: 'TXN-001', customerId: 'C123456', customerName: 'Sarah Johnson', type: 'Deposit', amount: 6250000, location: 'Mumbai, MH', riskScore: 12, status: 'APPROVED', latency: 42 },
  { time: '14:21:33', transactionId: 'TXN-002', customerId: 'C789012', customerName: 'John Smith', type: 'Purchase', amount: 154166, location: 'Mumbai, MH', riskScore: 67, status: 'PENDING', latency: 38 },
  { time: '14:19:22', transactionId: 'TXN-003', customerId: 'C234567', customerName: 'Tom Anderson', type: 'ATM Withdrawal', amount: 16666, location: 'Mumbai, MH', riskScore: 8, status: 'APPROVED', latency: 35 },
  { time: '14:17:11', transactionId: 'TXN-004', customerId: 'C456789', customerName: 'Maria Rodriguez', type: 'Transfer', amount: 416666, location: 'Pune, MH', riskScore: 15, status: 'APPROVED', latency: 41 },
  { time: '14:15:55', transactionId: 'TXN-005', customerId: 'C345678', customerName: 'Lisa Williams', type: 'Purchase', amount: 70833, location: 'Tokyo, Japan', riskScore: 94, status: 'BLOCKED', latency: 28 },
  { time: '14:13:44', transactionId: 'TXN-006', customerId: 'C567890', customerName: 'Emily Chen', type: 'Payment', amount: 37500, location: 'Mumbai, MH', riskScore: 5, status: 'APPROVED', latency: 39 },
  { time: '14:11:28', transactionId: 'TXN-007', customerId: 'C678901', customerName: 'Michael Brown', type: 'Purchase', amount: 270833, location: 'Goa, GA', riskScore: 22, status: 'APPROVED', latency: 44 },
  { time: '14:09:17', transactionId: 'TXN-008', customerId: 'C890123', customerName: 'David Martinez', type: 'ATM Withdrawal', amount: 8333, location: 'Pune, MH', riskScore: 6, status: 'APPROVED', latency: 33 },
  { time: '14:07:05', transactionId: 'TXN-009', customerId: 'C901234', customerName: 'Jennifer Garcia', type: 'Purchase', amount: 7499, location: 'Mumbai, MH', riskScore: 11, status: 'APPROVED', latency: 37 },
  { time: '14:04:52', transactionId: 'TXN-010', customerId: 'C012345', customerName: 'Robert Lee', type: 'Purchase', amount: 208333, location: 'Mumbai, MH', riskScore: 78, status: 'REVIEW', latency: 45 }
];

export const generateMockDashboardMetrics = () => ({
  transactionsToday: 8247000,
  transactionGrowth: 12,
  decisionsMade: 1847000,
  decisionsGrowth: 18,
  fraudBlocked: 37500000000,
  fraudCount: 4782,
  crossSellRevenue: 45800000000,
  revenueGrowth: 28,
  apiResponseTime: 42,
  throughput: 5200,
  uptime: 99.97,
  activeUsers: 847000,
  recentDecisions: [
    { time: '14:23:45', customerId: 'C123456', type: 'Cross-Sell', outcome: 'OFFER_SENT', badgeClass: 'success', confidence: 88, latency: 42 },
    { time: '14:21:33', customerId: 'C789012', type: 'Fraud Detection', outcome: 'REVIEW', badgeClass: 'warning', confidence: 67, latency: 38 },
    { time: '14:19:22', customerId: 'C234567', type: 'Service Routing', outcome: 'ROUTED', badgeClass: 'info', confidence: 95, latency: 35 },
    { time: '14:17:11', customerId: 'C456789', type: 'Credit Decision', outcome: 'APPROVED', badgeClass: 'success', confidence: 82, latency: 41 },
    { time: '14:15:55', customerId: 'C345678', type: 'Fraud Detection', outcome: 'BLOCKED', badgeClass: 'danger', confidence: 94, latency: 28 },
    { time: '14:13:44', customerId: 'C567890', type: 'Cross-Sell', outcome: 'OFFER_SENT', badgeClass: 'success', confidence: 74, latency: 39 },
    { time: '14:11:28', customerId: 'C678901', type: 'Service Routing', outcome: 'ROUTED', badgeClass: 'info', confidence: 89, latency: 44 },
    { time: '14:09:17', customerId: 'C890123', type: 'Fraud Detection', outcome: 'APPROVED', badgeClass: 'success', confidence: 6, latency: 33 },
    { time: '14:07:05', customerId: 'C901234', type: 'Cross-Sell', outcome: 'OFFER_SENT', badgeClass: 'success', confidence: 79, latency: 37 },
    { time: '14:04:52', customerId: 'C012345', type: 'Fraud Detection', outcome: 'REVIEW', badgeClass: 'warning', confidence: 78, latency: 45 }
  ],
  fraudAlerts: [
    { time: '14:15:55', customerName: 'Lisa Williams', customerId: 'C345678', transaction: 'Electronics Purchase', amount: 70833, riskScore: 94, riskBadge: 'danger', status: 'BLOCKED', statusBadge: 'danger' },
    { time: '14:04:52', customerName: 'Robert Lee', customerId: 'C012345', transaction: 'Auto Purchase', amount: 208333, riskScore: 78, riskBadge: 'warning', status: 'UNDER_REVIEW', statusBadge: 'warning' },
    { time: '13:58:22', customerName: 'Amanda Taylor', customerId: 'C112233', transaction: 'Wire Transfer', amount: 833333, riskScore: 85, riskBadge: 'danger', status: 'UNDER_REVIEW', statusBadge: 'warning' }
  ],
  topOffers: [
    { product: 'Index Fund Portfolio', sent: 847, conversions: 237, conversionRate: 28, revenue: 20833000 },
    { product: 'Travel Rewards Card', sent: 1240, conversions: 354, conversionRate: 29, revenue: 9583000 },
    { product: 'Premium Savings', sent: 634, conversions: 152, conversionRate: 24, revenue: 6250000 },
    { product: 'Personal Loan', sent: 892, conversions: 187, conversionRate: 21, revenue: 10416000 },
    { product: 'Mortgage Pre-Approval', sent: 456, conversions: 137, conversionRate: 30, revenue: 83333000 }
  ]
});

export const generateMockCustomerTransactions = (customerId) => [
  { icon: '↓', iconClass: 'deposit', description: 'Mobile Deposit', date: '2025-11-13', accountType: 'Checking', amount: '+₹62,50,000', amountClass: 'positive', status: 'COMPLETED', statusBadge: 'success' },
  { icon: '↑', iconClass: 'withdrawal', description: 'ATM Withdrawal', date: '2025-11-12', accountType: 'Checking', amount: '-₹16,666', amountClass: 'negative', status: 'COMPLETED', statusBadge: 'success' },
  { icon: '🛒', iconClass: 'purchase', description: 'Fresh Market', date: '2025-11-12', accountType: 'Credit Card', amount: '-₹20,479', amountClass: 'negative', status: 'COMPLETED', statusBadge: 'success' },
  { icon: '💳', iconClass: 'purchase', description: 'Amazon Purchase', date: '2025-11-11', accountType: 'Credit Card', amount: '-₹7,499', amountClass: 'negative', status: 'COMPLETED', statusBadge: 'success' },
  { icon: '↔', iconClass: 'purchase', description: 'Transfer to Savings', date: '2025-11-10', accountType: 'Checking', amount: '-₹41,666', amountClass: 'negative', status: 'COMPLETED', statusBadge: 'success' },
  { icon: '↓', iconClass: 'deposit', description: 'Salary Deposit', date: '2025-11-10', accountType: 'Checking', amount: '+₹5,41,666', amountClass: 'positive', status: 'COMPLETED', statusBadge: 'success' },
  { icon: '🛒', iconClass: 'purchase', description: 'Petrol Pump', date: '2025-11-09', accountType: 'Credit Card', amount: '-₹3,791', amountClass: 'negative', status: 'COMPLETED', statusBadge: 'success' },
  { icon: '💳', iconClass: 'purchase', description: 'Restaurant', date: '2025-11-08', accountType: 'Credit Card', amount: '-₹10,416', amountClass: 'negative', status: 'COMPLETED', statusBadge: 'success' },
  { icon: '🛒', iconClass: 'purchase', description: 'Grocery Store', date: '2025-11-07', accountType: 'Debit Card', amount: '-₹8,333', amountClass: 'negative', status: 'COMPLETED', statusBadge: 'success' },
  { icon: '↑', iconClass: 'withdrawal', description: 'ATM Withdrawal', date: '2025-11-06', accountType: 'Checking', amount: '-₹25,000', amountClass: 'negative', status: 'COMPLETED', statusBadge: 'success' }
];

export const generateMockDecisionInsights = (timeRange) => ({
  totalOffers: 9215,
  conversionRate: 28,
  revenue: 45800000000,
  avgOfferValue: 208333,
  productPerformance: [
    { name: 'Index Fund Portfolio', sent: 847, accepted: 237, conversionRate: 28, conversionBadge: 'success', revenue: 20833000, avgValue: 208333, roi: 5.6 },
    { name: 'Travel Rewards Card', sent: 1240, accepted: 354, conversionRate: 29, conversionBadge: 'success', revenue: 9583000, avgValue: 95833, roi: 4.8 },
    { name: 'Mortgage Pre-Approval', sent: 456, accepted: 137, conversionRate: 30, conversionBadge: 'success', revenue: 83333000, avgValue: 833333, roi: 12.4 },
    { name: 'Premium Savings', sent: 634, accepted: 152, conversionRate: 24, conversionBadge: 'success', revenue: 6250000, avgValue: 62500, roi: 3.2 },
    { name: 'Personal Loan', sent: 892, accepted: 187, conversionRate: 21, conversionBadge: 'warning', revenue: 10416000, avgValue: 104166, roi: 6.7 },
    { name: 'Auto Loan', sent: 745, accepted: 149, conversionRate: 20, conversionBadge: 'warning', revenue: 14166000, avgValue: 141666, roi: 8.2 },
    { name: 'Business Credit Card', sent: 523, accepted: 94, conversionRate: 18, conversionBadge: 'warning', revenue: 8333000, avgValue: 83333, roi: 4.1 },
    { name: 'Home Equity Line', sent: 389, accepted: 62, conversionRate: 16, conversionBadge: 'warning', revenue: 20833000, avgValue: 208333, roi: 9.8 }
  ],
  recentConversions: [
    { time: '14:23:45', customerName: 'Sarah Johnson', customerId: 'C123456', product: 'Index Fund Portfolio', channel: 'Mobile App', value: 208333, decisionTime: 42 },
    { time: '14:08:22', customerName: 'Tom Anderson', customerId: 'C234567', product: 'Travel Rewards Card', channel: 'Email', value: 95833, decisionTime: 38 },
    { time: '13:52:15', customerName: 'Maria Rodriguez', customerId: 'C345678', product: 'Mortgage Pre-Approval', channel: 'Branch', value: 833333, decisionTime: 128 },
    { time: '13:41:33', customerName: 'John Smith', customerId: 'C456789', product: 'Premium Savings', channel: 'Online Banking', value: 62500, decisionTime: 45 },
    { time: '13:28:47', customerName: 'Emily Chen', customerId: 'C567890', product: 'Personal Loan', channel: 'Mobile App', value: 104166, decisionTime: 52 },
    { time: '13:15:11', customerName: 'Michael Brown', customerId: 'C678901', product: 'Auto Loan', channel: 'Branch', value: 141666, decisionTime: 156 },
    { time: '13:02:55', customerName: 'Lisa Williams', customerId: 'C789012', product: 'Business Credit Card', channel: 'Online Banking', value: 83333, decisionTime: 48 },
    { time: '12:48:22', customerName: 'David Martinez', customerId: 'C890123', product: 'Index Fund Portfolio', channel: 'Personal Banker', value: 208333, decisionTime: 87 }
  ]
});
