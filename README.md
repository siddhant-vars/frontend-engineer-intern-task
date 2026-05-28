# Frontend Engineer Intern Assessment

## Overview

This project is a React + TypeScript dashboard application focused on debugging, performance optimization, responsive UI improvements, and better component structure.

## Improvements Made

### Bug Fixes

* Fixed existing UI and state-related issues
* Resolved search filtering inconsistencies
* Fixed empty search rendering issues

### Performance Optimizations

* Reduced unnecessary re-renders using `React.memo`
* Optimized filtering logic with `useMemo`
* Improved event handler performance with `useCallback`

### UI & Responsiveness

* Improved responsive layout using Tailwind CSS
* Enhanced spacing, shadows, hover effects, and visual hierarchy
* Added selected user highlighting
* Improved mobile responsiveness

### Search Improvements

* Added "User Not Found" empty state
* Improved search UX and feedback
* Added fallback messaging for invalid searches

## Tech Stack

* React
* TypeScript
* Vite
* Tailwind CSS

## Installation

```bash
npm install
```

## Run Development Server

```bash
npm run dev
```

## Build Project

```bash
npm run build
```

## Notes

* `node_modules` and generated files are excluded using `.gitignore`
* Focus was placed on maintainable structure, performance, and responsive UI design
