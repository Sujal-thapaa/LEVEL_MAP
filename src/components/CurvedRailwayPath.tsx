import React from 'react';
import { motion } from 'framer-motion';
import { Level } from '../types';

interface CurvedRailwayPathProps {
  levels: Level[];
  progress: number; // 0..1 progress along the full path for the red dotted overlay
}

const CurvedRailwayPath: React.FC<CurvedRailwayPathProps> = ({ levels, progress }) => {
  // Create circuit board trace path connecting all levels
  const createCircuitPath = () => {
    if (levels.length < 2) return '';
    
    const points = levels.map(level => ({ x: level.position.x, y: level.position.y }));
    
    // Start with the first point
    let path = `M ${points[0].x} ${points[0].y}`;
    
    // Create circuit board-style segments with right angles and curves
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const current = points[i];
      
      // Calculate direction
      const deltaX = current.x - prev.x;
      const deltaY = current.y - prev.y;
      
      // Create circuit board-style segments with intermediate waypoints
      const segments = 3; // Number of segments per connection
      
      for (let j = 1; j <= segments; j++) {
        const t = j / segments;
        const baseX = prev.x + deltaX * t;
        const baseY = prev.y + deltaY * t;
        
        // Add circuit board-style variations
        const variation = Math.sin(t * Math.PI * 2) * 2; // Small wave pattern
        const offsetX = Math.cos(t * Math.PI * 3) * 1.5; // Perpendicular offset
        
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
              strokeWidth="4"
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
          strokeWidth="2"
          fill="none"
          strokeLinecap="square"
          strokeLinejoin="miter"
          filter="url(#glowFilter)"
          animate={{
            strokeWidth: [2, 3, 2],
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
          strokeWidth="2"
          fill="none"
          strokeLinecap="square"
          strokeLinejoin="miter"
          opacity="0.6"
          animate={{
            strokeWidth: [2, 3, 2],
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
          strokeWidth="0.3"
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
            {/* Connection rings */}
            <motion.circle
              cx={level.position.x}
              cy={level.position.y}
              r={3}
              fill="none"
              stroke="#00ffff"
              strokeWidth="0.5"
              opacity="0.6"
              animate={{
                r: [3, 5, 3],
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