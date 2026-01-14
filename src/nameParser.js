/**
 * A more robust function to parse names from various string formats.
 * It handles multiple separators and attempts to filter out organization names.
 */
export const parseNames = (nameString, exclude = []) => {
  if (!nameString || typeof nameString !== 'string' || nameString.trim() === '') {
    return [];
  }

  // Expanded list of keywords that indicate an organization, producer, or role.
  const orgKeywords = [
    'ministrstvo', 'občina', 'zavod', 'gledališče', 'muzej', 'galerija',
    'center', 'festival', 'akademija', 'inštitut', 'kud', 'društvo',
    'group', 'theatre', 'museum', 'gallery', 'academy', 'institute',
    'foundation', 'production', 'sodelovanju', 'partnerji', 'producentka',
    'producent', 'producer', 'co-production', 'koprodukcija', 'založba',
    'publisher', 'company', 'studio', 'inc', 'doo', 'd.o.o.', 'ltd',
    'kulturno-umetniško', 'kulturni center', 'javni sklad', 'tourism board',
    'mestna občina', 'republic of slovenia', 'emanat', 'bunker', 'maska',
    'moment', 'ljudmila', 'glej', 'cukrarna', 'mglc', 'mgml'
  ];

  // Words to be filtered out completely if they appear as a "name".
  const junkWords = ['etc', 'and', 'in'];

  // 1. First, remove all content within parentheses.
  let cleanedString = nameString.replace(/\s*\(.*?\)\s*/g, ' ');

  // 2. Split by a robust set of delimiters. The apostrophe is NOT a delimiter.
  const names = cleanedString.split(/[,;&]|\s+in\s+/);

  return names
    .map(name => name.trim()) // Trim whitespace from each potential name.
    .filter(name => {
      if (!name) return false;
      if (exclude.includes(name)) return false; // Exclude specified names
      const lowerCaseName = name.toLowerCase();
      if (junkWords.includes(lowerCaseName)) return false; // Filter out junk words.
      // Check for exact match with org keywords, not just inclusion.
      if (orgKeywords.includes(lowerCaseName)) return false;
      if (lowerCaseName.length <= 2) return false; // Filter out very short strings like initials without a name.
      return true; // If it passes all checks, it's likely a valid name.
    });
};