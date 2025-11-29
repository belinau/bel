import React, { useState, useEffect, useRef, memo } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, animate, useAnimationFrame } from 'framer-motion';
import { X, ExternalLink, Calendar, MapPin, Film, Users, BookOpen } from 'lucide-react';
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';

import translations from './translations.json';

import sampleData from './data.json';

const PortfolioArchive = () => {
  const [filter, setFilter] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);
  const [lang, setLang] = useState('en');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const containerRef = useRef(null);
  const modalRef = useRef(null); // Create a ref for the modal's scrollable element

  const t = translations[lang];

  // Correctly implement body scroll lock.
  useEffect(() => {
    const modalElement = modalRef.current;

    if (selectedItem && modalElement) {
      // This LOCKS the scroll when the modal is open.
      disableBodyScroll(modalElement, { reserveScrollBarGap: true });

      // This UNLOCKS the scroll when the modal closes.
      return () => enableBodyScroll(modalElement);
    }
  }, [selectedItem]);

  const handleMouseMove = (e) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  const allItems = [...sampleData.publications, ...sampleData.projects, ...sampleData.texts || []];

  const filteredItems = filter === 'all'
    ? allItems
    : allItems.filter(item => {
        // Special case for translations filter
        if (filter === 'publications') return item.type === 'publication';

        // Check if item.type is an array and if it includes the current filter
        if (Array.isArray(item.type)) {
          return item.type.includes(filter);
        }
        // Fallback for items with a single string type
        return item.type === filter;
      });

  const categories = [
    { id: 'all', label: t.all },
    { id: 'publications', label: t.translations },
    { id: 'performance', label: t.performances },
    { id: 'postmedia', label: 'Postmedia' },
    { id: 'exhibition', label: t.exhibitions },
    { id: 'text', label: 'Text' }
  ];

  const getText = (field) => {
    return typeof field === 'object' ? field[lang] : field;
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="sticky top-0 left-0 right-0 bg-white/80 backdrop-blur-sm z-40 border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-6 flex justify-between items-center">
          <h1 className="text-xl md:text-2xl font-light tracking-tight">{t.archive}</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setLang('en')}
              className={`px-3 py-1 rounded text-sm ${lang === 'en' ? 'bg-neutral-900 text-white' : 'text-neutral-600 hover:bg-neutral-100'}`}
              >
              EN
            </button>
            <button
              onClick={() => setLang('sl')}
              className={`px-3 py-1 rounded text-sm ${lang === 'sl' ? 'bg-neutral-900 text-white' : 'text-neutral-600 hover:bg-neutral-100'}`}
            >
              SL
            </button>
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="sticky top-16 md:top-20 left-0 right-0 bg-white/60 backdrop-blur-sm z-40 border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4">
          <div className="flex gap-2 md:gap-3 flex-wrap">
            {categories.map(cat => (
              <motion.button
                key={cat.id}
                onClick={() => setFilter(cat.id)}
                className={`px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm transition-colors ${filter === 'all' && cat.id === 'all' ? 'bg-neutral-900 text-white' : filter === cat.id ? 'bg-neutral-900 text-white' : 'bg-white text-neutral-700 hover:bg-neutral-100'
                  } ${filter === cat.id
                    ? 'bg-neutral-900 text-white'
                    : 'bg-white text-neutral-700 hover:bg-neutral-100'
                  }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {cat.label}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Spline Container */}
      <div
        ref={containerRef}
        className="pt-32 md:pt-44 pb-20 px-4 md:px-6"
        onMouseMove={handleMouseMove}
      >
        <div className="max-w-7xl mx-auto">
          <AnimatedCanvas
            items={filteredItems}
            mousePos={mousePos}
            onSelect={setSelectedItem}
            getText={getText}
          />
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-neutral-100 border-t border-neutral-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 text-center text-xs text-neutral-500">
          <p className="mb-1">
            {t.footerCopyright.replace('{year}', new Date().getFullYear())}
          </p>
          <SafeEmail user="urban" host="bel.si">
            {t.footerContact}
          </SafeEmail>
        </div>
      </footer>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              onClick={() => setSelectedItem(null)}
            />
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed inset-x-8 top-24 bottom-24 md:inset-x-20 md:top-20 md:bottom-10 bg-white rounded-2xl z-50 overflow-hidden flex flex-col shadow-2xl"
            >
              <div ref={modalRef} className="flex-1 overflow-y-auto">
                <button
                  onClick={() => setSelectedItem(null)} // Close button for the modal
                  className="sticky top-4 right-4 float-right w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-neutral-100 transition-colors z-10"
                >
                  <X size={20} />
                </button>

                {selectedItem.type === 'publication' ? (
                  <div className="p-6 md:p-12">
                    <div className="max-w-3xl mx-auto">
                      {/* Cover image - same as thumbnail */}
                      <div className="mb-8">
                        <div className="aspect-[3/4] max-w-xs mx-auto mb-6">
                          <img
                            src={selectedItem.thumbnail || '/images/base.jpg'}
                            alt={getText(selectedItem.title)}
                            className="w-full h-auto object-contain rounded-lg shadow-lg"
                            onError={(e) => {
                              e.target.src = '/images/base.jpg'; // fallback image if specified image fails to load
                            }}
                          />
                        </div>

                        <span className="inline-block px-3 py-1 bg-neutral-100 rounded-full text-xs uppercase tracking-wider text-neutral-600 mb-4">
                          {t.translation}
                        </span>
                        <h2 className="text-2xl md:text-4xl font-light mb-2">{getText(selectedItem.title)}</h2>
                        <p className="text-lg md:text-xl text-neutral-600">{getText(selectedItem.author)}</p>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6 mb-8">
                        <div>
                          <h3 className="text-sm uppercase tracking-wider text-neutral-500 mb-2">{t.publisher}</h3>
                          <p>{getText(selectedItem.publisher)}</p>
                        </div>
                        <div>
                          <h3 className="text-sm uppercase tracking-wider text-neutral-500 mb-2">{t.year}</h3>
                          <p>{selectedItem.year}</p>
                        </div>
                        <div>
                          <h3 className="text-sm uppercase tracking-wider text-neutral-500 mb-2">{t.pages}</h3>
                          <p>{selectedItem.pages}</p>
                        </div>
                        <div>
                          <h3 className="text-sm uppercase tracking-wider text-neutral-500 mb-2">{t.isbn}</h3>
                          <p className="font-mono text-sm">{selectedItem.isbn}</p>
                        </div>
                        <div>
                          <h3 className="text-sm uppercase tracking-wider text-neutral-500 mb-2">{t.translationLabel}</h3>
                          <p>{getText(selectedItem.languageFrom)} → {getText(selectedItem.languageTo)}</p>
                        </div>
                      </div>

                      {selectedItem.additionalInfo && (
                        <div className="mb-8">
                          <h3 className="text-sm uppercase tracking-wider text-neutral-500 mb-2">{t.additionalInfo}</h3>
                          <p className="text-neutral-700 leading-relaxed">{getText(selectedItem.additionalInfo)}</p>
                        </div>
                      )}

                      <a
                        href={selectedItem.publisherLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-900 text-white rounded-full hover:bg-neutral-800 transition-colors"
                      >
                        <span>{t.viewPublisher}</span>
                        <ExternalLink size={16} />
                      </a>
                    </div>
                  </div>
                ) : selectedItem.type === 'text' ? (
                  <div className="p-6 md:p-12">
                    <div className="max-w-4xl mx-auto">
                      {/* Text document display */}
                      <div className="mb-8">
                        <div className="flex items-center justify-center w-32 h-32 mx-auto mb-6 bg-neutral-100 rounded-lg">
                          <BookOpen className="w-1/2 h-1/2 text-neutral-400" />
                        </div>

                        <span className="inline-block px-3 py-1 bg-neutral-100 rounded-full text-xs uppercase tracking-wider text-neutral-600 mb-4">
                          {t.text || 'Text'}
                        </span>
                        <h2 className="text-2xl md:text-4xl font-light mb-4">{getText(selectedItem.title)}</h2>

                        <div className="flex flex-wrap gap-4 text-neutral-600 mb-6">
                          <span className="flex items-center gap-2">
                            <Calendar size={16} />
                            {selectedItem.year}
                          </span>
                        </div>

                        <p className="text-base md:text-lg text-neutral-700 leading-relaxed mb-8">{getText(selectedItem.description)}</p>
                      </div>

                      {/* PDF viewer */}
                      {selectedItem.pdfUrl && (
                        <div className="mb-8">
                          <h3 className="text-sm uppercase tracking-wider text-neutral-500 mb-4 flex items-center gap-2">
                            <BookOpen size={16} />
                            PDF Document
                          </h3>
                          <div className="rounded-lg overflow-hidden bg-white shadow-lg">
                            <iframe
                              src={getText(selectedItem.pdfUrl)}
                              width="100%"
                              height="600px"
                              title="PDF Document"
                              className="border-0"
                              onError={(e) => {
                                // Fallback if iframe fails
                                const iframe = e.target;
                                iframe.style.display = 'none';
                                const fallbackDiv = iframe.parentElement?.querySelector('.pdf-fallback');
                                if (fallbackDiv) fallbackDiv.style.display = 'block';
                              }}
                            />
                            <div className="pdf-fallback p-6 text-center bg-gray-50" style={{display: 'none'}}>
                              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                              <p className="text-gray-600 mb-4">PDF: {getText(selectedItem.pdfUrl).split('/').pop()}</p>
                              <a
                                href={getText(selectedItem.pdfUrl)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white rounded hover:bg-neutral-800 transition-colors"
                              >
                                <span>Open PDF in New Tab</span>
                                <ExternalLink size={16} />
                              </a>
                            </div>
                          </div>
                        </div>
                      )}

                      {selectedItem.additionalInfo && (
                        <div className="mb-8">
                          <h3 className="text-sm uppercase tracking-wider text-neutral-500 mb-2">{t.additionalInfo}</h3>
                          <p className="text-neutral-700 leading-relaxed">{getText(selectedItem.additionalInfo)}</p>
                        </div>
                      )}

                      {/* Link to download PDF */}
                      {selectedItem.pdfUrl && (
                        <a
                          href={getText(selectedItem.pdfUrl)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-900 text-white rounded-full hover:bg-neutral-800 transition-colors"
                        >
                          <span>Download PDF</span>
                          <ExternalLink size={16} />
                        </a>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="p-6 md:p-12">
                    <div className="max-w-4xl mx-auto">
                      {/* Cover image - same as thumbnail */}
                      <div className="mb-8">
                        <div className="aspect-[3/4] max-w-xs mx-auto mb-6">
                          <img
                            src={selectedItem.thumbnail || '/images/base.jpg'}
                            alt={getText(selectedItem.title)}
                            className="w-full h-auto object-contain rounded-lg shadow-lg"
                            onError={(e) => {
                              e.target.src = '/images/base.jpg'; // fallback image if specified image fails to load
                            }}
                          />
                        </div>

                        <span className="inline-block px-3 py-1 bg-neutral-100 rounded-full text-xs uppercase tracking-wider text-neutral-600 mb-4">
                          {Array.isArray(selectedItem.type)
                            ? selectedItem.type
                                .map(typeId => {
                                  const category = categories.find(c => c.id === typeId);
                                  return category ? category.label : typeId;
                                })
                                .join(', ')
                            : (categories.find(c => c.id === selectedItem.type)?.label || selectedItem.type)}
                        </span>
                        <h2 className="text-2xl md:text-4xl font-light mb-4">{getText(selectedItem.title)}</h2>

                        <div className="flex flex-wrap gap-4 text-neutral-600 mb-6">
                          <span className="flex items-center gap-2">
                            <Calendar size={16} />
                            {selectedItem.year}
                          </span>
                          {selectedItem.venue && (
                            <div className="flex items-start gap-2">
                              <MapPin size={16} className="mt-1 flex-shrink-0" />
                              <div
                                dangerouslySetInnerHTML={{ __html: getText(selectedItem.venue) }}
                              />
                            </div>
                          )}
                          {selectedItem.producer && (
                            <span className="flex items-center gap-2">
                              <Users size={16} />
                              {getText(selectedItem.producer)}
                            </span>
                          )}
                        </div>

                        <p className="text-base md:text-lg text-neutral-700 leading-relaxed mb-8">{getText(selectedItem.description)}</p>

                        {/* Credits */}
                        {selectedItem.credits && selectedItem.credits.length > 0 && (
                          <div className="mb-8">
                            <h3 className="text-sm uppercase tracking-wider text-neutral-500 mb-3 flex items-center gap-2">
                              <Users size={16} />
                              {t.credits}
                            </h3>
                            <div className="space-y-2">
                              {selectedItem.credits.map((credit, idx) => (
                                <div key={idx} className="flex gap-3">
                                  <span className="text-neutral-500 min-w-[100px] md:min-w-[120px] text-sm">{getText(credit.role)}</span>
                                  <span className="font-medium text-sm">{credit.name}</span>
                                </div> // This is the closing div for the credit item
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Media */}
                      {selectedItem.media && selectedItem.media.length > 0 && (
                        <div className="mb-8">
                          <h3 className="text-sm uppercase tracking-wider text-neutral-500 mb-4 flex items-center gap-2">
                            <Film size={16} />
                            {t.documentation}
                          </h3>
                          <div className="grid md:grid-cols-2 gap-4">
                            {selectedItem.media.map((media, idx) => ( // Media items in the modal
                              <div key={idx} className="rounded-lg overflow-hidden bg-neutral-100">
                                {media.type === 'image' ? (
                                  <img src={media.url} alt="" className="w-full h-auto object-contain max-h-64" />
                                ) : (
                                  <iframe
                                    src={media.url}
                                    className="w-full aspect-video"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                  />
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Press */}
                      {selectedItem.press && selectedItem.press.length > 0 && (
                        <div>
                          <h3 className="text-sm uppercase tracking-wider text-neutral-500 mb-4">{t.press}</h3>
                          <div className="space-y-4">
                            {selectedItem.press.map((item, idx) => (
                              <a
                                key={idx}
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block border-l-2 border-neutral-200 hover:border-neutral-400 pl-4 transition-colors group"
                              >
                                <p className="text-neutral-700 group-hover:text-neutral-900 text-sm">
                                  {getText(item.text)}
                                </p>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

const SafeEmail = ({ user, host, children }) => {
  // This component constructs the mailto link on the client side,
  // making it harder for simple bots to scrape the email address.
  return (
    <a href={`mailto:${user}@${host}`} className="hover:underline">
      {children}
    </a>
  );
};

const PathItem = ({ item, index, total, pathRefs, animationOffset, mousePos, onSelect, getText }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  useAnimationFrame(() => {
    const pathCount = 5;
    const pathIndex = index % pathCount;
    const path = pathRefs.current[pathIndex];
    if (!path) return;

    // Correctly calculate the ACTUAL number of items on this specific path.
    const itemsOnThisPath = Math.floor((total - 1 - pathIndex) / pathCount) + 1;

    // Correctly determine the item's sequential index on its specific path.
    const itemIndexOnPath = Math.floor(index / pathCount);

    const totalLength = path.getTotalLength();
    // To create a gap, we divide the path into N segments for N items, which naturally leaves a gap in a closed loop.
    const baseProgress = itemIndexOnPath / itemsOnThisPath;
    const animatedProgress = (baseProgress + animationOffset) % 1;
    const point = path.getPointAtLength(animatedProgress * totalLength);

    // Add mouse wave effect
    const distX = mousePos.x - point.x;
    const distY = mousePos.y - point.y;
    const dist = Math.sqrt(distX * distX + distY * distY);
    const influence = Math.max(0, 1 - dist / 200) * 0.15;

    const newX = point.x + distX * influence;
    const newY = point.y + distY * influence;

    x.set(newX);
    y.set(newY);
  });

  // Set different heights for publications vs other items.
  const isPublication = item.type === 'publication';
  const itemHeight = isPublication ? 180 : 144; // Restore original size for publications

  return (
    <motion.div // This is the main container for each floating item
      layout
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5 }}
      transition={{ layout: { duration: 0.5 }, opacity: { duration: 0.3 } }}
      className="absolute cursor-pointer"
      style={{
        height: `${itemHeight}px`,
        y: useTransform(y, val => val - itemHeight / 2), // Center vertically
        x: useTransform(x, val => val - (isPublication ? 120 : (item.type === 'text' ? 64 : 96))), // Adjust horizontal centering based on size
      }}
      onClick={() => onSelect(item)}
      whileHover={{ scale: 1.05 }}
    >
      <div className="relative w-full h-full">
      {item.type === 'text' ? (
          <>
            <div className="flex items-center justify-center w-32 h-full bg-neutral-100/50 rounded-md"> {/* w-32 is 80% of original w-40 */}
              <BookOpen className="w-1/3 h-1/3 text-neutral-400" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-2">
              <h3 className="text-neutral-800 text-xs font-medium line-clamp-2">{getText(item.title)}</h3>
            </div>
          </>
        ) : (
          <>
            <img
              src={item.thumbnail || '/images/base.jpg'}
              alt={getText(item.title)}
              className="h-full w-auto" // This is the key change: height is fixed, width is auto
              onError={(e) => { e.target.src = '/images/base.jpg'; }}
            />
            {/* This div creates a gradient overlay ONLY at the bottom, behind the text */}
            <div className="absolute bottom-0 left-0 right-0 p-3 pt-8 bg-gradient-to-t from-black/80 to-transparent">
              {item.type === 'publication' ? (
                <p className="text-white/80 text-xs">{item.year}</p>
              ) : (
                <>
                  <h3 className="text-white text-xs font-medium line-clamp-2 mb-1">{getText(item.title)}</h3>
                  <p className="text-white/80 text-xs">{item.year}</p>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
};

const AnimatedCanvas = memo(({ items, mousePos, onSelect, getText }) => {
  const pathRefs = useRef([]);
  const [animationOffset, setAnimationOffset] = useState(0);

  useEffect(() => {
    let animationFrame;
    const animateLoop = () => {
      setAnimationOffset(prev => prev + 0.0005); // Controls speed
      animationFrame = requestAnimationFrame(animateLoop);
    };
    animationFrame = requestAnimationFrame(animateLoop);

    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return (
    <div className="relative">
      <svg
        className="w-full"
        viewBox="0 0 1200 2400"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Define the 5 paths */}
        <path
          ref={el => pathRefs.current[0] = el}
          d="M 20 150 C 500 -150, 700 450, 1180 150 C 700 -150, 500 450, 20 150 Z"
          fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="2"
        />
        <path
          ref={el => pathRefs.current[1] = el}
          d="M 20 350 C 300 50, 900 650, 1180 350 C 900 50, 300 650, 20 350 Z"
          fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="2"
        />
        <path
          ref={el => pathRefs.current[2] = el}
          d="M 20 550 C 600 300, 600 800, 1180 550 C 600 300, 600 800, 20 550 Z"
          fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="2"
        />
        <path
          ref={el => pathRefs.current[3] = el}
          d="M 20 750 C 300 550, 900 950, 1180 750 C 900 550, 300 950, 20 750 Z"
          fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="2"
        />
        <path
          ref={el => pathRefs.current[4] = el}
          d="M 20 950 C 500 750, 700 1250, 1180 950 C 700 750, 500 1250, 20 950 Z"
          fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="2"
        />
      </svg>

      {/* Items positioned along paths */}
      <div className="absolute inset-0">
        <AnimatePresence mode="popLayout">
          {items.map((item, index) => (
            <PathItem
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

export default PortfolioArchive;
