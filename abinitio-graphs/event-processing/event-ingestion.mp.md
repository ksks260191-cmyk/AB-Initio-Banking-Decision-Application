# AB Initio Graph Specification: Real-Time Event Ingestion
# Graph Name: event-ingestion.mp
# Purpose: Ingest and process high-velocity transaction events in real-time

## Graph Overview
This continuous flow graph ingests events from multiple channels, validates, enriches, and routes them to appropriate decision engines with sub-100ms latency.

## Input Sources (Real-Time)
1. **Mobile App Events** (Kafka Topic: mobile-banking-events)
2. **Online Banking Events** (Kafka Topic: online-banking-events)
3. **ATM Network Events** (MQ: atm-transaction-queue)
4. **POS Transactions** (Kafka Topic: pos-transactions)
5. **Call Center Events** (REST API → Kafka: call-center-events)
6. **Core Banking Events** (MQ: core-banking-events)

## Graph Type
**Continuous Flow** - Always running, processing events as they arrive

## Graph Components

### Phase 1: Event Ingestion (Parallel Inputs)
```
Component: Continuous Input (×6)
Type: Kafka Consumer / MQ Listener
Configuration:
- Consumer Groups: event-processor-group
- Parallelism: 10 partitions per topic
- Batch Size: 100 events (or 10ms timeout)
- Offset Management: Automatic commit on successful processing
- Error Handling: Dead Letter Queue for failed events
```

### Phase 2: Event Validation
```
Component: Filter/Reformat
Operations:
1. Schema Validation
   - Validate against transaction-event.xsd
   - Check required fields present
   - Verify data types match expected format
   
2. Duplicate Detection
   - Check event_id against recent cache (Redis, 5-minute window)
   - If duplicate: increment counter, discard
   - If unique: proceed
   
3. Data Quality Checks
   - Amount must be numeric and > 0 (for financial transactions)
   - Timestamp must be within last 5 minutes (reject stale events)
   - Customer ID format validation (alphanumeric, length check)
   - Account number validation (checksum if applicable)
   
Output Streams:
- valid_events → Continue processing
- invalid_events → Error handling stream
```

### Phase 3: Event Classification & Routing
```
Component: Partition by Expression
Classification Logic:
IF event_type IN ('PURCHASE', 'ATM_WITHDRAWAL') AND amount > $1000 THEN
    → high_value_transactions (Priority: HIGH)
ELSE IF event_type IN ('LOGIN', 'LOGOUT', 'BALANCE_INQUIRY') THEN
    → low_priority_events (Priority: LOW)
ELSE IF event_type = 'CUSTOMER_SERVICE_CALL' THEN
    → service_events (Priority: NORMAL)
ELSE IF event_type IN ('DEPOSIT', 'TRANSFER') AND amount > $10000 THEN
    → opportunity_events (Priority: HIGH)
ELSE
    → standard_events (Priority: NORMAL)
```

### Phase 4: Initial Enrichment
```
Component: Lookup/Reformat
Fast Lookups (< 5ms):
1. Customer Profile (Redis Cache)
   - Key: customer_id
   - Fields: tier, risk_score, life_stage, preferred_channel
   - Cache TTL: 300 seconds
   
2. Account Snapshot (Redis Cache)
   - Key: account_number
   - Fields: balance, status, last_transaction_date
   - Cache TTL: 60 seconds
   
3. Device Registration (Redis Cache)
   - Key: device_id
   - Fields: registered, trusted, last_seen
   - Cache TTL: 600 seconds

Enrichment Fields Added:
- customer_tier
- customer_lifetime_value
- account_current_balance
- device_trust_status
- enrichment_timestamp
```

### Phase 5: Real-Time Aggregation (Velocity Checks)
```
Component: Continuous Aggregation (Rolling Windows)
Window Definitions:
1. Last 1 Hour Window
   - Group By: customer_id
   - Aggregates: count(transactions), sum(amounts)
   - Update Frequency: Every event
   
2. Last 24 Hours Window
   - Group By: customer_id
   - Aggregates: count(transactions), sum(amounts), unique(merchant_categories)
   - Update Frequency: Every event
   
3. Last 7 Days Pattern
   - Group By: customer_id, hour_of_day
   - Aggregates: avg(transaction_count), avg(transaction_amount)
   - Purpose: Baseline behavior pattern

Outputs Added to Event:
- transactions_last_1h
- amount_last_1h
- transactions_last_24h
- amount_last_24h
- typical_transactions_this_hour (from 7-day pattern)
```

