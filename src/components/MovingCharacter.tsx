import React from 'react';
import { motion } from 'framer-motion';

interface MovingCharacterProps {
  position: { x: number; y: number };
  isMoving: boolean;
}

const MovingCharacter: React.FC<MovingCharacterProps> = ({ position, isMoving }) => {
  return (
    <motion.div
      className="absolute w-16 h-16 flex items-center justify-center z-30"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: 'translate(-50%, -50%)',
      }}
      animate={{
        x: 0,
        y: isMoving ? [-2, 2, -2] : [0, -3, 0],
        scale: isMoving ? [1, 1.1, 1] : 1,
      }}
      transition={{
        x: { duration: 0.8, ease: 'easeInOut' },
        y: { duration: isMoving ? 0.3 : 2, repeat: Infinity, ease: 'easeInOut' },
        scale: { duration: 0.3 },
      }}
      layout
    >
      {/* Outer glow ring */}
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/30 to-purple-500/30"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.6, 0.2, 0.6],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      {/* Logo image with enhanced effects */}
      <motion.img
        src="./logo2.png"
        alt="Moving Logo"
        className="relative w-12 h-12 object-contain drop-shadow-lg"
        animate={{
          filter: [
            'drop-shadow(0 0 8px rgba(59, 130, 246, 0.5))',
            'drop-shadow(0 0 12px rgba(147, 51, 234, 0.7))',
            'drop-shadow(0 0 8px rgba(59, 130, 246, 0.5))',
          ],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      {/* Enhanced trailing particles */}
      {Array.from({ length: 5 }, (_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400"
          style={{
            left: '50%',
            top: '50%',
          }}
          animate={{
            x: [0, -20 - i * 5, -30 - i * 8],
            y: [0, Math.sin(i) * 10, Math.sin(i + 1) * 15],
            opacity: [0.8, 0.4, 0],
            scale: [1, 0.5, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.2,
            ease: 'easeOut',
          }}
        />
      ))}
      
      {/* Moving highlight effect */}
      <motion.div
        className="absolute -inset-2 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </motion.div>
  );
};

export default MovingCharacter;