import React, { useMemo } from 'react';
import { Line, Html } from '@react-three/drei';
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
    
    // Division Level
    { id: 1, name: 'Boeing Commercial Airplanes', position: [-8, 12, 0], level: LEVELS.DIVISION, division: DIVISIONS.COMMERCIAL },
    { id: 2, name: 'Boeing Defense & Space', position: [8, 12, 0], level: LEVELS.DIVISION, division: DIVISIONS.DEFENSE },
    { id: 3, name: 'Boeing Global Services', position: [0, 12, 8], level: LEVELS.DIVISION, division: DIVISIONS.SERVICES },
    
    // Regions - North America
    { id: 4, name: 'USA', position: [-12, 8, -6], level: LEVELS.REGION },
    { id: 5, name: 'Canada', position: [-8, 8, -6], level: LEVELS.REGION },
    
    // Regions - Europe
    { id: 6, name: 'UK', position: [0, 8, -6], level: LEVELS.REGION },
    { id: 7, name: 'France', position: [4, 8, -6], level: LEVELS.REGION },
    { id: 8, name: 'Germany', position: [8, 8, -6], level: LEVELS.REGION },
    
    // Regions - Asia Pacific
    { id: 9, name: 'China', position: [-4, 8, 12], level: LEVELS.REGION },
    { id: 10, name: 'Japan', position: [0, 8, 12], level: LEVELS.REGION },
    { id: 11, name: 'Australia', position: [4, 8, 12], level: LEVELS.REGION },
    
    // Operations - Commercial
    { id: 12, name: '737 Program (USA)', position: [-14, 4, -8], level: LEVELS.OPERATION, division: DIVISIONS.COMMERCIAL },
    { id: 13, name: '787 Program (USA)', position: [-10, 4, -8], level: LEVELS.OPERATION, division: DIVISIONS.COMMERCIAL },
    { id: 14, name: 'Final Assembly (China)', position: [-6, 4, 14], level: LEVELS.OPERATION, division: DIVISIONS.COMMERCIAL },
    
    // Operations - Defense
    { id: 15, name: 'F-15 Program (USA)', position: [10, 4, -8], level: LEVELS.OPERATION, division: DIVISIONS.DEFENSE },
    { id: 16, name: 'Space Systems (USA)', position: [14, 4, -8], level: LEVELS.OPERATION, division: DIVISIONS.DEFENSE },
    { id: 17, name: 'Defense Europe', position: [6, 4, -8], level: LEVELS.OPERATION, division: DIVISIONS.DEFENSE },
    
    // Operations - Services
    { id: 18, name: 'Parts & Distribution', position: [-2, 4, 14], level: LEVELS.OPERATION, division: DIVISIONS.SERVICES },
    { id: 19, name: 'Training Services', position: [2, 4, 14], level: LEVELS.OPERATION, division: DIVISIONS.SERVICES },
    { id: 20, name: 'Digital Solutions', position: [6, 4, 14], level: LEVELS.OPERATION, division: DIVISIONS.SERVICES },
    
    // Commercial Airlines by Country
    // USA Airlines
    { id: 21, name: 'American Airlines', position: [-14, 2, -8], level: LEVELS.CUSTOMER, division: DIVISIONS.COMMERCIAL },
    { id: 22, name: 'United Airlines', position: [-12, 2, -8], level: LEVELS.CUSTOMER, division: DIVISIONS.COMMERCIAL },
    { id: 23, name: 'Delta Air Lines', position: [-10, 2, -8], level: LEVELS.CUSTOMER, division: DIVISIONS.COMMERCIAL },
    { id: 24, name: 'Southwest Airlines', position: [-8, 2, -8], level: LEVELS.CUSTOMER, division: DIVISIONS.COMMERCIAL },
    
    // China Airlines
    { id: 25, name: 'Air China', position: [-6, 2, 14], level: LEVELS.CUSTOMER, division: DIVISIONS.COMMERCIAL },
    { id: 26, name: 'China Southern', position: [-4, 2, 14], level: LEVELS.CUSTOMER, division: DIVISIONS.COMMERCIAL },
    { id: 27, name: 'China Eastern', position: [-2, 2, 14], level: LEVELS.CUSTOMER, division: DIVISIONS.COMMERCIAL },
    
    // UK Airlines
    { id: 28, name: 'British Airways', position: [-2, 2, -8], level: LEVELS.CUSTOMER, division: DIVISIONS.COMMERCIAL },
    { id: 29, name: 'Virgin Atlantic', position: [0, 2, -8], level: LEVELS.CUSTOMER, division: DIVISIONS.COMMERCIAL },
    
    // Defense Platforms by Country
    // UK Defense
    { id: 30, name: 'Apache AH-64', position: [2, 2, -8], level: LEVELS.PLATFORM, division: DIVISIONS.DEFENSE },
    { id: 31, name: 'Chinook', position: [4, 2, -8], level: LEVELS.PLATFORM, division: DIVISIONS.DEFENSE },
    { id: 32, name: 'C-17 Globemaster', position: [6, 2, -8], level: LEVELS.PLATFORM, division: DIVISIONS.DEFENSE },
    { id: 33, name: 'P-8 Poseidon', position: [8, 2, -8], level: LEVELS.PLATFORM, division: DIVISIONS.DEFENSE },
    
    // US Defense
    { id: 34, name: 'F-15 Eagle', position: [10, 2, -8], level: LEVELS.PLATFORM, division: DIVISIONS.DEFENSE },
    { id: 35, name: 'F/A-18 Super Hornet', position: [12, 2, -8], level: LEVELS.PLATFORM, division: DIVISIONS.DEFENSE },
    { id: 36, name: 'KC-46 Tanker', position: [14, 2, -8], level: LEVELS.PLATFORM, division: DIVISIONS.DEFENSE },
    
    // Australia Defense
    { id: 37, name: 'E-7A Wedgetail', position: [2, 2, 14], level: LEVELS.PLATFORM, division: DIVISIONS.DEFENSE },
    { id: 38, name: 'P-8A Poseidon', position: [4, 2, 14], level: LEVELS.PLATFORM, division: DIVISIONS.DEFENSE },
    { id: 39, name: 'CH-47F Chinook', position: [6, 2, 14], level: LEVELS.PLATFORM, division: DIVISIONS.DEFENSE },
  ],
  links: [
    // Corporate to Divisions
    { source: 0, target: 1, type: 'division' },
    { source: 0, target: 2, type: 'division' },
    { source: 0, target: 3, type: 'division' },
    
    // Commercial Links
    { source: 1, target: 4, type: 'region' }, // USA
    { source: 1, target: 9, type: 'region' }, // China
    
    // Defense Links
    { source: 2, target: 4, type: 'region' }, // USA
    { source: 2, target: 6, type: 'region' }, // UK
    { source: 2, target: 7, type: 'region' }, // France
    { source: 2, target: 8, type: 'region' }, // Germany
    
    // Services Links
    { source: 3, target: 4, type: 'region' }, // USA
    { source: 3, target: 9, type: 'region' }, // China
    { source: 3, target: 10, type: 'region' }, // Japan
    { source: 3, target: 11, type: 'region' }, // Australia
    
    // USA Airlines
    { source: 4, target: 21, type: 'customer' }, // American
    { source: 4, target: 22, type: 'customer' }, // United
    { source: 4, target: 23, type: 'customer' }, // Delta
    { source: 4, target: 24, type: 'customer' }, // Southwest
    
    // China Airlines
    { source: 9, target: 25, type: 'customer' }, // Air China
    { source: 9, target: 26, type: 'customer' }, // China Southern
    { source: 9, target: 27, type: 'customer' }, // China Eastern
    
    // UK Airlines
    { source: 6, target: 28, type: 'customer' }, // British Airways
    { source: 6, target: 29, type: 'customer' }, // Virgin Atlantic
    
    // Defense Platforms
    // UK Platforms
    { source: 6, target: 30, type: 'platform' }, // Apache
    { source: 6, target: 31, type: 'platform' }, // Chinook
    { source: 6, target: 32, type: 'platform' }, // C-17
    { source: 6, target: 33, type: 'platform' }, // P-8
    
    // US Platforms
    { source: 4, target: 34, type: 'platform' }, // F-15
    { source: 4, target: 35, type: 'platform' }, // F/A-18
    { source: 4, target: 36, type: 'platform' }, // KC-46
    
    // Australia Platforms
    { source: 11, target: 37, type: 'platform' }, // E-7A
    { source: 11, target: 38, type: 'platform' }, // P-8A
    { source: 11, target: 39, type: 'platform' }, // CH-47F
    
    // Cross-division collaboration
    { source: 12, target: 18, type: 'collaborate' }, // 737 - Parts
    { source: 13, target: 18, type: 'collaborate' }, // 787 - Parts
    { source: 14, target: 19, type: 'collaborate' }, // F-15 - Training
    { source: 17, target: 20, type: 'collaborate' }  // Defense Europe - Digital
  ]
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

