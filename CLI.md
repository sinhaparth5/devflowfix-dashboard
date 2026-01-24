# DevFlowFix CLI Commands Reference

A comprehensive guide to Kubernetes, Helm, and Docker commands used for deploying and managing the DevFlowFix Dashboard.

---

## Table of Contents

- [Docker Commands](#docker-commands)
- [Helm Commands](#helm-commands)
- [Kubernetes Basic Commands](#kubernetes-basic-commands)
- [Namespace Management](#namespace-management)
- [Pod Management](#pod-management)
- [Service Management](#service-management)
- [Deployment Management](#deployment-management)
- [Ingress & Routing](#ingress--routing)
- [Traefik Commands](#traefik-commands)
- [Cert-Manager Commands](#cert-manager-commands)
- [Logs & Debugging](#logs--debugging)
- [Port Forwarding](#port-forwarding)
- [Secrets & ConfigMaps](#secrets--configmaps)
- [Scaling & Autoscaling](#scaling--autoscaling)
- [Rollouts & Updates](#rollouts--updates)
- [Cleanup Commands](#cleanup-commands)

---

## Docker Commands

### Build & Run

```bash
# Build Docker image
docker build -t parthsinha90/devflowfix:v1.0 .

# Run container locally
docker run -p 80:80 parthsinha90/devflowfix:v1.0

# Run with custom port
docker run -p 3000:80 parthsinha90/devflowfix:v1.0

# Run in detached mode
docker run -d -p 80:80 --name devflowfix parthsinha90/devflowfix:v1.0

# Stop container
docker stop devflowfix

# Remove container
docker rm devflowfix
```

### Push to Registry

```bash
# Login to Docker Hub
docker login

# Push image
docker push parthsinha90/devflowfix:v1.0

# Tag image with new version
docker tag parthsinha90/devflowfix:v1.0 parthsinha90/devflowfix:v1.1

# Push new version
docker push parthsinha90/devflowfix:v1.1
```

### Image Management

```bash
# List images
docker images

# Remove image
docker rmi parthsinha90/devflowfix:v1.0

# Prune unused images
docker image prune -a
```

---

## Helm Commands

### Repository Management

```bash
# Add Helm repositories
helm repo add jetstack https://charts.jetstack.io
helm repo add traefik https://traefik.github.io/charts

# Update repositories
helm repo update

# List repositories
helm repo list

# Search for charts
helm search repo traefik
```

### Install & Upgrade

```bash
# Install cert-manager
helm install cert-manager jetstack/cert-manager \
  --namespace cert-manager \
  --create-namespace \
  --set installCRDs=true

# Install Traefik with custom values
helm install traefik traefik/traefik \
  --namespace traefik \
  --create-namespace \
  --values k8s/infra/traefik-values.yaml

# Install DevFlowFix app
helm install devflowfix ./devflowfix-chart \
  --namespace devflowfix \
  --create-namespace

# Upgrade existing release
helm upgrade traefik traefik/traefik \
  --namespace traefik \
  --values k8s/infra/traefik-values.yaml

# Install or upgrade (upsert)
helm upgrade --install devflowfix ./devflowfix-chart \
  --namespace devflowfix \
  --create-namespace
```

### Release Management

```bash
# List all releases
helm list -A

# List releases in namespace
helm list -n devflowfix

# Get release status
helm status devflowfix -n devflowfix

# Get release history
helm history devflowfix -n devflowfix

# Rollback to previous version
helm rollback devflowfix 1 -n devflowfix

# Uninstall release
helm uninstall devflowfix -n devflowfix
```

### Chart Development

```bash
# Lint chart
helm lint ./devflowfix-chart

# Dry run (preview without installing)
helm install devflowfix ./devflowfix-chart \
  --namespace devflowfix \
  --dry-run

# Template (render manifests locally)
helm template devflowfix ./devflowfix-chart \
  --namespace devflowfix

# Package chart
helm package ./devflowfix-chart

# Show chart values
helm show values traefik/traefik
```

---

## Kubernetes Basic Commands

### Cluster Info

```bash
# Get cluster info
kubectl cluster-info

# Get nodes
kubectl get nodes

# Get all resources in cluster
kubectl get all -A

# Get API resources
kubectl api-resources
```

### Context & Config

```bash
# View current context
kubectl config current-context

# List all contexts
kubectl config get-contexts

# Switch context
kubectl config use-context <context-name>

# View kubeconfig
kubectl config view
```

---

## Namespace Management

```bash
# List namespaces
kubectl get namespaces

# Create namespace
kubectl create namespace devflowfix

# Delete namespace (WARNING: deletes all resources)
kubectl delete namespace devflowfix

# Set default namespace
kubectl config set-context --current --namespace=devflowfix
```

---

## Pod Management

```bash
# List pods in namespace
kubectl get pods -n devflowfix

# List pods with more details
kubectl get pods -n devflowfix -o wide

# Watch pods in real-time
kubectl get pods -n devflowfix -w

# Describe pod (detailed info)
kubectl describe pod <pod-name> -n devflowfix

# Get pod logs
kubectl logs <pod-name> -n devflowfix

# Follow logs (tail -f)
kubectl logs <pod-name> -n devflowfix -f

# Get logs from previous container instance
kubectl logs <pod-name> -n devflowfix --previous

# Execute command in pod
kubectl exec -it <pod-name> -n devflowfix -- /bin/sh

# Delete pod
kubectl delete pod <pod-name> -n devflowfix
```

---

## Service Management

```bash
# List services
kubectl get svc -n devflowfix

# List all services across namespaces
kubectl get svc -A

# Describe service
kubectl describe svc devflowfix-dashboard -n devflowfix

# Get service endpoints
kubectl get endpoints -n devflowfix

# Delete service
kubectl delete svc <service-name> -n devflowfix
```

---

## Deployment Management

```bash
# List deployments
kubectl get deployments -n devflowfix

# Describe deployment
kubectl describe deployment devflowfix-dashboard -n devflowfix

# Scale deployment
kubectl scale deployment devflowfix-dashboard --replicas=3 -n devflowfix

# Edit deployment (opens in editor)
kubectl edit deployment devflowfix-dashboard -n devflowfix

# Delete deployment
kubectl delete deployment devflowfix-dashboard -n devflowfix

# Restart deployment (rolling restart)
kubectl rollout restart deployment devflowfix-dashboard -n devflowfix
```

---

## Ingress & Routing

### Standard Ingress

```bash
# List ingresses
kubectl get ingress -n devflowfix

# Describe ingress
kubectl describe ingress devflowfix-dashboard -n devflowfix

# Delete ingress
kubectl delete ingress devflowfix-dashboard -n devflowfix
```

### Traefik CRDs

```bash
# List IngressRoutes
kubectl get ingressroute -A

# Describe IngressRoute
kubectl describe ingressroute devflowfix-dashboard -n devflowfix

# List Middlewares
kubectl get middleware -A

# Describe Middleware
kubectl describe middleware security-headers -n devflowfix

# List TLS Options
kubectl get tlsoption -A
```

---

## Traefik Commands

### Status & Monitoring

```bash
# Get Traefik pods
kubectl get pods -n traefik

# Get Traefik service (shows External IP)
kubectl get svc -n traefik

# Watch for External IP assignment
kubectl get svc -n traefik -w

# Get all Traefik resources
kubectl get all -n traefik

# View Traefik logs
kubectl logs -n traefik -l app.kubernetes.io/name=traefik -f
```

### Dashboard Access

```bash
# Port forward to Traefik dashboard
kubectl port-forward -n traefik deployment/traefik 9000:9000

# Then open: http://localhost:9000/dashboard/
```

### Traefik Resources

```bash
# List all Traefik CRDs
kubectl get ingressroute,middleware,tlsoption,traefikservice -A

# Apply middleware
kubectl apply -f k8s/infra/traefik-middleware.yaml

# Apply IngressRoute
kubectl apply -f k8s/infra/traefik-ingressroute.yaml
```

---

## Cert-Manager Commands

### Status & Monitoring

```bash
# Get cert-manager pods
kubectl get pods -n cert-manager

# Wait for cert-manager to be ready
kubectl wait --for=condition=Available deployment --all -n cert-manager --timeout=300s

# View cert-manager logs
kubectl logs -n cert-manager -l app=cert-manager --tail=50
```

### Certificates

```bash
# List certificates
kubectl get certificate -n devflowfix

# Watch certificate status
kubectl get certificate -n devflowfix -w

# Describe certificate (detailed status)
kubectl describe certificate devflowfix-staging-cert -n devflowfix

# List certificate requests
kubectl get certificaterequest -n devflowfix

# Describe certificate request
kubectl describe certificaterequest -n devflowfix
```

### Challenges (ACME)

```bash
# List challenges
kubectl get challenges -n devflowfix

# Describe challenge (debug issues)
kubectl describe challenge <challenge-name> -n devflowfix

# List orders
kubectl get orders -n devflowfix
```

### Issuers

```bash
# List ClusterIssuers
kubectl get clusterissuer

# Describe ClusterIssuer
kubectl describe clusterissuer letsencrypt-prod

# List Issuers (namespace-scoped)
kubectl get issuer -n devflowfix

# Apply ClusterIssuers
kubectl apply -f k8s/infra/cert-manager-issuer.yaml
```

### Force Certificate Renewal

```bash
# Delete the secret to force renewal
kubectl delete secret devflowfix-staging-tls -n devflowfix

# Delete and recreate certificate
kubectl delete certificate devflowfix-staging-cert -n devflowfix
kubectl apply -f k8s/infra/traefik-ingressroute.yaml
```

---

## Logs & Debugging

### Viewing Logs

```bash
# Pod logs
kubectl logs <pod-name> -n <namespace>

# Follow logs
kubectl logs <pod-name> -n <namespace> -f

# Logs from all pods with label
kubectl logs -n devflowfix -l app.kubernetes.io/name=devflowfix-chart -f

# Last N lines
kubectl logs <pod-name> -n <namespace> --tail=100

# Logs since time
kubectl logs <pod-name> -n <namespace> --since=1h
```

### Debugging

```bash
# Describe resource (shows events)
kubectl describe pod <pod-name> -n <namespace>

# Get events
kubectl get events -n devflowfix

# Get events sorted by time
kubectl get events -n devflowfix --sort-by='.lastTimestamp'

# Debug with ephemeral container
kubectl debug <pod-name> -n <namespace> --image=busybox -it

# Run debug pod
kubectl run debug --rm -it --image=busybox -n devflowfix -- /bin/sh
```

---

## Port Forwarding

```bash
# Forward to pod
kubectl port-forward <pod-name> 8080:80 -n devflowfix

# Forward to service
kubectl port-forward svc/devflowfix-dashboard 8080:80 -n devflowfix

# Forward to deployment
kubectl port-forward deployment/devflowfix-dashboard 8080:80 -n devflowfix

# Forward Traefik dashboard
kubectl port-forward -n traefik deployment/traefik 9000:9000

# Forward with address binding (access from other machines)
kubectl port-forward --address 0.0.0.0 svc/devflowfix-dashboard 8080:80 -n devflowfix
```

---

## Secrets & ConfigMaps

### Secrets

```bash
# List secrets
kubectl get secrets -n devflowfix

# Describe secret
kubectl describe secret devflowfix-staging-tls -n devflowfix

# Get secret value (base64 decoded)
kubectl get secret devflowfix-staging-tls -n devflowfix -o jsonpath='{.data.tls\.crt}' | base64 -d

# Create secret from literal
kubectl create secret generic my-secret \
  --from-literal=username=admin \
  --from-literal=password=secret123 \
  -n devflowfix

# Create secret from file
kubectl create secret generic my-secret \
  --from-file=./credentials.json \
  -n devflowfix

# Delete secret
kubectl delete secret my-secret -n devflowfix
```

### ConfigMaps

```bash
# List configmaps
kubectl get configmap -n devflowfix

# Describe configmap
kubectl describe configmap <name> -n devflowfix

# Create configmap from file
kubectl create configmap my-config --from-file=./config.yaml -n devflowfix

# Create configmap from literal
kubectl create configmap my-config --from-literal=key1=value1 -n devflowfix
```

---

## Scaling & Autoscaling

### Manual Scaling

```bash
# Scale deployment
kubectl scale deployment devflowfix-dashboard --replicas=3 -n devflowfix

# Scale to zero (stop all pods)
kubectl scale deployment devflowfix-dashboard --replicas=0 -n devflowfix
```

### Horizontal Pod Autoscaler (HPA)

```bash
# List HPAs
kubectl get hpa -n devflowfix

# Describe HPA
kubectl describe hpa devflowfix-dashboard -n devflowfix

# Watch HPA status
kubectl get hpa -n devflowfix -w

# Create HPA (imperative)
kubectl autoscale deployment devflowfix-dashboard \
  --min=2 --max=10 --cpu-percent=70 \
  -n devflowfix
```

### Pod Disruption Budget (PDB)

```bash
# List PDBs
kubectl get pdb -n devflowfix

# Describe PDB
kubectl describe pdb devflowfix-dashboard -n devflowfix
```

---

## Rollouts & Updates

### Rollout Status

```bash
# Check rollout status
kubectl rollout status deployment devflowfix-dashboard -n devflowfix

# View rollout history
kubectl rollout history deployment devflowfix-dashboard -n devflowfix

# View specific revision
kubectl rollout history deployment devflowfix-dashboard --revision=2 -n devflowfix
```

### Rollback

```bash
# Rollback to previous version
kubectl rollout undo deployment devflowfix-dashboard -n devflowfix

# Rollback to specific revision
kubectl rollout undo deployment devflowfix-dashboard --to-revision=2 -n devflowfix
```

### Update Image

```bash
# Update container image
kubectl set image deployment/devflowfix-dashboard \
  devflowfix-chart=parthsinha90/devflowfix:v1.1 \
  -n devflowfix

# Restart deployment (rolling restart)
kubectl rollout restart deployment devflowfix-dashboard -n devflowfix
```

---

## Cleanup Commands

### Delete Resources

```bash
# Delete by file
kubectl delete -f k8s/deployment.yaml

# Delete by label
kubectl delete pods -l app=devflowfix -n devflowfix

# Delete all pods in namespace
kubectl delete pods --all -n devflowfix

# Delete namespace (deletes everything in it)
kubectl delete namespace devflowfix
```

### Helm Cleanup

```bash
# Uninstall release
helm uninstall devflowfix -n devflowfix

# Uninstall Traefik
helm uninstall traefik -n traefik

# Uninstall cert-manager
helm uninstall cert-manager -n cert-manager
```

### Full Cleanup

```bash
# Delete all DevFlowFix resources
helm uninstall devflowfix -n devflowfix
kubectl delete namespace devflowfix

# Delete Traefik
helm uninstall traefik -n traefik
kubectl delete namespace traefik

# Delete cert-manager
helm uninstall cert-manager -n cert-manager
kubectl delete namespace cert-manager

# Delete cert-manager CRDs
kubectl delete -f https://github.com/cert-manager/cert-manager/releases/download/v1.14.4/cert-manager.crds.yaml
```

---

## Quick Reference

### Most Used Commands

```bash
# Check everything
kubectl get all -n devflowfix

# Watch pods
kubectl get pods -n devflowfix -w

# View logs
kubectl logs -n devflowfix -l app.kubernetes.io/name=devflowfix-chart -f

# Restart app
kubectl rollout restart deployment devflowfix-dashboard -n devflowfix

# Check Traefik External IP
kubectl get svc -n traefik

# Check certificate status
kubectl get certificate -n devflowfix

# Access Traefik dashboard
kubectl port-forward -n traefik deployment/traefik 9000:9000

# Deploy/Update app
helm upgrade --install devflowfix ./devflowfix-chart -n devflowfix
```

### Troubleshooting Checklist

1. **Pod not starting?**
   ```bash
   kubectl describe pod <pod-name> -n <namespace>
   kubectl logs <pod-name> -n <namespace>
   ```

2. **Service not accessible?**
   ```bash
   kubectl get svc -n <namespace>
   kubectl get endpoints -n <namespace>
   ```

3. **Certificate not issued?**
   ```bash
   kubectl get certificate -n devflowfix
   kubectl get challenges -n devflowfix
   kubectl logs -n cert-manager -l app=cert-manager
   ```

4. **Ingress not working?**
   ```bash
   kubectl get ingress -n devflowfix
   kubectl get ingressroute -n devflowfix
   kubectl logs -n traefik -l app.kubernetes.io/name=traefik
   ```

---

## Environment Details

- **Kubernetes**: Azure Kubernetes Service (AKS)
- **Ingress Controller**: Traefik
- **Certificate Manager**: cert-manager with Let's Encrypt
- **DNS/CDN**: Cloudflare
- **Container Registry**: Docker Hub

---

*Last updated: January 2026*
