# 🚀 CI/CD Pipeline - Documentación Completa

## 📖 Tabla de Contenidos

1. [Visión General](#visión-general)
2. [Arquitectura del Pipeline](#arquitectura-del-pipeline)
3. [Configuración Inicial](#configuración-inicial)
4. [Workflows](#workflows)
5. [Kubernetes Deployment](#kubernetes-deployment)
6. [Monitoreo y Logging](#monitoreo-y-logging)
7. [Troubleshooting](#troubleshooting)

---

## 🎯 Visión General

El pipeline CI/CD automatiza todo el proceso desde el código hasta la producción:

```
Código → Pruebas → Seguridad → Build → Deploy → Monitoreo
```

### Beneficios

✅ **Automatización**: Reducir errores manuales
✅ **Velocidad**: Deploy frecuentes y seguros
✅ **Calidad**: Validación en cada etapa
✅ **Confiabilidad**: Rollback automático si falla
✅ **Observabilidad**: Logs y métricas completos

---

## 🏗️ Arquitectura del Pipeline

```
┌─────────────────────────────────────────────────┐
│          GitHub Repository (main)               │
└─────────────────┬───────────────────────────────┘
                  │ Push event
                  ↓
┌─────────────────────────────────────────────────┐
│     GitHub Actions Workflow Triggered           │
└─────────────────┬───────────────────────────────┘
                  │
    ┌─────────────┼─────────────┐
    ↓             ↓             ↓
┌────────┐   ┌────────┐   ┌────────┐
│ Lint   │   │ Tests  │   │Security│
└────┬───┘   └───┬────┘   └───┬────┘
     │           │            │
     └───────────┼────────────┘
                 ↓
        ┌────────────────┐
        │ Build Docker   │
        └────────┬───────┘
                 │
        ┌────────▼───────┐
        │ Push to GHCR   │
        └────────┬───────┘
                 │
        ┌────────▼──────────┐
        │ Deploy to K8s     │
        │ (Solo main)       │
        └────────┬──────────┘
                 │
        ┌────────▼──────────┐
        │ Smoke Tests       │
        └────────┬──────────┘
                 │
        ┌────────▼──────────┐
        │ Notifications     │
        └───────────────────┘
```

---

## ⚙️ Configuración Inicial

### 1. Fork o Clone del Repositorio

```bash
# Clone
git clone https://github.com/tu-usuario/devsecops-cicd-k8s.git
cd devsecops-cicd-k8s

# O fork en GitHub y clone tu fork
```

### 2. Preparar GitHub Secrets

Ve a: **Settings → Secrets and variables → Actions**

#### Agregar Secret: `KUBE_CONFIG`

```bash
# 1. Obtener tu kubeconfig
cat ~/.kube/config | base64 -w 0

# 2. Copiar el output
# 3. Crear secret en GitHub
#    Name: KUBE_CONFIG
#    Value: [contenido base64]
```

#### Agregar Secret: `REGISTRY_TOKEN` (Opcional)

Para usar un registro privado (Docker Hub, private GHCR, etc):

```bash
# GitHub Container Registry (GHCR)
# Token con permisos: write:packages

# Docker Hub
# Access token con permisos push
```

### 3. Configurar Contexto de Kubernetes

```bash
# Verificar contexto actual
kubectl config current-context

# Cambiar contexto si es necesario
kubectl config use-context <context-name>

# Verificar acceso
kubectl auth can-i get deployments --all-namespaces
```

### 4. Actualizar Nombres en YAML

Editar los siguientes archivos:

- **`.github/workflows/ci-cd.yml`**: Cambiar `OWNER` en IMAGE_NAME
- **`k8s/deployment.yaml`**: Cambiar imagen a tu registro
- **`k8s/ingress.yaml`**: Cambiar `calculator.example.com` a tu dominio

---

## 🔄 Workflows

### Workflow 1: CI/CD Principal

**Archivo**: `.github/workflows/ci-cd.yml`

**Triggers**:
- Push a `main` o `develop`
- Pull Request a `main` o `develop`

**Etapas**:

1. **Lint & Validate** (1-2 min)
   - Valida estructura
   - Verifica sintaxis

2. **Unit Tests** (2-3 min)
   - Ejecuta `npm test`
   - 6 tests unitarios

3. **Security Scan** (2-3 min)
   - Analiza vulnerabilidades
   - Verifica Dockerfile

4. **Build Docker** (3-5 min)
   - Construye imagen
   - Push a GHCR

5. **Deploy to K8s** (5-10 min, solo `main`)
   - Rolling update
   - Verifica health

6. **Smoke Tests** (2-3 min)
   - Health check
   - Test de endpoints

### Workflow 2: Security

**Archivo**: `.github/workflows/security.yml`

**Triggers**:
- Push a `main` o `develop`
- Pull Request a `main`
- Scheduled (semanal)

**Análisis**:
- TruffleHog (secrets)
- SAST (código)
- Trivy (imagen Docker)

---

## ☸️ Kubernetes Deployment

### Estructura de Archivos

```
k8s/
├── deployment.yaml      # Deployment con 3 replicas
├── service.yaml         # Service ClusterIP
├── resources.yaml       # ConfigMap, HPA, NetworkPolicy, etc.
└── ingress.yaml         # Ingress con SSL
```

### Recursos Incluidos

| Recurso | Propósito |
|---------|-----------|
| **Deployment** | Define pods, containers, health checks |
| **Service** | Expone aplicación internamente |
| **ConfigMap** | Variables de configuración |
| **HPA** | Auto-scaling (2-10 réplicas) |
| **NetworkPolicy** | Restricciones de red |
| **PDB** | Disponibilidad durante disrupciones |
| **Ingress** | Exposición externa con SSL |

### Deploy Manual

```bash
# Aplicar todos los recursos
kubectl apply -f k8s/

# O usar el script
./deploy.sh production latest

# Verificar
kubectl get deployments,services,pods
```

### Verify Deployment

```bash
# Ver estado
kubectl get deployment calculator-deployment

# Ver pods
kubectl get pods -l app=calculator

# Ver eventos
kubectl get events --sort-by='.lastTimestamp'

# Ver logs
kubectl logs deployment/calculator-deployment --follow

# Port forward
kubectl port-forward svc/calculator-service 3000:80
```

---

## 📊 Monitoreo y Logging

### Docker Compose con Stack Completo

```bash
# Iniciar con Prometheus, Grafana, ELK Stack
docker-compose up -d

# URLs
# - App: http://localhost:3000
# - Prometheus: http://localhost:9090
# - Grafana: http://localhost:3001 (admin/admin)
# - Kibana: http://localhost:5601
```

### Prometheus

**Ubicación**: http://localhost:9090

```yaml
# Métricas recolectadas:
- request_count
- request_duration
- error_count
- health_status
```

### Grafana

**Ubicación**: http://localhost:3001

Dashboards preconfigurados:
- Overview
- Performance
- Health Status
- Errors

### ELK Stack (Logs)

**Kibana**: http://localhost:5601

Logs de:
- Aplicación
- Docker
- Kubernetes

---

## 🔍 Comandos Útiles

### GitHub CLI

```bash
# Ver workflows
gh workflow list
gh workflow view ci-cd.yml

# Ver últimas ejecuciones
gh run list --workflow=ci-cd.yml

# Ver logs de un run
gh run view <run-id> --log

# Cancelar ejecución
gh run cancel <run-id>
```

### Kubernetes

```bash
# Deploy
kubectl apply -f k8s/

# Rollout
kubectl rollout status deployment/calculator-deployment
kubectl rollout history deployment/calculator-deployment
kubectl rollout undo deployment/calculator-deployment

# Logs
kubectl logs deployment/calculator-deployment -f
kubectl logs deployment/calculator-deployment --all-containers

# Debugging
kubectl describe deployment calculator-deployment
kubectl exec -it <pod-name> -- /bin/sh
kubectl port-forward svc/calculator-service 3000:80

# Resources
kubectl top node
kubectl top pod
```

### Docker

```bash
# Build
docker build -t calculator:latest .

# Run
docker run -p 3000:3000 calculator:latest

# Compose
docker-compose up -d
docker-compose logs -f
docker-compose down
```

---

## 🛠️ Troubleshooting

### Pipeline falla en "Lint & Validate"

```bash
# Verificar estructura del proyecto
cd app && node validate.js

# Revisar archivos requeridos
ls -la app/{index.js,calculator.js,index.test.js}
ls -la app/public/{index.html,css/style.css,js/app.js}
```

### Unit Tests fallan

```bash
# Ejecutar localmente
cd app
npm install
npm test

# Ver error específico
npm test -- --verbose
```

### Docker build falla

```bash
# Build local
docker build -t calculator:test .

# Check Dockerfile
cat Dockerfile

# Ver logs detallados
docker build --no-cache -t calculator:test .
```

### Kubernetes deploy falla

```bash
# Verificar sintaxis YAML
kubectl apply -f k8s/ --dry-run=client

# Ver eventos
kubectl describe deployment calculator-deployment
kubectl get events

# Ver logs del pod
kubectl logs <pod-name>

# Restart deployment
kubectl rollout restart deployment/calculator-deployment
```

### Smoke tests fallan

```bash
# Verificar health endpoint
curl http://localhost:3000/health

# Verificar API
curl "http://localhost:3000/api/calculate?op=add&a=10&b=5"

# Ver logs
kubectl logs deployment/calculator-deployment
```

---

## 📈 Mejoras Futuras

- [ ] Agregar tests de integración
- [ ] Implementar load testing
- [ ] Agregar análisis de cobertura
- [ ] Configurar Slack notifications
- [ ] Agregar política de approval para main
- [ ] Implementar canary deployments
- [ ] Agregar cache de Docker
- [ ] Configurar backup automático

---

## 📚 Referencias

- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Kubernetes Docs](https://kubernetes.io/docs/)
- [Docker Docs](https://docs.docker.com/)
- [CNCF Best Practices](https://www.cncf.io/)

---

**Versión**: 1.0.0  
**Última actualización**: 2026  
**Estado**: ✅ Producción
