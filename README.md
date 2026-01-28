<<<<<<< HEAD
# 🧮 Calculadora Web - DevSecOps + CI/CD + Kubernetes

Aplicación web moderna de calculadora construida con **Node.js**, **HTML5**, **CSS3** y **JavaScript vanilla**. Completamente funcional, containerizada y lista para Kubernetes.

## 📋 Tabla de Contenidos

- [Características](#características)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Instalación](#instalación)
- [Uso](#uso)
- [Pruebas Unitarias](#pruebas-unitarias)
- [Docker](#docker)
- [Kubernetes](#kubernetes)
- [API Endpoints](#api-endpoints)

## ✨ Características

- ✅ **Interfaz Moderna**: Diseño responsive con gradientes y animaciones suaves
- ✅ **Operaciones Básicas**: Suma, resta, multiplicación y división
- ✅ **API REST**: Backend escalable con endpoints bien definidos
- ✅ **Historial Persistente**: Almacenamiento local de operaciones
- ✅ **Verificación de Salud**: Health check del servidor en tiempo real
- ✅ **Pruebas Unitarias**: Suite completa de tests con Node's test runner
- ✅ **Docker Ready**: Dockerfile optimizado para producción
- ✅ **Kubernetes Ready**: Manifiestos YAML listos para desplegar
- ✅ **Error Handling**: Validación robusta de entradas y manejo de errores
- ✅ **Documentación**: Código bien comentado y documentado

## 📁 Estructura del Proyecto

```
devsecops-cicd-k8s/
├── app/
│   ├── public/
│   │   ├── index.html          # Página principal
│   │   ├── css/
│   │   │   └── style.css       # Estilos CSS
│   │   └── js/
│   │       └── app.js          # Lógica del cliente
│   ├── index.js                # Servidor Node.js
│   ├── index.test.js           # Pruebas unitarias
│   ├── calculator.js           # Módulo de cálculos
│   └── package.json            # Dependencias
├── k8s/
│   ├── deployment.yaml         # Configuración de Kubernetes
│   └── service.yaml            # Servicio de Kubernetes
├── Dockerfile                  # Imagen Docker
└── README.md                   # Este archivo
```

## 🚀 Instalación

### Requisitos Previos
- Node.js v20+ 
- npm (incluido con Node.js)

### Pasos

1. **Navegar al directorio de la aplicación:**
```bash
cd app
```

2. **Instalar dependencias:**
```bash
npm install
```

3. **Iniciar el servidor:**
```bash
npm start
```

El servidor estará disponible en `http://localhost:3000`

## 💻 Uso

### Interfaz Web

1. Accede a `http://localhost:3000`
2. Ingresa dos números
3. Haz clic en la operación deseada
4. El resultado aparecerá instantáneamente
5. El historial se actualiza automáticamente

### Mediante API

**Endpoint:** `GET /api/calculate`

**Parámetros:**
- `op`: Operación (`add`, `subtract`, `multiply`, `divide`)
- `a`: Primer número
- `b`: Segundo número

**Ejemplo:**
```bash
curl "http://localhost:3000/api/calculate?op=add&a=10&b=5"
```

**Respuesta:**
```json
{
  "result": 15,
  "operation": "add",
  "a": 10,
  "b": 5
}
```

## 🧪 Pruebas Unitarias

### Ejecutar Todas las Pruebas

```bash
npm test
```

### Pruebas Incluidas

La suite de pruebas incluye:

- **Adición**: Suma simple, números negativos, decimales
- **Sustracción**: Resta simple, números negativos, decimales
- **Multiplicación**: Multiplicación simple, números negativos, decimales
- **División**: División simple, números negativos, decimales
- **Errores**: División por cero
- **Casos Límite**: Números muy grandes, multiplicación por 1, etc.

**Ejemplo de salida:**
```
✔ Calculator - Addition (5.234ms)
✔ Calculator - Subtraction (0.456ms)
✔ Calculator - Multiplication (0.234ms)
✔ Calculator - Division (0.345ms)
✔ Calculator - Division by zero (0.789ms)
✔ Calculator - Edge cases (0.123ms)

6 tests passed (12.345ms)
```

## 🐳 Docker

### Construcción de la Imagen

```bash
docker build -t calculator-app:latest .
```

### Ejecutar en Docker

```bash
docker run -p 3000:3000 calculator-app:latest
```

La aplicación estará disponible en `http://localhost:3000`

### Dockerfile

El Dockerfile incluye:
- Base image: `node:20-alpine` (ligero y seguro)
- Instalación de dependencias de producción solamente
- Exposición del puerto 3000
- CMD para iniciar la aplicación

## ☸️ Kubernetes

### Desplegar a Kubernetes

```bash
# Aplicar los manifiestos
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml

# Verificar despliegue
kubectl get deployments
kubectl get services
kubectl get pods
```

### Port Forward (Local Testing)

```bash
kubectl port-forward svc/calculator-service 3000:3000
```

### Ver Logs

```bash
kubectl logs -f deployment/calculator-deployment
```

### Actualizar Imagen

```bash
# Cambiar la imagen en deployment.yaml y aplicar
kubectl apply -f k8s/deployment.yaml

# O mediante kubectl
kubectl set image deployment/calculator-deployment \
  calculator=calculator-app:v2.0
```

## 🔌 API Endpoints

### GET /
Retorna la página HTML principal.

### GET /health
Verifica la salud del servidor.

**Respuesta:**
```json
{
  "ok": true,
  "status": "healthy"
}
```

### GET /api/calculate
Realiza una operación matemática.

**Parámetros Query:**
- `op` (required): `add`, `subtract`, `multiply`, `divide`
- `a` (required): Número flotante
- `b` (required): Número flotante

**Respuesta Exitosa:**
```json
{
  "result": 15,
  "operation": "add",
  "a": 10,
  "b": 5
}
```

**Respuesta de Error:**
```json
{
  "error": "Missing or invalid parameters"
}
```

## 📊 Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────┐
│                    Usuario                          │
└─────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────┐
│              Navegador Web (Cliente)                │
│  ┌──────────────────────────────────────────────┐   │
│  │ HTML5 + CSS3 + JavaScript Vanilla            │   │
│  │ - Interfaz Reactiva                          │   │
│  │ - Almacenamiento Local (localStorage)        │   │
│  │ - Verificación de Salud Periódica            │   │
│  └──────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
                          ↓ HTTP
┌─────────────────────────────────────────────────────┐
│         Servidor Node.js (Backend)                  │
│  ┌──────────────────────────────────────────────┐   │
│  │ index.js - Servidor HTTP                     │   │
│  │ calculator.js - Lógica de Cálculos           │   │
│  │ index.test.js - Pruebas Unitarias            │   │
│  └──────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────┐
│              Docker Container                       │
│  ┌──────────────────────────────────────────────┐   │
│  │ Node.js v20 Alpine                           │   │
│  └──────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────┐
│           Kubernetes Cluster                        │
│  ┌──────────────────────────────────────────────┐   │
│  │ Deployment + Service + Pods                  │   │
│  └──────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

## 🔒 Seguridad

- **Validación de Entrada**: Todas las entradas se validan
- **Manejo de Errores**: Errores capturados y registrados
- **Sin Dependencias Externas**: Reducida superficie de ataque
- **Alpine Linux**: Imagen Docker mínima y segura
- **Health Checks**: Monitoreo continuo del estado

## 📈 Monitoreo

### Health Check

El health check está disponible en `/health` y retorna:

```json
{
  "ok": true,
  "status": "healthy"
}
```

La UI verifica la salud del servidor cada 5 segundos.

### Logs

```bash
# Local
npm start

# Docker
docker logs -f <container-id>

# Kubernetes
kubectl logs -f pod/<pod-name>
```

## 🔧 Desarrollo

### Estructura de Código

**calculator.js**: Módulo de operaciones matemáticas
```javascript
class Calculator {
  add(a, b) { return a + b; }
  subtract(a, b) { return a - b; }
  multiply(a, b) { return a * b; }
  divide(a, b) {
    if (b === 0) throw new Error("Cannot divide by zero");
    return a / b;
  }
}
```

**index.js**: Servidor HTTP
```javascript
const server = http.createServer((req, res) => {
  // Rutas: /, /health, /api/calculate, /css/style.css, /js/app.js
});
```

**app.js**: Lógica del cliente
```javascript
async function calculate(operation) {
  // Valida entradas
  // Llamadas a API
  // Actualiza DOM
}
```

## 📝 Variables de Entorno

```bash
PORT=3000          # Puerto del servidor (default: 3000)
NODE_ENV=development # Entorno (development/production)
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agrega nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está licenciado bajo la MIT License.

## 👨‍💻 Autor

Proyecto DevSecOps + CI/CD + Kubernetes - UDLA Semestre 9

## 🌐 URLs

- **Aplicación**: http://localhost:3000
- **Health Check**: http://localhost:3000/health
- **API**: http://localhost:3000/api/calculate?op=add&a=10&b=5

## 📚 Recursos Adicionales

- [Node.js Documentation](https://nodejs.org/docs/)
- [Docker Documentation](https://docs.docker.com/)
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [MDN Web Docs](https://developer.mozilla.org/)

---

**Versión**: 1.0.0  
**Última actualización**: 2026  
**Estado**: ✅ Producción
=======
# devsecops-cicd-kubernetes

Proyecto demo para Integración CI/CD y DevSecOps.

## Objetivo
Implementar un pipeline CI/CD con enfoque DevSecOps que:
- ejecute pruebas,
- construya y publique un artefacto (imagen Docker),
- aplique análisis de seguridad (Trivy),
- despliegue en Kubernetes (kind) y valide el despliegue.

## Pipeline (GitHub Actions)
Etapas:
1. Test (Node)
2. Build & Push (Docker → GHCR)
3. Security Scan (Trivy)
4. Deploy (Kubernetes kind + kubectl apply)

## Evidencias
Las evidencias del pipeline y del análisis de seguridad se encuentran en la pestaña Actions del repositorio.
>>>>>>> f86a237715c050950582e7ab2779b1ca8e150807
