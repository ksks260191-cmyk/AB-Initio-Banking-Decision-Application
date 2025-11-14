# AB Initio Graph Specification: Customer Profile Builder
# Graph Name: profile-builder.mp
# Purpose: Build comprehensive 360° customer profiles from multiple business unit sources

## Graph Overview
This graph aggregates customer data from various business units to create a unified customer profile that enables real-time decision-making.

## Input Sources
1. **Checking Account System** (DB/JDBC)
   - Table: CHECKING_ACCOUNTS
   - Fields: account_number, customer_id, balance, open_date, status
   
2. **Savings Account System** (DB/JDBC)
   - Table: SAVINGS_ACCOUNTS
   - Fields: account_number, customer_id, balance, interest_rate, open_date
   
3. **Credit Card Platform** (DB/JDBC)
   - Table: CREDIT_CARDS
   - Fields: card_number, customer_id, credit_limit, balance, apr, payment_history
   
4. **Loan Origination System** (DB/JDBC)
   - Table: LOANS
   - Fields: loan_number, customer_id, loan_type, balance, interest_rate, payment_status
   
5. **Investment Management System** (DB/JDBC)
   - Table: INVESTMENTS
   - Fields: account_number, customer_id, market_value, risk_tolerance, ytd_return
   
6. **CRM System** (DB/JDBC)
   - Table: CUSTOMER_MASTER
   - Fields: customer_id, name, dob, email, phone, address, tier, customer_since

## Graph Components

### Phase 1: Data Ingestion
```
Component: Input Table (×6)
- Read from source systems using JDBC connectors
- Apply incremental load logic (last_modified_date > :checkpoint)
- Validate data quality (null checks, format validation)
- Tag with source_system metadata
```

### Phase 2: Data Cleansing & Standardization
```
Component: Reformat (×6)
Operations:
- Standardize phone numbers (format: XXX-XXX-XXXX)
- Normalize addresses (USPS validation)
- Cleanse names (title case, trim whitespace)
- Validate email addresses (regex pattern)
- Convert dates to ISO format
- Hash sensitive data (SSN, account numbers for joins)
```

### Phase 3: Customer Master Join
```
Component: Join
Type: Inner Join
Primary Key: customer_id (hashed)
Description: Join all business unit data to customer master record

Join Strategy:
CUSTOMER_MASTER (driving table)
  LEFT JOIN CHECKING_ACCOUNTS ON customer_id
  LEFT JOIN SAVINGS_ACCOUNTS ON customer_id
  LEFT JOIN CREDIT_CARDS ON customer_id
  LEFT JOIN LOANS ON customer_id
  LEFT JOIN INVESTMENTS ON customer_id
```

### Phase 4: Profile Aggregation
```
Component: Rollup
Group By: customer_id
Aggregations:
- total_accounts: count(*)
- total_balance: sum(all_balances)
- total_credit_limit: sum(credit_limits)
- total_debt: sum(loan_balances)
- has_checking: boolean
- has_savings: boolean
- has_credit_card: boolean
- has_loan: boolean
- has_investment: boolean
- product_count: count(distinct product_types)
```

### Phase 5: Profile Enrichment
```
Component: Reformat
Calculations:
- lifetime_value = total_deposits + total_interest_earned + total_fees_paid
- credit_utilization = total_cc_balance / total_credit_limit
- net_worth_estimate = total_balance - total_debt
- customer_tenure_days = current_date - customer_since_date
- customer_tenure_years = tenure_days / 365
- account_per_year = total_accounts / customer_tenure_years
- engagement_score = calculate_engagement(login_frequency, transaction_count)
```

### Phase 6: Data Quality Scoring
```
Component: Reformat
Calculations:
- data_quality_score = weighted_average([
    email_valid ? 1.0 : 0.0,
    phone_valid ? 1.0 : 0.0,
    address_valid ? 1.0 : 0.0,
    dob_valid ? 1.0 : 0.0,
    income_available ? 1.0 : 0.0
  ])
- profile_completeness = (fields_populated / total_fields) * 100
```

