#!/bin/bash

# DevFlowFix Infrastructure Setup Script
# This script installs cert-manager and kgateway on AKS

set -e

echo "============================================"
echo "DevFlowFix Infrastructure Setup"
echo "============================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[✓]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[!]${NC} $1"
}

print_error() {
    echo -e "${RED}[✗]${NC} $1"
}

# Check if kubectl is available
if ! command -v kubectl &> /dev/null; then
    print_error "kubectl is not installed. Please install kubectl first."
    exit 1
fi

# Check if helm is available
if ! command -v helm &> /dev/null; then
    print_error "helm is not installed. Please install helm first."
    exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo ""
echo "Step 1: Adding Helm repositories..."
echo "--------------------------------------------"
helm repo add jetstack https://charts.jetstack.io || true
helm repo add kgateway https://kgateway.dev/charts || true
helm repo update
print_status "Helm repositories updated"

echo ""
echo "Step 2: Installing Gateway API CRDs..."
echo "--------------------------------------------"
kubectl apply -f https://github.com/kubernetes-sigs/gateway-api/releases/download/v1.2.1/standard-install.yaml
print_status "Gateway API CRDs installed"

echo ""
echo "Step 3: Installing cert-manager..."
echo "--------------------------------------------"
kubectl create namespace cert-manager --dry-run=client -o yaml | kubectl apply -f -

helm upgrade --install cert-manager jetstack/cert-manager \
  --namespace cert-manager \
  --version v1.14.4 \
  --set installCRDs=true \
  --set prometheus.enabled=false \
  --set "extraArgs={--feature-gates=ExperimentalGatewayAPISupport=true}" \
  --wait

print_status "cert-manager installed (with Gateway API support)"

# Wait for cert-manager to be ready
echo "Waiting for cert-manager to be ready..."
kubectl wait --for=condition=Available deployment --all -n cert-manager --timeout=300s
print_status "cert-manager is ready"

echo ""
echo "Step 4: Installing kgateway..."
echo "--------------------------------------------"
kubectl create namespace kgateway-system --dry-run=client -o yaml | kubectl apply -f -

helm upgrade --install kgateway kgateway/kgateway \
  --namespace kgateway-system \
  --values "${SCRIPT_DIR}/kgateway-values.yaml" \
  --wait

print_status "kgateway installed"

echo ""
echo "Step 5: Creating ClusterIssuers..."
echo "--------------------------------------------"
kubectl apply -f "${SCRIPT_DIR}/cert-manager-issuer.yaml"
print_status "ClusterIssuers created"

echo ""
echo "Step 6: Creating DevFlowFix namespace..."
echo "--------------------------------------------"
kubectl create namespace devflowfix --dry-run=client -o yaml | kubectl apply -f -
print_status "devflowfix namespace created"

echo ""
echo "Step 7: Applying kgateway policies and certificates..."
echo "--------------------------------------------"
kubectl apply -f "${SCRIPT_DIR}/kgateway-policies.yaml"
print_status "kgateway policies applied"

echo ""
echo "============================================"
echo "Getting Gateway External IP..."
echo "============================================"
echo ""

# Wait for LoadBalancer IP
echo "Waiting for LoadBalancer IP (this may take a minute)..."
for i in {1..60}; do
    EXTERNAL_IP=$(kubectl get svc -n devflowfix -l gateway.networking.k8s.io/gateway-name=devflowfix-gateway -o jsonpath='{.items[0].status.loadBalancer.ingress[0].ip}' 2>/dev/null)
    if [ -n "$EXTERNAL_IP" ]; then
        break
    fi
    sleep 2
done

if [ -n "$EXTERNAL_IP" ]; then
    print_status "Gateway External IP: ${EXTERNAL_IP}"
    echo ""
    echo "============================================"
    echo "CLOUDFLARE DNS CONFIGURATION"
    echo "============================================"
    echo ""
    echo "Add the following A record in Cloudflare:"
    echo ""
    echo "  Type: A"
    echo "  Name: staging"
    echo "  IPv4: ${EXTERNAL_IP}"
    echo "  Proxy: Proxied (orange cloud)"
    echo ""
    echo "SSL/TLS Settings:"
    echo "  Mode: Full (strict)"
    echo ""
else
    print_warning "Could not get External IP yet. Run this command to check:"
    echo "  kubectl get svc -n devflowfix"
fi

echo ""
echo "============================================"
echo "NEXT STEPS"
echo "============================================"
echo ""
echo "1. Configure Cloudflare DNS with the External IP above"
echo ""
echo "2. Deploy DevFlowFix application:"
echo "   kubectl apply -k ../  (or use Helm chart)"
echo ""
echo "3. Check Gateway status:"
echo "   kubectl get gateway -n devflowfix"
echo ""
echo "4. Check HTTPRoute status:"
echo "   kubectl get httproute -n devflowfix"
echo ""
echo "5. Check certificate status:"
echo "   kubectl get certificate -n devflowfix"
echo ""
print_status "Infrastructure setup complete!"
