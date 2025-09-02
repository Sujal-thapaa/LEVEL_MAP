import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface GuideCharacterProps {
  isVisible: boolean;
  currentLevel: number;
  imageIndex: number;
  onComplete: () => void;
}

const GuideCharacter: React.FC<GuideCharacterProps> = ({ 
  isVisible, 
  currentLevel, 
  imageIndex, 
  onComplete 
}) => {
  const guideImages = ['./guide2.webp', './guide3.webp', './guide4.png'];
  const currentImage = guideImages[imageIndex % guideImages.length];

  const levelHints = {
    1: "Next level is a quiz",
    2: "Next level is hard – it is a 3D game", 
    3: "Get ready for puzzles!",
    4: "This one is tricky – focus!",
    5: "Fun challenge ahead!",
    6: "Only one more to go!",
    7: "Final level – give it your best!"
  };

  const currentHint = levelHints[currentLevel as keyof typeof levelHints] || "Good luck!";

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed bottom-8 right-8 z-50 flex items-end gap-4"
          initial={{ opacity: 0, x: 100, y: 50 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: 100, y: 50 }}
          transition={{ 
            type: 'spring', 
            stiffness: 200, 
            damping: 20,
            duration: 0.6 
          }}
        >
          {/* Speech Bubble */}
          <motion.div
            className="relative bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-white/30 max-w-xs"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            {/* Speech bubble arrow */}
            <div className="absolute -right-2 bottom-6 w-0 h-0 border-l-8 border-l-white/90 border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
            
            <p className="text-gray-800 font-medium text-sm leading-relaxed">
              {currentHint}
            </p>
            
            {/* Close button */}
            <button
              onClick={onComplete}
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white text-xs font-bold transition-colors"
              aria-label="Close guide"
            >
              ×
            </button>
          </motion.div>

          {/* Guide Character Image */}
          <motion.div
            className="relative"
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 300 }}
          >
            <motion.img
              src={currentImage}
              alt="Guide Character"
              className="w-24 h-24 object-cover rounded-full border-4 border-yellow-400 shadow-lg"
              style={{
                filter: 'drop-shadow(0 0 20px rgba(255, 193, 7, 0.6))',
              }}
              animate={{
                filter: [
                  'drop-shadow(0 0 20px rgba(255, 193, 7, 0.6))',
                  'drop-shadow(0 0 30px rgba(255, 193, 7, 0.8))',
                  'drop-shadow(0 0 20px rgba(255, 193, 7, 0.6))',
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
            
            {/* Additional glow effect */}
            <motion.div
              className="absolute -inset-2 rounded-full border-2 border-yellow-300/50"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GuideCharacter;
