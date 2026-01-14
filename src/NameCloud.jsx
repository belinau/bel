import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { parseNames } from './nameParser';

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

const NameCloud = ({ items, lang }) => {
  const uniqueShuffledNames = useMemo(() => {
    const allNames = (items || []).flatMap(item => {
      const authorString = item.author ? item.author[lang] || item.author.sl || item.author.en : '';
      const excludeList = item.exclude || [];
      
      let parsed = parseNames(authorString, excludeList);

      if (item.credits) {
        const creditNames = item.credits.flatMap(credit => {
          const creditNameString = typeof credit.name === 'string' ? credit.name : (credit.name?.[lang] || credit.name?.sl || '');
          return parseNames(creditNameString, excludeList);
        });
        parsed = [...parsed, ...creditNames];
      }
      
      return parsed;
    });

    const nameCounts = allNames.reduce((acc, name) => {
      acc[name] = (acc[name] || 0) + 1;
      return acc;
    }, {});

    const uniqueNames = Object.keys(nameCounts).map(name => ({ name, count: nameCounts[name] }));
    return shuffle(uniqueNames);
  }, [items, lang]);

  return (
    <div className="relative z-0 bg-gradient-to-t from-neutral-100 to-transparent pointer-events-none py-10"> {/* Removed h-48, inset-x-0, bottom-0. Added py-10 */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-wrap items-end justify-center gap-x-4 gap-y-1">
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