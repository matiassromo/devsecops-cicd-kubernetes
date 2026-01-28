# DevSecOps CI/CD Pipeline con Kubernetes y ArgoCD

Proyecto de calculadora web con pipeline CI/CD completo que integra seguridad (SAST/DAST), despliegue continuo con ArgoCD y monitoreo con Prometheus y Grafana.

## Arquitectura del Proyecto

```
devsecops-cicd-k8s/
├── .github/workflows/
│   └── ci-cd.yml              # Pipeline CI/CD (GitHub Actions)
├── app/
│   ├── index.js               # Servidor HTTP (Node.js)
│   ├── calculator.js           # Logica de operaciones matematicas
│   ├── index.test.js           # Tests unitarios (6 tests)
│   ├── package.json            # Dependencias y scripts
│   └── public/                 # Frontend (HTML/CSS/JS)
├── k8s/
│   ├── deployment.yaml         # Deployment de la aplicacion
│   ├── service.yaml            # Service ClusterIP
│   ├── ingress.yaml            # Ingress con TLS
│   ├── resources.yaml          # HPA, NetworkPolicy, ResourceQuota, PDB
│   └── monitoring.yaml         # Prometheus y Grafana
├── argocd/
│   └── application.yaml        # Manifiesto ArgoCD Application
├── Dockerfile                  # Imagen Docker (Node 20 Alpine)
├── docker-compose.yml          # Stack local con monitoreo
├── deploy.sh                   # Script de despliegue automatizado
└── health-check.sh             # Script de verificacion de salud
```

## Aplicacion

Calculadora web construida con Node.js 20 (sin dependencias externas) que expone:

| Endpoint | Descripcion |
|----------|-------------|
| `GET /` | Interfaz web de la calculadora |
| `GET /health` | Health check (`{"ok":true,"status":"healthy"}`) |
| `GET /api/calculate?op=add&a=10&b=5` | API de calculo (add, subtract, multiply, divide) |

## Pipeline CI/CD

El pipeline se ejecuta automaticamente en cada push a la rama `main` mediante GitHub Actions.

### Diagrama del Pipeline

```
push a main
    │
    ▼
┌─────────┐
│  Build  │  Instalar dependencias (npm ci)
└────┬────┘
     │
     ├──────────────────┐
     ▼                  ▼
┌─────────┐      ┌───────────┐
│  Tests  │      │   SAST    │  Semgrep (analisis estatico)
│ (unit)  │      │ (Semgrep) │
└────┬────┘      └─────┬─────┘
     │                 │
     └────────┬────────┘
              ▼
     ┌────────────────┐
     │ Docker Build & │  Construccion y push a ghcr.io
     │     Push       │
     └───────┬────────┘
             ▼
     ┌────────────────┐
     │     DAST       │  OWASP ZAP (analisis dinamico)
     │  (OWASP ZAP)   │
     └───────┬────────┘
             ▼
     ┌────────────────┐
     │    Deploy      │  Actualiza manifiestos K8s
     │   (ArgoCD)     │  ArgoCD sincroniza automaticamente
     └────────────────┘
```

### Etapas del Pipeline

#### 1. Build
- Checkout del codigo fuente
- Setup de Node.js 20
- Instalacion de dependencias con `npm ci`
- Generacion de artefacto del build

#### 2. Tests
- Ejecucion de 6 tests unitarios con el test runner nativo de Node.js
- Cobertura: operaciones aritmeticas, division por cero, casos borde
- Resultados almacenados como artefacto (30 dias de retencion)

#### 3. SAST (Static Application Security Testing)
- **Herramienta:** Semgrep
- Analisis estatico del codigo fuente buscando vulnerabilidades
- Genera reportes en formato JSON y texto plano
- Reportes almacenados como artefactos

#### 4. Docker Build & Push
- Construccion de imagen Docker con Node.js 20 Alpine
- Push a GitHub Container Registry (ghcr.io)
- Tags: SHA del commit + `latest`
- Cache de capas Docker para builds mas rapidos
- Informacion del build almacenada como artefacto

#### 5. DAST (Dynamic Application Security Testing)
- **Herramienta:** OWASP ZAP
- Levanta la aplicacion en un contenedor Docker
- Espera a que el health check responda
- Ejecuta `zap-baseline.py` contra la aplicacion en ejecucion
- Genera reportes HTML y JSON
- Reportes almacenados como artefactos

#### 6. Deploy (ArgoCD)
- Actualiza `k8s/deployment.yaml` con el nuevo tag de imagen
- Hace commit y push automatico al repositorio
- ArgoCD detecta el cambio y sincroniza el cluster

## Seguridad (DevSecOps)

### SAST - Semgrep
Analisis estatico que se ejecuta sobre el codigo fuente en cada build. Detecta:
- Vulnerabilidades de inyeccion (SQL, XSS, Command Injection)
- Malas practicas de seguridad
- Dependencias inseguras
- Patrones de codigo vulnerable

