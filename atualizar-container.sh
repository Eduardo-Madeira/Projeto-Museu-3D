#!/bin/bash

echo "=== Atualizando container do Museu 3D ==="

# Navega para o diretório do projeto (ajuste o caminho se necessário)
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR" || exit

echo "1. Parando container atual..."
docker stop museu-3d-app 2>/dev/null || true
docker rm museu-3d-app 2>/dev/null || true

echo "2. Removendo imagem antiga..."
docker rmi eq_3d-museu-3d 2>/dev/null || true

echo "3. Fazendo rebuild completo (sem cache) para pegar atualizações do GitHub..."
docker compose build --no-cache --pull

echo "4. Iniciando container..."
docker compose up -d

echo "5. Verificando status..."
sleep 2
docker ps | grep museu-3d-app || echo "Container não está rodando!"

echo ""
echo "=== Logs do container ==="
docker compose logs --tail=20 museu-3d

echo ""
echo "Atualização concluída!"
echo "Acesse: http://extensaoads.sj.ifsc.edu.br:3001"

