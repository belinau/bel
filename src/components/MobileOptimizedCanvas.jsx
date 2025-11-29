import React, { useState, useEffect, useRef, memo } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useAnimationFrame } from 'framer-motion';

// Mobile-optimized path item component
const MobilePathItem = ({ item, index, total, pathRefs, animationOffset, mousePos, onSelect, getText }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  useAnimationFrame(() => {
    const pathCount = 5;
    const pathIndex = index % pathCount;
    const path = pathRefs.current[pathIndex];
    if (!path) return;

    const itemsOnThisPath = Math.floor((total - 1 - pathIndex) / pathCount) + 1;
    const itemIndexOnPath = Math.floor(index / pathCount);

    const totalLength = path.getTotalLength();
    const baseProgress = itemIndexOnPath / itemsOnThisPath;
    const animatedProgress = (baseProgress + animationOffset) % 1;
    const point = path.getPointAtLength(animatedProgress * totalLength);

    const distX = mousePos.x - point.x;
    const distY = mousePos.y - point.y;
    const dist = Math.sqrt(distX * distX + distY * distY);
    const influence = Math.max(0, 1 - dist / 150) * 0.1; // Reduced influence for mobile

    const newX = point.x + distX * influence;
    const newY = point.y + distY * influence;

    x.set(newX);
    y.set(newY);
  });

  // Smaller dimensions for mobile
  const isPublication = item.type === 'publication';
  const isText = item.type === 'text';
  const itemWidth = isPublication ? 80 : (isText ? 60 : 70);
  const itemHeight = isText ? 80 : 100;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5 }}
      transition={{ layout: { duration: 0.5 }, opacity: { duration: 0.3 } }}
      className="absolute cursor-pointer"
      style={{
        width: `${itemWidth}px`,
        height: `${itemHeight}px`,
        y: useTransform(y, val => val - itemHeight / 2),
        x: useTransform(x, val => val - itemWidth / 2),
        pointerEvents: 'auto'
      }}
      onClick={() => onSelect(item)}
      whileHover={{ scale: 1.1 }}
    >
      <div className="relative w-full h-full rounded-sm overflow-hidden shadow-sm">
        {item.type === 'text' ? (
          <div className="flex items-center justify-center w-full h-full bg-neutral-100">
            <svg className="w-1/3 h-1/3 text-neutral-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
            </svg>
          </div>
        ) : (
          <>
            <img
              src={item.thumbnail || '/images/base.jpg'}
              alt={getText(item.title)}
              className="w-full h-full object-cover"
              onError={(e) => { e.target.src = '/images/base.jpg'; }}
            />
            <div className="absolute bottom-0 left-0 right-0 p-1 bg-gradient-to-t from-black/60 to-transparent">
              <p className="text-white text-[8px] line-clamp-1 px-1">{item.year}</p>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
};

// Mobile-optimized canvas component
const MobileOptimizedCanvas = memo(({ items, mousePos, onSelect, getText }) => {
  const pathRefs = useRef([]);
  const [animationOffset, setAnimationOffset] = useState(0);

  useEffect(() => {
    let animationFrame;
    const animateLoop = () => {
      setAnimationOffset(prev => prev + 0.0008); // Slightly faster animation for mobile
      animationFrame = requestAnimationFrame(animateLoop);
    };
    animationFrame = requestAnimationFrame(animateLoop);
    
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  // Mobile-optimized SVG paths
  const svgHeight = 1000;
  const svgWidth = 800;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'visible' }}>
      <svg
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          pointerEvents: 'none',
          touchAction: 'pan-y'
        }}
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Mobile optimized paths - more compressed and closer together */}
        <path
          ref={el => pathRefs.current[0] = el}
          d="M 20 100 C 300 20, 500 180, 780 100 C 500 20, 300 180, 20 100 Z"
          fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="1.5"
        />
        <path
          ref={el => pathRefs.current[1] = el}
          d="M 20 220 C 250 150, 550 290, 780 220 C 550 150, 250 290, 20 220 Z"
          fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="1.5"
        />
        <path
          ref={el => pathRefs.current[2] = el}
          d="M 20 340 C 400 280, 400 400, 780 340 C 400 280, 400 400, 20 340 Z"
          fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="1.5"
        />
        <path
          ref={el => pathRefs.current[3] = el}
          d="M 20 460 C 250 390, 550 530, 780 460 C 550 390, 250 530, 20 460 Z"
          fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="1.5"
        />
        <path
          ref={el => pathRefs.current[4] = el}
          d="M 20 580 C 350 520, 450 640, 780 580 C 450 520, 350 640, 20 580 Z"
          fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="1.5"
        />
      </svg>

      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <AnimatePresence mode="popLayout">
          {items.map((item, index) => (
            <MobilePathItem
              key={item.id}
              item={item}
              index={index}
              total={items.length}
              pathRefs={pathRefs}
              animationOffset={animationOffset}
              mousePos={mousePos}
              onSelect={onSelect}
              getText={getText}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
});

export default MobileOptimizedCanvas;