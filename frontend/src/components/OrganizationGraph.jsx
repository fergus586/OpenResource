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
    { id: 0, name: 'Boeing', position: [0, 15, 0], level: LEVELS.CORPORATE },
    
    // Division Level - Clear triangle formation
    { id: 1, name: 'Boeing Commercial Airplanes', position: [-12, 12, -4], level: LEVELS.DIVISION, division: DIVISIONS.COMMERCIAL },
    { id: 2, name: 'Boeing Defense & Space', position: [12, 12, -4], level: LEVELS.DIVISION, division: DIVISIONS.DEFENSE },
    { id: 3, name: 'Boeing Global Services', position: [0, 12, 12], level: LEVELS.DIVISION, division: DIVISIONS.SERVICES },
    
    // Regions - Major hubs central but in their respective sectors
    // North America
    { id: 4, name: 'USA', position: [0, 8, 0], level: LEVELS.REGION }, // Central hub
    { id: 5, name: 'Canada', position: [-8, 8, -8], level: LEVELS.REGION },
    
    // Europe
    { id: 6, name: 'UK', position: [4, 8, 0], level: LEVELS.REGION }, // Right sector hub
    { id: 7, name: 'France', position: [12, 8, -8], level: LEVELS.REGION },
    { id: 8, name: 'Germany', position: [16, 8, -10], level: LEVELS.REGION },
    
    // Asia Pacific
    { id: 9, name: 'China', position: [-4, 8, 0], level: LEVELS.REGION }, // Left sector hub
    { id: 10, name: 'Japan', position: [-12, 8, 8], level: LEVELS.REGION },
    { id: 11, name: 'Australia', position: [8, 8, 8], level: LEVELS.REGION },
    
    // Commercial Sector (Left Side) ---------------------
    // Operations - Commercial
    { id: 12, name: '737 Program (USA)', position: [-16, 4, -8], level: LEVELS.OPERATION, division: DIVISIONS.COMMERCIAL },
    { id: 13, name: '787 Program (USA)', position: [-18, 4, -6], level: LEVELS.OPERATION, division: DIVISIONS.COMMERCIAL },
    { id: 14, name: 'Final Assembly (China)', position: [-20, 4, -4], level: LEVELS.OPERATION, division: DIVISIONS.COMMERCIAL },
    
    // USA Airlines - Left front sector
    { id: 21, name: 'American Airlines', position: [-14, 2, -16], level: LEVELS.CUSTOMER, division: DIVISIONS.COMMERCIAL },
    { id: 22, name: 'United Airlines', position: [-16, 2, -14], level: LEVELS.CUSTOMER, division: DIVISIONS.COMMERCIAL },
    { id: 23, name: 'Delta Air Lines', position: [-18, 2, -12], level: LEVELS.CUSTOMER, division: DIVISIONS.COMMERCIAL },
    { id: 24, name: 'Southwest Airlines', position: [-20, 2, -10], level: LEVELS.CUSTOMER, division: DIVISIONS.COMMERCIAL },
    
    // China Airlines - Left back sector
    { id: 25, name: 'Air China', position: [-14, 2, 16], level: LEVELS.CUSTOMER, division: DIVISIONS.COMMERCIAL },
    { id: 26, name: 'China Southern', position: [-16, 2, 14], level: LEVELS.CUSTOMER, division: DIVISIONS.COMMERCIAL },
    { id: 27, name: 'China Eastern', position: [-18, 2, 12], level: LEVELS.CUSTOMER, division: DIVISIONS.COMMERCIAL },
    
    // UK Airlines - Center-left sector
    { id: 28, name: 'British Airways', position: [-8, 2, -14], level: LEVELS.CUSTOMER, division: DIVISIONS.COMMERCIAL },
    { id: 29, name: 'Virgin Atlantic', position: [-10, 2, -12], level: LEVELS.CUSTOMER, division: DIVISIONS.COMMERCIAL },
    
    // Defense Sector (Right Side) ---------------------
    // Operations - Defense
    { id: 15, name: 'F-15 Program (USA)', position: [16, 4, -8], level: LEVELS.OPERATION, division: DIVISIONS.DEFENSE },
    { id: 16, name: 'Space Systems (USA)', position: [18, 4, -6], level: LEVELS.OPERATION, division: DIVISIONS.DEFENSE },
    { id: 17, name: 'Defense Europe', position: [20, 4, -4], level: LEVELS.OPERATION, division: DIVISIONS.DEFENSE },
    
    // UK Defense - Right front sector
    { id: 30, name: 'Apache AH-64', position: [14, 2, -16], level: LEVELS.PLATFORM, division: DIVISIONS.DEFENSE },
    { id: 31, name: 'Chinook', position: [16, 2, -14], level: LEVELS.PLATFORM, division: DIVISIONS.DEFENSE },
    { id: 32, name: 'C-17 Globemaster', position: [18, 2, -12], level: LEVELS.PLATFORM, division: DIVISIONS.DEFENSE },
    { id: 33, name: 'P-8 Poseidon', position: [20, 2, -10], level: LEVELS.PLATFORM, division: DIVISIONS.DEFENSE },
    
    // US Defense - Right center sector
    { id: 34, name: 'F-15 Eagle', position: [14, 2, -8], level: LEVELS.PLATFORM, division: DIVISIONS.DEFENSE },
    { id: 35, name: 'F/A-18 Super Hornet', position: [16, 2, -6], level: LEVELS.PLATFORM, division: DIVISIONS.DEFENSE },
    { id: 36, name: 'KC-46 Tanker', position: [18, 2, -4], level: LEVELS.PLATFORM, division: DIVISIONS.DEFENSE },
    
    // Australia Defense - Right back sector
    { id: 37, name: 'E-7A Wedgetail', position: [14, 2, 16], level: LEVELS.PLATFORM, division: DIVISIONS.DEFENSE },
    { id: 38, name: 'P-8A Poseidon', position: [16, 2, 14], level: LEVELS.PLATFORM, division: DIVISIONS.DEFENSE },
    { id: 39, name: 'CH-47F Chinook', position: [18, 2, 12], level: LEVELS.PLATFORM, division: DIVISIONS.DEFENSE },
    
    // Services Sector (Back) ---------------------
    // Operations - Services (Back sector)
    { id: 18, name: 'Parts & Distribution', position: [-4, 4, 16], level: LEVELS.OPERATION, division: DIVISIONS.SERVICES },
    { id: 19, name: 'Training Services', position: [0, 4, 18], level: LEVELS.OPERATION, division: DIVISIONS.SERVICES },
    { id: 20, name: 'Digital Solutions', position: [4, 4, 20], level: LEVELS.OPERATION, division: DIVISIONS.SERVICES },
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
    
    // Platforms to Operating Countries
    // C-17 Globemaster operators
    { source: 32, target: 4 }, // C-17 -> USA
    { source: 32, target: 6 }, // C-17 -> UK
    { source: 32, target: 11 }, // C-17 -> Australia
    
    // P-8 Poseidon operators
    { source: 33, target: 4 }, // P-8 -> USA
    { source: 33, target: 6 }, // P-8 -> UK
    { source: 33, target: 11 }, // P-8 -> Australia
    
    // Apache operators
    { source: 30, target: 4 }, // Apache -> USA
    { source: 30, target: 6 }, // Apache -> UK
    
    // Chinook operators
    { source: 31, target: 4 }, // Chinook -> USA
    { source: 31, target: 6 }, // Chinook -> UK
    { source: 31, target: 11 }, // Chinook -> Australia
    
    // F-15 Eagle operators
    { source: 34, target: 4 }, // F-15 -> USA
    { source: 34, target: 6 }, // F-15 -> UK
    
    // F/A-18 operators
    { source: 35, target: 4 }, // F/A-18 -> USA
    { source: 35, target: 11 }, // F/A-18 -> Australia
    
    // KC-46 operators
    { source: 36, target: 4 }, // KC-46 -> USA
    { source: 36, target: 6 }, // KC-46 -> UK
    
    // E-7A Wedgetail operators
    { source: 37, target: 11 }, // E-7A -> Australia
    { source: 37, target: 6 }, // E-7A -> UK
    
    // Airlines to Countries
    { source: 21, target: 4 }, // American -> USA
    { source: 22, target: 4 }, // United -> USA
    { source: 23, target: 4 }, // Delta -> USA
    { source: 24, target: 4 }, // Southwest -> USA
    
    { source: 25, target: 9 }, // Air China -> China
    { source: 26, target: 9 }, // China Southern -> China
    { source: 27, target: 9 }, // China Eastern -> China
    
    { source: 28, target: 6 }, // British Airways -> UK
    { source: 29, target: 6 }, // Virgin Atlantic -> UK
    
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