### Phase 6: Geographic Enrichment
```
Component: Lookup/Reformat
IP/Location Lookup:
- Service: MaxMind GeoIP2 (in-memory database)
- Input: IP address or GPS coordinates
- Output: city, state, country, lat/long
- Latency: < 2ms

Distance Calculation:
- Compare transaction location to customer home address
- Calculate distance in miles
- Flag if distance > 100 miles from last transaction in < 2 hours
```

### Phase 7: Risk Scoring (Pre-Decision)
```
Component: Reformat (Complex Logic)
Quick Risk Assessment:
1. Velocity Score
   IF transactions_last_1h > typical_hourly_transactions * 3 THEN
       velocity_risk = 0.8
   ELSE IF transactions_last_1h > typical_hourly_transactions * 2 THEN
       velocity_risk = 0.5
   ELSE
       velocity_risk = 0.1
   
2. Geographic Anomaly Score
   IF distance_from_home > 500 miles AND time_since_last < 2 hours THEN
       geo_risk = 0.9
   ELSE IF distance_from_home > 100 miles THEN
       geo_risk = 0.4
   ELSE
       geo_risk = 0.1
   
3. Amount Anomaly Score
   z_score = (amount - customer_avg_amount) / customer_stddev_amount
   IF z_score > 3.0 THEN
       amount_risk = 0.8
   ELSE IF z_score > 2.0 THEN
       amount_risk = 0.5
   ELSE
       amount_risk = 0.2
   
4. Combined Pre-Score
   pre_risk_score = (velocity_risk * 0.3) + (geo_risk * 0.4) + (amount_risk * 0.3)
```

### Phase 8: Event Routing to Decision Engines
```
Component: Partition by Expression (Multiple Outputs)
Routing Logic:
1. Fraud Detection Engine
   IF pre_risk_score > 0.3 OR amount > $5000 OR country != 'USA' THEN
       → fraud_detection_queue
   
2. Cross-Sell Engine
   IF event_type IN ('LARGE_DEPOSIT', 'LOGIN') AND customer_tier IN ('Gold', 'Platinum') THEN
       → cross_sell_queue
   
3. Customer Service Router
   IF event_type = 'CUSTOMER_SERVICE_CALL' THEN
       → service_routing_queue
   
4. Credit Decisioning Engine
   IF event_type = 'LOAN_APPLICATION' OR (event_type = 'PAYMENT' AND on_time = true) THEN
       → credit_decision_queue
   
5. Compliance Monitoring
   IF amount > $10000 OR event_type IN ('WIRE_TRANSFER', 'CASH_DEPOSIT') THEN
       → compliance_queue
   
6. Event Archive (All Events)
   → archive_stream (Kafka → S3)
```

### Phase 9: Output to Decision Engines
```
Component: Continuous Output (×5)
Outputs:
1. fraud_detection_queue (Kafka Topic)
   - Partition Key: customer_id
   - Retention: 7 days
   - Expected Latency: < 50ms from ingestion
   
2. cross_sell_queue (Kafka Topic)
   - Partition Key: customer_id
   - Retention: 1 day
   - Expected Latency: < 100ms from ingestion
   
3. service_routing_queue (Redis Stream)
   - TTL: 5 minutes
   - Expected Latency: < 200ms from ingestion
   
4. credit_decision_queue (Kafka Topic)
   - Partition Key: customer_id
   - Retention: 30 days
   - Expected Latency: < 100ms from ingestion
   
5. compliance_queue (MQ)
   - Priority Queue: HIGH
   - Retention: 90 days
   - Expected Latency: < 100ms from ingestion
```