### Phase 7: Output Generation
```
Component: Output Table
Target: CUSTOMER_PROFILE_360
Format: Partitioned by customer_tier
Partitions: [Basic, Silver, Gold, Platinum, PrivateBanking]
Indexes: customer_id, email, phone
Update Strategy: MERGE (upsert on customer_id)
```

## Performance Configuration

### Parallelism
```
Layout: 4-way parallel
Partitioning: Hash partition on customer_id
Sort Requirements: None (hash join used)
```

### Resource Allocation
```
Max Core: 8
Max Memory: 16 GB per component
Temp Space: 50 GB
```

### Checkpoint/Recovery
```
Checkpoint Frequency: Every 100,000 records
Recovery Mode: Phase-level recovery
Audit Trail: Enabled
```

## Data Lineage
```
Source → Transform → Target
CHECKING_ACCOUNTS → Cleanse → CUSTOMER_PROFILE_360.checking_accounts
SAVINGS_ACCOUNTS → Cleanse → CUSTOMER_PROFILE_360.savings_accounts
CREDIT_CARDS → Cleanse → CUSTOMER_PROFILE_360.credit_cards
LOANS → Cleanse → CUSTOMER_PROFILE_360.loans
INVESTMENTS → Cleanse → CUSTOMER_PROFILE_360.investments
CRM → Cleanse → CUSTOMER_PROFILE_360.personal_info
```

## Error Handling
```
1. Invalid customer_id → Reject file (investigate orphan records)
2. Duplicate customer_id → Use most recent record (by last_modified_date)
3. Missing required fields → Reject record with error code
4. Data type mismatch → Convert or reject based on severity
5. Join failures → Log to unmatched_records table for reconciliation
```

## Monitoring & Alerts
```
Metrics:
- Records processed per second
- Data quality score distribution
- Profile completeness distribution
- Processing time per phase
- Error rate by type

Alerts:
- Error rate > 1% → Page on-call
- Processing time > 60 min → Warning
- Data quality score < 0.8 → Warning
- Profile completeness < 70% → Investigation required
```

## Schedule
```
Execution: Hourly (on the hour)
Duration: ~15 minutes for 25M customers
Dependencies: All source systems available
Success Criteria: Error rate < 0.5%
```

## Testing
```
Unit Tests:
- Validate cleansing rules
- Verify aggregation logic
- Test join conditions

Integration Tests:
- End-to-end with sample data (1000 records)
- Performance test with 1M records
- Failure scenario testing

Validation:
- Row count reconciliation (source vs target)
- Sum checks on financial fields
- Profile completeness > 95% for Gold+ customers
```

## Graph Parameters
```
${SOURCE_DB_CONNECTION} - Source database connection string
${TARGET_DB_CONNECTION} - Target database connection string
${CHECKPOINT_DATE} - Incremental load checkpoint
${BATCH_ID} - Unique batch identifier
${AUDIT_TABLE} - Audit logging table name
```

## Dependencies
```
Required Components:
- Ab Initio Express>It (high-speed processing)
- Ab Initio Enterprise Meta>Environment (metadata management)
- Ab Initio Co>Operating System (parallel execution)

External Systems:
- Source databases (read access)
- Target database (read/write access)
- Audit/logging system
```

## Version History
```
v1.0 - Initial implementation
v1.1 - Added investment account integration
v1.2 - Enhanced data quality scoring
v2.0 - Added real-time update capability
v2.1 - Performance optimization (4-way parallelism)
```

## Notes
- This graph runs in batch mode hourly to refresh the profile store
- For real-time updates, use profile-enrichment.mp graph
- Profile data is cached in Redis for <10ms lookup times
- Historical profiles retained for 24 months for trend analysis
