# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# Instala git e clona o repositório
RUN apk add --no-cache git && \
    git clone https://github.com/Eduardo-Madeira/Projeto-Museu-3D.git . && \
    npm install

# Build da aplicação
RUN npm run build

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

