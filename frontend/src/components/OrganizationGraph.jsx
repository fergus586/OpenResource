import React, { useMemo, useState } from 'react';
import { Line, Html, Mesh, SphereGeometry, MeshStandardMaterial } from '@react-three/drei';
import * as THREE from 'three';
import styles from './OrganizationGraph.module.css';

const DIVISIONS = {
  COMMERCIAL: 'commercial',
  DEFENSE: 'defense',
  SERVICES: 'services'
};

const LEVELS = {
  CORPORATE: 'corporate',
  DIVISION: 'division',
  REGION: 'region',
  OPERATION: 'operation',
  CUSTOMER: 'customer',
  PLATFORM: 'platform'
};

const testData = {
  nodes: [
    // Corporate Level
    { id: 0, name: 'Boeing', type: 'corporate', position: [0, 15, 0] },
    
    // Division Level
    { id: 1, name: 'Boeing Commercial Airplanes', type: 'division', division: DIVISIONS.COMMERCIAL, position: [-12, 12, -4] },
    { id: 2, name: 'Boeing Defense & Space', type: 'division', division: DIVISIONS.DEFENSE, position: [12, 12, -4] },
    { id: 3, name: 'Boeing Global Services', type: 'division', division: DIVISIONS.SERVICES, position: [0, 12, 12] },
    
    // Commercial Airlines - Left front sector
    { id: 21, name: 'American Airlines', type: 'customer', division: DIVISIONS.COMMERCIAL, position: [-14, 6, -16] },
    { id: 22, name: 'United Airlines', type: 'customer', division: DIVISIONS.COMMERCIAL, position: [-16, 6, -14] },
    { id: 23, name: 'Delta Air Lines', type: 'customer', division: DIVISIONS.COMMERCIAL, position: [-18, 6, -12] },
    { id: 24, name: 'Southwest Airlines', type: 'customer', division: DIVISIONS.COMMERCIAL, position: [-20, 6, -10] },
    
    // Aircraft Types for American Airlines
    { id: 101, name: '737 MAX 8', type: 'aircraft', division: DIVISIONS.COMMERCIAL, position: [-14, 2, -18] },
    { id: 102, name: '777-300ER', type: 'aircraft', division: DIVISIONS.COMMERCIAL, position: [-12, 2, -17] },
    { id: 103, name: '787-8', type: 'aircraft', division: DIVISIONS.COMMERCIAL, position: [-10, 2, -16] },
    { id: 104, name: '787-9', type: 'aircraft', division: DIVISIONS.COMMERCIAL, position: [-8, 2, -15] },
    
    // Aircraft Types for United Airlines
    { id: 105, name: '737 MAX 9', type: 'aircraft', division: DIVISIONS.COMMERCIAL, position: [-16, 2, -12] },
    { id: 106, name: '777-200ER', type: 'aircraft', division: DIVISIONS.COMMERCIAL, position: [-14, 2, -11] },
    { id: 107, name: '787-10', type: 'aircraft', division: DIVISIONS.COMMERCIAL, position: [-12, 2, -10] },
    { id: 108, name: '767-300ER', type: 'aircraft', division: DIVISIONS.COMMERCIAL, position: [-10, 2, -9] },
    
    // Aircraft Types for Delta Air Lines
    { id: 109, name: '737-900ER', type: 'aircraft', division: DIVISIONS.COMMERCIAL, position: [-18, 2, -8] },
    { id: 110, name: '757-200', type: 'aircraft', division: DIVISIONS.COMMERCIAL, position: [-16, 2, -7] },
    { id: 111, name: '767-400ER', type: 'aircraft', division: DIVISIONS.COMMERCIAL, position: [-14, 2, -6] },
    
    // Aircraft Types for Southwest Airlines
    { id: 112, name: '737-700', type: 'aircraft', division: DIVISIONS.COMMERCIAL, position: [-20, 2, -4] },
    { id: 113, name: '737-800', type: 'aircraft', division: DIVISIONS.COMMERCIAL, position: [-18, 2, -3] },
    { id: 114, name: '737 MAX 7', type: 'aircraft', division: DIVISIONS.COMMERCIAL, position: [-16, 2, -2] },
    { id: 115, name: '737 MAX 8', type: 'aircraft', division: DIVISIONS.COMMERCIAL, position: [-14, 2, -1] },
    
    // Regions - Major hubs central but in their respective sectors
    // North America
    { id: 4, name: 'USA', type: 'region', position: [0, 8, 0] }, // Central hub
    { id: 5, name: 'Canada', type: 'region', position: [-8, 8, -8] },
    
    // Europe
    { id: 6, name: 'UK', type: 'region', position: [4, 8, 0] }, // Right sector hub
    { id: 7, name: 'France', type: 'region', position: [12, 8, -8] },
    { id: 8, name: 'Germany', type: 'region', position: [16, 8, -10] },
    
    // Asia Pacific
    { id: 9, name: 'China', type: 'region', position: [-4, 8, 0] }, // Left sector hub
    { id: 10, name: 'Japan', type: 'region', position: [-12, 8, 8] },
    { id: 11, name: 'Australia', type: 'region', position: [8, 8, 8] },
    
    // Commercial Sector (Left Side) ---------------------
    // Operations - Commercial
    { id: 12, name: '737 Program (USA)', type: 'program', division: DIVISIONS.COMMERCIAL, position: [-16, 4, -8] },
    { id: 13, name: '787 Program (USA)', type: 'program', division: DIVISIONS.COMMERCIAL, position: [-18, 4, -6] },
    { id: 14, name: 'Final Assembly (China)', type: 'program', division: DIVISIONS.COMMERCIAL, position: [-20, 4, -4] },
    
    // Defense Sector (Right Side) ---------------------
    // Operations - Defense
    { id: 15, name: 'F-15 Program (USA)', type: 'program', division: DIVISIONS.DEFENSE, position: [16, 4, -8] },
    { id: 16, name: 'Space Systems (USA)', type: 'program', division: DIVISIONS.DEFENSE, position: [18, 4, -6] },
    { id: 17, name: 'Defense Europe', type: 'program', division: DIVISIONS.DEFENSE, position: [20, 4, -4] },
    
    // UK Defense - Right front sector
    { id: 30, name: 'Apache AH-64', type: 'platform', division: DIVISIONS.DEFENSE, position: [14, 2, -16] },
    { id: 31, name: 'Chinook', type: 'platform', division: DIVISIONS.DEFENSE, position: [16, 2, -14] },
    { id: 32, name: 'C-17 Globemaster', type: 'platform', division: DIVISIONS.DEFENSE, position: [18, 2, -12] },
    { id: 33, name: 'P-8 Poseidon', type: 'platform', division: DIVISIONS.DEFENSE, position: [20, 2, -10] },
    
    // US Defense - Right center sector
    { id: 34, name: 'F-15 Eagle', type: 'platform', division: DIVISIONS.DEFENSE, position: [14, 2, -8] },
    { id: 35, name: 'F/A-18 Super Hornet', type: 'platform', division: DIVISIONS.DEFENSE, position: [16, 2, -6] },
    { id: 36, name: 'KC-46 Tanker', type: 'platform', division: DIVISIONS.DEFENSE, position: [18, 2, -4] },
    
    // Australia Defense - Right back sector
    { id: 37, name: 'E-7A Wedgetail', type: 'platform', division: DIVISIONS.DEFENSE, position: [14, 2, 16] },
    { id: 38, name: 'P-8A Poseidon', type: 'platform', division: DIVISIONS.DEFENSE, position: [16, 2, 14] },
    { id: 39, name: 'CH-47F Chinook', type: 'platform', division: DIVISIONS.DEFENSE, position: [18, 2, 12] },
    
    // Services Sector (Back) ---------------------
    // Operations - Services (Back sector)
    { id: 18, name: 'Parts & Distribution', type: 'program', division: DIVISIONS.SERVICES, position: [-4, 4, 16] },
    { id: 19, name: 'Training Services', type: 'program', division: DIVISIONS.SERVICES, position: [0, 4, 18] },
    { id: 20, name: 'Digital Solutions', type: 'program', division: DIVISIONS.SERVICES, position: [4, 4, 20] },
  ],
  links: [
    // Corporate to Divisions
    { source: 0, target: 1 }, // Boeing -> Commercial
    { source: 0, target: 2 }, // Boeing -> Defense
    { source: 0, target: 3 }, // Boeing -> Services
    
    // Divisions to Regions
    // Commercial Division to Regions
    { source: 1, target: 4 }, // Commercial -> USA
    { source: 1, target: 6 }, // Commercial -> UK
    { source: 1, target: 9 }, // Commercial -> China
    
    // Defense Division to Regions
    { source: 2, target: 4 }, // Defense -> USA
    { source: 2, target: 6 }, // Defense -> UK
    { source: 2, target: 11 }, // Defense -> Australia
    
    // Services Division to Regions
    { source: 3, target: 4 }, // Services -> USA
    { source: 3, target: 6 }, // Services -> UK
    { source: 3, target: 9 }, // Services -> China
    { source: 3, target: 11 }, // Services -> Australia
    
    // Commercial Division to Airlines
    { source: 1, target: 21 }, // Commercial -> American
    { source: 1, target: 22 }, // Commercial -> United
    { source: 1, target: 23 }, // Commercial -> Delta
    { source: 1, target: 24 }, // Commercial -> Southwest
    
    // Commercial Programs to Countries
    { source: 12, target: 4 }, // 737 -> USA
    { source: 12, target: 9 }, // 737 -> China (assembly)
    { source: 13, target: 4 }, // 787 -> USA
    { source: 13, target: 9 }, // 787 -> China (parts)
    { source: 14, target: 9 }, // Final Assembly -> China
    
    // Defense Programs to Countries
    { source: 15, target: 4 }, // F-15 Program -> USA
    { source: 15, target: 6 }, // F-15 Program -> UK
    { source: 16, target: 4 }, // Space Systems -> USA
    { source: 17, target: 6 }, // Defense Europe -> UK
    { source: 17, target: 7 }, // Defense Europe -> France
    { source: 17, target: 8 }, // Defense Europe -> Germany
    
    // American Airlines Aircraft
    { source: 21, target: 101 }, // American -> 737 MAX 8
    { source: 21, target: 102 }, // American -> 777-300ER
    { source: 21, target: 103 }, // American -> 787-8
    { source: 21, target: 104 }, // American -> 787-9

    // United Airlines Aircraft
    { source: 22, target: 105 }, // United -> 737 MAX 9
    { source: 22, target: 106 }, // United -> 777-200ER
    { source: 22, target: 107 }, // United -> 787-10
    { source: 22, target: 108 }, // United -> 767-300ER

    // Delta Air Lines Aircraft
    { source: 23, target: 109 }, // Delta -> 737-900ER
    { source: 23, target: 110 }, // Delta -> 757-200
    { source: 23, target: 111 }, // Delta -> 767-400ER

    // Southwest Airlines Aircraft
    { source: 24, target: 112 }, // Southwest -> 737-700
    { source: 24, target: 113 }, // Southwest -> 737-800
    { source: 24, target: 114 }, // Southwest -> 737 MAX 7
    { source: 24, target: 115 }, // Southwest -> 737 MAX 8

    // Cross-airline aircraft links
    // 737 MAX 8 is used by both American and Southwest
    { source: 24, target: 101 }, // Southwest -> 737 MAX 8 (shared with American)
    
    // 787 family cross-usage
    { source: 22, target: 103 }, // United -> 787-8 (shared with American)
    { source: 22, target: 104 }, // United -> 787-9 (shared with American)
    { source: 21, target: 107 }, // American -> 787-10 (shared with United)
    
    // 777 family cross-usage
    { source: 23, target: 102 }, // Delta -> 777-300ER (shared with American)
    { source: 21, target: 106 }, // American -> 777-200ER (shared with United)
    
    // 767 family cross-usage
    { source: 23, target: 108 }, // Delta -> 767-300ER (shared with United)
    
    // 737 family cross-usage
    { source: 22, target: 112 }, // United -> 737-700 (shared with Southwest)
    { source: 21, target: 113 }, // American -> 737-800 (shared with Southwest)
    { source: 23, target: 113 }, // Delta -> 737-800 (shared with Southwest)
    { source: 22, target: 114 }, // United -> 737 MAX 7 (shared with Southwest)
    { source: 21, target: 115 }, // American -> 737 MAX 8 (shared with Southwest)

    // Airlines to Countries
    { source: 21, target: 4 }, // American -> USA
    { source: 22, target: 4 }, // United -> USA
    { source: 23, target: 4 }, // Delta -> USA
    { source: 24, target: 4 }, // Southwest -> USA
    
    // Defense Division Structure
    { source: 2, target: 15 }, // Defense -> F-15 Program
    { source: 2, target: 16 }, // Defense -> Space Systems
    { source: 2, target: 17 }, // Defense -> Defense Europe

    // Defense Platforms
    { source: 15, target: 34 }, // F-15 Program -> F-15 Eagle
    { source: 15, target: 35 }, // F-15 Program -> F/A-18
    { source: 16, target: 36 }, // Space Systems -> KC-46
    { source: 17, target: 30 }, // Defense Europe -> Apache
    { source: 17, target: 31 }, // Defense Europe -> Chinook
    { source: 17, target: 32 }, // Defense Europe -> C-17
    { source: 17, target: 33 }, // Defense Europe -> P-8

    // Platforms to Countries
    { source: 30, target: 4 }, // Apache -> USA
    { source: 30, target: 6 }, // Apache -> UK
    { source: 31, target: 4 }, // Chinook -> USA
    { source: 31, target: 6 }, // Chinook -> UK
    { source: 31, target: 11 }, // Chinook -> Australia
    { source: 32, target: 4 }, // C-17 -> USA
    { source: 32, target: 6 }, // C-17 -> UK
    { source: 32, target: 11 }, // C-17 -> Australia
    { source: 33, target: 4 }, // P-8 -> USA
    { source: 33, target: 6 }, // P-8 -> UK
    { source: 33, target: 11 }, // P-8 -> Australia
    { source: 34, target: 4 }, // F-15 -> USA
    { source: 34, target: 6 }, // F-15 -> UK
    { source: 35, target: 4 }, // F/A-18 -> USA
    { source: 35, target: 11 }, // F/A-18 -> Australia
    { source: 36, target: 4 }, // KC-46 -> USA
    { source: 36, target: 6 }, // KC-46 -> UK

    // Services Division
    { source: 3, target: 18 }, // Services -> Parts
    { source: 3, target: 19 }, // Services -> Training
    { source: 3, target: 20 }, // Services -> Digital

    // Services Operations to Countries
    { source: 18, target: 4 }, // Parts -> USA
    { source: 18, target: 6 }, // Parts -> UK
    { source: 18, target: 9 }, // Parts -> China
    { source: 18, target: 11 }, // Parts -> Australia
    
    { source: 19, target: 4 }, // Training -> USA
    { source: 19, target: 6 }, // Training -> UK
    { source: 19, target: 9 }, // Training -> China
    
    { source: 20, target: 4 }, // Digital -> USA
    { source: 20, target: 6 }, // Digital -> UK
    { source: 20, target: 9 }, // Digital -> China
    { source: 20, target: 11 }, // Digital -> Australia
  ],
};

