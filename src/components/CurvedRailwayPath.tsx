import React from 'react';
import { motion } from 'framer-motion';
import { Level } from '../types';

interface CurvedRailwayPathProps {
  levels: Level[];
  progress: number; // 0..1 progress along the full path for the red dotted overlay
}

const CurvedRailwayPath: React.FC<CurvedRailwayPathProps> = ({ levels, progress }) => {
  // Helper function to get ring color based on level status
  const getRingColor = (levelId: number) => {
    const level = levels.find(l => l.id === levelId);
    if (level?.isCurrent) {
      return '#ff0000'; // Red for current level
    }
    if (level?.isCompleted) {
      return '#39ff14'; // Green for completed levels
    }
    if (level?.isUnlocked) {
      return '#00d4ff'; // Blue for unlocked levels
    }
    return '#666666'; // Gray for locked levels
  };
  // Create circuit board trace path connecting all levels with better corner handling
  const createCircuitPath = () => {
    if (levels.length < 2) return '';
    
    const points = levels.map(level => ({ x: level.position.x, y: level.position.y }));
    
    // Start with the first point
    let path = `M ${points[0].x} ${points[0].y}`;
    
    // Create circuit board-style segments with better corner spacing
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const current = points[i];
      
      // Calculate direction and distance
      const deltaX = current.x - prev.x;
      const deltaY = current.y - prev.y;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      
      // For short distances (corners), use simpler path to avoid overlap
      if (distance < 15) {
        // Simple straight line for close levels
        path += ` L ${current.x} ${current.y}`;
      } else {
        // Create circuit board-style segments with intermediate waypoints for longer distances
        const segments = 3;
        
        for (let j = 1; j <= segments; j++) {
          const t = j / segments;
          const baseX = prev.x + deltaX * t;
          const baseY = prev.y + deltaY * t;
          
          // Reduced variations to prevent overlap at corners
          const variation = Math.sin(t * Math.PI * 2) * 1; // Smaller wave pattern
          const offsetX = Math.cos(t * Math.PI * 3) * 0.8; // Smaller perpendicular offset
          
          const waypointX = baseX + offsetX;
          const waypointY = baseY + variation;
          
          if (j === 1) {
            // First segment: smooth curve
            const controlX = prev.x + (waypointX - prev.x) * 0.5;
            const controlY = prev.y + (waypointY - prev.y) * 0.5;
            path += ` Q ${controlX} ${controlY}, ${waypointX} ${waypointY}`;
          } else if (j === segments) {
            // Last segment: smooth curve to final point
            const controlX = waypointX + (current.x - waypointX) * 0.5;
            const controlY = waypointY + (current.y - waypointY) * 0.5;
            path += ` Q ${controlX} ${controlY}, ${current.x} ${current.y}`;
          } else {
            // Middle segments: sharp angles like circuit traces
            path += ` L ${waypointX} ${waypointY}`;
          }
        }
      }
    }
    
    return path;
  };

  const pathData = createCircuitPath();

  return (
    <div className="absolute inset-0 pointer-events-none">
      <svg
        className="w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          {/* Enhanced glow filter for circuit traces */}
          <filter id="glowFilter" x="-50%" y="-50%" width="150%" height="150%">

            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feGaussianBlur stdDeviation="4" result="coloredBlur2"/>
            <feMerge> 
              <feMergeNode in="coloredBlur2"/>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          
          {/* Create a mask that reveals progressively */}
          <mask id="progressMask">
            <motion.path
              d={pathData}
              stroke="white"
              strokeWidth="2"
              fill="none"
              strokeLinecap="square"
              strokeLinejoin="miter"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: Math.max(0, Math.min(1, progress)) }}
              transition={{ duration: 0 }}
            />
          </mask>
        </defs>

        {/* Circuit board trace base path */}
        <motion.path
          d={pathData}
          stroke="#00ffff"
          strokeWidth="1"
          fill="none"
          strokeLinecap="square"
          strokeLinejoin="miter"
          filter="url(#glowFilter)"
          animate={{
            strokeWidth: [1, 1.5, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        {/* Secondary circuit trace for depth */}
        <motion.path
          d={pathData}
          stroke="#00aaff"
          strokeWidth="1"
          fill="none"
          strokeLinecap="square"
          strokeLinejoin="miter"
          opacity="0.6"
          animate={{
            strokeWidth: [1, 1.5, 1],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        />

        {/* Dotted red progress line */}
        <path
          d={pathData}
          stroke="#0a0a0a"
          strokeWidth="0.15"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="0.5 1"
          mask="url(#progressMask)"
        />

        {/* Circuit board connection points */}
        {levels.map((level, index) => (
          <g key={level.id}>
            {/* Connection pad */}
            <circle
              cx={level.position.x}
              cy={level.position.y}
              r={2}
              fill="#00ffff"
              filter="url(#glowFilter)"
            />
            {/* Inner connection point */}
            <circle
              cx={level.position.x}
              cy={level.position.y}
              r={1}
              fill="#ffffff"
            />
            {/* Connection rings - smaller size */}
            <motion.circle
              cx={level.position.x}
              cy={level.position.y}
              r={1.5}
              fill="none"
              stroke={getRingColor(level.id)}
              strokeWidth="0.3"
              opacity={0.6}
              animate={{
                r: [1.5, 2.5, 1.5],
                opacity: [0.6, 0.2, 0.6],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * 0.3,
              }}
            />
          </g>
        ))}
      </svg>
    </div>
  );
};

export default CurvedRailwayPath;