export function OrganizationGraph() {
  const nodes = useMemo(() => 
    testData.nodes.map((node) => (
      <group key={node.id} position={node.position} className={styles.org_node__g6f5d}>
        <Html distanceFactor={15}>
          <div className={getNodeLabelClass(node)}>{node.name}</div>
        </Html>
      </group>
    )),
    []
  );

  const links = useMemo(() =>
    testData.links.map((link, i) => {
      const start = new THREE.Vector3(...testData.nodes[link.source].position);
      const end = new THREE.Vector3(...testData.nodes[link.target].position);
      
      const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
      const offset = new THREE.Vector3().subVectors(end, start).cross(new THREE.Vector3(0, 1, 0)).normalize().multiplyScalar(2);
      mid.add(offset);

      const points = new THREE.CatmullRomCurve3([start, mid, end]).getPoints(50);
      
      const lineColor = link.type === 'division' ? '#ffffff' :
                       link.type === 'region' ? '#88888888' :
                       link.type === 'operation' ? '#88888888' :
                       link.type === 'customer' ? '#88888888' :
                       link.type === 'platform' ? '#88888888' :
                       '#44444466'; // collaboration
      
      return (
        <Line
          key={i}
          points={points}
          color={lineColor}
          lineWidth={link.type === 'division' ? 1.5 : 0.75}
          transparent
          opacity={link.type === 'division' ? 0.8 : 0.4}
          className={styles.org_connection_line__e3r4t}
        />
      );
    }),
    []
  );

  return (
    <group className={styles.org_graph_container__t7y1x}>
      {links}
      {nodes}
    </group>
  );
}

export default OrganizationGraph;