### DAST - OWASP ZAP
Analisis dinamico que se ejecuta contra la aplicacion desplegada. Detecta:
- Cabeceras HTTP inseguras
- Configuraciones de seguridad faltantes
- Vulnerabilidades en endpoints expuestos
- Problemas de CORS y cookies

### Seguridad en Kubernetes
- **NetworkPolicy:** Restringe trafico de red entre pods y namespaces
- **ResourceQuota:** Limita recursos por namespace
- **PodDisruptionBudget:** Garantiza disponibilidad minima
- **ServiceAccount:** Identidad dedicada para la aplicacion

## ArgoCD (GitOps)

ArgoCD implementa el patron GitOps para despliegue continuo:

- **Repositorio como fuente de verdad:** Los manifiestos en `k8s/` definen el estado deseado
- **Sincronizacion automatica:** ArgoCD detecta cambios y despliega sin intervencion manual
- **Self-healing:** Si alguien modifica el cluster manualmente, ArgoCD revierte al estado del repositorio
- **Pruning:** Recursos eliminados del repositorio se eliminan del cluster

### Configuracion

```yaml
syncPolicy:
  automated:
    prune: true      # Elimina recursos huerfanos
    selfHeal: true   # Corrige drift automaticamente
```

## Monitoreo Continuo

### Prometheus
- **Funcion:** Recoleccion de metricas
- **Puerto en Minikube:** NodePort 30090
- **Scrape interval:** 15 segundos
- **Targets:**
  - Prometheus (auto-monitoreo)
  - Calculator app (endpoint /health cada 10s)

### Grafana
- **Funcion:** Visualizacion de metricas y dashboards
- **Puerto en Minikube:** NodePort 30030
- **Credenciales:** admin / admin
- **Datasource:** Prometheus (configuracion manual al ingresar)

### Stack adicional (docker-compose)
Para desarrollo local, el docker-compose incluye ademas:
- **Elasticsearch:** Almacenamiento de logs
- **Kibana:** Visualizacion de logs
- **Filebeat:** Recoleccion de logs

## Kubernetes

### Recursos desplegados

| Recurso | Archivo | Descripcion |
|---------|---------|-------------|
| Deployment | deployment.yaml | 2 replicas de la app |
| Service | service.yaml | ClusterIP con session affinity |
| Ingress | ingress.yaml | NGINX con TLS y rate limiting |
| HPA | resources.yaml | Auto-scaling 2-10 replicas (CPU 70%, Memory 80%) |
| NetworkPolicy | resources.yaml | Reglas de trafico ingress/egress |
| ResourceQuota | resources.yaml | Limites de recursos del namespace |
| PDB | resources.yaml | Minimo 1 pod disponible |
| ConfigMap | resources.yaml | Variables de entorno |
| ServiceAccount | resources.yaml | Identidad de la app |
| Prometheus | monitoring.yaml | Recolector de metricas |
| Grafana | monitoring.yaml | Dashboards de monitoreo |

## Despliegue en Minikube

### Prerequisitos
- Docker Desktop instalado
- Minikube instalado

### Pasos

```bash
# 1. Iniciar Minikube
minikube start

# 2. Instalar ArgoCD
minikube kubectl -- create namespace argocd
minikube kubectl -- apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# 3. Esperar a que ArgoCD este listo
minikube kubectl -- wait --for=condition=ready pod --all -n argocd --timeout=300s

# 4. Obtener contrasena de ArgoCD
minikube kubectl -- -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}"
# Decodificar en PowerShell:
# [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String("TEXTO_BASE64"))

# 5. Aplicar manifiesto de ArgoCD
minikube kubectl -- apply -f argocd/application.yaml

# 6. Exponer ArgoCD UI
minikube kubectl -- port-forward svc/argocd-server -n argocd 9443:443

# 7. Acceder a ArgoCD
# URL: https://localhost:9443
# Usuario: admin
# Contrasena: la obtenida en el paso 4
```

### Acceso a servicios

```bash
# Aplicacion
minikube service calculator-service

# Prometheus
minikube service prometheus-service -n monitoring

# Grafana (admin/admin)
minikube service grafana-service -n monitoring
```

## Tecnologias Utilizadas

| Categoria | Tecnologia |
|-----------|-----------|
| Aplicacion | Node.js 20, JavaScript |
| Contenedores | Docker, Alpine Linux |
| Orquestacion | Kubernetes (Minikube) |
| CI/CD | GitHub Actions |
| GitOps | ArgoCD |
| SAST | Semgrep |
| DAST | OWASP ZAP |
| Monitoreo | Prometheus, Grafana |
| Registro de imagenes | GitHub Container Registry (ghcr.io) |
| Control de versiones | Git, GitHub |
