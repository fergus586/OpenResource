import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import styled from 'styled-components';
import { OrganizationGraph } from './components/OrganizationGraph';

const AppContainer = styled.div`
  width: 100vw;
  height: 100vh;
  background: #1a1a1a;
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
  font-size: 24px;
`;

const Instructions = styled.div`
  position: absolute;
  bottom: 20px;
  left: 20px;
  color: #ffffff;
  z-index: 1;
  font-size: 14px;
  background: rgba(0, 0, 0, 0.5);
  padding: 10px;
  border-radius: 5px;
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
            position: [15, 15, 15], 
            fov: 50,
            near: 0.1,
            far: 1000
          }}
        >
          <color attach="background" args={['#1a1a1a']} />
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <directionalLight position={[-10, -10, -5]} intensity={0.3} />
          <OrganizationGraph />
          <OrbitControls 
            enableDamping 
            dampingFactor={0.05} 
            minDistance={5}
            maxDistance={50}
            maxPolarAngle={Math.PI / 1.5}
            minPolarAngle={Math.PI / 6}
          />
        </Canvas>
      </CanvasContainer>
    </AppContainer>
  );
}

export default App;
