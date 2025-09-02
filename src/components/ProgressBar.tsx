import React from 'react';
import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';

interface ProgressBarProps {
  currentLevel: number;
  completedLevels: number[];
  totalLevels: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentLevel, completedLevels, totalLevels }) => {
  const progress = (completedLevels.length / totalLevels) * 100;

  return (
    <motion.div
      className="w-full max-w-4xl mx-auto mb-8"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Trophy className="text-yellow-400" size={20} />
          <span className="text-white font-semibold drop-shadow-lg">Progress</span>
        </div>
        <span className="text-white text-sm drop-shadow-lg">
          {completedLevels.length} / {totalLevels} Levels Completed
        </span>
      </div>
      
      <div className="relative backdrop-blur-sm rounded-full h-3 overflow-hidden border-2" style={{ backgroundColor: 'rgba(102, 102, 102, 0.2)', borderColor: '#666666' }}>
        <motion.div
          className="absolute top-0 left-0 h-full rounded-full"
          style={{ backgroundColor: '#39ff14' }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
        
        {/* Shimmer effect */}
        <motion.div
          className="absolute top-0 left-0 h-full w-8 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          animate={{ x: [-32, 400] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        />
      </div>
      
      <div className="flex justify-between mt-2 text-xs text-white drop-shadow-lg">
        <span>Level 1</span>
        <span className="font-medium" style={{ color: '#ff6b35' }}>Current: Level {currentLevel}</span>
        <span>Level {totalLevels}</span>
      </div>
    </motion.div>
  );
};

export default ProgressBar;