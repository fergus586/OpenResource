import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import styled from 'styled-components';
import { OrganizationGraph } from './components/OrganizationGraph';

const AppContainer = styled.div`
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%);
  color: #ffffff;
`;

const CanvasContainer = styled.div`
  width: 100%;
  height: 100%;
`;

const Title = styled.h1`
  position: absolute;
  top: 20px;
  left: 20px;
  color: #ffffff;
  z-index: 1;
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  font-size: 24px;
  font-weight: 500;
  letter-spacing: -0.5px;
  opacity: 0.9;
`;

const Instructions = styled.div`
  position: absolute;
  bottom: 20px;
  left: 20px;
  color: #ffffff;
  z-index: 1;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  font-size: 13px;
  line-height: 1.5;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  padding: 12px 16px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.2);
`;

function App() {
  return (
    <AppContainer>
      <Title>OpenResource</Title>
      <Instructions>
        🖱️ Left click + drag to rotate<br/>
        🖱️ Right click + drag to pan<br/>
        🖱️ Scroll to zoom<br/>
        Hover over nodes to see details
      </Instructions>
      <CanvasContainer>
        <Canvas 
          camera={{ 
            position: [20, 20, 20], 
            fov: 45,
            near: 0.1,
            far: 1000
          }}
          dpr={[1, 2]} // Better rendering on retina displays
          gl={{ 
            antialias: true,
            alpha: true,
            powerPreference: "high-performance"
          }}
        >
          <color attach="background" args={['#000000']} />
          <fog attach="fog" args={['#000000', 20, 90]} /> {/* Depth fog effect */}
          
          {/* Lighting */}
          <ambientLight intensity={0.4} />
          <pointLight position={[10, 10, 10]} intensity={0.5} />
          <pointLight position={[-10, -10, -10]} intensity={0.3} />
          <directionalLight position={[0, 10, 0]} intensity={0.5} />
          
          {/* Main content */}
          <OrganizationGraph />
          
          {/* Controls */}
          <OrbitControls 
            enableDamping 
            dampingFactor={0.05}
            rotateSpeed={0.5}
            minDistance={10}
            maxDistance={50}
            maxPolarAngle={Math.PI / 1.5}
            minPolarAngle={Math.PI / 6}
          />
          
          {/* Environment lighting */}
          <Environment preset="city" />
        </Canvas>
      </CanvasContainer>
    </AppContainer>
  );
}

export default App;
