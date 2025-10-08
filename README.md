# 🏛️ Projeto Museu 3D

Uma galeria interativa de modelos 3D desenvolvida com React e Three.js, criada para exibir artefatos de museu em um ambiente web imersivo.

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:

- **Node.js** (versão 14.0 ou superior)
- **npm** (geralmente vem com o Node.js)
- **Git**


## 🚀 Como clonar e executar o projeto

### 1. **Clone o repositório**
```bash
git clone https://github.com/Eduardo-Madeira/Projeto-Museu-3D.git
```

### 2. **Navegue até o diretório do projeto**
```bash
cd Projeto-Museu-3D
```

### 3. **Instale as dependências**
```bash
npm install
```

### 4. **Execute o projeto**
```bash
npm start
```

### 6. **Acesse no navegador**
Abra [http://localhost:3000](http://localhost:3000) para visualizar o projeto.

## 📁 Estrutura do projeto

```
Projeto-Museu-3D/
├── public/
│   ├── models/          # Seus arquivos .glb aqui
│   ├── index.html
│   └── ...
├── src/
│   ├── App.js          # Componente principal
│   ├── App.css         # Estilos
│   ├── index.js
│   └── ...
├── package.json
└── README.md
```

## 🎯 Funcionalidades

- ✅ **Visualização 3D interativa** - Rotação, zoom e panorâmica
- ✅ **Múltiplos modelos** - Suporte para vários arquivos .glb
- ✅ **Iluminação realista** - Sistema de luzes e sombras
- ✅ **Interface responsiva** - Funciona em desktop e mobile
- ✅ **Carregamento otimizado** - Lazy loading dos modelos 3D

## 🛠️ Tecnologias utilizadas

- **React** - Framework JavaScript
- **Three.js** - Biblioteca 3D
- **@react-three/fiber** - React renderer para Three.js
- **@react-three/drei** - Utilitários para React Three Fiber

## 📝 Como adicionar novos modelos

1. **Coloque o arquivo .glb** na pasta `public/models/`
2. **Edite o array `models`** em `src/App.js`:

```jsx
const models = [
  { 
    name: 'Seu Modelo', 
    file: 'seu_arquivo.glb',
    position: [0, 0, 0],
    rotation: [0, 0, 0]
  },
  // ... outros modelos
];
```

## 🎨 Personalização

### **Alterar iluminação:**
```jsx
// Em src/App.js - seção de luzes
<ambientLight intensity={0.4} />
<directionalLight position={[5, 5, 5]} intensity={1.5} />
```

### **Modificar posição da câmera:**
```jsx
// Em src/App.js - configuração do Canvas
camera={{ position: [0, 1, 3], fov: 50 }}
```

### **Ajustar posição de modelos específicos:**
```jsx
// No array models
position: [0, -1, 0]  // [x, y, z]
```

## �� Comandos disponíveis

```bash
npm start          # Inicia o servidor de desenvolvimento
npm run build      # Cria build de produção
npm test           # Executa os testes
npm run eject      # Remove dependência do Create React App
```

## 📱 Controles de navegação

- **Rotação**: Clique e arraste
- **Zoom**: Scroll do mouse ou pinch (mobile)
- **Panorâmica**: Clique direito + arraste (ou dois dedos no mobile)

## ⚠️ Solução de problemas

### **Erro "Could not load model":**
- Verifique se o arquivo .glb está na pasta `public/models/`
- Confirme se o nome do arquivo no código corresponde ao arquivo real

### **Modelos não aparecem:**
- Verifique o console do navegador (F12) para erros
- Teste com modelos .glb de exemplo primeiro





---