const getNodeLabelClass = (node) => {
  const classes = [];
  
  switch (node.level) {
    case LEVELS.CORPORATE:
      classes.push(styles.org_corporate_node__x9j3p);
      break;
    case LEVELS.DIVISION:
      classes.push(styles.org_division_node__l2m5n);
      break;
    case LEVELS.REGION:
      classes.push(styles.org_region_node__w5h8c);
      break;
    case LEVELS.OPERATION:
      classes.push(styles.org_operation_node__j6f9d);
      break;
    case LEVELS.CUSTOMER:
      classes.push(styles.org_customer_node__q2n7m);
      break;
    case LEVELS.PLATFORM:
      classes.push(styles.org_platform_node__s4k8p);
      break;
  }
  
  if (node.division) {
    switch (node.division) {
      case DIVISIONS.COMMERCIAL:
        classes.push(styles.org_commercial_division__k7p4q);
        break;
      case DIVISIONS.DEFENSE:
        classes.push(styles.org_defense_division__r8t6v);
        break;
      case DIVISIONS.SERVICES:
        classes.push(styles.org_services_division__m3n9b);
        break;
    }
  }
  
  return classes.join(' ');
};

const getNodeColor = (node) => {
  switch (node.level) {
    case LEVELS.CORPORATE:
      return "#FFD700";
    case LEVELS.DIVISION:
      return "#FFA07A";
    case LEVELS.REGION:
      return "#DC143C";
    case LEVELS.OPERATION:
      return "#008000";
    case LEVELS.CUSTOMER:
      return "#4B0082";
    case LEVELS.PLATFORM:
      return "#800080";
  }
};

