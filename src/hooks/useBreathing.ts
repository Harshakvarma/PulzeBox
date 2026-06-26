import { useState, useEffect, useCallback, useRef } from 'react';
import {
  type BreathPhase,
  type DifficultyLevel,
  type BreathingState,
  type BreathingSettings,
  DIFFICULTY_LEVELS,
  BREATH_PHASES,
  PHASE_LABELS,
  PHASE_DESCRIPTIONS,
  PHASE_COLORS
} from '../types/breathing';
import { WebHaptics, defaultPatterns } from 'web-haptics';

export function useBreathing() {
  const [state, setState] = useState<BreathingState>({
    currentPhase: 'inhale',
    phaseIndex: 0,
    timeRemaining: DIFFICULTY_LEVELS.beginner.stepDuration,
    isRunning: false,
    isMuted: false,
    difficulty: 'beginner',
    completedCycles: 0,
    totalSeconds: 0,
  });

  const [settings, setSettings] = useState<BreathingSettings>({
    difficulty: 'beginner',
    isMuted: false,
    vibrationEnabled: true,
  });

  const intervalRef = useRef<number | null>(null);
  const phaseStartTimeRef = useRef<number>(0);
  const sessionStartTimeRef = useRef<number>(0);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Initialize audio context
  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Play tone for phase transitions
  const playTone = useCallback((frequency: number, duration: number, type: OscillatorType = 'sine') => {
    if (state.isMuted || settings.isMuted || !audioContextRef.current) return;

    const ctx = audioContextRef.current;
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = type;

    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  }, [state.isMuted, settings.isMuted]);

  // Trigger vibration for phase transitions
  const triggerVibration = useCallback((pattern: number[]) => {
    if (!settings.vibrationEnabled) return;

    // Use web-haptics library (handles native navigator.vibrate internally)
    try {
      const haptics = new WebHaptics();
      haptics.trigger(pattern.length > 0 ? pattern : defaultPatterns.medium);
    } catch (e) {
      // Fallback to native API if web-haptics fails
      if ('vibrate' in navigator) {
        navigator.vibrate(pattern);
      }
    }
  }, [settings.vibrationEnabled]);

  // Get phase-specific audio and vibration patterns
  const getPhaseFeedback = useCallback((phase: BreathPhase) => {
    switch (phase) {
      case 'inhale':
        return { frequency: 440, duration: 0.15, vibration: [50, 50, 50] };
      case 'hold':
        return { frequency: 523, duration: 0.1, vibration: [100] };
      case 'exhale':
        return { frequency: 349, duration: 0.2, vibration: [80, 80, 80, 80] };
      case 'holdEnd':
        return { frequency: 392, duration: 0.1, vibration: [100] };
      default:
        return { frequency: 440, duration: 0.1, vibration: [50] };
    }
  }, []);

  // Start the breathing session
  const start = useCallback(() => {
    if (state.isRunning) return;

    const stepDuration = DIFFICULTY_LEVELS[settings.difficulty].stepDuration;
    const now = Date.now();

    setState(prev => ({
      ...prev,
      isRunning: true,
      currentPhase: 'inhale',
      phaseIndex: 0,
      timeRemaining: stepDuration,
      totalSeconds: 0,
    }));

    phaseStartTimeRef.current = now;
    sessionStartTimeRef.current = now;

    // Play initial inhale tone
    const inhaleFeedback = getPhaseFeedback('inhale');
    playTone(inhaleFeedback.frequency, inhaleFeedback.duration);
    triggerVibration(inhaleFeedback.vibration);
  }, [settings.difficulty, getPhaseFeedback, playTone, triggerVibration, state.isRunning]);

  // Pause the breathing session
  const pause = useCallback(() => {
    if (!state.isRunning) return;

    setState(prev => ({ ...prev, isRunning: false }));

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [state.isRunning]);

  // Reset the breathing session
  const reset = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    setState(prev => ({
      ...prev,
      currentPhase: 'inhale',
      phaseIndex: 0,
      timeRemaining: DIFFICULTY_LEVELS[settings.difficulty].stepDuration,
      isRunning: false,
      completedCycles: 0,
      totalSeconds: 0,
    }));
  }, [settings.difficulty]);

  // Toggle mute
  const toggleMute = useCallback(() => {
    setState(prev => ({ ...prev, isMuted: !prev.isMuted }));
    setSettings(prev => ({ ...prev, isMuted: !prev.isMuted }));
  }, []);

  // Toggle vibration
  const toggleVibration = useCallback(() => {
    setSettings(prev => ({ ...prev, vibrationEnabled: !prev.vibrationEnabled }));
  }, []);

  // Change difficulty
  const setDifficulty = useCallback((difficulty: DifficultyLevel) => {
    const stepDuration = DIFFICULTY_LEVELS[difficulty].stepDuration;

    setSettings(prev => ({ ...prev, difficulty }));
    setState(prev => ({
      ...prev,
      difficulty,
      timeRemaining: prev.isRunning ? stepDuration : stepDuration,
    }));
  }, []);

  // Main timer logic
  useEffect(() => {
    if (!state.isRunning) return;

    intervalRef.current = window.setInterval(() => {
      setState(prev => {
        const newTimeRemaining = prev.timeRemaining - 1;
        const newTotalSeconds = prev.totalSeconds + 1;

        if (newTimeRemaining <= 0) {
          // Phase complete, move to next phase
          const nextPhaseIndex = (prev.phaseIndex + 1) % 4;
          const nextPhase = BREATH_PHASES[nextPhaseIndex];
          const nextStepDuration = DIFFICULTY_LEVELS[prev.difficulty].stepDuration;

          // Play tone and vibration for new phase
          const feedback = getPhaseFeedback(nextPhase);
          playTone(feedback.frequency, feedback.duration);
          triggerVibration(feedback.vibration);

          // Check if completed a full cycle
          const newCompletedCycles = nextPhaseIndex === 0 ? prev.completedCycles + 1 : prev.completedCycles;

          return {
            ...prev,
            currentPhase: nextPhase,
            phaseIndex: nextPhaseIndex,
            timeRemaining: nextStepDuration,
            completedCycles: newCompletedCycles,
            totalSeconds: newTotalSeconds,
          };
        }

        return {
          ...prev,
          timeRemaining: newTimeRemaining,
          totalSeconds: newTotalSeconds,
        };
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [state.isRunning, state.difficulty, getPhaseFeedback, playTone, triggerVibration]);

  // Calculate progress for current phase (0-1)
  const phaseProgress = state.isRunning
    ? 1 - (state.timeRemaining / DIFFICULTY_LEVELS[state.difficulty].stepDuration)
    : 0;

  // Calculate overall cycle progress (0-1)
  const cycleProgress = (state.phaseIndex + phaseProgress) / 4;

  return {
    // State
    currentPhase: state.currentPhase,
    phaseIndex: state.phaseIndex,
    timeRemaining: state.timeRemaining,
    isRunning: state.isRunning,
    isMuted: state.isMuted,
    difficulty: state.difficulty,
    completedCycles: state.completedCycles,
    totalSeconds: state.totalSeconds,
    phaseProgress,
    cycleProgress,
    stepDuration: DIFFICULTY_LEVELS[state.difficulty].stepDuration,
    totalCycleDuration: DIFFICULTY_LEVELS[state.difficulty].totalDuration,

    // Phase info
    phaseLabel: PHASE_LABELS[state.currentPhase],
    phaseDescription: PHASE_DESCRIPTIONS[state.currentPhase],
    phaseColor: PHASE_COLORS[state.currentPhase],

    // Settings
    vibrationEnabled: settings.vibrationEnabled,

    // Actions
    start,
    pause,
    reset,
    toggleMute,
    toggleVibration,
    setDifficulty,

    // All phases for display
    allPhases: BREATH_PHASES.map(phase => ({
      phase,
      label: PHASE_LABELS[phase],
      description: PHASE_DESCRIPTIONS[phase],
      color: PHASE_COLORS[phase],
    })),
  };
}