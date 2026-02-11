# Infrastructure Setup for DevFlowFix

This guide sets up kgateway (Kubernetes Gateway API) as the ingress controller and cert-manager for automatic TLS certificates.

## Architecture

```
Internet → Cloudflare (DNS) → Azure Load Balancer → kgateway (Gateway API) → DevFlowFix Pods
                                                          ↓
                                                   cert-manager (TLS)
```

## Prerequisites

- Azure Kubernetes Service (AKS) cluster
- kubectl configured
- Helm 3.x installed

## Quick Start

Run the automated setup script:

```bash
chmod +x setup.sh
./setup.sh
```

## Manual Installation Steps

### 1. Install Gateway API CRDs

```bash
kubectl apply -f https://github.com/kubernetes-sigs/gateway-api/releases/download/v1.2.1/standard-install.yaml
```

### 2. Install cert-manager

```bash
helm repo add jetstack https://charts.jetstack.io
helm repo update

helm install cert-manager jetstack/cert-manager \
  --namespace cert-manager \
  --create-namespace \
  --version v1.14.4 \
  --set installCRDs=true \
  --set prometheus.enabled=false \
  --set "extraArgs={--feature-gates=ExperimentalGatewayAPISupport=true}"

kubectl wait --for=condition=Available deployment --all -n cert-manager --timeout=300s
```

### 3. Install kgateway

```bash
helm repo add kgateway https://kgateway.dev/charts
helm repo update

helm install kgateway kgateway/kgateway \
  --namespace kgateway-system \
  --create-namespace \
  --values kgateway-values.yaml

kubectl get pods -n kgateway-system
```

### 4. Create ClusterIssuers

```bash
kubectl apply -f cert-manager-issuer.yaml
```

### 5. Create DevFlowFix Namespace

```bash
kubectl create namespace devflowfix
```

### 6. Apply kgateway Policies

```bash
kubectl apply -f kgateway-policies.yaml
```

### 7. Deploy DevFlowFix Application

```bash
# Using Kustomize
kubectl apply -k ../

# Or using Helm chart
helm install devflowfix ../devflowfix-chart --namespace devflowfix
```

### 8. Configure Cloudflare DNS

1. Get the Gateway external IP:
   ```bash
   kubectl get svc -n devflowfix
   ```

2. Go to Cloudflare Dashboard → DNS
3. Add A record:
   - Name: `staging`
   - IPv4: `<GATEWAY_EXTERNAL_IP>`
   - Proxy: Proxied (orange cloud)

4. SSL/TLS Settings:
   - Mode: **Full (strict)**

## Verify Setup

```bash
# Check Gateway status
kubectl get gateway -n devflowfix

# Check HTTPRoute status
kubectl get httproute -n devflowfix

# Check certificate status
kubectl get certificate -n devflowfix
kubectl describe certificate devflowfix-staging-cert -n devflowfix

# Test HTTPS
curl -v https://staging.devflowfix.com
```

## Troubleshooting

### Certificate not issued
```bash
# Check cert-manager logs
kubectl logs -n cert-manager -l app=cert-manager

# Check certificate status
kubectl describe certificate devflowfix-staging-cert -n devflowfix

# Check challenges
kubectl get challenges -n devflowfix
```

### Gateway not routing
```bash
# Check kgateway controller logs
kubectl logs -n kgateway-system -l app.kubernetes.io/name=kgateway

# Check Gateway status conditions
kubectl describe gateway devflowfix-gateway -n devflowfix

# Check HTTPRoute status
kubectl describe httproute devflowfix-dashboard -n devflowfix
```

## Useful Commands

```bash
# View all Gateway API resources
kubectl get gateway,httproute -A

# Force certificate renewal
kubectl delete secret devflowfix-staging-tls -n devflowfix

# Restart kgateway
kubectl rollout restart deployment -n kgateway-system
```
