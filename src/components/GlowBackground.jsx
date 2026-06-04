import React from 'react';
import { motion } from 'framer-motion';

const GlowBackground = () => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      pointerEvents: 'none',
      zIndex: -1,
      overflow: 'hidden'
    }}>
      <motion.div
        animate={{
          x: ['0%', '10%', '-10%', '0%'],
          y: ['0%', '-10%', '10%', '0%'],
          scale: [1, 1.2, 0.8, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{
          position: 'absolute',
          top: '-10%',
          left: '-10%',
          width: '50vw',
          height: '50vw',
          background: 'radial-gradient(circle, rgba(236,182,19,0.03) 0%, rgba(0,0,0,0) 70%)',
          borderRadius: '50%'
        }}
      />
      <motion.div
        animate={{
          x: ['0%', '-20%', '10%', '0%'],
          y: ['0%', '10%', '-20%', '0%'],
          scale: [1, 0.8, 1.1, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{
          position: 'absolute',
          bottom: '-20%',
          right: '-10%',
          width: '60vw',
          height: '60vw',
          background: 'radial-gradient(circle, rgba(236,182,19,0.02) 0%, rgba(0,0,0,0) 70%)',
          borderRadius: '50%'
        }}
      />
    </div>
  );
};

export default GlowBackground;