const findPathToTop = (nodeId, links) => {
  const path = new Set();
  const visited = new Set();

  const traverse = (currentId) => {
    if (visited.has(currentId)) return;
    visited.add(currentId);

    // Find all links connected to this node
    const connectedLinks = links.filter(link => 
      link.source === currentId || link.target === currentId
    );

    for (const link of connectedLinks) {
      // Get the next node (the one we're not currently on)
      const nextNode = link.source === currentId ? link.target : link.source;
      
      // Only traverse upward (towards Boeing)
      if (nextNode === 0 || nextNode < currentId) {
        path.add(JSON.stringify(link));
        // Continue traversing from the next node
        traverse(nextNode);
      }
    }
  };

  // Start traversal from the clicked node
  traverse(nodeId);
  return path;
};

export function OrganizationGraph() {
  const [selectedNode, setSelectedNode] = useState(null);
  const [highlightedPaths, setHighlightedPaths] = useState(new Set());

  const handleNodeClick = (e, nodeId) => {
    e.stopPropagation();
    console.log(`Clicked node: ${nodeId}`);
    
    // If clicking the same node, clear selection
    if (selectedNode === nodeId) {
      setSelectedNode(null);
      setHighlightedPaths(new Set());
      return;
    }

    // Find path to Boeing (node 0)
    const paths = findPathToTop(nodeId, testData.links);
    console.log(`Found paths:`, Array.from(paths));
    
    setSelectedNode(nodeId);
    setHighlightedPaths(paths);
  };

  const handleBackgroundClick = () => {
    setSelectedNode(null);
    setHighlightedPaths(new Set());
  };

  const isLinkHighlighted = (link) => {
    const linkStr = JSON.stringify(link);
    const isHighlit = highlightedPaths.has(linkStr);
    console.log(`Link ${link.source}->${link.target} highlighted: ${isHighlit}`);
    return isHighlit;
  };

  const nodes = useMemo(() => 
    testData.nodes.map((node) => (
      <group key={node.id} position={node.position}>
        <Html distanceFactor={15}>
          <div 
            className={getNodeLabelClass(node)} 
            onClick={(e) => handleNodeClick(e, node.id)}
            style={{ 
              cursor: 'pointer',
              backgroundColor: node.id === selectedNode ? 'rgba(255, 215, 0, 0.2)' : undefined,
              borderColor: node.id === selectedNode ? 'rgba(255, 215, 0, 0.4)' : undefined,
              boxShadow: node.id === selectedNode ? '0 0 20px rgba(255, 215, 0, 0.2)' : undefined
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
      
      // Create a curved line between nodes
      const midPoint = new THREE.Vector3(
        (start.position[0] + end.position[0]) / 2,
        (start.position[1] + end.position[1]) / 2,
        (start.position[2] + end.position[2]) / 2
      );
      
      // Add a slight curve by moving the midpoint up
      midPoint.y += 2;

      const points = new THREE.CatmullRomCurve3([
        new THREE.Vector3(...start.position),
        midPoint,
        new THREE.Vector3(...end.position)
      ]).getPoints(50);

      const isHighlighted = isLinkHighlighted(link);
      
      return (
        <Line
          key={index}
          points={points}
          color={isHighlighted ? "#FFD700" : "#44444466"}
          lineWidth={isHighlighted ? 2 : 1}
          transparent
          opacity={isHighlighted ? 0.8 : 0.3}
        />
      );
    });
  }, [highlightedPaths]);

  return (
    <group onClick={handleBackgroundClick}>
      {links}
      {nodes}
    </group>
  );
}

export default OrganizationGraph;
