import React, { useState, Suspense } from 'react';
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
      return null; // Retorna null para que o erro seja tratado pelo ModelCard
    }
    return this.props.children;
  }
}

// Componente para carregar e exibir modelo 3D
function Model({ path, position = [0, 0, 0], rotation = [0, 0, 0], onError }) {
  const { scene } = useGLTF(path);
  
  React.useEffect(() => {
    try {
      scene.traverse((child) => {
        if (child.isMesh) {
          const originalMaterial = child.material;
          const isArray = Array.isArray(originalMaterial);
          const materialToProcess = isArray ? originalMaterial[0] : originalMaterial;
          
          // Verifica se o material existe antes de processar
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
            // Material padrão se não houver material
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
    } catch (error) {
      console.error('Erro ao processar material:', error);
      if (onError) onError(error);
    }
  }, [scene, onError]);

  return <primitive object={scene} scale={2} position={position} rotation={rotation} />;
}

// Componente para cada card de modelo
function ModelCard({ modelName, modelPath, position, rotation }) {
  const [error, setError] = useState(false);
  const canvasRef = React.useRef(null);

  return (
    <div className="model-card">
      <div className="canvas-container">
        <Canvas
          ref={canvasRef}
          camera={{ position: [0, 1, 3], fov: 50 }}
          shadows
          frameloop="demand"
          dpr={[1, 2]}
          gl={{ 
            preserveDrawingBuffer: false,
            powerPreference: "high-performance",
            antialias: true,
            alpha: true
          }}
          onError={() => setError(true)}
        >
          {/* Luz ambiente mais intensa */}
          <ambientLight intensity={1.5} />
          
          {/* Luz principal fixa - sempre na mesma posição relativa */}
          <directionalLight 
            position={[5, 5, 5]}  // Posição fixa relativa
            intensity={1.8}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-camera-far={50}
            shadow-camera-left={-10}
            shadow-camera-right={10}
            shadow-camera-top={10}
            shadow-camera-bottom={-10}
            shadow-bias={-0.0005}
          />
          
          {/* Luzes de preenchimento para eliminar sombras escuras */}
          <pointLight 
            position={[-3, 2, -2]} 
            intensity={0.6} 
            color="#ffffff"
          />
          <pointLight 
            position={[3, 2, 2]} 
            intensity={0.4} 
            color="#ffffff"
          />
          <pointLight 
            position={[0, 3, 0]} 
            intensity={0.5} 
            color="#ffffff"
          />

          {/* Modelo 3D */}
          <Suspense fallback={null}>
            {!error && (
              <ModelErrorBoundary>
                <Model 
                  path={modelPath} 
                  position={position} 
                  rotation={rotation}
                  onError={() => setError(true)}
                />
              </ModelErrorBoundary>
            )}
          </Suspense>

          {/* Controles de câmera */}
          <OrbitControls 
            enableZoom={true}
            enablePan={true}
            enableRotate={true}
            autoRotate={false}
            maxPolarAngle={Math.PI / 2}
            onChange={() => {
              // Força renderização quando há interação
              if (canvasRef.current) {
                canvasRef.current.requestRender();
              }
            }}
          />
        </Canvas>

        {error && (
          <div className="error">
            ❌ Erro ao carregar o modelo<br />
            Verifique se o arquivo existe em: {modelPath}
          </div>
        )}
      </div>

      <div className="model-info">
        <h3 className="model-title">{modelName}</h3>
      </div>
    </div>
  );
}

// Componente principal
function App() {
  const [currentPage, setCurrentPage] = useState(1);
  const modelsPerPage = 3;
  
  const models = [
    { 
      name: 'Vaso', 
      file: 'vaso.glb',
      position: [0, 0, 0],
      rotation: [0, 0, 0]
    },
    { 
      name: 'Barro', 
      file: 'barro.glb',
      position: [0, 0, 0],
      rotation: [0, 0, 0]
    },
    { 
      name: 'Bule', 
      file: 'bule.glb',
      position: [0, 0, 0],
      rotation: [0, 0, 0]
    },
    { 
      name: 'Cadeira', 
      file: 'cadeira.glb',
      position: [0, 0, 0],
      rotation: [0, 0, 0]
    },
    { 
      name: 'Canoa', 
      file: 'canoa.glb',
      position: [0, 0, 0],
      rotation: [0, 0, 0]
    },
    { 
      name: 'Carranca', 
      file: 'carranca.glb',
      position: [0, 0, 0],
      rotation: [0, 0, 0]
    },
    { 
      name: 'Jarro de Metal', 
      file: 'jarroMetal.glb',
      position: [0, 0, 0],
      rotation: [0, 0, 0]
    },
    { 
      name: 'Lampião', 
      file: 'lampiao.glb',
      position: [0, 0, 0],
      rotation: [0, 0, 0]
    },
    { 
      name: 'Tigre', 
      file: 'tigre.glb',
      position: [0, 0, 0],
      rotation: [0, 0, 0]
    },
    { 
      name: 'Balaio', 
      file: 'balaio.glb',
      position: [0, 0, 0],
      rotation: [0, 0, 0]
    },
    { 
      name: 'chapeu', 
      file: '/Sprint5/chapeu.glb',
      position: [0, -2, 0],
      rotation: [0, 0, 0]
    },
    { 
      name: 'coador de café', 
      file: '/Sprint5/coador_cafe.glb',
      position: [0, -1, 0],
      rotation: [0, 0, 0]
    },
    { 
      name: 'cranio', 
      file: '/Sprint5/cranio_onca.glb',
      position: [0, -0.5, 0],
      rotation: [0, 0, 0]
    },
    { 
      name: 'ferro', 
      file: '/Sprint5/ferro.glb',
      position: [0, -1, 0],
      rotation: [0, 0, 0]
    },
    { 
      name: 'mascara homem', 
      file: '/Sprint5/mascara_homem.glb',
      position: [0, -1.3, 0],
      rotation: [0, 0, 0]
    },
    { 
      name: 'mascara macaco', 
      file: '/Sprint5/mascara_macaco.glb',
      position: [0, -1.3, 0],
      rotation: [0, 0, 0]
    },
    { 
      name: 'vela mesa', 
      file: '/Sprint5/vela_mesa.glb',
      position: [0, -1.2, 0],
      rotation: [0, 0, 0]
    },
  ];

  // Calcular índices dos modelos para a página atual
  const totalPages = Math.ceil(models.length / modelsPerPage);
  const startIndex = (currentPage - 1) * modelsPerPage;
  const endIndex = startIndex + modelsPerPage;
  const currentModels = models.slice(startIndex, endIndex);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      // Scroll para o topo quando mudar de página
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="app-container">
      <h1 className="app-title">🏛️ Galeria de Modelos 3D</h1>
      
      <div className="models-grid">
        {currentModels.map((model, index) => (
          <ModelCard
            key={startIndex + index}
            modelName={model.name}
            modelPath={`/models/${model.file}`}
            position={model.position}
            rotation={model.rotation}
          />
        ))}
      </div>

      {/* Controles de paginação */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        gap: '10px', 
        marginTop: '30px',
        marginBottom: '20px'
      }}>
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
            backgroundColor: currentPage === 1 ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            opacity: currentPage === 1 ? 0.5 : 1
          }}
        >
          ← Anterior
        </button>
        
        <span style={{ 
          padding: '10px 20px', 
          fontSize: '16px',
          fontWeight: 'bold'
        }}>
          Página {currentPage} de {totalPages}
        </span>
        
        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
            backgroundColor: currentPage === totalPages ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            opacity: currentPage === totalPages ? 0.5 : 1
          }}
        >
          Próxima →
        </button>
      </div>

      {/* Indicadores de página */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '8px',
        flexWrap: 'wrap',
        marginBottom: '20px'
      }}>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => goToPage(page)}
            style={{
              width: '35px',
              height: '35px',
              fontSize: '14px',
              cursor: 'pointer',
              backgroundColor: currentPage === page ? '#007bff' : '#e0e0e0',
              color: currentPage === page ? 'white' : '#333',
              border: 'none',
              borderRadius: '5px',
              fontWeight: currentPage === page ? 'bold' : 'normal'
            }}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  );
}

export default App;