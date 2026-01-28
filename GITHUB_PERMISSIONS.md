# 🔐 GitHub Permissions Setup

## Errores Comunes y Soluciones

### Error: "Resource not accessible by integration"

Este error ocurre cuando GitHub Actions no tiene permisos suficientes.

#### Solución 1: Configurar Permisos en el Repositorio

**En GitHub Settings:**

1. Ve a: **Settings → Actions → General**
2. Bajo "Permissions", selecciona:
   - ☑️ **Read and write permissions**
   - ☑️ **Allow GitHub Actions to create and approve pull requests**

#### Solución 2: Configurar Permisos en el Workflow

Los workflows ya tienen permisos configurados:

```yaml
permissions:
  contents: read
  packages: write
  security-events: write
```

### Error: "CodeQL Action v2 is deprecated"

**Solución**: Actualizar a v3 (YA CORREGIDO en los archivos)

```yaml
# ❌ ANTES (v2 - deprecated)
uses: github/codeql-action/upload-sarif@v2

# ✅ DESPUÉS (v3 - actual)
uses: github/codeql-action/upload-sarif@v3
```

---

## ✅ Checklist de Permisos

### En GitHub Repository

- [ ] Settings → Actions → General
- [ ] **Read and write permissions** habilitado
- [ ] **Allow GitHub Actions to create and approve pull requests** habilitado

### En GitHub Secrets

- [ ] `KUBE_CONFIG` agregado (para Kubernetes, opcional)
- [ ] `REGISTRY_TOKEN` agregado (si usas registro privado)

### En Workflow Files

- [ ] Permisos declarados en el root del workflow
- [ ] CodeQL Action actualizado a v3
- [ ] No hay hardcoded credentials

---

## 🔐 Permisos Recomendados por Job

### Lint & Validate
```yaml
permissions:
  contents: read
```

### Unit Tests
```yaml
permissions:
  contents: read
```

### Security Scan
```yaml
permissions:
  contents: read
  security-events: write  # Para upload SARIF
```

### Build Docker
```yaml
permissions:
  contents: read
  packages: write  # Para push a GHCR
```

### Deploy
```yaml
permissions:
  contents: read
```

### Smoke Tests
```yaml
permissions:
  contents: read
```

---

## 📋 Variables de Entorno Seguras

### GitHub Secrets (No se muestran en logs)

```bash
# Para Kubernetes deployment
KUBE_CONFIG=base64_encoded_kubeconfig

# Para Docker/Container Registry
REGISTRY_USERNAME=tu_usuario
REGISTRY_PASSWORD=tu_token
```

### GitHub Variables (Visibles en logs, para info no sensible)

```bash
# Para configuración
REGISTRY=ghcr.io
IMAGE_NAME=usuario/repo
```

---

## 🚀 First Run - Pasos

### 1. Corregir Permisos del Repositorio
```
Settings → Actions → General
→ Read and write permissions (✓)
→ Allow GitHub Actions to create and approve PRs (✓)
```

### 2. Agregar Secrets Necesarios (Opcional)
```
Settings → Secrets and variables → Actions
→ New repository secret: KUBE_CONFIG (si usas K8s)
```

### 3. Hacer Push
```bash
git add .
git commit -m "Fix: Update workflows with proper permissions"
git push
```

### 4. Ver Pipeline en Actions
```
Actions tab → CI/CD Pipeline → Ver ejecución
```

---

## ✨ Lo que funciona sin configuración adicional

✅ **Lint & Validate** - No requiere permisos especiales
✅ **Unit Tests** - No requiere permisos especiales
✅ **Security Scan** - Solo necesita `security-events: write`
✅ **Build Docker** - Necesita `packages: write` (ya configurado)
✅ **Notifications** - No requiere permisos especiales

⚠️ **Kubernetes Deploy** - Es opcional, requiere KUBE_CONFIG secret
   (El workflow está configurado para fallar gracefully si no está)

---

## 🔒 Mejores Prácticas

1. **Usa GitHub Secrets**: Nunca commits credenciales
2. **Permisos mínimos**: Solo lo que necesitas
3. **Tokens con scope limitado**: No uses admin tokens
4. **Rota tokens regularmente**: Cambialos cada 3 meses
5. **Audita accesos**: Revisa logs de Actions

---

## 🆘 Si Sigue Fallando

### Step 1: Ver logs detallados
```
GitHub Actions → Run → Click en job que falla → Ver logs completos
```

### Step 2: Verificar permisos en Settings
```
Settings → Actions → General → Confirmar permisos ✓
```

### Step 3: Recrear secrets si es necesario
```
Settings → Secrets → Delete → New
```

### Step 4: Hacer push limpio
```bash
git add .
git commit -m "Refresh workflow"
git push
```

---

## 📚 Referencias

- [GitHub Actions Permissions](https://docs.github.com/en/actions/using-jobs/assigning-permissions-to-jobs)
- [GitHub CodeQL Action v3](https://github.com/github/codeql-action)
- [GitHub Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
