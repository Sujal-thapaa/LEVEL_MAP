import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Level, LevelStatus } from '../types';
import LevelNode from './LevelNode';
import CurvedRailwayPath from './CurvedRailwayPath.tsx';
import MovingCharacter from './MovingCharacter';
import ProgressBar from './ProgressBar';
import LevelTooltip from './LevelTooltip';
import SoundManager from './SoundManager';
import AboutModal from './AboutModal';
import GuideCharacter from './GuideCharacter';
import { Info, Volume2, VolumeX } from 'lucide-react';

const LevelMap: React.FC = () => {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);
  const [hoveredLevel, setHoveredLevel] = useState<Level | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [isMoving, setIsMoving] = useState(false);
  const [showUnlockAnimation, setShowUnlockAnimation] = useState<number | null>(null);
  const [soundTriggers, setSoundTriggers] = useState({
    levelComplete: false,
    levelUnlock: false,
  });
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [logoPosition, setLogoPosition] = useState({ x: 15, y: 85 });
  const [partialProgress, setPartialProgress] = useState(0); // 0..1 progress between current and next level while moving
  const [showGuide, setShowGuide] = useState(false);
  const [guideImageIndex, setGuideImageIndex] = useState(0);

  // Define level positions along the curved path (Candy Crush style)
  const levelData = useMemo(() => [
    { id: 1, x: 15, y: 85, difficulty: 'Easy' as const, stars: 1, description: 'Welcome! Start your journey here.', color: '#00d4ff', icon: './icons/cyber.png', topic: 'Cyber' },
    { id: 2, x: 50, y: 65, difficulty: 'Easy' as const, stars: 1, description: 'Learn the basics with simple challenges.', color: '#00d4ff', icon: './icons/AI.png', topic: 'AI & Machine Learning' },
    { id: 3, x: 85, y: 55, difficulty: 'Easy' as const, stars: 2, description: 'Getting warmed up? Try some combos!', color: '#00d4ff', icon: './icons/phishing.png', topic: 'Phishing Detection' },
    { id: 4, x: 50, y: 45, difficulty: 'Medium' as const, stars: 2, description: 'Things are heating up now!', color: '#00d4ff', icon: './icons/password.png', topic: 'Password Security' },
    { id: 5, x: 15, y: 35, difficulty: 'Medium' as const, stars: 2, description: 'Strategic thinking required.', color: '#00d4ff', icon: './icons/network.png', topic: 'Network Security' },
    { id: 6, x: 50, y: 25, difficulty: 'Medium' as const, stars: 2, description: 'Complex patterns await you.', color: '#00d4ff', icon: './icons/system.png', topic: 'System Administration' },
    { id: 7, x: 85, y: 15, difficulty: 'Hard' as const, stars: 3, description: 'Expert level challenges ahead!', color: '#00d4ff', icon: './icons/testing.png', topic: 'Penetration Testing' },
  ], []);

  const levels: Level[] = useMemo(() => 
    levelData.map(data => ({
      ...data,
      position: { x: data.x, y: data.y },
      isCompleted: completedLevels.includes(data.id),
      isUnlocked: data.id <= currentLevel,
      isCurrent: data.id === currentLevel,
      icon: data.icon,
    })),
    [levelData, currentLevel, completedLevels]
  );

  const totalSegments = 6; // between 7 levels
  // Overall path progress across all segments: completed full segments + partial while moving
  const pathProgress = useMemo(() => {
    if (isMoving) {
      // During movement, calculate progress based on actual character position
      const currentLevelIndex = currentLevel - 1;
      const nextLevelIndex = currentLevel;
      
      if (currentLevelIndex >= 0 && nextLevelIndex < levels.length) {
        const currentPos = levels[currentLevelIndex]?.position;
        const nextPos = levels[nextLevelIndex]?.position;
        
        if (currentPos && nextPos) {
          // Calculate how far along the current segment the character is
          const segmentProgress = partialProgress;
          
          // Calculate total progress: completed segments + current segment progress
          const completedSegments = Math.max(0, currentLevel - 1);
          const totalProgress = (completedSegments + segmentProgress) / totalSegments;
          
          return Math.min(1, totalProgress);
        }
      }
    }
    
    // When not moving, show completed segments
    const completedSegments = Math.max(0, currentLevel - 1);
    return Math.min(1, completedSegments / totalSegments);
  }, [currentLevel, partialProgress, isMoving, levels, totalSegments]);

  const getLevelStatus = useCallback((level: Level): LevelStatus => {
    if (level.isCompleted) return LevelStatus.COMPLETED;
    if (level.isCurrent) return LevelStatus.CURRENT;
    if (level.isUnlocked) return LevelStatus.UNLOCKED;
    return LevelStatus.LOCKED;
  }, []);

  const handleLevelClick = useCallback((levelId: number) => {
    if (levelId <= currentLevel && !completedLevels.includes(levelId)) {
      window.location.href = `level${levelId}.html`;
    }
  }, [currentLevel, completedLevels]);

  const handleNext = useCallback(() => {
    if (currentLevel <= 7) {
      // Immediately mark current level as completed and show stars
      setCompletedLevels(prev => Array.from(new Set([...prev, currentLevel])));
      setSoundTriggers(prev => ({ ...prev, levelComplete: true }));
      
      if (currentLevel < 7) {
        // Show guide character with hint for next level
        setShowGuide(true);
        setGuideImageIndex(prev => (prev + 1) % 3); // Cycle through 3 images
        
        // Start movement animation after a brief delay
        setTimeout(() => {
          setIsMoving(true);
          const currentPos = levels.find(l => l.id === currentLevel)?.position || { x: 15, y: 85 };
          const nextPos = levels.find(l => l.id === currentLevel + 1)?.position || { x: 15, y: 85 };
          const startTime = Date.now();
          const duration = 2000; // faster to reduce perceived lag
          const animateLogo = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            setPartialProgress(easeProgress);
            const currentX = currentPos.x + (nextPos.x - currentPos.x) * easeProgress;
            const currentY = currentPos.y + (nextPos.y - currentPos.y) * easeProgress;
            setLogoPosition({ x: currentX, y: currentY });
            if (progress < 1) {
              requestAnimationFrame(animateLogo);
            } else {
              // Movement finished: advance to next level
              setCurrentLevel(prev => prev + 1);
              setShowUnlockAnimation(currentLevel + 1);
              setSoundTriggers(prev => ({ ...prev, levelUnlock: true }));
              setIsMoving(false);
              setPartialProgress(0);
              setLogoPosition(nextPos);
              setTimeout(() => {
                setShowUnlockAnimation(null);
              }, 600);
            }
          };
          requestAnimationFrame(animateLogo);
        }, 500); // Small delay to let guide appear first
      }
      // If currentLevel === 7, it will just mark as completed and show the completion message
    }
  }, [currentLevel, levels]);

  const handleReset = useCallback(() => {
    setCurrentLevel(1);
    setCompletedLevels([]);
    setHoveredLevel(null);
    setIsMoving(false);
    setShowUnlockAnimation(null);
    setPartialProgress(0);
    setLogoPosition({ x: 15, y: 85 });
    setShowGuide(false);
    setGuideImageIndex(0);
    for (let i = 1; i <= 7; i++) {
      localStorage.removeItem(`level${i}Completed`);
    }
  }, []);

  const handleGuideComplete = useCallback(() => {
    setShowGuide(false);
  }, []);

  const handleLevelHover = useCallback((level: Level | null, position: { x: number; y: number }) => {
    setHoveredLevel(level);
    setTooltipPosition(position);
  }, []);

  const resetSoundTriggers = useCallback(() => {
    setSoundTriggers({ levelComplete: false, levelUnlock: false });
  }, []);

  useEffect(() => {
    const completed = [] as number[];
    for (let i = 1; i <= 7; i++) {
      if (localStorage.getItem(`level${i}Completed`) === 'true') {
        completed.push(i);
      }
    }
    setCompletedLevels(completed);
    const nextLevel = completed.length + 1;
    if (nextLevel <= 7) {
      setCurrentLevel(nextLevel);
      const levelPos = levelData.find(l => l.id === nextLevel);
      if (levelPos) {
        setLogoPosition({ x: levelPos.x, y: levelPos.y });
      }
    } else {
      const lastLevel = levelData.find(l => l.id === 7);
      if (lastLevel) {
        setLogoPosition({ x: lastLevel.x, y: lastLevel.y });
      }
    }
  }, [levelData]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'n') {
        handleNext();
      } else if (e.key.toLowerCase() === 'r') {
        handleReset();
      } else if (e.key.toLowerCase() === 'a') {
        setIsAboutOpen((v) => !v);
      } else if (e.key.toLowerCase() === 'm') {
        setIsMuted((v) => !v);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleNext, handleReset]);

  const allLevelsCompleted = completedLevels.length === 7;
  const currentLevelPosition = logoPosition;

  return (
    <div className="min-h-screen text-white p-4" style={{
      backgroundImage: 'url("./background4.png")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    }}>
      <SoundManager
        onLevelComplete={!isMuted && soundTriggers.levelComplete}
        onLevelUnlock={!isMuted && soundTriggers.levelUnlock}
        onReset={resetSoundTriggers}
      />
      
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-8 flex items-center justify-between"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMuted((v) => !v)}
              className="p-3 rounded-xl border-2 backdrop-blur-sm transition"
              style={{
                borderColor: '#00d4ff',
                backgroundColor: 'rgba(0, 212, 255, 0.1)',
              }}
              aria-label={isMuted ? 'Unmute sounds (M)' : 'Mute sounds (M)'}
              title="Toggle sound (M)"
            >
              {isMuted ? <VolumeX size={18} className="text-white" /> : <Volume2 size={18} className="text-white" />}
            </button>
            <button
              onClick={() => setIsAboutOpen(true)}
              className="p-3 rounded-xl border-2 backdrop-blur-sm transition"
              style={{
                borderColor: '#00d4ff',
                backgroundColor: 'rgba(0, 212, 255, 0.1)',
              }}
              aria-label="Open About (A)"
              title="About (A)"
            >
              <Info size={18} className="text-white" />
            </button>
          </div>
        </motion.div>

        {/* Progress Bar */}
        <ProgressBar
          currentLevel={currentLevel}
          completedLevels={completedLevels}
          totalLevels={7}
        />

        {/* Level Map Container */}
        <motion.div
          className="relative bg-white/10 backdrop-blur-sm rounded-3xl p-8 mb-8 border border-white/30"
          style={{ minHeight: '700px' }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Curved Railway Path */}
                  <CurvedRailwayPath
          levels={levels}
          progress={pathProgress}
          currentLevel={currentLevel}
        />

          {/* Moving Character */}
          <MovingCharacter 
            position={currentLevelPosition}
            isMoving={isMoving}
          />

          {/* Level Nodes */}
          <AnimatePresence>
            {levels.map((level) => (
              <LevelNode
                key={level.id}
                level={level}
                status={getLevelStatus(level)}
                onClick={handleLevelClick}
                onHover={handleLevelHover}
                showUnlockAnimation={showUnlockAnimation === level.id}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Tooltip */}
        <LevelTooltip
          level={hoveredLevel}
          isVisible={hoveredLevel !== null}
          position={tooltipPosition}
        />

        {/* Control Buttons */}
        <motion.div
          className="flex justify-center gap-6"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {!allLevelsCompleted ? (
            <motion.button
              onClick={handleNext}
              className="text-white font-bold py-4 px-10 rounded-full shadow-lg
                         transform transition-all duration-200 hover:scale-105 active:scale-95 
                         disabled:opacity-50 disabled:cursor-not-allowed border-2
                         backdrop-blur-sm"
              style={{
                backgroundColor: '#00d4ff',
                borderColor: '#00d4ff',
                boxShadow: '0 10px 25px rgba(0, 212, 255, 0.3)',
              }}
              disabled={currentLevel > 7}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {currentLevel === 7 && completedLevels.includes(7) ? 'All Complete!' : 'Next Level'}
            </motion.button>
          ) : (
            <motion.div
              className="text-center backdrop-blur-sm rounded-3xl p-8 border-2"
              style={{
                backgroundColor: 'rgba(57, 255, 20, 0.1)',
                borderColor: '#39ff14',
              }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              <div className="text-6xl mb-4">🎉</div>
              <p className="text-white text-2xl font-bold mb-4">Congratulations!</p>
              <p className="text-white text-lg mb-6">You've completed all levels!</p>
            </motion.div>
          )}
          
          <motion.button
            onClick={handleReset}
            className="text-white font-bold py-4 px-10 rounded-full shadow-lg
                       transform transition-all duration-200 hover:scale-105 active:scale-95 
                       border-2 backdrop-blur-sm"
            style={{
              backgroundColor: '#ff6b35',
              borderColor: '#ff6b35',
              boxShadow: '0 10px 25px rgba(255, 107, 53, 0.3)',
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Reset Progress
          </motion.button>
        </motion.div>

        {/* About Modal */}
        <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
        
        {/* Guide Character */}
        <GuideCharacter
          isVisible={showGuide}
          currentLevel={currentLevel + 1} // Show hint for next level
          imageIndex={guideImageIndex}
          onComplete={handleGuideComplete}
        />
      </div>
    </div>
  );
};

export default LevelMap;