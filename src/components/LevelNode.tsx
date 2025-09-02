import React from 'react';
import { motion } from 'framer-motion';
import { Level, LevelStatus } from '../types';
import { Lock, Star, Check } from 'lucide-react';

interface LevelNodeProps {
  level: Level;
  onClick: (levelId: number) => void;
  status: LevelStatus;
  onHover: (level: Level | null, position: { x: number; y: number }) => void;
  showUnlockAnimation: boolean;
}

const LevelNode: React.FC<LevelNodeProps> = ({ level, onClick, status, onHover, showUnlockAnimation }) => {
  const getStatusStyles = () => {
    switch (status) {
      case LevelStatus.COMPLETED:
        return {
          backgroundColor: '#39ff14',
          borderColor: '#39ff14',
          glowColor: '#39ff14',
          textColor: '#000000',
          cursor: 'cursor-pointer',
        };
      case LevelStatus.CURRENT:
        return {
          backgroundColor: '#ff6b35',
          borderColor: '#ff6b35',
          glowColor: '#ff6b35',
          textColor: '#ffffff',
          cursor: 'cursor-pointer',
        };
      case LevelStatus.UNLOCKED:
        return {
          backgroundColor: '#00d4ff',
          borderColor: '#00d4ff',
          glowColor: '#00d4ff',
          textColor: '#000000',
          cursor: 'cursor-pointer',
        };
      case LevelStatus.LOCKED:
      default:
        return {
          backgroundColor: '#666666',
          borderColor: '#666666',
          glowColor: '#666666',
          textColor: '#ffffff',
          cursor: 'cursor-not-allowed',
        };
    }
  };

  const styles = getStatusStyles();
  const isClickable = status !== LevelStatus.LOCKED;

  const handleClick = () => {
    if (isClickable) {
      onClick(level.id);
    }
  };

  const handleMouseEnter = (e: React.MouseEvent) => {
    if (isClickable) {
      const rect = e.currentTarget.getBoundingClientRect();
      onHover(level, { x: rect.left + rect.width / 2, y: rect.top });
    }
  };

  const handleMouseLeave = () => {
    onHover(null, { x: 0, y: 0 });
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 0; i < 3; i++) {
      const isFilled = i < level.stars;
      stars.push(
        <Star
          key={i}
          size={12}
          className={`${
            isFilled 
              ? 'text-yellow-400 fill-yellow-400' 
              : 'text-gray-400'
          } transition-colors duration-200`}
        />
      );
    }
    return stars;
  };

  // Create hexagonal clip path
  const hexagonClipPath = "polygon(50% 0%, 93.3% 25%, 93.3% 75%, 50% 100%, 6.7% 75%, 6.7% 25%)";

  return (
    <div className="absolute" style={{
      left: `${level.position.x}%`,
      top: `${level.position.y}%`,
      transform: 'translate(-50%, -50%)',
    }}>


      {/* Main Hexagonal Node */}
      <motion.div
        className={`relative ${styles.cursor} transition-all duration-300 z-10`}
        style={{
          width: '80px',
          height: '80px',
          clipPath: hexagonClipPath,
          backgroundColor: styles.backgroundColor,
          border: `3px solid ${styles.borderColor}`,
          filter: `drop-shadow(0 0 15px ${styles.glowColor}80)`,
        }}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        whileHover={isClickable ? { 
          scale: 1.15,
          filter: `drop-shadow(0 0 25px ${styles.glowColor})`
        } : {}}
        whileTap={isClickable ? { scale: 0.95 } : {}}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          type: 'spring',
          stiffness: 260,
          damping: 20,
          delay: level.id * 0.1,
        }}
      >
        {/* Number Badge */}
        <div
          className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2"
          style={{
            backgroundColor: '#1a1a2e',
            borderColor: styles.borderColor,
            color: styles.glowColor,
          }}
        >
          {level.id}
        </div>

        {/* Main Content */}
        <div className="w-full h-full flex flex-col items-center justify-center">
          {status === LevelStatus.LOCKED ? (
            <Lock size={24} style={{ color: styles.textColor }} />
          ) : status === LevelStatus.COMPLETED ? (
            <div className="flex flex-col items-center">
              {level.icon?.startsWith('./') ? (
                <img 
                  src={level.icon} 
                  alt={level.topic || 'Level'} 
                  className="w-8 h-8 mb-1 object-contain"
                  onError={(e) => {
                    console.log('Failed to load icon:', level.icon);
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <div className="text-2xl mb-1">{level.icon}</div>
              )}
              <div className="text-xs font-bold mt-1" style={{ color: styles.textColor }}>
                {level.topic?.split(' ')[0] || 'Done'}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              {level.icon?.startsWith('./') ? (
                <img 
                  src={level.icon} 
                  alt={level.topic || 'Level'} 
                  className="w-8 h-8 mb-1 object-contain"
                  onError={(e) => {
                    console.log('Failed to load icon:', level.icon);
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <div className="text-2xl mb-1">{level.icon}</div>
              )}
              <div className="text-xs font-bold" style={{ color: styles.textColor }}>
                {level.topic?.split(' ')[0] || 'Level'}
              </div>
            </div>
          )}
        </div>

        {/* Unlock animation */}
        {showUnlockAnimation && (
          <>
            <motion.div
              className="absolute -inset-4"
              style={{ 
                clipPath: hexagonClipPath,
                border: `4px solid ${styles.glowColor}`,
              }}
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 2, opacity: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
            <motion.div
              className="absolute -inset-2"
              style={{ 
                clipPath: hexagonClipPath,
                backgroundColor: `${styles.glowColor}20`,
              }}
              initial={{ scale: 0, opacity: 0.8 }}
              animate={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut', delay: 0.1 }}
            />
          </>
        )}

        {/* Current level pulsing ring */}
        {status === LevelStatus.CURRENT && (
          <motion.div
            className="absolute -inset-3"
            style={{ 
              clipPath: hexagonClipPath,
              border: `3px solid ${styles.glowColor}`,
            }}
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.8, 0.3, 0.8]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}

        {/* Enhanced glow effect for unlocked levels */}
        {status === LevelStatus.UNLOCKED && (
          <motion.div
            className="absolute -inset-1"
            style={{ 
              clipPath: hexagonClipPath,
              border: `2px solid ${styles.glowColor}`,
            }}
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}
      </motion.div>

      {/* Stars below the level node - only show after completion */}
      {status === LevelStatus.COMPLETED && (
        <motion.div
          className="flex justify-center gap-1 mt-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.3,
          }}
        >
          {renderStars()}
        </motion.div>
      )}
    </div>
  );
};

export default LevelNode;