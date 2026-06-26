# PulseBox

A beautiful, accessible Progressive Web App for guided box breathing exercises. Built with React, TypeScript, Vite, and PWA support.

## Features

- **Box Breathing Timer** - Visual timer with animated breathing circle and progress ring
- **Four Phases** - Inhale, Hold, Exhale, Hold with smooth transitions
- **Three Difficulty Levels** - Newbie (3s), Beginner (4s), Advanced (5s) per step
- **Audio Feedback** - Gentle tones for phase transitions using Web Audio API
- **Haptic Feedback** - Vibration patterns via web-haptics library with native fallback
- **Progress Tracking** - Cycle counter and total session time
- **Full Accessibility** - Keyboard navigation, ARIA labels, reduced motion support
- **PWA Ready** - Installable, works offline with service worker
- **Responsive Design** - Works on mobile, tablet, and desktop

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Starts the development server at http://localhost:5173

### Build for Production

```bash
npm run build
```

Outputs to `dist/` directory

### Preview Production Build

```bash
npm run preview
```

### Linting

```bash
npm run lint
```

## Project Structure

```
src/
├── components/
│   ├── BreathingTimer.tsx    # Main timer component with visualizations
│   └── BreathingTimer.css    # Styles for timer and animations
├── hooks/
│   └── useBreathing.ts       # Core breathing logic and state management
├── types/
│   └── breathing.ts          # TypeScript types and constants
├── App.tsx                   # Root app component
├── main.tsx                  # Entry point
└── index.css                 # Global styles
```

## Technologies

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **vite-plugin-pwa** - PWA support with Workbox
- **web-haptics** - Haptic feedback patterns
- **Web Audio API** - Audio tone generation
- **CSS Animations** - Smooth breathing visualizations

## PWA Features

- **Offline Support** - Service worker caches all assets
- **Installable** - Add to home screen on mobile/desktop
- **Auto-update** - Checks for updates on each visit
- **Manifest** - Configured for standalone display mode

## Accessibility

- Semantic HTML with proper ARIA roles and labels
- Keyboard navigation (Space to start/pause)
- High contrast colors meeting WCAG AA
- Reduced motion support via `prefers-reduced-motion`
- Screen reader friendly with live regions
- Focus visible states for all interactive elements

## Breathing Technique

PulseBox implements **box breathing** (also known as square breathing):

1. **Inhale** - Breathe in slowly through nose
2. **Hold** - Hold the breath
3. **Exhale** - Breathe out steadily through mouth
4. **Hold** - Hold the breath again

Each phase is equal duration. This technique is used by athletes, military personnel, and for stress reduction.

## License

MIT