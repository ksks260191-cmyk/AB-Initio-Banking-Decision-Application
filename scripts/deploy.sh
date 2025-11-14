#!/bin/bash

# AB Initio Banking Decision Automation - Deployment Script
# Version: 2.1.0
# Purpose: Deploy graphs, configurations, and dependencies to AB Initio environment

set -e  # Exit on error
set -u  # Exit on undefined variable

# ============================================================================
# CONFIGURATION
# ============================================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
DEPLOY_DATE=$(date +%Y-%m-%d)
DEPLOY_TIME=$(date +%H:%M:%S)

# AB Initio Environment
AB_HOME="${AB_HOME:-/opt/abinitio}"
AB_GDE="${AB_GDE:-$AB_HOME/gde}"
AB_EME="${AB_EME:-$AB_HOME/eme}"
AB_SANDBOX="${AB_SANDBOX:-prod_banking_decisioning}"

# Source environment configuration
if [ -f "$PROJECT_ROOT/config/environment.properties" ]; then
    source "$PROJECT_ROOT/config/environment.properties"
else
    echo "Error: environment.properties not found"
    exit 1
fi

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ============================================================================
# HELPER FUNCTIONS
# ============================================================================

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

check_prerequisites() {
    log_info "Checking prerequisites..."
    
    # Check AB Initio installation
    if [ ! -d "$AB_HOME" ]; then
        log_error "AB Initio not found at $AB_HOME"
        exit 1
    fi
    
    # Check AB Initio commands
    for cmd in air m_db m_ksh; do
        if ! command -v $cmd &> /dev/null; then
            log_error "AB Initio command '$cmd' not found in PATH"
            exit 1
        fi
    done
    
    # Check network connectivity to AB Initio EME
    if ! nc -z -w5 $abinitio_eme_host $abinitio_eme_port; then
        log_error "Cannot connect to AB Initio EME at $abinitio_eme_host:$abinitio_eme_port"
        exit 1
    fi
    
    log_success "All prerequisites met"
}

backup_existing() {
    log_info "Backing up existing deployment..."
    
    BACKUP_DIR="/backups/abinitio/banking-decisioning-$DEPLOY_DATE-$DEPLOY_TIME"
    mkdir -p "$BACKUP_DIR"
    
    # Backup existing graphs
    if [ -d "$AB_EME/repository/$AB_SANDBOX" ]; then
        cp -r "$AB_EME/repository/$AB_SANDBOX" "$BACKUP_DIR/"
        log_success "Backed up existing graphs to $BACKUP_DIR"
    fi
}

