import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Level } from '../types';
import { Star, Lock, Check } from 'lucide-react';

interface LevelTooltipProps {
  level: Level | null;
  isVisible: boolean;
  position: { x: number; y: number };
}

const LevelTooltip: React.FC<LevelTooltipProps> = ({ level, isVisible, position }) => {
  if (!level) return null;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-400';
      case 'Medium': return 'text-yellow-400';
      case 'Hard': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const renderStars = (stars: number) => {
    return Array.from({ length: 3 }, (_, i) => (
      <Star
        key={i}
        size={14}
        className={i < stars ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}
      />
    ));
  };

  const getStatusIcon = () => {
    if (level.isCompleted) return <Check size={16} className="text-green-400" />;
    if (!level.isUnlocked) return <Lock size={16} className="text-gray-500" />;
    return null;
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed z-50 pointer-events-none"
          style={{
            left: position.x,
            top: position.y - 10,
          }}
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 10 }}
          transition={{ duration: 0.2 }}
        >
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 shadow-xl backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-white font-bold">Level {level.id}</span>
              {getStatusIcon()}
            </div>
            
            <div className="flex items-center gap-2 mb-1">
              <span className="text-gray-300 text-sm">Difficulty:</span>
              <span className={`text-sm font-medium ${getDifficultyColor(level.difficulty)}`}>
                {level.difficulty}
              </span>
            </div>
            
            <div className="flex items-center gap-1 mb-2">
              {renderStars(level.stars)}
            </div>
            
            <p className="text-gray-400 text-xs max-w-48">
              {level.description}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LevelTooltip;