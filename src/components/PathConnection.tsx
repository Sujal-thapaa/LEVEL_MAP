import React from 'react';
import { motion } from 'framer-motion';

interface PathConnectionProps {
  from: { x: number; y: number };
  to: { x: number; y: number };
  isUnlocked: boolean;
}

const PathConnection: React.FC<PathConnectionProps> = ({ from, to, isUnlocked }) => {
  // Calculate the path between two points
  const startX = from.x;
  const startY = from.y;
  const endX = to.x;
  const endY = to.y;
  
  // Create a curved path
  const midX = (startX + endX) / 2;
  const midY = (startY + endY) / 2;
  
  // Add some curve to make it more interesting
  const controlX = midX + (startY > endY ? 5 : -5);
  const controlY = midY;

  const pathData = `M ${startX} ${startY} Q ${controlX} ${controlY} ${endX} ${endY}`;

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    >
      <motion.path
        d={pathData}
        stroke={isUnlocked ? '#10b981' : '#9ca3af'}
        strokeWidth="3"
        fill="none"
        strokeDasharray={isUnlocked ? '0' : '8 4'}
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{
          duration: 0.8,
          delay: 0.2,
          ease: 'easeInOut',
        }}
      />
      {isUnlocked && (
        <motion.circle
          r="3"
          fill="#10b981"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 1,
          }}
        >
          <animateMotion dur="2s" repeatCount="indefinite">
            <mpath href={`#path-${from.x}-${from.y}`} />
          </animateMotion>
        </motion.circle>
      )}
    </svg>
  );
};

export default PathConnection;