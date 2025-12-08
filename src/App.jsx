import React, { useState, Suspense, useEffect, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import './App.css';

// Error Boundary para capturar erros de carregamento
class ModelErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Erro ao carregar modelo:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="model-error">
          <span>❌ Erro ao carregar</span>
        </div>
      );
    }
    return this.props.children;
  }
}

// Componente para carregar e exibir modelo 3D
function Model({ path, position = [0, 0, 0], rotation = [0, 0, 0] }) {
  const { scene } = useGLTF(path);
  
  useEffect(() => {
    // Clonar a cena para evitar problemas de reutilização
    const clonedScene = scene.clone(true);
    
    clonedScene.traverse((child) => {
        if (child.isMesh) {
          const originalMaterial = child.material;
          const isArray = Array.isArray(originalMaterial);
          const materialToProcess = isArray ? originalMaterial[0] : originalMaterial;
          
          if (materialToProcess) {
            child.material = new THREE.MeshStandardMaterial({
              map: materialToProcess?.map || null,
              color: materialToProcess?.color || '#ffffff',
              roughness: 0.3,
              metalness: 0.1,
              emissive: '#000000',
              emissiveIntensity: 0.1,
            });
          } else {
            child.material = new THREE.MeshStandardMaterial({
              color: '#ffffff',
              roughness: 0.3,
              metalness: 0.1,
            });
          }
          
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
  }, [scene]);

  return <primitive object={scene} scale={2} position={position} rotation={rotation} />;
}

// Componente do Modal para visualização 3D
function ModelViewer({ model, onClose }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Limpar cache do modelo quando fechar
  useEffect(() => {
    return () => {
      // Limpar recursos WebGL quando o modal fechar
      const modelPath = `/models/${model.file}`;
      useGLTF.clear(modelPath);
    };
  }, [model.file]);

  // Fechar com ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  // Prevenir scroll do body quando modal estiver aberto
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>
        
        <h2 className="modal-title">{model.name}</h2>
        
        <div className="modal-canvas-container">
          {loading && !error && (
            <div className="modal-loading">
              <div className="spinner"></div>
              <span>Carregando modelo 3D...</span>
            </div>
          )}
          
          {error && (
            <div className="modal-error">
              <span>❌ Erro ao carregar o modelo</span>
              <p>Verifique se o arquivo existe</p>
            </div>
          )}
          
        <Canvas
          camera={{ position: [0, 1, 3], fov: 50 }}
          shadows
          frameloop="demand"
            dpr={[1, 1.5]} // Reduzido para melhor performance
          gl={{ 
            preserveDrawingBuffer: false,
            powerPreference: "high-performance",
            antialias: true,
              alpha: true,
              failIfMajorPerformanceCaveat: false
            }}
            onCreated={() => setLoading(false)}
            onError={() => {
              setError(true);
              setLoading(false);
            }}
            style={{ opacity: loading ? 0 : 1 }}
          >
          <ambientLight intensity={1.5} />
          
          <directionalLight 
              position={[5, 5, 5]}
            intensity={1.8}
            castShadow
              shadow-mapSize-width={1024}
              shadow-mapSize-height={1024}
            shadow-camera-far={50}
            shadow-camera-left={-10}
            shadow-camera-right={10}
            shadow-camera-top={10}
            shadow-camera-bottom={-10}
          />
          
            <pointLight position={[-3, 2, -2]} intensity={0.6} color="#ffffff" />
            <pointLight position={[3, 2, 2]} intensity={0.4} color="#ffffff" />
            <pointLight position={[0, 3, 0]} intensity={0.5} color="#ffffff" />

          <Suspense fallback={null}>
              <ModelErrorBoundary>
                <Model 
                  path={`/models/${model.file}`}
                  position={model.position} 
                  rotation={model.rotation}
                />
              </ModelErrorBoundary>
          </Suspense>

            <OrbitControls 
              enableZoom={true}
              enablePan={true}
              enableRotate={true}
              autoRotate={false}
              maxPolarAngle={Math.PI / 2}
            />
        </Canvas>
        </div>
        
        <p className="modal-instructions">
          🖱️ Arraste para rotacionar • Scroll para zoom • Shift+Arraste para mover
        </p>
      </div>
    </div>
  );
}

// Card de preview do modelo (com thumbnail)
function ModelCard({ model, onClick }) {
  const [imageError, setImageError] = useState(false);
  
  // Usa o thumbnail definido no modelo
  const thumbnailPath = `/thumbnails/${model.thumbnail}`;
  
  return (
    <div className="model-card" onClick={onClick}>
      <div className="card-preview">
        {!imageError ? (
          <img 
            src={thumbnailPath}
            alt={model.name}
            className="preview-image"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="preview-placeholder">
            <div className="preview-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 16.5V8.25A2.25 2.25 0 0018.75 6H5.25A2.25 2.25 0 003 8.25v8.25A2.25 2.25 0 005.25 18.75h13.5A2.25 2.25 0 0021 16.5z" />
                <path d="M12 6V3.75A.75.75 0 0012.75 3h.75" />
                <path d="M12 6l-3 3m3-3l3 3" />
                <circle cx="12" cy="13" r="2.5" />
              </svg>
            </div>
          </div>
        )}
        <div className="preview-overlay">
          <span className="preview-label">👆 Clique para ver em 3D</span>
        </div>
      </div>

      <div className="model-info">
        <h3 className="model-title">{model.name}</h3>
      </div>
    </div>
  );
}

// Componente principal
function App() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedModel, setSelectedModel] = useState(null);
  const modelsPerPage = 6; // Aumentado já que não há mais renderização pesada
  
  const models = [
    // Modelos originais
    { name: 'Jarro de Barro', file: 'jarroBarro.glb', thumbnail: 'jarroBarro.webp', position: [0, 0, 0], rotation: [0, 0, 0] },
    { name: 'Barro', file: 'barro.glb', thumbnail: 'barro.webp', position: [0, 0, 0], rotation: [0, 0, 0] },
    { name: 'Bule', file: 'bule.glb', thumbnail: 'bule.webp', position: [0, 0, 0], rotation: [0, 0, 0] },
    { name: 'Cadeira', file: 'cadeira.glb', thumbnail: 'cadeira.webp', position: [0, 0, 0], rotation: [0, 0, 0] },
    { name: 'Canoa', file: 'canoa.glb', thumbnail: 'canoa.webp', position: [0, 0, 0], rotation: [0, 0, 0] },
    { name: 'Carranca', file: 'carranca.glb', thumbnail: 'Carranca.webp', position: [0, 0, 0], rotation: [0, 0, 0] },
    { name: 'Jarro de Metal', file: 'jarroMetal.glb', thumbnail: 'jarroMetal.webp', position: [0, 0, 0], rotation: [0, 0, 0] },
    { name: 'Lampião', file: 'lampiao.glb', thumbnail: 'lampiao.webp', position: [0, 0, 0], rotation: [0, 0, 0] },
    { name: 'Tigre', file: 'tigre.glb', thumbnail: 'tigre.webp', position: [0, 0, 0], rotation: [0, 0, 0] },
    { name: 'Balaio', file: 'balaio.glb', thumbnail: 'balaio.webp', position: [0, 0, 0], rotation: [0, 0, 0] },
    { name: 'Chapéu', file: 'chapeu.glb', thumbnail: 'chapeu.webp', position: [0, -2, 0], rotation: [0, 0, 0] },
    { name: 'Coador de Café', file: 'coador_cafe.glb', thumbnail: 'coadorCafe.webp', position: [0, -1, 0], rotation: [0, 0, 0] },
    { name: 'Crânio de Onça', file: 'cranio_onca.glb', thumbnail: 'cranioOnca.webp', position: [0, -0.5, 0], rotation: [0, 0, 0] },
    { name: 'Ferro', file: 'ferro.glb', thumbnail: 'ferro.webp', position: [0, -1, 0], rotation: [0, 0, 0] },
    { name: 'Máscara Homem', file: 'mascara_homem.glb', thumbnail: 'mascaraHomem.webp', position: [0, -1.3, 0], rotation: [0, 0, 0] },
    { name: 'Máscara Macaco', file: 'mascara_macaco.glb', thumbnail: 'mascaraMacaco.webp', position: [0, -1.3, 0], rotation: [0, 0, 0] },
    { name: 'Vela de Mesa', file: 'vela_mesa.glb', thumbnail: 'velaMesa.webp', position: [0, -1.2, 0], rotation: [0, 0, 0] },
    // Novos modelos
    { name: 'Caixa Registradora', file: 'caixa_registrado.glb', thumbnail: 'caixaRegistradora.webp', position: [0, -1, 0], rotation: [0, 0, 0] },
    { name: 'Chaleira', file: 'chaleira.glb', thumbnail: 'chaleira.webp', position: [0, -1, 0], rotation: [0, 0, 0] },
    { name: 'Charrete', file: 'charrete.glb', thumbnail: 'charrete.webp', position: [0, -1, 0], rotation: [0, 0, 0] },
    { name: 'Cocar Indígena', file: 'cocar_ind.glb', thumbnail: 'cocarIndigena.webp', position: [0, -1.3, 0], rotation: [0, 0, 0] },
    { name: 'Digitalizadora', file: 'digitalizadora.glb', thumbnail: 'digitalizadora.webp', position: [0, -1, 0], rotation: [0, 0, 0] },
    { name: 'Máquina de Costura', file: 'maquina_costura.glb', thumbnail: 'maquinaCostura.webp', position: [0, -1, 0], rotation: [0, 0, 0] },
    { name: 'Máquina de Vídeo', file: 'maquina_video.glb', thumbnail: 'maquinaVideo.webp', position: [0, -1, 0], rotation: [0, 0, 0] },
    { name: 'Mesa com Cadeira', file: 'mesa_cadeira.glb', thumbnail: 'mesaCadeira.webp', position: [0, -1.2, 0], rotation: [0, 0, 0] },
    { name: 'Telefone de Mesa', file: 'telefone_mesa.glb', thumbnail: 'teleMesa.webp', position: [0, -1, 0], rotation: [0, 0, 0] },
    { name: 'Telefone de Parede', file: 'telefone_parede.glb', thumbnail: 'teleParede.webp', position: [0, -1, 0], rotation: [0, 0, 0] },
  ];

  const totalPages = Math.ceil(models.length / modelsPerPage);
  const startIndex = (currentPage - 1) * modelsPerPage;
  const endIndex = startIndex + modelsPerPage;
  const currentModels = models.slice(startIndex, endIndex);

  const goToPage = useCallback((page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [totalPages]);

  const openModel = useCallback((model) => {
    setSelectedModel(model);
  }, []);

  const closeModel = useCallback(() => {
    setSelectedModel(null);
  }, []);

  return (
    <div className="app-container">
      <h1 className="app-title">🏛️ Galeria de Modelos 3D</h1>
      <p className="app-subtitle">Clique em um item para visualizar o modelo em 3D</p>
      
      <div className="models-grid">
        {currentModels.map((model, index) => (
          <ModelCard
            key={`${model.file}-${startIndex + index}`}
            model={model}
            onClick={() => openModel(model)}
          />
        ))}
      </div>

      {/* Controles de paginação */}
      <div className="pagination">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="pagination-btn"
        >
          ← Anterior
        </button>
        
        <span className="pagination-info">
          Página {currentPage} de {totalPages}
        </span>
        
        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="pagination-btn"
        >
          Próxima →
        </button>
      </div>

      {/* Indicadores de página */}
      <div className="page-indicators">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => goToPage(page)}
            className={`page-indicator ${currentPage === page ? 'active' : ''}`}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Modal de visualização 3D */}
      {selectedModel && (
        <ModelViewer 
          model={selectedModel} 
          onClose={closeModel}
        />
      )}
    </div>
  );
}

export default App;
