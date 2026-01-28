#!/bin/bash

# Script para verificar la salud del deployment
# Uso: ./health-check.sh

set -e

NAMESPACE="default"
DEPLOYMENT="calculator-deployment"
SERVICE="calculator-service"

echo "🏥 Health Check - Kubernetes"
echo "═══════════════════════════════════════"
echo ""

# 1. Verificar deployment
echo "1️⃣  Deployment Status"
kubectl get deployment $DEPLOYMENT -n $NAMESPACE -o wide
echo ""

# 2. Verificar réplicas
echo "2️⃣  Replicas"
DESIRED=$(kubectl get deployment $DEPLOYMENT -n $NAMESPACE -o jsonpath='{.spec.replicas}')
READY=$(kubectl get deployment $DEPLOYMENT -n $NAMESPACE -o jsonpath='{.status.readyReplicas}')
echo "   Desired: $DESIRED, Ready: $READY"
if [ "$DESIRED" == "$READY" ]; then
    echo "   ✅ Réplicas sincronizadas"
else
    echo "   ⚠️  Esperando réplicas..."
fi
echo ""

# 3. Verificar pods
echo "3️⃣  Pods Status"
kubectl get pods -n $NAMESPACE -l app=calculator -o wide
echo ""

# 4. Verificar service
echo "4️⃣  Service Status"
kubectl get svc $SERVICE -n $NAMESPACE
echo ""

# 5. Verificar eventos recientes
echo "5️⃣  Recent Events"
kubectl get events -n $NAMESPACE --sort-by='.lastTimestamp' | tail -5
echo ""

# 6. Verificar recursos
echo "6️⃣  Resource Usage"
kubectl top deployment $DEPLOYMENT -n $NAMESPACE 2>/dev/null || echo "   Metrics no disponibles (instala metrics-server)"
echo ""

# 7. Verificar logs
echo "7️⃣  Recent Logs"
kubectl logs deployment/$DEPLOYMENT -n $NAMESPACE --tail=5
echo ""

echo "═══════════════════════════════════════"
echo "✅ Health check completado"
