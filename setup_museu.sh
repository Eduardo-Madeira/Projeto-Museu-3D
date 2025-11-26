#!/bin/bash

# Script para configurar e rodar o Projeto Museu 3D em um container Docker

set -e  # Parar em caso de erro

echo "🐳 Iniciando setup do Projeto Museu 3D em Docker..."
echo ""

# Etapa 1: Criar e rodar container Ubuntu de forma interativa
echo "1️⃣  Criando e iniciando container Ubuntu..."
docker run -it \
  --name museu-3d-container \
  -p 3000:3000 \
  ubuntu:latest \
  bash -c "
    echo '✅ Container iniciado com sucesso!'
    echo ''
    
    # Atualizar pacotes do sistema
    echo '2️⃣  Atualizando pacotes do sistema...'
    apt-get update && apt-get upgrade -y
    
    # Etapa 3: Instalar Git
    echo ''
    echo '3️⃣  Instalando Git...'
    apt-get install -y git
    echo '✅ Git instalado!'
    echo ''
    
    # Etapa 4: Clonar repositório
    echo '4️⃣  Clonando repositório...'
    git clone https://github.com/Eduardo-Madeira/Projeto-Museu-3D.git
    echo '✅ Repositório clonado!'
    echo ''
    
    # Instalar Node.js e npm
    echo '📦 Instalando Node.js e npm...'
    apt-get install -y curl
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    apt-get install -y nodejs
    echo '✅ Node.js e npm instalados!'
    echo ''
    
    # Etapa 5: Instalar dependências e rodar projeto
    echo '5️⃣  Navegando até o diretório do projeto...'
    cd Projeto-Museu-3D
    echo '✅ Diretório alterado!'
    echo ''
    
    echo '📥 Instalando dependências do projeto...'
    npm install
    echo '✅ Dependências instaladas!'
    echo ''
    
    echo '🚀 Iniciando o servidor do projeto...'
    echo '📍 Acesse: http://localhost:3000'
    echo ''
    npm start
  "

echo ""
echo "✨ Processo concluído!"
