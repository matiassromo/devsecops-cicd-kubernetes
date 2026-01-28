# 🚀 GUÍA RÁPIDA DE INICIO

## ⚡ Inicio Rápido (30 segundos)

### Opción 1: En tu máquina

```bash
# 1. Navega a la carpeta de la app
cd app

# 2. Instala las dependencias (solo la primera vez)
npm install

# 3. Inicia el servidor
npm start

# 4. Abre en tu navegador
# http://localhost:3000
```

### Opción 2: Con Docker

```bash
# Construye la imagen
docker build -t calculator:latest .

# Ejecuta el contenedor
docker run -p 3000:3000 calculator:latest

# Abre en tu navegador
# http://localhost:3000
```

### Opción 3: En Kubernetes

```bash
# Aplica los manifiestos
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml

# Accede a través del port-forward
kubectl port-forward svc/calculator-service 3000:3000

# Abre en tu navegador
# http://localhost:3000
```

## 🧪 Ejecutar Pruebas

```bash
cd app
npm test
```

**Resultado esperado**: ✅ 6 tests pasando

## 📊 Operaciones Disponibles

En la interfaz web ingresa dos números y haz clic en:

- **+ Sumar** → a + b
- **- Restar** → a - b  
- **× Multiplicar** → a × b
- **÷ Dividir** → a ÷ b

## 🔌 API REST

### Health Check
```bash
curl http://localhost:3000/health
```

### Suma
```bash
curl "http://localhost:3000/api/calculate?op=add&a=10&b=5"
# Respuesta: {"result":15,"operation":"add","a":10,"b":5}
```

### Resta
```bash
curl "http://localhost:3000/api/calculate?op=subtract&a=20&b=8"
# Respuesta: {"result":12,"operation":"subtract","a":20,"b":8}
```

### Multiplicación
```bash
curl "http://localhost:3000/api/calculate?op=multiply&a=6&b=7"
# Respuesta: {"result":42,"operation":"multiply","a":6,"b":7}
```

### División
```bash
curl "http://localhost:3000/api/calculate?op=divide&a=100&b=4"
# Respuesta: {"result":25,"operation":"divide","a":100,"b":4}
```

## 📁 Estructura de Archivos

```
app/
├── index.js              - Servidor Node.js
├── calculator.js         - Lógica de cálculos
├── index.test.js         - Pruebas unitarias
├── validate.js           - Validador del proyecto
├── package.json          - Configuración npm
├── public/
│   ├── index.html        - Página web
│   ├── css/style.css     - Estilos
│   └── js/app.js         - Lógica del cliente
└── demo.sh               - Script de demostración
```

## 🎯 Características Principales

✅ **Interfaz Web Moderna** - Responsive y atractiva
✅ **API REST** - 4 operaciones matemáticas
✅ **Pruebas Unitarias** - 6 tests con cobertura completa
✅ **Historial Persistente** - Se guarda en localStorage
✅ **Health Check** - Verifica disponibilidad del servidor
✅ **Sin Dependencias** - Solo Node.js nativo
✅ **Docker Ready** - Containerizado
✅ **Kubernetes Ready** - Manifiestos incluidos

## 🔧 Requisitos

- Node.js v20+ (para ejecutar localmente)
- Docker (para ejecutar en contenedor)
- Kubernetes (para ejecutar en cluster)

## 📖 Documentación Completa

Para más detalles, consulta el archivo `README.md` en la raíz del proyecto.

## ✅ Validación del Proyecto

Para verificar que todo está bien estructurado:

```bash
cd app
node validate.js
```

Deberías ver:
```
✅ ¡VALIDACIÓN EXITOSA!

El proyecto está completamente estructurado y funcional.
```

## 🐛 Solución de Problemas

### "Puerto 3000 ya está en uso"
```bash
# Mata el proceso anterior
# En Windows:
taskkill /PID <process-id> /F

# En Linux/Mac:
lsof -ti:3000 | xargs kill -9
```

### "No se encuentra el módulo"
```bash
# Reinstala las dependencias
cd app
rm -rf node_modules package-lock.json
npm install
```

### "Error de conexión al servidor"
```bash
# Asegúrate de que el servidor esté corriendo
# Abre una nueva terminal y ejecuta:
npm start

# Verifica que sea accesible:
curl http://localhost:3000/health
```

## 📞 Soporte

- **Documentación**: Ver `README.md`
- **Validación**: Ejecutar `node validate.js`
- **Pruebas**: Ejecutar `npm test`
- **Logs**: Revisar salida de `npm start`

---

**¡Listo para empezar!** 🎉

Presiona `Ctrl+C` en la terminal para detener el servidor cuando termines.
