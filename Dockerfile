# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# Instala git e clona o repositório (sempre pega a versão mais recente)
RUN apk add --no-cache git && \
    git clone --depth 1 https://github.com/Eduardo-Madeira/Projeto-Museu-3D.git . && \
    npm install && \
    npm run build && \
    # Limpa cache do npm e node_modules para economizar espaço
    rm -rf node_modules && \
    npm cache clean --force && \
    # Remove git para economizar espaço
    rm -rf .git

# Stage 2: Production
FROM node:18-alpine

WORKDIR /app

# Instala serve globalmente
RUN npm install -g serve

# Copia os arquivos buildados
COPY --from=builder /app/build ./build

# Expõe a porta 3001
EXPOSE 3001

# Comando para iniciar o servidor
CMD ["serve", "-s", "build", "-l", "3001"]

