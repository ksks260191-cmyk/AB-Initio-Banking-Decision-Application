# AB Initio Graph Specification: Fraud Detection Engine
# Graph Name: fraud-detection.mp
# Purpose: Real-time fraud detection and transaction decisioning

## Graph Overview
This continuous flow graph analyzes transactions in real-time using rule-based logic, ML models, and behavioral analytics to detect and prevent fraud with <50ms latency.

## Input Source
**Kafka Topic**: fraud_detection_queue (from event-ingestion.mp)
- Partition Strategy: By customer_id
- Consumer Group: fraud-detection-engine
- Parallelism: 20 partitions

## Graph Type
**Continuous Flow** - Real-time processing with immediate decision output

## Graph Components

### Phase 1: Event Intake & Preparation
```
Component: Continuous Input
Source: Kafka Consumer
Configuration:
- Max Poll Records: 50
- Poll Timeout: 5ms
- Auto Commit: False (commit after decision made)

Initial Processing:
- Parse enriched event from JSON
- Extract key fields for fraud analysis
- Initialize decision context object
```

### Phase 2: Feature Store Lookup
```
Component: Lookup (Redis + DB)
Fast Lookups (< 8ms total):

1. Customer Behavior Profile (Redis - HOT)
   Key: customer_id
   Fields:
   - avg_transaction_amount (30/90 day)
   - stddev_transaction_amount
   - typical_merchant_categories[]
   - typical_transaction_hours[]
   - typical_geographic_locations[]
   - fraud_history_flag
   - last_verified_transaction_time
   Cache TTL: 300 seconds

2. Account Status (Redis - HOT)
   Key: account_number
   Fields:
   - current_balance
   - daily_limit
   - amount_spent_today
   - account_status
   - freeze_flag
   Cache TTL: 60 seconds

3. Historical Fraud Patterns (Redis - WARM)
   Key: customer_id
   Fields:
   - previous_fraud_attempts
   - last_fraud_date
   - fraud_pattern_type
   - resolution_status
   Cache TTL: 3600 seconds

4. Merchant Risk Profile (DB - Cached)
   Key: merchant_id
   Fields:
   - merchant_risk_score
   - fraud_report_count
   - chargeback_rate
   - industry_risk_level
   Cache: In-memory LRU (10K merchants)

5. Device Trustworthiness (Redis - HOT)
   Key: device_fingerprint
   Fields:
   - device_trust_score
   - device_age_days
   - associated_customers[]
   - suspicious_activity_flag
   Cache TTL: 600 seconds
```

