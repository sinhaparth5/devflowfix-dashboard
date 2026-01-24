# Infrastructure Setup for DevFlowFix

This guide sets up Traefik as ingress controller and cert-manager for automatic TLS certificates.

## Architecture

```
Internet → Cloudflare (DNS) → Azure Load Balancer → Traefik (Ingress) → DevFlowFix Pods
                                                          ↓
                                                   cert-manager (TLS)
```

## Prerequisites

- Azure Kubernetes Service (AKS) cluster
- kubectl configured
- Helm 3.x installed

## Installation Steps

### 1. Install cert-manager

```bash
# Add Jetstack Helm repo
helm repo add jetstack https://charts.jetstack.io
helm repo update

# Install cert-manager with CRDs
helm install cert-manager jetstack/cert-manager \
  --namespace cert-manager \
  --create-namespace \
  --version v1.14.4 \
  --set installCRDs=true \
  --set prometheus.enabled=false

# Verify installation
kubectl wait --for=condition=Available deployment --all -n cert-manager --timeout=300s
```

### 2. Install Traefik

```bash
# Add Traefik Helm repo
helm repo add traefik https://traefik.github.io/charts
helm repo update

# Install Traefik with custom values
helm install traefik traefik/traefik \
  --namespace traefik \
  --create-namespace \
  --values traefik-values.yaml

# Verify installation
kubectl get pods -n traefik
kubectl get svc -n traefik
```

### 3. Get Traefik External IP

```bash
# Wait for LoadBalancer IP
kubectl get svc -n traefik traefik -w
```

Note the EXTERNAL-IP for Cloudflare DNS configuration.

### 4. Create ClusterIssuers

```bash
# Apply cert-manager issuers
kubectl apply -f cert-manager-issuer.yaml
```

### 5. Create DevFlowFix Namespace

```bash
kubectl create namespace devflowfix
```

### 6. Apply Traefik Middlewares

```bash
kubectl apply -f traefik-middleware.yaml
```

### 7. Deploy DevFlowFix Application

```bash
# Using Helm chart
helm install devflowfix ../devflowfix-chart \
  --namespace devflowfix

# Apply IngressRoute
kubectl apply -f traefik-ingressroute.yaml
```

### 8. Configure Cloudflare DNS

1. Go to Cloudflare Dashboard → DNS
2. Add A record:
   - Name: `staging`
   - IPv4: `<TRAEFIK_EXTERNAL_IP>`
   - Proxy: Proxied (orange cloud)

3. SSL/TLS Settings:
   - Mode: **Full (strict)**
   - This works because cert-manager provides valid Let's Encrypt certificates

## Verify Setup

```bash
# Check certificate status
kubectl get certificate -n devflowfix

# Check certificate details
kubectl describe certificate devflowfix-staging-cert -n devflowfix

# Check IngressRoute
kubectl get ingressroute -n devflowfix

# Test HTTPS
curl -v https://staging.devflowfix.com
```

## Traefik Dashboard

Access Traefik dashboard at: `https://traefik.staging.devflowfix.com`

To enable dashboard access, add DNS record:
- Name: `traefik.staging`
- IPv4: `<TRAEFIK_EXTERNAL_IP>`

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

### Traefik not routing
```bash
# Check Traefik logs
kubectl logs -n traefik -l app.kubernetes.io/name=traefik

# Check IngressRoute status
kubectl describe ingressroute devflowfix-dashboard -n devflowfix
```

## Useful Commands

```bash
# View all Traefik resources
kubectl get ingressroute,middleware,tlsoption -A

# Force certificate renewal
kubectl delete secret devflowfix-staging-tls -n devflowfix

# Restart Traefik
kubectl rollout restart deployment traefik -n traefik
```
