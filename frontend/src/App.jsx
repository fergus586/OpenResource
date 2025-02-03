import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import styled from 'styled-components';

const AppContainer = styled.div`
  width: 100vw;
  height: 100vh;
  background: #f0f2f5;
`;

const CanvasContainer = styled.div`
  width: 100%;
  height: 100%;
`;

const Title = styled.h1`
  position: absolute;
  top: 20px;
  left: 20px;
  color: #333;
  z-index: 1;
  margin: 0;
  font-size: 24px;
`;

function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#007bff" />
      </mesh>
    </>
  );
}

function App() {
  return (
    <AppContainer>
      <Title>OpenResource</Title>
      <CanvasContainer>
        <Canvas camera={{ position: [3, 3, 5], fov: 50 }}>
          <Scene />
          <OrbitControls enableDamping dampingFactor={0.05} />
        </Canvas>
      </CanvasContainer>
    </AppContainer>
  );
}

export default App;