const getNodeColor = (node) => {
  switch (node.type) {
    case 'corporate':
      return '#0090FF';
    case 'division':
      switch (node.division) {
        case DIVISIONS.COMMERCIAL:
          return '#FF6B6B';
        case DIVISIONS.DEFENSE:
          return '#4ECDC4';
        case DIVISIONS.SERVICES:
          return '#FFD93D';
        default:
          return '#888888';
      }
    case 'region':
      return '#95A5A6';
    case 'program':
      return '#9B59B6';
    case 'customer':
      return '#34C759';
    case 'aircraft':
      return '#FF9500';
    default:
      return '#888888';
  }
};

const getNodeClass = (node) => {
  switch (node.type) {
    case 'corporate':
      return styles.org_corporate_node__x9j3p;
    case 'division':
      return styles.org_division_node__l2m5n;
    case 'region':
      return styles.org_region_node__w5h8c;
    case 'program':
      return styles.org_program_node__j6f9d;
    case 'customer':
      return styles.org_customer_node__q2n7m;
    case 'platform':
      return styles.org_platform_node__s4k8p;
    case 'aircraft':
      return styles.org_aircraft_node__a5b6c;
    default:
      return styles.org_node_label__h4k2m;
  }
};

const findAllConnectedPaths = (nodeId, links) => {
  const upstreamPaths = new Set();
  const downstreamPaths = new Set();
  const visited = new Set();

  const traverse = (currentId, goingUp = true) => {
    if (visited.has(currentId)) return;
    visited.add(currentId);

    // Find all links connected to this node
    const connectedLinks = links.filter(link => 
      link.source === currentId || link.target === currentId
    );

    for (const link of connectedLinks) {
      const nextNode = link.source === currentId ? link.target : link.source;
      const linkStr = JSON.stringify(link);
      
      if (goingUp) {
        // Going up towards Boeing
        if (nextNode === 0 || nextNode < currentId) {
          upstreamPaths.add(linkStr);
          traverse(nextNode, true);
        }
      } else {
        // Going down - follow all connections
        if (!visited.has(nextNode)) {
          downstreamPaths.add(linkStr);
          traverse(nextNode, false);
        }
      }
    }
  };

  // First go up to Boeing
  traverse(nodeId, true);
  
  // Then from the selected node, go down
  visited.clear();
  traverse(nodeId, false);

  return { upstreamPaths, downstreamPaths };
};

