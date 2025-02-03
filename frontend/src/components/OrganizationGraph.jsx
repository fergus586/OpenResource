import React, { useMemo } from 'react';
import { Line, Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const testData = {
  nodes: [
    // CEO at top
    { id: 1, name: 'CEO', position: [0, 15, 0], color: '#FF6B6B' },
    
    // C-Suite Level (forming a triangle)
    { id: 2, name: 'CTO', position: [-8, 10, -6], color: '#4ECDC4' },
    { id: 3, name: 'COO', position: [8, 10, -6], color: '#45B7D1' },
    { id: 4, name: 'CFO', position: [0, 10, 8], color: '#96CEB4' },
    
    // Technology Branch (extending down-left)
    { id: 5, name: 'Head of Engineering', position: [-12, 7, -9], color: '#4ECDC4' },
    { id: 6, name: 'Head of Product', position: [-6, 7, -9], color: '#4ECDC4' },
    { id: 7, name: 'Dev Team Lead', position: [-14, 4, -12], color: '#4ECDC4' },
    { id: 8, name: 'QA Lead', position: [-10, 4, -12], color: '#4ECDC4' },
    { id: 9, name: 'Product Manager', position: [-6, 4, -12], color: '#4ECDC4' },
    { id: 10, name: 'Senior Developer', position: [-14, 1, -15], color: '#4ECDC4' },
    { id: 11, name: 'Junior Developer', position: [-10, 1, -15], color: '#4ECDC4' },
    
    // Operations Branch (extending down-right)
    { id: 12, name: 'Supply Chain Director', position: [12, 7, -9], color: '#45B7D1' },
    { id: 13, name: 'Operations Manager', position: [6, 7, -9], color: '#45B7D1' },
    { id: 14, name: 'Logistics Lead', position: [14, 4, -12], color: '#45B7D1' },
    { id: 15, name: 'Warehouse Manager', position: [10, 4, -12], color: '#45B7D1' },
    { id: 16, name: 'Quality Control', position: [6, 4, -12], color: '#45B7D1' },
    { id: 17, name: 'Logistics Coordinator', position: [14, 1, -15], color: '#45B7D1' },
    { id: 18, name: 'Warehouse Staff', position: [10, 1, -15], color: '#45B7D1' },
    
    // Finance Branch (extending down-back)
    { id: 19, name: 'Controller', position: [-3, 7, 12], color: '#96CEB4' },
    { id: 20, name: 'Head of Accounting', position: [3, 7, 12], color: '#96CEB4' },
    { id: 21, name: 'Financial Analyst', position: [-4, 4, 15], color: '#96CEB4' },
    { id: 22, name: 'Senior Accountant', position: [0, 4, 15], color: '#96CEB4' },
    { id: 23, name: 'Budget Manager', position: [4, 4, 15], color: '#96CEB4' },
    { id: 24, name: 'Junior Analyst', position: [-2, 1, 18], color: '#96CEB4' },
    { id: 25, name: 'Junior Accountant', position: [2, 1, 18], color: '#96CEB4' },
  ],
  links: [
    // CEO to C-Suite
    { source: 1, target: 2, type: 'manages' },
    { source: 1, target: 3, type: 'manages' },
    { source: 1, target: 4, type: 'manages' },
    
    // CTO Branch
    { source: 2, target: 5, type: 'manages' },
    { source: 2, target: 6, type: 'manages' },
    { source: 5, target: 7, type: 'manages' },
    { source: 5, target: 8, type: 'manages' },
    { source: 6, target: 9, type: 'manages' },
    { source: 7, target: 10, type: 'manages' },
    { source: 8, target: 11, type: 'manages' },
    
    // COO Branch
    { source: 3, target: 12, type: 'manages' },
    { source: 3, target: 13, type: 'manages' },
    { source: 12, target: 14, type: 'manages' },
    { source: 12, target: 15, type: 'manages' },
    { source: 13, target: 16, type: 'manages' },
    { source: 14, target: 17, type: 'manages' },
    { source: 15, target: 18, type: 'manages' },
    
    // CFO Branch
    { source: 4, target: 19, type: 'manages' },
    { source: 4, target: 20, type: 'manages' },
    { source: 19, target: 21, type: 'manages' },
    { source: 19, target: 22, type: 'manages' },
    { source: 20, target: 23, type: 'manages' },
    { source: 21, target: 24, type: 'manages' },
    { source: 22, target: 25, type: 'manages' },
    
    // Cross-department collaborations
    { source: 7, target: 14, type: 'collaborates' },  // Dev Lead to Logistics
    { source: 21, target: 16, type: 'collaborates' }, // Financial Analyst to Quality Control
    { source: 9, target: 23, type: 'collaborates' },  // Product Manager to Budget Manager
  ]
};

function PersonNode({ position, color, name }) {
  const [hover, setHover] = React.useState(false);

  return (
    <group position={position}>
      <mesh
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
        scale={hover ? 1.2 : 1}
      >
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial 
          color={hover ? '#ffffff' : color}
          roughness={0.5}
          metalness={0.5}
        />
      </mesh>
      <Html
        position={[0, 0.8, 0]}
        center
        sprite
        transform
        occlude
      >
        <div style={{ 
          background: 'rgba(0,0,0,0.8)', 
          color: 'white', 
          padding: '4px 8px', 
          borderRadius: '4px',
          fontSize: '12px',
          whiteSpace: 'nowrap',
          userSelect: 'none'
        }}>
          {name}
        </div>
      </Html>
    </group>
  );
}

function ConnectionLine({ start, end, type }) {
  const curve = useMemo(() => {
    const startVec = new THREE.Vector3(...start);
    const endVec = new THREE.Vector3(...end);
    
    // Calculate middle point with an offset based on distance
    const midPoint = new THREE.Vector3().addVectors(startVec, endVec).multiplyScalar(0.5);
    const distance = startVec.distanceTo(endVec);
    
    // Add some vertical lift and random offset to make lines more distinct
    midPoint.y += distance * 0.2;
    midPoint.x += (Math.random() - 0.5) * 0.5;
    midPoint.z += (Math.random() - 0.5) * 0.5;
    
    // Create a smooth curve through the points
    const curve = new THREE.CatmullRomCurve3([
      startVec,
      midPoint,
      endVec
    ]);
    
    return curve.getPoints(50);
  }, [start, end]);

  const colors = {
    manages: '#FF6B6B',
    leads: '#4ECDC4',
    uses: '#FFE66D',
    collaborates: '#45B7D1',
    connects: '#96CEB4'
  };

  return (
    <Line
      points={curve}
      color={colors[type] || '#666666'}
      lineWidth={2}
      dashed={type === 'collaborates'}
      transparent
      opacity={0.8}
    />
  );
}

export function OrganizationGraph() {
  const nodeRefs = useMemo(() => 
    testData.nodes.reduce((acc, node) => {
      acc[node.id] = React.createRef();
      return acc;
    }, {}),
    []
  );

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    testData.nodes.forEach((node) => {
      if (nodeRefs[node.id].current) {
        // Add subtle floating animation in all dimensions
        nodeRefs[node.id].current.position.y += Math.sin(t + node.id) * 0.001;
        nodeRefs[node.id].current.position.x += Math.sin(t * 0.8 + node.id) * 0.0005;
        nodeRefs[node.id].current.position.z += Math.cos(t * 0.9 + node.id) * 0.0005;
      }
    });
  });

  return (
    <group>
      {/* Draw connections first */}
      {testData.links.map((link, index) => {
        const sourceNode = testData.nodes.find(n => n.id === link.source);
        const targetNode = testData.nodes.find(n => n.id === link.target);
        return (
          <ConnectionLine
            key={`line-${index}`}
            start={sourceNode.position}
            end={targetNode.position}
            type={link.type}
          />
        );
      })}
      
      {/* Draw nodes */}
      {testData.nodes.map((node) => (
        <PersonNode
          key={node.id}
          ref={nodeRefs[node.id]}
          position={node.position}
          color={node.color}
          name={node.name}
        />
      ))}
    </group>
  );
}
