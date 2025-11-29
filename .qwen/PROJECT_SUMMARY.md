# Project Summary

## Overall Goal
Create a React portfolio/archive application that displays publications, projects, and texts with an immersive UI featuring animated cards that move along curved paths with depth perspective, proper aspect ratios for different content types, and smooth navigation.

## Key Knowledge
- Technology Stack: React, Vite, Framer Motion for animations, Lucide React for icons
- Data Structure: `data.json` contains publications, projects, and texts with multilingual fields using `{ "sl": "...", "en": "..." }` format
- Card Types: Publications (book covers - vertical aspect ratio), Projects (horizontal photos - wider aspect ratio), Texts (reading docs - with PDF support)
- Build Command: `npm run dev` for development server
- File Locations: `/public/images/` stores both images and PDFs, `/public/pdfs/` (deprecated - all files now in images folder)
- Important Files: `App.jsx` (main component), `data.json` (content), `translations.json` (language support)

## Recent Actions
- [DONE] Fixed data.json syntax errors that prevented app from loading
- [DONE] Added missing multilingual fields to all publications for consistency
- [DONE] Implemented producer field support for projects in both data and UI
- [DONE] Added text category with PDF support and reading icon
- [DONE] Created modal PDF viewer with fallback download option
- [DONE] Implemented Moebius-style curved paths for card animations
- [DONE] Added responsive interaction (cards slow down when hovering/selecting)
- [DONE] Slowed animation speed by 50% for better user interaction
- [DONE] Increased project card size to 240px width for better visibility of horizontal photos
- [DONE] Properly fitted horizontal photos in project cards without cropping using appropriate aspect ratios
- [DONE] Fixed rendering glitches by removing problematic visual effects

## Current Plan
- [DONE] Maintain stable performance while preserving depth effect and appropriate card sizing
- [IN PROGRESS] Optimize rendering to eliminate remaining visual artifacts
- [TODO] Add accessibility improvements for keyboard navigation
- [TODO] Fine-tune animation parameters for optimal user experience
- [TODO] Implement additional filtering options based on user feedback

---

## Summary Metadata
**Update time**: 2025-11-28T08:33:37.313Z 
