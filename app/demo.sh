#!/bin/bash

# Script de Demostración del Proyecto
# Ejecuta ejemplos de uso de la calculadora web

echo "╔════════════════════════════════════════════════════════════╗"
echo "║     CALCULADORA WEB - DEMOSTRACIÓN DE FUNCIONALIDAD        ║"
echo "║     DevSecOps + CI/CD + Kubernetes                         ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Esperar a que el servidor esté listo
wait_for_server() {
    local count=0
    while [ $count -lt 10 ]; do
        if curl -s http://localhost:3000/health > /dev/null 2>&1; then
            echo -e "${GREEN}✓ Servidor disponible${NC}"
            return 0
        fi
        count=$((count+1))
        sleep 1
    done
    echo -e "${RED}✗ Servidor no disponible${NC}"
    return 1
}

# Función para hacer llamadas a la API
call_api() {
    local operation=$1
    local a=$2
    local b=$3
    
    echo -e "\n${BLUE}→ Operación: $operation${NC}"
    echo "  Números: $a, $b"
    
    local response=$(curl -s "http://localhost:3000/api/calculate?op=$operation&a=$a&b=$b")
    echo "  Respuesta: $response"
    
    if [[ $response == *"error"* ]]; then
        echo -e "${RED}  ❌ Error${NC}"
    else
        echo -e "${GREEN}  ✓ Éxito${NC}"
    fi
}

echo -e "${YELLOW}1. Verificar servidor${NC}"
echo "   URL: http://localhost:3000"
echo ""

# Intentar conectar
if wait_for_server; then
    echo ""
    echo -e "${YELLOW}2. Verificar estado de salud${NC}"
    HEALTH=$(curl -s http://localhost:3000/health)
    echo "   Endpoint: GET /health"
    echo "   Respuesta: $HEALTH"
    echo -e "${GREEN}   ✓ Servidor saludable${NC}"
    
    echo ""
    echo -e "${YELLOW}3. Ejecutar operaciones matemáticas${NC}"
    echo ""
    
    # Pruebas
    call_api "add" 10 5
    call_api "subtract" 20 8
    call_api "multiply" 6 7
    call_api "divide" 100 4
    
    echo ""
    echo -e "${YELLOW}4. Pruebas unitarias${NC}"
    echo "   Ejecutando: npm test"
    echo ""
    cd "$(dirname "$0")/app"
    npm test 2>&1 | head -20
    
    echo ""
    echo -e "${YELLOW}5. Acceder a la interfaz web${NC}"
    echo "   URL: http://localhost:3000/"
    echo "   - Ingresa dos números"
    echo "   - Selecciona una operación"
    echo "   - El resultado aparecerá instantáneamente"
    echo "   - El historial se guardará automáticamente"
    
    echo ""
    echo -e "${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║  ✓ DEMOSTRACIÓN COMPLETADA EXITOSAMENTE                  ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
    
else
    echo -e "${RED}Error: No se pudo conectar al servidor${NC}"
    echo "Asegúrate de ejecutar: npm start"
fi
