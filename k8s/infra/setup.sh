#!/bin/bash

# DevFlowFix Infrastructure Setup Script
# This script installs cert-manager and Traefik on AKS

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

echo ""
echo "Step 1: Adding Helm repositories..."
echo "--------------------------------------------"
helm repo add jetstack https://charts.jetstack.io || true
helm repo add traefik https://traefik.github.io/charts || true
helm repo update
print_status "Helm repositories updated"

echo ""
echo "Step 2: Installing cert-manager..."
echo "--------------------------------------------"
kubectl create namespace cert-manager --dry-run=client -o yaml | kubectl apply -f -

helm upgrade --install cert-manager jetstack/cert-manager \
  --namespace cert-manager \
  --version v1.14.4 \
  --set installCRDs=true \
  --set prometheus.enabled=false \
  --wait

print_status "cert-manager installed"

# Wait for cert-manager to be ready
echo "Waiting for cert-manager to be ready..."
kubectl wait --for=condition=Available deployment --all -n cert-manager --timeout=300s
print_status "cert-manager is ready"

echo ""
echo "Step 3: Installing Traefik..."
echo "--------------------------------------------"
kubectl create namespace traefik --dry-run=client -o yaml | kubectl apply -f -

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
helm upgrade --install traefik traefik/traefik \
  --namespace traefik \
  --values "${SCRIPT_DIR}/traefik-values.yaml" \
  --wait

print_status "Traefik installed"

echo ""
echo "Step 4: Creating ClusterIssuers..."
echo "--------------------------------------------"
kubectl apply -f "${SCRIPT_DIR}/cert-manager-issuer.yaml"
print_status "ClusterIssuers created"

echo ""
echo "Step 5: Creating DevFlowFix namespace..."
echo "--------------------------------------------"
kubectl create namespace devflowfix --dry-run=client -o yaml | kubectl apply -f -
print_status "devflowfix namespace created"

echo ""
echo "Step 6: Applying Traefik middlewares..."
echo "--------------------------------------------"
kubectl apply -f "${SCRIPT_DIR}/traefik-middleware.yaml"
print_status "Traefik middlewares applied"

echo ""
echo "============================================"
echo "Getting Traefik External IP..."
echo "============================================"
echo ""

# Wait for LoadBalancer IP
echo "Waiting for LoadBalancer IP (this may take a minute)..."
for i in {1..60}; do
    EXTERNAL_IP=$(kubectl get svc traefik -n traefik -o jsonpath='{.status.loadBalancer.ingress[0].ip}' 2>/dev/null)
    if [ -n "$EXTERNAL_IP" ]; then
        break
    fi
    sleep 2
done

if [ -n "$EXTERNAL_IP" ]; then
    print_status "Traefik External IP: ${EXTERNAL_IP}"
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
    echo "  kubectl get svc traefik -n traefik"
fi

echo ""
echo "============================================"
echo "NEXT STEPS"
echo "============================================"
echo ""
echo "1. Configure Cloudflare DNS with the External IP above"
echo ""
echo "2. Deploy DevFlowFix application:"
echo "   helm upgrade --install devflowfix ../devflowfix-chart -n devflowfix"
echo ""
echo "3. Apply IngressRoute (optional, for advanced Traefik features):"
echo "   kubectl apply -f traefik-ingressroute.yaml"
echo ""
echo "4. Check certificate status:"
echo "   kubectl get certificate -n devflowfix"
echo ""
echo "5. Access Traefik dashboard:"
echo "   kubectl port-forward -n traefik svc/traefik 9000:9000"
echo "   Then visit: http://localhost:9000/dashboard/"
echo ""
print_status "Infrastructure setup complete!"