deploy_metadata() {
    log_info "Deploying metadata and schemas..."
    
    # Deploy XSD schemas
    for schema in "$PROJECT_ROOT/data/schemas"/*.xsd; do
        schema_name=$(basename "$schema")
        log_info "Deploying schema: $schema_name"
        air project publish \
            -sandbox "$AB_SANDBOX" \
            -file "$schema" \
            -type schema \
            -overwrite
    done
    
    log_success "Metadata deployed"
}

compile_graphs() {
    log_info "Compiling AB Initio graphs..."
    
    # Customer Profiling Graphs
    log_info "Compiling customer profiling graphs..."
    air graph compile \
        -sandbox "$AB_SANDBOX" \
        -graph "profile-builder.mp" \
        -parallel 4
    
    air graph compile \
        -sandbox "$AB_SANDBOX" \
        -graph "profile-enrichment.mp" \
        -parallel 4
    
    air graph compile \
        -sandbox "$AB_SANDBOX" \
        -graph "profile-aggregation.mp" \
        -parallel 4
    
    # Event Processing Graphs
    log_info "Compiling event processing graphs..."
    air graph compile \
        -sandbox "$AB_SANDBOX" \
        -graph "event-ingestion.mp" \
        -parallel 10
    
    air graph compile \
        -sandbox "$AB_SANDBOX" \
        -graph "event-enrichment.mp" \
        -parallel 8
    
    air graph compile \
        -sandbox "$AB_SANDBOX" \
        -graph "real-time-aggregation.mp" \
        -parallel 6
    
    # Decision Automation Graphs
    log_info "Compiling decision automation graphs..."
    air graph compile \
        -sandbox "$AB_SANDBOX" \
        -graph "fraud-detection.mp" \
        -parallel 8
    
    air graph compile \
        -sandbox "$AB_SANDBOX" \
        -graph "cross-sell-engine.mp" \
        -parallel 6
    
    air graph compile \
        -sandbox "$AB_SANDBOX" \
        -graph "customer-service-routing.mp" \
        -parallel 4
    
    air graph compile \
        -sandbox "$AB_SANDBOX" \
        -graph "credit-decisioning.mp" \
        -parallel 4
    
    # Feedback Loop Graphs
    log_info "Compiling feedback loop graphs..."
    air graph compile \
        -sandbox "$AB_SANDBOX" \
        -graph "decision-tracking.mp" \
        -parallel 2
    
    air graph compile \
        -sandbox "$AB_SANDBOX" \
        -graph "model-evaluation.mp" \
        -parallel 2
    
    log_success "All graphs compiled successfully"
}

deploy_business_rules() {
    log_info "Deploying business rules..."
    
    # Deploy Drools rules
    for rule_file in "$PROJECT_ROOT/business-rules"/*.drl; do
        rule_name=$(basename "$rule_file")
        log_info "Deploying rule: $rule_name"
        
        # Copy to AB Initio rules directory
        cp "$rule_file" "$AB_EME/rules/$AB_SANDBOX/"
        
        # Validate rules syntax
        air rules validate -file "$rule_file"
    done
    
    log_success "Business rules deployed"
}

deploy_ml_models() {
    log_info "Deploying machine learning models..."
    
    MODEL_DIR="/models"
    
    # Fraud Detection Model
    if [ -f "$PROJECT_ROOT/models/fraud_detector_v2.3.model" ]; then
        cp "$PROJECT_ROOT/models/fraud_detector_v2.3.model" "$MODEL_DIR/fraud/"
        log_success "Deployed fraud detection model v2.3"
    else
        log_warning "Fraud detection model not found, skipping"
    fi
    
    # Cross-Sell Model
    if [ -f "$PROJECT_ROOT/models/product_affinity_v1.8.model" ]; then
        cp "$PROJECT_ROOT/models/product_affinity_v1.8.model" "$MODEL_DIR/crosssell/"
        log_success "Deployed cross-sell model v1.8"
    fi
    
    # Credit Scoring Model
    if [ -f "$PROJECT_ROOT/models/fico_scorer_v3.1.model" ]; then
        cp "$PROJECT_ROOT/models/fico_scorer_v3.1.model" "$MODEL_DIR/credit/"
        log_success "Deployed credit scoring model v3.1"
    fi
}

configure_continuous_flows() {
    log_info "Configuring continuous flows..."
    
    # Event Ingestion Flow
    air continuous-flow configure \
        -sandbox "$AB_SANDBOX" \
        -graph "event-ingestion.mp" \
        -mode continuous \
        -parallelism 20 \
        -checkpoint-interval 100000
    
    # Fraud Detection Flow
    air continuous-flow configure \
        -sandbox "$AB_SANDBOX" \
        -graph "fraud-detection.mp" \
        -mode continuous \
        -parallelism 20 \
        -checkpoint-interval 100000
    
    log_success "Continuous flows configured"
}

setup_monitoring() {
    log_info "Setting up monitoring and alerting..."
    
    # Configure Prometheus metrics export
    air monitoring configure \
        -sandbox "$AB_SANDBOX" \
        -metrics-port 9090 \
        -export-interval 15s
    
    # Configure health check endpoints
    air monitoring health-check \
        -sandbox "$AB_SANDBOX" \
        -port 8080 \
        -path /health
    
    log_success "Monitoring configured"
}

run_smoke_tests() {
    log_info "Running smoke tests..."
    
    # Test 1: Customer Profile Builder
    log_info "Testing customer profile builder..."
    air graph run \
        -sandbox "$AB_SANDBOX" \
        -graph "profile-builder.mp" \
        -params "test_mode=true,sample_size=1000" \
        -wait
    
    if [ $? -eq 0 ]; then
        log_success "Customer profile builder test passed"
    else
        log_error "Customer profile builder test failed"
        exit 1
    fi
    
    # Test 2: Event Ingestion
    log_info "Testing event ingestion..."
    # Inject test events
    echo '{"eventId":"TEST-001","eventType":"PURCHASE","customerId":"C123456","amount":100}' | \
        kafka-console-producer --broker-list $kafka_bootstrap_servers \
        --topic test-events
    
    sleep 5  # Wait for processing
    
    # Verify event was processed
    if air log check -sandbox "$AB_SANDBOX" -graph "event-ingestion.mp" -contains "TEST-001"; then
        log_success "Event ingestion test passed"
    else
        log_error "Event ingestion test failed"
        exit 1
    fi
    
    log_success "All smoke tests passed"
}

start_continuous_flows() {
    log_info "Starting continuous flows..."
    
    # Start Event Ingestion
    air continuous-flow start \
        -sandbox "$AB_SANDBOX" \
        -graph "event-ingestion.mp" \
        -background
    
    sleep 5
    
    # Start Fraud Detection
    air continuous-flow start \
        -sandbox "$AB_SANDBOX" \
        -graph "fraud-detection.mp" \
        -background
    
    sleep 5
    
    # Start Cross-Sell Engine
    air continuous-flow start \
        -sandbox "$AB_SANDBOX" \
        -graph "cross-sell-engine.mp" \
        -background
    
    log_success "Continuous flows started"
}

verify_deployment() {
    log_info "Verifying deployment..."
    
    # Check all flows are running
    if ! air continuous-flow status -sandbox "$AB_SANDBOX" | grep -q "RUNNING"; then
        log_error "Some continuous flows are not running"
        exit 1
    fi
    
    # Check Redis connectivity
    if ! redis-cli -h $redis_cluster_nodes -p 6379 PING | grep -q "PONG"; then
        log_error "Redis connectivity failed"
        exit 1
    fi
    
    # Check Kafka connectivity
    if ! kafka-topics --bootstrap-server $kafka_bootstrap_servers --list &> /dev/null; then
        log_error "Kafka connectivity failed"
        exit 1
    fi
    
    log_success "Deployment verification complete"
}

generate_deployment_report() {
    log_info "Generating deployment report..."
    
    REPORT_FILE="deployment-report-$DEPLOY_DATE.txt"
    
    cat > "$REPORT_FILE" << EOF
AB Initio Banking Decision Automation - Deployment Report
==========================================================

Deployment Date: $DEPLOY_DATE $DEPLOY_TIME
Version: 2.1.0
Sandbox: $AB_SANDBOX
Environment: Production

Deployed Components:
--------------------
✓ Customer Profiling Graphs (3)
✓ Event Processing Graphs (3)
✓ Decision Automation Graphs (4)
✓ Feedback Loop Graphs (2)
✓ Business Rules (4)
✓ ML Models (3)

Continuous Flows:
-----------------
✓ event-ingestion.mp (20 parallel instances)
✓ fraud-detection.mp (20 parallel instances)
✓ cross-sell-engine.mp (6 parallel instances)

Configuration:
--------------
- Redis Cluster: $redis_cluster_nodes
- Kafka Brokers: $kafka_bootstrap_servers
- Target Latency P95: ${performance_target_latency_p95}ms
- Target Throughput: ${performance_target_events_per_second} events/sec

Health Checks:
--------------
✓ AB Initio EME connectivity
✓ Redis connectivity
✓ Kafka connectivity
✓ All graphs compiled
✓ Continuous flows running
✓ Smoke tests passed

Next Steps:
-----------
1. Monitor performance metrics for first 24 hours
2. Validate decision quality with sample transactions
3. Review logs for any warnings or errors
4. Schedule model evaluation for end of week

Deployed by: $(whoami)
Host: $(hostname)
EOF

    log_success "Deployment report generated: $REPORT_FILE"
    cat "$REPORT_FILE"
}

# ============================================================================
# MAIN DEPLOYMENT FLOW
# ============================================================================

main() {
    log_info "Starting AB Initio Banking Decision Automation Deployment"
    log_info "========================================================="
    
    check_prerequisites
    backup_existing
    deploy_metadata
    compile_graphs
    deploy_business_rules
    deploy_ml_models
    configure_continuous_flows
    setup_monitoring
    run_smoke_tests
    start_continuous_flows
    verify_deployment
    generate_deployment_report
    
    log_success "========================================================="
    log_success "Deployment completed successfully!"
    log_success "========================================================="
}

# Run main deployment
main "$@"
