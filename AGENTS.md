# AGENTS.md - PulseBox Development Guide

This file provides guidance for AI agents working on the PulseBox codebase.

## Project Overview

PulseBox is a PWA for guided box breathing exercises. It features a visual timer with animated breathing circle, progress ring, audio/haptic feedback, and full accessibility support.

## Key Files & Architecture

### Core Logic
- **`src/hooks/useBreathing.ts`** - Main state management hook containing:
  - Breathing phases (inhale, hold, exhale, holdEnd)
  - Timer logic with 1-second intervals
  - Audio tone generation via Web Audio API
  - Haptic feedback via web-haptics library
  - Difficulty levels (newbie: 3s, beginner: 4s, advanced: 5s per step)
  - State: currentPhase, phaseIndex, timeRemaining, isRunning, completedCycles, totalSeconds

### Types
- **`src/types/breathing.ts`** - TypeScript interfaces and constants:
  - `BreathPhase` - 'inhale' | 'hold' | 'exhale' | 'holdEnd'
  - `DifficultyLevel` - 'newbie' | 'beginner' | 'advanced'
  - `BreathingState` - Complete state interface
  - `BreathingSettings` - User preferences
  - `DIFFICULTY_LEVELS` - Configuration per difficulty

### UI Components
- **`src/components/BreathingTimer.tsx`** - Main visual component:
  - Animated breathing circle with scale transitions
  - SVG progress ring (stroke-dashoffset animation)
  - Phase indicator dots (4 dots for 4 phases)
  - Particle effects during breathing
  - Cycle counter and total time display
  - Controls: Start/Pause, Reset
  - Settings: Mute, Vibration, Difficulty selector

- **`src/components/BreathingTimer.css`** - All styling including:
  - CSS animations for breathing circle and particles
  - Phase-specific colors (teal, gold, coral, purple)
  - Responsive design (mobile-first)
  - Reduced motion support
  - Dark mode adjustments

## Development Commands

```bash
npm run dev       # Start dev server
npm run build     # Production build (type-check + bundle)
npm run preview   # Preview production build
npm run lint      # Run oxlint
```

## Key Patterns

### State Management
- Uses React hooks (useState, useEffect, useCallback, useRef)
- Single source of truth in `useBreathing` hook
- State updates via functional setState for reliability

### Audio/Haptic Feedback
- Web Audio API for tones (created on mount, cleaned up on unmount)
- web-haptics library with native `navigator.vibrate` fallback
- Each phase has unique frequency and vibration pattern

### Accessibility
- Semantic HTML with ARIA roles/labels
- Keyboard: Space to start/pause, Tab navigation
- Live regions for phase announcements
- `prefers-reduced-motion` disables animations
- Focus-visible states on all interactive elements

### PWA
- Configured in `vite.config.ts` with `vite-plugin-pwa`
- GenerateSW mode with Workbox
- Manifest in `public/manifest.webmanifest`
- Service worker auto-updates

## Common Tasks

### Adding a New Difficulty Level
1. Add to `DIFFICULTY_LEVELS` in `src/types/breathing.ts`
2. Add button in `BreathingTimer.tsx` difficulty selector

### Modifying Phase Durations
- Currently all phases use same duration per difficulty
- Modify `stepDuration` in `DIFFICULTY_LEVELS` for equal phases
- For unequal phases, update timer logic in `useBreathing.ts`

### Changing Colors
- Update `PHASE_COLORS` in `src/types/breathing.ts`
- CSS uses `currentColor` inheritance from phase color

### Adding Audio/Haptic Patterns
- Modify `getPhaseFeedback` in `useBreathing.ts`
- Use `defaultPatterns` from web-haptics or custom arrays

## Code Style

- TypeScript with strict mode
- Type-only imports for types (`import type`)
- Functional components with hooks
- CSS custom properties for dynamic values
- No external UI libraries - vanilla CSS

## Testing

No test framework configured. Manual testing via:
- `npm run dev` - interactive testing
- `npm run build` - type checking
- `npm run lint` - code quality

## Performance Notes

- Audio context created once, reused
- Interval cleaned up on pause/unmount
- CSS animations use transform/opacity (GPU accelerated)
- Particles use CSS animations, not JS
- PWA caches all static assets