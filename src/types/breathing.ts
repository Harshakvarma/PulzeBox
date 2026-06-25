export type BreathPhase = 'inhale' | 'hold' | 'exhale' | 'holdEnd';

export type DifficultyLevel = 'newbie' | 'beginner' | 'advanced';

export interface DifficultyConfig {
  label: string;
  description: string;
  stepDuration: number; // in seconds
  totalDuration: number; // in seconds (4 steps * stepDuration)
}

export const DIFFICULTY_LEVELS: Record<DifficultyLevel, DifficultyConfig> = {
  newbie: {
    label: 'Newbie',
    description: '3 seconds per step',
    stepDuration: 3,
    totalDuration: 12,
  },
  beginner: {
    label: 'Beginner',
    description: '4 seconds per step (default)',
    stepDuration: 4,
    totalDuration: 16,
  },
  advanced: {
    label: 'Advanced',
    description: '5 seconds per step',
    stepDuration: 5,
    totalDuration: 20,
  },
};

export const BREATH_PHASES: BreathPhase[] = ['inhale', 'hold', 'exhale', 'holdEnd'];

export const PHASE_LABELS: Record<BreathPhase, string> = {
  inhale: 'Inhale',
  hold: 'Hold',
  exhale: 'Exhale',
  holdEnd: 'Hold',
};

export const PHASE_DESCRIPTIONS: Record<BreathPhase, string> = {
  inhale: 'Breathe in slowly',
  hold: 'Hold your breath',
  exhale: 'Breathe out steadily',
  holdEnd: 'Hold your breath',
};

export const PHASE_COLORS: Record<BreathPhase, string> = {
  inhale: '#00d4aa',
  hold: '#ffd700',
  exhale: '#ff6b6b',
  holdEnd: '#a855f7',
};

export interface BreathingState {
  currentPhase: BreathPhase;
  phaseIndex: number;
  timeRemaining: number;
  isRunning: boolean;
  isMuted: boolean;
  difficulty: DifficultyLevel;
  completedCycles: number;
}

export interface BreathingSettings {
  difficulty: DifficultyLevel;
  isMuted: boolean;
  vibrationEnabled: boolean;
}