### Phase 10: Monitoring & Metrics
```
Component: Continuous Aggregation → Metrics Output
Metrics Collected (Real-Time):
- Events per second (by source, by type)
- Average processing latency (end-to-end)
- Validation failure rate
- Duplicate event rate
- Pre-risk score distribution
- Routing distribution (events per queue)

Output:
- Prometheus metrics (scrape endpoint)
- Grafana dashboard updates
- CloudWatch custom metrics
- Alert triggers (PagerDuty integration)
```

## Performance Configuration

### Parallelism
```
Continuous Flow Configuration:
- Input Threads: 60 (10 per source)
- Processing Threads: 40
- Output Threads: 20
- Total Parallelism: 120 concurrent streams
```

### Resource Allocation
```
Per Thread:
- Memory: 256 MB
- CPU: 0.25 core
Total Resources:
- Memory: ~30 GB
- CPU: 30 cores
- Network: 10 Gbps
```

### State Management
```
Redis Cluster Configuration:
- Nodes: 6 (3 master, 3 replica)
- Memory per Node: 32 GB
- Persistence: RDB snapshots every 5 minutes
- Replication: Async
- Cluster Mode: Enabled (sharding)
```

## Latency Targets
```
Phase 1 (Ingestion): < 5ms
Phase 2 (Validation): < 3ms
Phase 3 (Classification): < 1ms
Phase 4 (Enrichment): < 10ms (cache lookup)
Phase 5 (Aggregation): < 5ms (in-memory)
Phase 6 (Geo Lookup): < 2ms
Phase 7 (Risk Scoring): < 5ms
Phase 8 (Routing): < 1ms
Phase 9 (Output): < 5ms

Total End-to-End: < 50ms (P95)
```

## Error Handling
```
1. Schema Validation Failure
   → Send to dead_letter_queue
   → Alert data engineering team
   → Log to error tracking system
   
2. Cache Miss (Customer/Account)
   → Fallback to database lookup (slower path)
   → Refresh cache for next request
   → Log cache miss rate
   
3. Downstream Queue Full
   → Apply backpressure to upstream
   → Log warning
   → Scale out if sustained
   
4. Duplicate Event
   → Increment counter
   → Discard silently
   → Investigate if rate > 1%
```

## Scaling Strategy
```
Auto-Scaling Triggers:
1. Events/sec > 8000 → Scale out +10 threads
2. Avg latency > 100ms → Scale out +20 threads
3. CPU utilization > 70% → Add compute nodes
4. Memory utilization > 80% → Add memory
5. Queue depth > 10000 → Scale out processing

Scale-In Criteria:
- Events/sec < 2000 for > 30 minutes
- Latency < 25ms sustained
- CPU < 40% sustained
```

## Monitoring & Alerts
```
Critical Alerts (PagerDuty):
- End-to-end latency > 200ms for > 5 minutes
- Error rate > 2% for > 2 minutes
- Any downstream queue blocked
- Duplicate rate > 5%

Warning Alerts (Email):
- Latency > 100ms for > 10 minutes
- Error rate > 1% for > 5 minutes
- Cache miss rate > 20%
- Throughput dropped by > 50%
```

## Graph Parameters
```
${KAFKA_BROKERS} - Kafka broker list
${REDIS_CLUSTER} - Redis cluster endpoints
${GEOIP_DB_PATH} - GeoIP2 database file path
${METRICS_ENDPOINT} - Prometheus push gateway
${DLQ_TOPIC} - Dead letter queue topic name
${LOG_LEVEL} - Logging verbosity (INFO/DEBUG)
```

## Testing
```
Load Testing:
- Sustained: 5000 events/sec for 1 hour
- Peak: 15000 events/sec for 5 minutes
- Spike: 30000 events/sec for 30 seconds

Latency Testing:
- P50 < 30ms
- P95 < 50ms
- P99 < 100ms
- P99.9 < 200ms

Failure Testing:
- Cache failure scenario (fallback to DB)
- Downstream queue unavailable
- Network partition simulation
- Node failure (automatic failover)
```

## Dependencies
```
Required:
- Ab Initio Continuous Flows
- Kafka 3.x cluster
- Redis 7.x cluster
- GeoIP2 database

Optional:
- Prometheus/Grafana
- PagerDuty integration
- CloudWatch
```
