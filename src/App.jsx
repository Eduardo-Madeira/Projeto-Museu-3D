import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import './App.css';

// Componente para carregar e exibir modelo 3D
function Model({ path, position = [0, 0, 0], rotation = [0, 0, 0] }) {
  const { scene } = useGLTF(path);
  
  React.useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.material = new THREE.MeshStandardMaterial({
          map: child.material.map,
          color: child.material.color || '#ffffff',
          roughness: 0.5,
          metalness: 0.2,
        });
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [scene]);

  return <primitive object={scene} scale={2} position={position} rotation={rotation} />;
}

// Componente para cada card de modelo
function ModelCard({ modelName, modelPath, position, rotation }) {
  const [error, setError] = useState(false);

  return (
    <div className="model-card">
      <div className="canvas-container">
        <Canvas
          camera={{ position: [0, 1, 3], fov: 50 }}
          shadows
          onError={() => setError(true)}
        >
          {/* Luz ambiente suave */}
          <ambientLight intensity={1} />
          
          {/* Luz principal fixa - sempre na mesma posição relativa */}
          <directionalLight 
            position={[5, 5, 5]}  // Posição fixa relativa
            intensity={1.1}
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
          
          {/* Luz de preenchimento (opcional) */}
          <pointLight 
            position={[-3, 2, -2]} 
            intensity={0.3} 
            color="#ffffff"
          />

          {/* Modelo 3D */}
          <Suspense fallback={null}>
            {!error && <Model path={modelPath} position={position} rotation={rotation} />}
          </Suspense>

          {/* Controles de câmera */}
          <OrbitControls 
            enableZoom={true}
            enablePan={true}
            enableRotate={true}
            autoRotate={false}
            maxPolarAngle={Math.PI / 2}
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
  const models = [
    { 
      name: 'Prato', 
      file: 'model1.glb',
      position: [0, -1, 0],
      rotation: [0, 0, 0]
    },
    { 
      name: 'Modelo 2', 
      file: 'model2.glb',
      position: [0, 0, 0],
      rotation: [0, 0, 0]
    },
    { 
      name: 'Modelo 3', 
      file: 'model3.glb',
      position: [0, 0, 0],
      rotation: [0, 0, 0]
    },
  ];

  return (
    <div className="app-container">
      <h1 className="app-title">🏛️ Galeria de Modelos 3D</h1>
      
      <div className="models-grid">
        {models.map((model, index) => (
          <ModelCard
            key={index}
            modelName={model.name}
            modelPath={`/models/${model.file}`}
            position={model.position}
            rotation={model.rotation}
          />
        ))}
      </div>
    </div>
  );
}

export default App;