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
