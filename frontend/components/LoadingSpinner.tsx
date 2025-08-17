'use client';

import { motion } from 'framer-motion';

export default function LoadingSpinner() {
  return (
    <div className="flex flex-col justify-center items-center h-full py-12">
      <div className="relative w-32 h-32 mb-6">
        {/* Outer ring */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'var(--greyLight-1)',
            boxShadow: '.3rem .3rem .6rem var(--greyLight-2), -.2rem -.2rem .5rem var(--white)'
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        >
          <div 
            className="absolute inset-2 rounded-full"
            style={{
              background: 'var(--greyLight-1)',
              boxShadow: 'inset .2rem .2rem .5rem var(--greyLight-2), inset -.2rem -.2rem .5rem var(--white)'
            }}
          />
        </motion.div>

        {/* Inner rotating elements */}
        <motion.div
          className="absolute inset-4 rounded-full"
          style={{
            background: `conic-gradient(from 0deg, var(--primary-light), var(--primary), var(--primary-dark), var(--primary-light))`,
            maskImage: 'radial-gradient(circle at center, transparent 40%, black 42%)',
            WebkitMaskImage: 'radial-gradient(circle at center, transparent 40%, black 42%)'
          }}
          animate={{ rotate: -360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />

        {/* Center dot */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <div 
            className="w-6 h-6 rounded-full"
            style={{
              background: 'var(--primary)',
              boxShadow: 'inset .1rem .1rem .2rem var(--primary-light), inset -.1rem -.1rem .2rem var(--primary-dark), .2rem .2rem .4rem var(--greyLight-2)'
            }}
          />
        </motion.div>

        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{
              background: 'var(--primary)',
              boxShadow: '.1rem .1rem .2rem var(--greyLight-2)',
              left: '50%',
              top: '50%',
              transformOrigin: `0 ${24 + i * 8}px`
            }}
            animate={{ 
              rotate: 360,
              scale: [0.5, 1, 0.5]
            }}
            transition={{ 
              duration: 3 + i * 0.5, 
              repeat: Infinity, 
              ease: "linear",
              delay: i * 0.2
            }}
          />
        ))}
      </div>

      {/* Enhanced loading text */}
      <motion.div
        className="text-center"
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <h3 className="text-2xl font-bold heading-premium mb-2">
          正在加载
        </h3>
        <p className="text-premium">
          请稍候，数据准备中...
        </p>
      </motion.div>

      {/* Progress indicator */}
      <motion.div
        className="mt-6 w-48 h-1 rounded-full overflow-hidden"
        style={{
          background: 'var(--greyLight-1)',
          boxShadow: 'inset .1rem .1rem .2rem var(--greyLight-2), inset -.1rem -.1rem .2rem var(--white)'
        }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{
            background: `linear-gradient(90deg, var(--primary-light), var(--primary), var(--primary-dark))`
          }}
          animate={{ 
            x: ['-100%', '100%'],
            scaleX: [0.3, 1, 0.3]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            ease: "easeInOut"
          }}
        />
      </motion.div>
    </div>
  );
}