### Phase 3: Rule-Based Fraud Detection
```
Component: Reformat with Complex Logic
Rule Engine (Drools-style rules in Ab Initio):

RULE 1: Stolen Card Pattern
IF card_reported_stolen = true OR account_status = 'FROZEN' THEN
    decision = 'BLOCK'
    reason = 'Card reported stolen or account frozen'
    confidence = 1.0
    STOP PROCESSING

RULE 2: Velocity Breach - Transaction Count
IF transactions_last_1h > 10 OR transactions_last_24h > 50 THEN
    velocity_violation = true
    risk_contribution += 0.3
    flags[] += 'HIGH_VELOCITY'

RULE 3: Velocity Breach - Amount
IF amount_last_1h > $5000 OR amount_last_24h > $20000 THEN
    velocity_violation = true
    risk_contribution += 0.25
    flags[] += 'HIGH_AMOUNT_VELOCITY'

RULE 4: Geographic Impossibility
distance_from_last = calculate_distance(current_location, last_transaction_location)
time_difference_minutes = (current_time - last_transaction_time) / 60
max_possible_distance = time_difference_minutes * 10 (miles, assuming flight)

IF distance_from_last > max_possible_distance THEN
    decision = 'BLOCK'
    reason = 'Geographic impossibility detected'
    confidence = 0.95
    STOP PROCESSING

RULE 5: Geographic Anomaly (High Risk Country)
IF transaction_country IN high_risk_countries[] AND customer_country = 'USA' THEN
    IF device_trust_score < 0.5 THEN
        decision = 'BLOCK'
        reason = 'High-risk country with untrusted device'
        confidence = 0.90
        STOP PROCESSING
    ELSE
        risk_contribution += 0.4
        flags[] += 'HIGH_RISK_COUNTRY'

RULE 6: Amount Anomaly (Statistical)
z_score = (transaction_amount - customer_avg_amount) / customer_stddev_amount
IF z_score > 4.0 THEN
    risk_contribution += 0.35
    flags[] += 'EXTREME_AMOUNT_ANOMALY'
ELSE IF z_score > 3.0 THEN
    risk_contribution += 0.25
    flags[] += 'HIGH_AMOUNT_ANOMALY'
ELSE IF z_score > 2.0 THEN
    risk_contribution += 0.15
    flags[] += 'MODERATE_AMOUNT_ANOMALY'

RULE 7: Merchant Category Anomaly
IF merchant_category NOT IN customer_typical_categories[] THEN
    IF merchant_risk_score > 0.7 THEN
        risk_contribution += 0.20
        flags[] += 'UNUSUAL_HIGH_RISK_MERCHANT'
    ELSE
        risk_contribution += 0.10
        flags[] += 'UNUSUAL_MERCHANT_CATEGORY'

RULE 8: Time-of-Day Anomaly
hour_of_day = extract_hour(transaction_time)
IF hour_of_day NOT IN customer_typical_hours[] THEN
    IF hour_of_day BETWEEN 2 AND 5 THEN
        risk_contribution += 0.15
        flags[] += 'UNUSUAL_LATE_NIGHT'
    ELSE
        risk_contribution += 0.05
        flags[] += 'UNUSUAL_TIME'

RULE 9: Device Anomaly
IF device_registered = false THEN
    risk_contribution += 0.25
    flags[] += 'UNREGISTERED_DEVICE'
ELSE IF device_trust_score < 0.3 THEN
    risk_contribution += 0.20
    flags[] += 'LOW_TRUST_DEVICE'

RULE 10: Account Balance Check
IF transaction_amount > account_balance AND account_type = 'DEBIT' THEN
    decision = 'DECLINE'
    reason = 'Insufficient funds'
    confidence = 1.0
    STOP PROCESSING

RULE 11: Daily Limit Breach
IF amount_spent_today + transaction_amount > daily_limit THEN
    decision = 'DECLINE'
    reason = 'Daily transaction limit exceeded'
    confidence = 1.0
    STOP PROCESSING

RULE 12: Merchant High Fraud Rate
IF merchant_fraud_rate > 0.15 AND transaction_amount > $1000 THEN
    risk_contribution += 0.30
    flags[] += 'HIGH_FRAUD_MERCHANT'

RULE 13: Multiple Failed Authentication
IF failed_auth_attempts_last_hour > 3 THEN
    risk_contribution += 0.40
    flags[] += 'MULTIPLE_AUTH_FAILURES'

RULE 14: First Transaction Pattern (Fraud Common)
IF customer_tenure_days < 30 AND transaction_amount > $2000 THEN
    risk_contribution += 0.20
    flags[] += 'NEW_CUSTOMER_HIGH_AMOUNT'

RULE 15: Sequential Transactions (Testing Card)
IF transactions_last_5_minutes > 5 THEN
    risk_contribution += 0.35
    flags[] += 'CARD_TESTING_PATTERN'

Rule-Based Fraud Score:
fraud_score_rules = min(1.0, risk_contribution)
```

### Phase 4: Machine Learning Model Execution
```
Component: Reformat (Model Invocation)
ML Model: Gradient Boosted Decision Trees (XGBoost)
Model Version: fraud_detector_v2.3
Training Data: 500M transactions (90-day window)
Features: 85 features

Feature Vector Construction:
[
    // Transaction Features
    transaction_amount,
    transaction_amount_z_score,
    merchant_category_encoded,
    merchant_risk_score,
    
    // Temporal Features
    hour_of_day,
    day_of_week,
    is_weekend,
    is_holiday,
    time_since_last_transaction_seconds,
    
    // Velocity Features
    transactions_last_1h,
    transactions_last_24h,
    transactions_last_7d,
    amount_last_1h,
    amount_last_24h,
    amount_last_7d,
    unique_merchants_last_24h,
    unique_categories_last_24h,
    
    // Geographic Features
    distance_from_home_miles,
    distance_from_last_transaction_miles,
    transaction_country_risk_score,
    is_domestic_transaction,
    
    // Customer Features
    customer_tenure_days,
    customer_tier_encoded,
    customer_lifetime_value,
    avg_monthly_spend,
    credit_score,
    
    // Account Features
    account_balance_ratio,
    credit_utilization,
    days_since_last_payment,
    payment_history_score,
    
    // Device Features
    device_trust_score,
    device_age_days,
    is_registered_device,
    device_location_match,
    
    // Behavioral Features
    merchant_familiarity_score,
    time_familiarity_score,
    amount_familiarity_score,
    location_familiarity_score,
    
    // Historical Features
    previous_fraud_count,
    days_since_last_fraud,
    chargebacks_last_year,
    declined_transactions_last_month,
    
    ... (35 more engineered features)
]

Model Execution:
model_prediction = xgboost_model.predict(feature_vector)
fraud_probability_ml = model_prediction.probability
model_confidence = model_prediction.confidence

Feature Importance (Top 10):
1. distance_from_last_transaction_miles: 0.18
2. transaction_amount_z_score: 0.15
3. device_trust_score: 0.12
4. merchant_risk_score: 0.10
5. transactions_last_1h: 0.08
6. time_since_last_transaction_seconds: 0.07
7. location_familiarity_score: 0.06
8. amount_familiarity_score: 0.05
9. customer_tenure_days: 0.04
10. merchant_fraud_rate: 0.04
```

