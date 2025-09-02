import React from 'react';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';

interface PlayerMarkerProps {
  position: { x: number; y: number };
  isVisible: boolean;
}

const PlayerMarker: React.FC<PlayerMarkerProps> = ({ position, isVisible }) => {
  if (!isVisible) return null;

  return (
    <motion.div
      className="absolute w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 
                 border-3 border-white shadow-lg shadow-purple-500/50 flex items-center justify-center z-20"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: 'translate(-50%, -50%)',
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ 
        scale: 1, 
        opacity: 1,
        y: [0, -5, 0]
      }}
      transition={{
        scale: { type: 'spring', stiffness: 300, damping: 20 },
        opacity: { duration: 0.3 },
        y: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
      }}
      layout
    >
      <User size={20} className="text-white" />
    </motion.div>
  );
};

export default PlayerMarker;