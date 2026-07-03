import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const LoadingScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate loading progress
    const steps = [20, 45, 70, 90, 100];
    let i = 0;
    const tick = () => {
      if (i < steps.length) {
        setProgress(steps[i]);
        i++;
        setTimeout(tick, i === steps.length ? 300 : 350 + Math.random() * 150);
      } else {
        setTimeout(onComplete, 400);
      }
    };
    setTimeout(tick, 200);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #134e4a 0%, #0f766e 50%, #115e59 100%)' }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7, ease: 'easeInOut' }}
    >
      {/* Decorative radial glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #2dd4bf 0%, transparent 70%)' }}
        />
      </div>

      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-ceylon-300/20"
          style={{
            width: `${40 + i * 20}px`,
            height: `${40 + i * 20}px`,
            left: `${10 + i * 15}%`,
            top: `${15 + (i % 3) * 25}%`,
          }}
          animate={{ y: [0, -20, 0], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}
        />
      ))}

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="mb-8"
        >
          <div className="w-28 h-28 rounded-3xl overflow-hidden shadow-2xl shadow-black/40 border border-white/10 backdrop-blur-sm bg-white/10 flex items-center justify-center p-3">
            <img
              src="/assets/logo.png"
              alt="Relic Lanka Tours"
              className="w-full h-full object-contain drop-shadow-lg"
            />
          </div>
        </motion.div>

        {/* Brand name */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mb-12"
        >
          <h1
            className="text-3xl font-bold tracking-[0.25em] uppercase text-white mb-1"
            style={{ fontFamily: "'Maven Pro', sans-serif" }}
          >
            Relic Lanka
          </h1>
          <p
            className="text-ceylon-300 text-sm tracking-[0.4em] uppercase"
            style={{ fontFamily: "'Maven Pro', sans-serif" }}
          >
            Tours & Travel
          </p>
        </motion.div>

        {/* Progress bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="w-56"
        >
          <div className="h-[2px] bg-white/10 rounded-full overflow-hidden mb-3">
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #5eead4, #14b8a6)' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          </div>
          <p
            className="text-center text-white/40 text-xs tracking-widest uppercase"
            style={{ fontFamily: "'Maven Pro', sans-serif" }}
          >
            Loading experience…
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};
