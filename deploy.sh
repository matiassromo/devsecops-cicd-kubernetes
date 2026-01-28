#!/bin/bash

# Script de Deployment Automatizado para Kubernetes
# Uso: ./deploy.sh [environment] [image-tag]

set -e

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuración
ENVIRONMENT=${1:-production}
IMAGE_TAG=${2:-latest}
NAMESPACE="default"
APP_NAME="calculator"
DEPLOYMENT_NAME="calculator-deployment"
SERVICE_NAME="calculator-service"
REGISTRY="ghcr.io"
IMAGE_NAME="$REGISTRY/OWNER/calculator"

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     KUBERNETES DEPLOYMENT SCRIPT       ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""

# Verificar kubectl
if ! command -v kubectl &> /dev/null; then
    echo -e "${RED}✗ kubectl no está instalado${NC}"
    exit 1
fi

echo -e "${GREEN}✓ kubectl encontrado${NC}"

# Verificar conexión a cluster
echo -e "\n${YELLOW}1. Verificando conexión a Kubernetes...${NC}"
if kubectl cluster-info &> /dev/null; then
    echo -e "${GREEN}✓ Conectado a cluster${NC}"
    kubectl cluster-info | grep -i "kubernetes master"
else
    echo -e "${RED}✗ No se pudo conectar al cluster${NC}"
    exit 1
fi

# Crear namespace si no existe
echo -e "\n${YELLOW}2. Verificando namespace...${NC}"
if kubectl get namespace $NAMESPACE &> /dev/null; then
    echo -e "${GREEN}✓ Namespace '$NAMESPACE' existe${NC}"
else
    echo -e "${YELLOW}→ Creando namespace '$NAMESPACE'...${NC}"
    kubectl create namespace $NAMESPACE
    echo -e "${GREEN}✓ Namespace creado${NC}"
fi

# Validar manifiestos
echo -e "\n${YELLOW}3. Validando manifiestos YAML...${NC}"
for file in k8s/*.yaml; do
    echo "  Validando $file..."
    kubectl apply -f "$file" --dry-run=client &> /dev/null
    echo -e "  ${GREEN}✓ $file válido${NC}"
done

# Aplicar ConfigMaps y recursos
echo -e "\n${YELLOW}4. Aplicando recursos de Kubernetes...${NC}"
kubectl apply -f k8s/resources.yaml -n $NAMESPACE
echo -e "${GREEN}✓ Recursos aplicados${NC}"

# Actualizar imagen en deployment
echo -e "\n${YELLOW}5. Actualizando imagen del deployment...${NC}"
FULL_IMAGE="$IMAGE_NAME:$IMAGE_TAG"
echo "  Imagen: $FULL_IMAGE"

kubectl set image deployment/$DEPLOYMENT_NAME \
    $APP_NAME=$FULL_IMAGE \
    -n $NAMESPACE \
    --record

echo -e "${GREEN}✓ Imagen actualizada${NC}"

# Esperar rollout
echo -e "\n${YELLOW}6. Esperando rollout del deployment...${NC}"
if kubectl rollout status deployment/$DEPLOYMENT_NAME -n $NAMESPACE --timeout=5m; then
    echo -e "${GREEN}✓ Rollout completado exitosamente${NC}"
else
    echo -e "${RED}✗ Error durante rollout${NC}"
    echo "Rollback..."
    kubectl rollout undo deployment/$DEPLOYMENT_NAME -n $NAMESPACE
    exit 1
fi

# Verificar pods
echo -e "\n${YELLOW}7. Verificando pods...${NC}"
echo ""
kubectl get pods -n $NAMESPACE -l app=$APP_NAME
echo ""

RUNNING_PODS=$(kubectl get pods -n $NAMESPACE -l app=$APP_NAME --field-selector=status.phase=Running -o jsonpath='{.items | length}')
echo -e "${GREEN}✓ Pods en ejecución: $RUNNING_PODS${NC}"

# Verificar service
echo -e "\n${YELLOW}8. Verificando servicio...${NC}"
kubectl get svc $SERVICE_NAME -n $NAMESPACE
echo -e "${GREEN}✓ Servicio disponible${NC}"

# Smoke tests
echo -e "\n${YELLOW}9. Ejecutando smoke tests...${NC}"
HEALTH_CHECK=$(kubectl exec -it deployment/$DEPLOYMENT_NAME -n $NAMESPACE -- \
    wget -O- http://localhost:3000/health 2>/dev/null | grep -q '"ok":true' && echo "pass" || echo "fail")

if [ "$HEALTH_CHECK" == "pass" ]; then
    echo -e "${GREEN}✓ Health check passed${NC}"
else
    echo -e "${RED}✗ Health check failed${NC}"
fi

# Resumen
echo -e "\n${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║      DEPLOYMENT COMPLETADO ✓          ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""
echo "Información de la aplicación:"
echo "  Namespace: $NAMESPACE"
echo "  Deployment: $DEPLOYMENT_NAME"
echo "  Service: $SERVICE_NAME"
echo "  Image: $FULL_IMAGE"
echo "  Environment: $ENVIRONMENT"
echo ""
echo "Comandos útiles:"
echo "  Ver logs:      kubectl logs -f deployment/$DEPLOYMENT_NAME -n $NAMESPACE"
echo "  Port forward:  kubectl port-forward svc/$SERVICE_NAME 3000:80 -n $NAMESPACE"
echo "  Describe:      kubectl describe deployment $DEPLOYMENT_NAME -n $NAMESPACE"
echo "  Rollback:      kubectl rollout undo deployment/$DEPLOYMENT_NAME -n $NAMESPACE"
echo ""
