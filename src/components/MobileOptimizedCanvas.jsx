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

  // Even smaller dimensions for mobile
  const isPublication = item.type === 'publication';
  const isText = item.type === 'text';
  const itemWidth = isPublication ? 60 : (isText ? 50 : 60); // Reduced from 80/60/70 to 60/50/60
  const itemHeight = isText ? 70 : 80; // Reduced from 80/100 to 70/80

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
          <>
            <div className="flex items-center justify-center w-full h-full bg-neutral-100">
              <svg className="w-1/2 h-1/2 text-neutral-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
              </svg>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-1 bg-gradient-to-t from-black/60 to-transparent">
              <p className="text-white text-[6px] line-clamp-1 px-1">{getText(item.title)}</p>
            </div>
          </>
        ) : item.type === 'publication' ? (
          <>
            <img
              src={item.thumbnail || '/images/base.jpg'}
              alt={getText(item.title)}
              className="w-full h-full object-cover"
              onError={(e) => { e.target.src = '/images/base.jpg'; }}
            />
            <div className="absolute bottom-0 left-0 right-0 p-1 bg-gradient-to-t from-black/60 to-transparent">
              <p className="text-white text-[7px] line-clamp-1 px-1">{item.year}</p>
            </div>
          </>
        ) : (
          <>
            <img
              src={item.thumbnail || '/images/base.jpg'}
              alt={getText(item.title)}
              className="w-full h-full object-cover"
              onError={(e) => { e.target.src = '/images/base.jpg'; }}
            />
            <div className="absolute bottom-0 left-0 right-0 p-1 bg-gradient-to-t from-black/60 to-transparent">
              <p className="text-white text-[6px] line-clamp-1 px-1">{getText(item.title)}</p>
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

  // Mobile-optimized SVG paths - adjust height based on number of items to ensure scrolling works
  const itemsPerPath = Math.ceil(items.length / 5); // 5 paths
  const baseHeight = 500; // Reduced base height
  const dynamicHeight = Math.max(baseHeight, 35 * itemsPerPath); // Reduced from 40 to 35 per item to make it more compact
  const svgHeight = Math.min(dynamicHeight, 1000); // Cap at 1000 to prevent excessive height
  const svgWidth = 800;

  return (
    <div style={{ position: 'relative', width: '100%', height: 'auto', overflow: 'visible' }}>
      <svg
        style={{
          width: '100%',
          height: 'auto', // Changed from '100%' to 'auto' to allow natural height
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
          d="M 20 80 C 250 20, 550 140, 780 80 C 550 20, 250 140, 20 80 Z"
          fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="1.5"
        />
        <path
          ref={el => pathRefs.current[1] = el}
          d="M 20 180 C 200 120, 600 240, 780 180 C 600 120, 200 240, 20 180 Z"
          fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="1.5"
        />
        <path
          ref={el => pathRefs.current[2] = el}
          d="M 20 280 C 350 240, 450 320, 780 280 C 450 240, 350 320, 20 280 Z"
          fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="1.5"
        />
        <path
          ref={el => pathRefs.current[3] = el}
          d="M 20 380 C 200 320, 600 440, 780 380 C 600 320, 200 440, 20 380 Z"
          fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="1.5"
        />
        <path
          ref={el => pathRefs.current[4] = el}
          d="M 20 480 C 300 440, 500 520, 780 480 C 500 440, 300 520, 20 480 Z"
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