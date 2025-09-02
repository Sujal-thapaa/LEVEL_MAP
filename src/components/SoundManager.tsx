import { useEffect } from 'react';

interface SoundManagerProps {
  onLevelComplete: boolean;
  onLevelUnlock: boolean;
  onReset: () => void;
}

const SoundManager: React.FC<SoundManagerProps> = ({ onLevelComplete, onLevelUnlock, onReset }) => {
  useEffect(() => {
    if (onLevelComplete) {
      // Create completion sound using Web Audio API
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Success sound - ascending notes
      const playSuccessSound = () => {
        const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5
        frequencies.forEach((freq, index) => {
          setTimeout(() => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.3);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
          }, index * 100);
        });
      };
      
      playSuccessSound();
      onReset();
    }
  }, [onLevelComplete, onReset]);

  useEffect(() => {
    if (onLevelUnlock) {
      // Create unlock sound
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      const playUnlockSound = () => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(880, audioContext.currentTime + 0.2);
        oscillator.type = 'triangle';
        
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.05, audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.4);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.4);
      };
      
      playUnlockSound();
      onReset();
    }
  }, [onLevelUnlock, onReset]);

  return null;
};

export default SoundManager;