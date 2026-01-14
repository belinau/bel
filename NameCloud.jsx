import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

// Fisher-Yates shuffle algorithm
const shuffle = (array) => {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
};

const NameCloud = ({ names, lang }) => {
  const uniqueShuffledNames = useMemo(() => {
    const nameCounts = names.reduce((acc, name) => {
      if (name) {
        acc[name] = (acc[name] || 0) + 1;
      }
      return acc;
    }, {});

    const uniqueNames = Object.keys(nameCounts).map(name => ({ name, count: nameCounts[name] }));
    return shuffle(uniqueNames);
  }, [names]);

  return (
    <div className="absolute inset-x-0 bottom-0 z-0 h-48 bg-gradient-to-t from-neutral-100 to-transparent pointer-events-none">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-full flex flex-wrap items-end justify-center gap-x-4 gap-y-1 overflow-hidden">
        {uniqueShuffledNames.map(({ name, count }, index) => (
          <motion.span key={index} className="text-neutral-400 text-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.02 }}>
            {name}
          </motion.span>
        ))}
      </div>
    </div>
  );
};

export default NameCloud;