### Phase 5: Ensemble Decision Logic
```
Component: Reformat (Decision Algorithm)
Combine Rule-Based and ML Scores:

weighted_fraud_score = (fraud_score_rules * 0.40) + (fraud_probability_ml * 0.60)

Decision Thresholds:
IF weighted_fraud_score >= 0.85 THEN
    decision = 'BLOCK'
    reason = 'High fraud probability detected'
    confidence = weighted_fraud_score
    action = 'IMMEDIATE_BLOCK'
    
ELSE IF weighted_fraud_score >= 0.70 THEN
    decision = 'REVIEW'
    reason = 'Elevated fraud risk - manual review required'
    confidence = weighted_fraud_score
    action = 'HOLD_FOR_REVIEW'
    
ELSE IF weighted_fraud_score >= 0.40 THEN
    decision = 'STEP_UP_AUTH'
    reason = 'Moderate fraud risk - additional verification required'
    confidence = weighted_fraud_score
    action = 'REQUEST_VERIFICATION'
    
ELSE IF weighted_fraud_score >= 0.15 THEN
    decision = 'APPROVE_WITH_MONITORING'
    reason = 'Low risk but flagged for monitoring'
    confidence = 1.0 - weighted_fraud_score
    action = 'APPROVE_AND_MONITOR'
    
ELSE
    decision = 'APPROVE'
    reason = 'Low fraud risk'
    confidence = 1.0 - weighted_fraud_score
    action = 'APPROVE'
```

### Phase 6: Step-Up Authentication (Conditional)
```
Component: Conditional Flow
IF decision = 'STEP_UP_AUTH' THEN
    
    // Send SMS verification
    Component: External API Call
    Service: SMS Gateway
    Message: "BANK ALERT: Did you authorize a ${amount} transaction at ${merchant}? 
              Reply YES to approve or NO to block. Ref: ${transaction_id}"
    
    // Wait for response (with timeout)
    Component: Wait with Timeout
    Timeout: 60 seconds
    
    // Process customer response
    IF customer_response = 'YES' AND response_time < 60 seconds THEN
        decision = 'APPROVE'
        reason = 'Customer verified transaction via SMS'
        confidence = 0.95
        
    ELSE IF customer_response = 'NO' THEN
        decision = 'BLOCK'
        reason = 'Customer declined transaction via SMS'
        confidence = 1.0
        fraud_confirmed = true
        
    ELSE IF timeout THEN
        decision = 'BLOCK'
        reason = 'Customer verification timeout - blocking for safety'
        confidence = 0.80
```

### Phase 7: Action Execution
```
Component: Partition by Decision → Output Actions

IF decision = 'BLOCK' THEN
    Actions:
    1. Send blocking command to transaction processor
    2. Freeze card temporarily (15 minutes)
    3. Send SMS alert to customer
    4. Create fraud case in investigation system
    5. Log to fraud analytics database
    
IF decision = 'APPROVE' THEN
    Actions:
    1. Send approval to transaction processor
    2. Update customer transaction history
    3. Refresh behavior profile (async)
    4. Log successful transaction
    
IF decision = 'REVIEW' THEN
    Actions:
    1. Hold transaction (pending review)
    2. Create case in fraud analyst queue
    3. Send notification to fraud team
    4. Notify customer of delay (if > 2 minutes)
    
IF decision = 'APPROVE_WITH_MONITORING' THEN
    Actions:
    1. Approve transaction
    2. Add to enhanced monitoring list (24 hours)
    3. Increase sensitivity for next transactions
    4. Log to monitoring dashboard
```

