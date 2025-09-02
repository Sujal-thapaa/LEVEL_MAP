import React from 'react';
import { motion } from 'framer-motion';

interface RailwayPathProps {
  from: { x: number; y: number };
  to: { x: number; y: number };
  isActive: boolean;
  delay?: number;
}

const RailwayPath: React.FC<RailwayPathProps> = ({ from, to, isActive, delay = 0 }) => {
  // Calculate path dimensions and position
  const startX = Math.min(from.x, to.x);
  const startY = Math.min(from.y, to.y);
  const width = Math.abs(to.x - from.x);
  const height = Math.abs(to.y - from.y);
  
  // Determine if path is more horizontal or vertical
  const isHorizontal = width > height;
  
  // Create SVG path
  const pathLength = Math.sqrt(width * width + height * height);
  
  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: `${startX}%`,
        top: `${startY}%`,
        width: `${width}%`,
        height: `${height}%`,
      }}
    >
      <svg
        className="w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {/* Main railway track */}
        <motion.line
          x1={from.x < to.x ? "0" : "100"}
          y1={from.y < to.y ? "0" : "100"}
          x2={from.x < to.x ? "100" : "0"}
          y2={from.y < to.y ? "100" : "0"}
          stroke="rgba(255, 255, 255, 0.9)"
          strokeWidth="4"
          strokeLinecap="round"
          filter="drop-shadow(0 0 4px rgba(255, 255, 255, 0.5))"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ 
            pathLength: 1, 
            opacity: isActive ? 1 : 0.4 
          }}
          transition={{
            duration: 0.8,
            delay: delay,
            ease: 'easeInOut',
          }}
        />
        
        {/* Railway ties/sleepers */}
        {Array.from({ length: 5 }, (_, i) => {
          const progress = (i + 1) / 6;
          const x = from.x < to.x ? progress * 100 : (1 - progress) * 100;
          const y = from.y < to.y ? progress * 100 : (1 - progress) * 100;
          
          return (
            <motion.rect
              key={i}
              x={x - (isHorizontal ? 1 : 4)}
              y={y - (isHorizontal ? 4 : 1)}
              width={isHorizontal ? 2 : 8}
              height={isHorizontal ? 8 : 2}
              fill="rgba(255, 255, 255, 0.8)"
              filter="drop-shadow(0 0 2px rgba(255, 255, 255, 0.6))"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: isActive ? 0.9 : 0.3,
                scale: 1 
              }}
              transition={{
                duration: 0.3,
                delay: delay + 0.2 + (i * 0.1),
              }}
            />
          );
        })}
      </svg>
    </div>
  );
};

export default RailwayPath;