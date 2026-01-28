# 🚀 SETUP CI/CD PIPELINE

## ⚡ Quick Start (5 minutos)

### 1. Push a GitHub

```bash
# Inicializar repositorio
git init
git add .
git commit -m "Initial commit: CI/CD Pipeline"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/TU_REPO.git
git push -u origin main
```

### 2. Agregar GitHub Secrets

#### Secret 1: KUBE_CONFIG

```bash
# 1. Obtener kubeconfig
cat ~/.kube/config | base64 -w 0

# 2. En GitHub:
# Settings → Secrets and variables → Actions → New repository secret
# Name: KUBE_CONFIG
# Value: [Pegue el output anterior]
```

#### Secret 2: REGISTRY_TOKEN (Opcional)

Para registros privados:

```bash
# En GitHub:
# Settings → Secrets and variables → Actions → New repository secret  
# Name: REGISTRY_TOKEN
# Value: [Token de tu registro]
```

### 3. Actualizar Configuración

**Archivo**: `.github/workflows/ci-cd.yml`

Cambiar `OWNER` en esta línea:
```yaml
IMAGE_NAME: ghcr.io/OWNER/calculator
```

**Archivo**: `k8s/deployment.yaml`

Cambiar imagen:
```yaml
image: ghcr.io/OWNER/calculator:latest
```

---

## 🔄 Pipeline Stages

### ✅ Etapa 1: Lint & Validate (Automático)
```
✓ Valida estructura
✓ Revisa sintaxis
✓ Verifica archivos
```

### ✅ Etapa 2: Tests (Automático)
```
✓ 6 unit tests
✓ Coverage completo
✓ Validación de casos límite
```

### ✅ Etapa 3: Security (Automático)
```
✓ Análisis de vulnerabilidades
✓ Escaneo de Dockerfile
✓ Check de dependencias
```

### ✅ Etapa 4: Build (Automático)
```
✓ Construye imagen Docker
✓ Push a GHCR
✓ Caching de capas
```

### ✅ Etapa 5: Deploy (Solo main)
```
✓ Rolling update en K8s
✓ Health checks
✓ Verificación de pods
```

### ✅ Etapa 6: Smoke Tests
```
✓ Health endpoint
✓ API tests
✓ Verificación funcional
```

---

## 📊 Ver Pipeline en Acción

### En GitHub

1. Ve a tu repositorio
2. Click en tab **Actions**
3. Selecciona **CI/CD Pipeline**
4. Click en el último run

### Con GitHub CLI

```bash
# Ver últimos runs
gh run list

# Ver logs detallados
gh run view <RUN_ID> --log

# Cancelar run
gh run cancel <RUN_ID>
```

---

## 🐳 Ejecutar Localmente (Docker Compose)

### Stack Completo

```bash
# Iniciar todo (App + Monitoring)
docker-compose up -d

# URLs disponibles
# - Aplicación: http://localhost:3000
# - Prometheus: http://localhost:9090
# - Grafana: http://localhost:3001
# - Kibana: http://localhost:5601

# Ver logs
docker-compose logs -f calculator

# Detener
docker-compose down
```

### Solo la Aplicación

```bash
# Build
docker build -t calculator:latest .

# Run
docker run -p 3000:3000 calculator:latest

# Con variables
docker run -p 3000:3000 -e NODE_ENV=production calculator:latest
```

---

## ☸️ Deploy Manual a Kubernetes

### Opción 1: Script

```bash
# Hacer ejecutable
chmod +x deploy.sh health-check.sh

# Deploy
./deploy.sh production latest

# Health check
./health-check.sh
```

### Opción 2: Kubectl

```bash
# Aplicar recursos
kubectl apply -f k8s/

# Esperar rollout
kubectl rollout status deployment/calculator-deployment

# Verificar
kubectl get pods
kubectl get svc
```

### Opción 3: Kustomize

```bash
# Crear estructura (opcional)
kustomize build k8s/ | kubectl apply -f -
```

---

## 🔍 Monitoreo

### Health Check en Tiempo Real

```bash
# Via kubectl
kubectl port-forward svc/calculator-service 3000:80

# Via curl
while true; do
  curl -s http://localhost:3000/health | jq .
  sleep 5
done
```

### Logs

```bash
# Últimas líneas
kubectl logs deployment/calculator-deployment

# Follow logs
kubectl logs -f deployment/calculator-deployment

# De un pod específico
kubectl logs <POD_NAME>

# Con timestamps
kubectl logs deployment/calculator-deployment --timestamps=true
```

### Métricas

```bash
# CPU y memoria
kubectl top node
kubectl top pod

# Detailed info
kubectl describe deployment calculator-deployment
```

---

## 🚨 Solución de Problemas

### "Pipeline failed at Lint"

```bash
# Verificar estructura
cd app
node validate.js

# Debe mostrar ✅ VALIDACIÓN EXITOSA
```

### "Docker build failed"

```bash
# Revisar Dockerfile
cat Dockerfile

# Build local
docker build -t calc:test .
docker run -p 3000:3000 calc:test
```

### "Kubernetes deploy failed"

```bash
# Ver error específico
kubectl describe deployment calculator-deployment
kubectl get events

# Revisar logs del pod
kubectl logs <POD_NAME>

# Rollback si es necesario
kubectl rollout undo deployment/calculator-deployment
```

### "KUBE_CONFIG secret not found"

```bash
# Verificar secret está creado
gh secret list

# Recrear si es necesario
cat ~/.kube/config | base64 -w 0
# Copiar output en Settings → Secrets → KUBE_CONFIG
```

---

## 📋 Checklist de Setup

- [ ] Repositorio en GitHub
- [ ] Código pushed a main
- [ ] KUBE_CONFIG secret agregado
- [ ] Nombres actualizados en YAML
- [ ] Primer push trigger workflow
- [ ] Verificar workflow en Actions tab
- [ ] Todos los tests pasan
- [ ] Docker build exitoso
- [ ] Deploy a K8s completado
- [ ] Acceder a http://localhost:3000

---

## 🎯 Próximos Pasos

### 1. Verificar Pipeline
```bash
gh run list --workflow=ci-cd.yml
```

### 2. Hacer Cambios de Prueba
```bash
# Editar algo en app/
git add .
git commit -m "Test pipeline"
git push
# Observar pipeline en Actions
```

### 3. Crear Pull Request
```bash
git checkout -b feature/test
# Hacer cambios
git push -u origin feature/test
# Crear PR en GitHub
# Observar checks automáticos
```

### 4. Deployar a Producción
```bash
# Merge PR a main
# Pipeline automáticamente:
# 1. Corre tests
# 2. Construye imagen
# 3. Hace deploy a K8s
# 4. Corre smoke tests
```

---

## 📚 Documentación Completa

Para más detalles ver:
- `CICD_DOCUMENTATION.md` - Documentación completa del pipeline
- `PIPELINE_CONFIG.md` - Configuración detallada
- `README.md` - Documentación de la aplicación

---

## 💡 Tips

1. **Usa branches**: Siempre usa feature branches, no commits directo a main
2. **PRs para review**: Crea PRs para cambios en main
3. **Monitor metrics**: Revisa Grafana regularmente
4. **Check logs**: Los logs te dirán qué está mal
5. **Pequeños commits**: Commits pequeños = debugging más fácil

---

**¡Listo!** 🎉

Tu pipeline CI/CD está configurado y funcionando.

Próximo push: pipeline automáticamente ejecutará todos los checks.