### Phase 8: Decision Output & Feedback
```
Component: Continuous Output (Multiple Streams)

1. Transaction Processor (Kafka - HIGH Priority)
   Topic: transaction-decisions
   Message: {
       transaction_id,
       decision,
       authorization_code (if approved),
       decline_reason (if blocked),
       timestamp
   }
   Expected Latency: < 10ms

2. Customer Notification Service (Kafka)
   Topic: customer-notifications
   Message: {
       customer_id,
       notification_type,
       message_template,
       urgency_level
   }
   
3. Fraud Analytics Store (Kafka → S3)
   Topic: fraud-decisions-archive
   Message: Complete decision record with all features
   Purpose: Model retraining and analysis
   
4. Fraud Investigation System (Database)
   Table: FRAUD_CASES
   Condition: Only if decision = 'BLOCK' or 'REVIEW'
   
5. Real-Time Monitoring Dashboard (WebSocket)
   Stream: Live fraud metrics
   Update Frequency: Every second
   Metrics: Fraud rate, block rate, average score
```

### Phase 9: Feedback Loop (Asynchronous)
```
Component: Feedback Capture
Sources:
1. Customer Disputes (chargeback filed)
2. Manual Review Outcomes (analyst decision)
3. False Positive Reports (customer confirmed legitimate)

Feedback Processing:
- Tag original decision record with outcome
- Calculate model accuracy metrics
- Identify mis-classified patterns
- Queue for model retraining (weekly)
- Update merchant risk scores
- Adjust decision thresholds if needed
```

## Performance Metrics

### Latency (End-to-End)
```
P50: 28ms
P95: 45ms
P99: 75ms
P99.9: 150ms
Max Target: 200ms
```

### Throughput
```
Sustained: 5000 decisions/second
Peak: 12000 decisions/second
Per Thread: 250 decisions/second
```

### Accuracy Metrics (Historical)
```
Precision (Fraud Detection): 92%
Recall (Fraud Detection): 88%
F1 Score: 90%
False Positive Rate: 3.2%
False Negative Rate: 2.8%
AUC-ROC: 0.94
```

### Business Impact
```
Fraud Detected: $45M/year
False Positives: $2.8M (opportunity cost)
Processing Cost: $0.003/transaction
ROI: 1600%
```

## Error Handling
```
1. Model Unavailable
   → Fallback to rule-based only
   → Alert ML team
   → Continue processing

2. Feature Store Timeout
   → Use cached/stale data (up to 5 min old)
   → Log warning
   → Degrade gracefully

3. SMS Gateway Down
   → Skip step-up auth
   → Apply stricter thresholds
   → Alert operations

4. Downstream System Unavailable
   → Queue decisions locally (max 10K)
   → Retry with exponential backoff
   → Alert if queue > 1000
```

## Monitoring & Alerts
```
Critical Alerts:
- Fraud detection rate drops > 50%
- False positive rate > 10%
- Latency P95 > 100ms for > 5 min
- Model prediction errors > 5%

Dashboards:
- Real-time fraud metrics
- Decision distribution
- Latency percentiles
- Feature importance trends
- Model performance over time
```

## Model Management
```
Model Updates:
- Frequency: Weekly (automated)
- Training Data: Rolling 90-day window
- Validation: A/B test (10% traffic for 48 hours)
- Rollback: Automatic if accuracy drops > 5%
- Version Control: Git + Model Registry

Champion/Challenger:
- Champion: Current production model
- Challenger: New model candidate
- Traffic Split: 90%/10%
- Evaluation Period: 7 days
- Promotion Criteria: +2% F1 score improvement
```

## Graph Parameters
```
${KAFKA_FRAUD_QUEUE} - Input queue
${REDIS_CLUSTER} - Feature store
${MODEL_PATH} - XGBoost model file
${SMS_GATEWAY_API} - SMS service endpoint
${FRAUD_THRESHOLD_BLOCK} - Block threshold (default: 0.85)
${FRAUD_THRESHOLD_REVIEW} - Review threshold (default: 0.70)
${FRAUD_THRESHOLD_STEPUP} - Step-up threshold (default: 0.40)
```

## Testing
```
Unit Tests:
- Rule logic validation
- Feature engineering correctness
- Decision threshold boundaries

Integration Tests:
- End-to-end with known fraud patterns
- End-to-end with known legitimate transactions
- SMS gateway integration
- Downstream system integration

Performance Tests:
- 10K transactions/sec sustained load
- Model inference latency
- Feature store response times

Adversarial Tests:
- Fraud evasion techniques
- Novel fraud patterns
- Edge cases and boundary conditions
```

This fraud detection engine demonstrates AB Initio's capability to process complex, high-velocity decisioning with multiple data sources, sophisticated logic, and real-time action execution.
