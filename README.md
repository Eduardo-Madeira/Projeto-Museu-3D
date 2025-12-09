# 🏛️ Projeto Museu 3D

Uma galeria interativa de modelos 3D desenvolvida com React e Three.js, criada para exibir artefatos de museu em um ambiente web imersivo.

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:

- **Node.js** (versão 14.0 ou superior)
- **npm** (geralmente vem com o Node.js)
- **Git**
- **Docker** (opcional, para deploy em produção)

## 🚀 Como clonar e executar o projeto

### 1. Clone o repositório
```bash
git clone https://github.com/Eduardo-Madeira/Projeto-Museu-3D.git
```

### 2. Navegue até o diretório do projeto
```bash
cd Projeto-Museu-3D
```

### 3. Instale as dependências
```bash
npm install
```

### 4. Execute o projeto
```bash
npm start
```

### 5. Acesse no navegador
Abra [http://localhost:3000](http://localhost:3000) para visualizar o projeto.

---

## 📁 Estrutura do projeto

```
Projeto-Museu-3D/
├── public/
│   ├── models/              # Arquivos .glb dos modelos 3D
│   │   ├── vaso.glb
│   │   ├── bule.glb
│   │   └── ...
│   ├── thumbnails/          # Imagens de preview dos modelos
│   │   ├── vaso.webp
│   │   ├── bule.webp
│   │   └── ...
│   └── index.html
├── src/
│   ├── App.jsx              # Componente principal
│   ├── App.css              # Estilos
│   └── index.js
├── Dockerfile               # Configuração Docker para produção
├── docker-compose.yml       # Orquestração do container
├── atualizar-container.sh   # Script de deploy no servidor IFSC
├── setup_museu.sh           # Script para rodar em máquinas do IFSC
├── package.json
└── README.md
```

---

## 🎯 Funcionalidades

- ✅ **Visualização 3D interativa** - Rotação, zoom e panorâmica
- ✅ **Múltiplos modelos** - Suporte para vários arquivos .glb
- ✅ **Iluminação realista** - Sistema de luzes e sombras
- ✅ **Interface responsiva** - Funciona em desktop e mobile
- ✅ **Lazy Loading** - Modelos 3D carregam apenas quando clicados (evita sobrecarga)
- ✅ **Thumbnails** - Preview das peças com imagens estáticas
- ✅ **Limpeza de memória** - Recursos WebGL liberados automaticamente

---

## 🛠️ Tecnologias utilizadas

- **React** - Framework JavaScript
- **Three.js** - Biblioteca 3D
- **@react-three/fiber** - React renderer para Three.js
- **@react-three/drei** - Utilitários para React Three Fiber
- **Docker** - Containerização para deploy

---

## 📝 Como adicionar novos modelos

### Passo 1: Adicione os arquivos

1. Coloque o arquivo `.glb` na pasta `public/models/`
2. Coloque a imagem de preview (`.webp`, `.jpg` ou `.png`) na pasta `public/thumbnails/`

### Passo 2: Edite o array de modelos

Abra o arquivo `src/App.jsx` e adicione o novo modelo no array `models`:

```jsx
const models = [
  // ... outros modelos
  { 
    name: 'Nome do Modelo',           // Nome que aparece na galeria
    file: 'seu_arquivo.glb',          // Nome do arquivo 3D
    thumbnail: 'seu_arquivo.webp',    // Nome da imagem de preview
    position: [0, -1, 0],             // Posição [x, y, z] - ajuste Y para centralizar
    rotation: [0, 0, 0]               // Rotação [x, y, z]
  },
];
```

### Dicas de posicionamento

- `position: [0, 0, 0]` - Modelo centralizado
- `position: [0, -1, 0]` - Modelo deslocado para baixo (objetos maiores)
- `position: [0, -2, 0]` - Modelo muito deslocado (objetos muito grandes)

---

## 🎨 Personalização

### Alterar iluminação
```jsx
// Em src/App.jsx - dentro do Canvas no ModelViewer
<ambientLight intensity={1.5} />
<directionalLight position={[5, 5, 5]} intensity={1.8} />
```

### Modificar posição da câmera
```jsx
// Em src/App.jsx - configuração do Canvas
camera={{ position: [0, 1, 3], fov: 50 }}
```

### Ajustar quantidade de modelos por página
```jsx
// Em src/App.jsx - dentro da função App
const modelsPerPage = 6; // Altere conforme necessário
```

### Personalizar estilo dos cards
Edite o arquivo `src/App.css` para modificar:
- `.model-card` - Estilo do card
- `.card-preview` - Área da thumbnail
- `.modal-content` - Estilo do modal de visualização 3D

---

## 🐳 Docker e Deploy

O projeto utiliza Docker para facilitar o deploy em produção, especialmente no servidor do IFSC.

### Arquivos Docker

| Arquivo | Descrição |
|---------|-----------|
| `Dockerfile` | Build multi-stage otimizado para produção |
| `docker-compose.yml` | Orquestração do container |
| `atualizar-container.sh` | Script de deploy/atualização no servidor |
| `setup_museu.sh` | Script para desenvolvimento em máquinas do IFSC |

---

### 🖥️ Deploy no Servidor de Produção (IFSC)

O arquivo `atualizar-container.sh` automatiza o processo de deploy no servidor do IFSC:

```bash
# No servidor de produção, execute:
./atualizar-container.sh
```

**O que o script faz:**
1. Para e remove o container atual
2. Remove a imagem antiga
3. Faz rebuild completo (sem cache) buscando atualizações do GitHub
4. Inicia o novo container
5. Mostra os logs para verificação

**Acesso em produção:** `http://extensaoads.sj.ifsc.edu.br:3001`

---

### 💻 Desenvolvimento em Máquinas do IFSC

> ⚠️ **Problema:** As máquinas do IFSC não permitem instalação de Node.js/npm diretamente.
> 
> **Solução:** Utilizamos um container Docker com Ubuntu para rodar a aplicação durante o desenvolvimento e apresentações.

O arquivo `setup_museu.sh` cria um ambiente completo dentro de um container Ubuntu:

#### Como usar:

```bash
# 1. Dê permissão de execução ao script
chmod +x setup_museu.sh

# 2. Execute o script
./setup_museu.sh
```

**O que o script faz automaticamente:**
1. Cria um container Ubuntu
2. Atualiza os pacotes do sistema
3. Instala Git e Node.js
4. Clona o repositório
5. Instala as dependências
6. Inicia o servidor na porta 3000

---

### 🔧 Comandos Docker úteis

#### Rodar container Ubuntu de forma interativa (manual)

Se preferir configurar manualmente ou precisar de acesso ao terminal do container:

```bash
# Criar e acessar container Ubuntu interativamente
docker run -it -p 3000:3000 --name museu-dev ubuntu:latest bash
```

Dentro do container:
```bash
# Atualizar sistema
apt-get update && apt-get upgrade -y

# Instalar Git
apt-get install -y git

# Instalar Node.js
apt-get install -y curl
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs

# Clonar e rodar projeto
git clone https://github.com/Eduardo-Madeira/Projeto-Museu-3D.git
cd Projeto-Museu-3D
npm install
npm start
```

#### Outros comandos úteis

```bash
# Listar containers rodando
docker ps

# Parar container
docker stop museu-3d-app

# Ver logs do container
docker logs museu-3d-app

# Acessar terminal de um container rodando
docker exec -it museu-3d-app bash

# Remover todos os containers parados
docker container prune

# Remover imagens não utilizadas
docker image prune
```

---

## 📦 Comandos npm disponíveis

```bash
npm start          # Inicia o servidor de desenvolvimento (porta 3000)
npm run build      # Cria build otimizado para produção
npm test           # Executa os testes
```

---

## 📱 Controles de navegação 3D

| Ação | Desktop | Mobile |
|------|---------|--------|
| Rotacionar | Clique + arraste | Toque + arraste |
| Zoom | Scroll do mouse | Pinch (dois dedos) |
| Mover | Shift + arraste | Dois dedos + arraste |

---

## 👥 Equipe

Projeto desenvolvido para o IFSC - Instituto Federal de Santa Catarina.

 (adicionar a primeira turma e vão adicionando conforme forem fazendo. Qualquer coisa só chamar!)

| Turma 2025/02 |
|---------------|
| Enzo Fagundes Barbi |
| Eduardo Bongiolo Madeira |
| Rafael Araujo Pereira |
---
