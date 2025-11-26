#!/bin/bash

echo "=== Limpando Docker para liberar espaço ==="

echo "1. Parando containers..."
docker stop $(docker ps -aq) 2>/dev/null || true

echo "2. Removendo containers parados..."
docker container prune -f

echo "3. Removendo imagens não utilizadas..."
docker image prune -a -f

echo "4. Removendo volumes não utilizados..."
docker volume prune -f

echo "5. Removendo networks não utilizadas..."
docker network prune -f

echo "6. Limpeza completa do sistema Docker..."
docker system prune -a -f --volumes

echo ""
echo "=== Espaço em disco ==="
df -h

echo ""
echo "=== Uso do Docker ==="
docker system df

echo ""
echo "Limpeza concluída!"

