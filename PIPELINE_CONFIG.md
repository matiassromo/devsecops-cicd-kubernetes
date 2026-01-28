# CI/CD Pipeline Configuration

## 🚀 Pipeline Stages

### 1. **Lint & Validate**
   - Valida estructura del proyecto
   - Verifica sintaxis de Node.js
   - Checkea archivos requeridos

### 2. **Unit Tests**
   - Ejecuta suite de pruebas
   - Cobertura de funcionalidad
   - Validación de casos límite

### 3. **Security Scan**
   - Análisis de vulnerabilidades
   - Verificación de Dockerfile
   - Control de calidad de código

### 4. **Build Docker**
   - Construye imagen Docker
   - Push a registro de contenedores
   - Caché de capas

### 5. **Deploy to Kubernetes** (Solo rama main)
   - Actualiza deployment en K8s
   - Realiza rollout seguro
   - Verifica disponibilidad

### 6. **Smoke Tests**
   - Verifica endpoints
   - Pruebas de API
   - Health check

### 7. **Notifications**
   - Resumen del pipeline
   - Status de cada etapa

## 📋 Requisitos

### GitHub Secrets Requeridos

```
KUBE_CONFIG          # Configuración kubeconfig (base64)
REGISTRY_USERNAME    # Usuario del registro
REGISTRY_PASSWORD    # Contraseña del registro
SLACK_WEBHOOK        # (Opcional) Para notificaciones
```

### Configuración de kubeconfig

```bash
# 1. Obtener configuración
cat ~/.kube/config | base64 -w 0

# 2. Agregar como secret en GitHub
# Settings -> Secrets and variables -> Actions -> New repository secret
# Name: KUBE_CONFIG
# Value: [contenido base64]
```

## 🔄 Flujo del Pipeline

```
main/develop push
        ↓
    Lint & Validate
        ↓
    Unit Tests ←─── Si falla: detiene
        ↓
    Security Scan ←─── Si falla: detiene
        ↓
    Build Docker ←─── Push a registro
        ↓
    Deploy (main solo) ←─── Rolling update
        ↓
    Smoke Tests ←─── Verifica funcionalidad
        ↓
    Notifications ←─── Resumen final
```

## 🎯 Triggers

### CI/CD Principal
- **Push** a main o develop
- **Pull Request** a main o develop
- **Manual** (workflow_dispatch)

### Security
- **Push** a main o develop
- **Pull Request** a main
- **Scheduled** (semanal)

## 📊 Estados del Pipeline

| Estado | Significado |
|--------|------------|
| ✅ Success | Todo pasó correctamente |
| ❌ Failed | Una etapa falló, consulta logs |
| ⏳ Pending | Esperando ejecución |
| ⊘ Skipped | Condición no cumplida |

## 🔍 Monitoreo

### Ver estado del pipeline
```bash
gh workflow list
gh run list
```

### Ver logs detallados
```bash
gh run view <run-id>
gh run view <run-id> --log
```

### Cancelar ejecución
```bash
gh run cancel <run-id>
```

## 🛠️ Personalización

### Cambiar versión de Node.js
Editar `.github/workflows/ci-cd.yml`:
```yaml
- uses: actions/setup-node@v4
  with:
    node-version: '20'  # Cambiar aquí
```

### Cambiar registros de contenedores
Editar `.github/workflows/ci-cd.yml`:
```yaml
REGISTRY: ghcr.io  # O tu registro
IMAGE_NAME: ${{ github.repository }}
```

### Agregar más pruebas
Editar `app/index.test.js` y agregar tests con:
```javascript
test("descripción", () => {
  assert.equal(...);
});
```

## 📈 Métricas

El pipeline recolecta:
- Tiempo de ejecución
- Resultados de pruebas
- Vulnerabilidades encontradas
- Tamaño de imagen Docker

## 🔐 Seguridad

- Tokens en GitHub Secrets (nunca en código)
- Imagen Docker con Alpine (mínima)
- No se ejecuta como root
- Validación de entradas
- Análisis de vulnerabilidades

## 🚨 Troubleshooting

### Pipeline falla en "Setup Node.js"
```bash
# Verificar versión disponible
# Usar versión compatible
```

### Docker push falla
```bash
# Verificar credentials
# Revisar permisos en registro
# Confirmar GITHUB_TOKEN
```

### Kubernetes deploy falla
```bash
# Revisar KUBE_CONFIG secret
# Verificar acceso al cluster
# Confirmar contexto correcto
```

### Smoke tests fallan
```bash
# Revisar logs del pod
kubectl logs deployment/calculator-deployment
# Verificar health endpoint
curl http://localhost:3000/health
```

## 📚 Referencias

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Docker Documentation](https://docs.docker.com/)
- [Best Practices CI/CD](https://www.atlassian.com/continuous-delivery/pipeline/)
