import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Info, Package } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const techItems: Array<{ label: string; value: string }> = [
  { label: 'Framework', value: 'React 18 (TypeScript)' },
  { label: 'Bundler/Dev Server', value: 'Vite 5' },
  { label: 'Styling', value: 'Tailwind CSS 3 + PostCSS + Autoprefixer' },
  { label: 'Animation', value: 'Framer Motion 12' },
  { label: 'Icons', value: 'lucide-react' },
  { label: 'Sound', value: 'Web Audio API (custom tones)' },
  { label: 'Linting', value: 'ESLint 9 + TypeScript ESLint + React Hooks' },
  { label: 'Build Target', value: 'TypeScript 5' },
];

const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

          <motion.div
            className="relative w-full max-w-xl mx-4 bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl"
            initial={{ y: 20, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between p-5 border-b border-gray-800">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/20 border border-blue-400/30">
                  <Info className="text-blue-400" size={18} />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">About This Project</h3>
                  <p className="text-gray-400 text-xs">Overview of tools and technologies</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-white/5 text-gray-300"
                aria-label="Close about dialog"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5 space-y-5">
              <div>
                <p className="text-gray-300 text-sm">
                  Interactive level map demonstrating animated UI, progress tracking, and sound effects.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {techItems.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-start gap-3 p-3 rounded-xl bg-gray-800/50 border border-gray-700"
                  >
                    <div className="pt-0.5">
                      <Package size={16} className="text-emerald-400" />
                    </div>
                    <div>
                      <div className="text-gray-400 text-xs">{item.label}</div>
                      <div className="text-white text-sm font-medium">{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-xs text-gray-500">
                Source files live in `src/` with components under `src/components/`. Tooling configured via `vite.config.ts`, `tailwind.config.js`, `postcss.config.js`, and ESLint in `eslint.config.js`.
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AboutModal;