export function OrganizationGraph() {
  const [selectedNode, setSelectedNode] = useState(null);
  const [upstreamPaths, setUpstreamPaths] = useState(new Set());
  const [downstreamPaths, setDownstreamPaths] = useState(new Set());

  const handleNodeClick = (e, nodeId) => {
    e.stopPropagation();
    console.log(`Clicked node: ${nodeId}`);
    
    // If clicking the same node, clear selection
    if (selectedNode === nodeId) {
      setSelectedNode(null);
      setUpstreamPaths(new Set());
      setDownstreamPaths(new Set());
      return;
    }

    // Find all connected paths
    const { upstreamPaths, downstreamPaths } = findAllConnectedPaths(nodeId, testData.links);
    console.log(`Upstream paths:`, Array.from(upstreamPaths));
    console.log(`Downstream paths:`, Array.from(downstreamPaths));
    
    setSelectedNode(nodeId);
    setUpstreamPaths(upstreamPaths);
    setDownstreamPaths(downstreamPaths);
  };

  const handleBackgroundClick = (e) => {
    e.stopPropagation();
    setSelectedNode(null);
    setUpstreamPaths(new Set());
    setDownstreamPaths(new Set());
  };

  const getLinkColor = (link) => {
    const linkStr = JSON.stringify(link);
    if (upstreamPaths.has(linkStr)) return "#FFD700"; // Gold for upstream
    if (downstreamPaths.has(linkStr)) return "#00CED1"; // Turquoise for downstream
    return "#44444466"; // Default gray
  };

  const isLinkHighlighted = (link) => {
    const linkStr = JSON.stringify(link);
    return upstreamPaths.has(linkStr) || downstreamPaths.has(linkStr);
  };

  const nodes = useMemo(() => 
    testData.nodes.map((node) => (
      <group key={node.id} position={node.position}>
        <Html distanceFactor={15}>
          <div 
            className={getNodeClass(node)} 
            onClick={(e) => handleNodeClick(e, node.id)}
            style={{ 
              cursor: 'pointer',
              transform: node.id === selectedNode ? 'scale(1.1)' : 'scale(1)',
              transition: 'all 0.3s ease',
            }}
            onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
            onPointerOut={() => { document.body.style.cursor = 'auto'; }}
          >
            {node.name}
          </div>
        </Html>
      </group>
    )),
    [selectedNode]
  );

  const links = useMemo(() => {
    return testData.links.map((link, index) => {
      const start = testData.nodes.find(n => n.id === link.source);
      const end = testData.nodes.find(n => n.id === link.target);
      
      if (!start || !end) {
        console.warn(`Missing node for link: ${link.source} -> ${link.target}`);
        return null;
      }
      
      const midPoint = new THREE.Vector3(
        (start.position[0] + end.position[0]) / 2,
        (start.position[1] + end.position[1]) / 2,
        (start.position[2] + end.position[2]) / 2
      );
      
      midPoint.y += 2;

      const points = new THREE.CatmullRomCurve3([
        new THREE.Vector3(...start.position),
        midPoint,
        new THREE.Vector3(...end.position)
      ]).getPoints(50);

      const highlighted = isLinkHighlighted(link);
      
      return (
        <Line
          key={index}
          points={points}
          color={getLinkColor(link)}
          lineWidth={highlighted ? 2 : 1}
          transparent
          opacity={highlighted ? 0.8 : 0.3}
        />
      );
    }).filter(Boolean);
  }, [upstreamPaths, downstreamPaths]);

  return (
    <group onClick={handleBackgroundClick}>
      {links}
      {nodes}
    </group>
  );
}

export default OrganizationGraph;
