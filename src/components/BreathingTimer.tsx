import { useBreathing } from '../hooks/useBreathing';
import { BreathPhase } from '../types/breathing';
import './BreathingTimer.css';

export function BreathingTimer() {
  const {
    currentPhase,
    phaseIndex,
    timeRemaining,
    isRunning,
    isMuted,
    difficulty,
    completedCycles,
    phaseProgress,
    cycleProgress,
    stepDuration,
    phaseLabel,
    phaseDescription,
    phaseColor,
    vibrationEnabled,
    start,
    pause,
    reset,
    toggleMute,
    toggleVibration,
    setDifficulty,
    allPhases,
  } = useBreathing();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.code === 'Space') {
      e.preventDefault();
      if (isRunning) {
        pause();
      } else {
        start();
      }
    }
  };

  return (
    <div className="breathing-timer" onKeyDown={handleKeyDown} tabIndex={0} role="button" aria-label={isRunning ? 'Pause breathing' : 'Start breathing'}>
      {/* Background glow based on current phase */}
      <div
        className="phase-glow"
        style={{ backgroundColor: phaseColor, opacity: 0.15 + phaseProgress * 0.1 }}
      />

      {/* Phase indicator dots */}
      <div className="phase-indicators" aria-label="Breathing phases">
        {allPhases.map(({ phase, color }, index) => (
          <div
            key={phase}
            className={`phase-dot ${index === phaseIndex ? 'active' : ''} ${index < phaseIndex ? 'completed' : ''}`}
            style={{ borderColor: color, backgroundColor: index <= phaseIndex ? color : 'transparent' }}
            aria-current={index === phaseIndex ? 'step' : undefined}
          >
            <span className="phase-dot-label">{index + 1}</span>
          </div>
        ))}
      </div>

      {/* Main breathing circle visualization */}
      <div className="breathing-circle-container">
        {/* Outer progress ring */}
        <svg className="progress-ring" viewBox="0 0 280 280" role="img" aria-label={`Breathing progress: ${Math.round(cycleProgress * 100)}% complete`}>
          <circle
            className="progress-ring-bg"
            cx="140"
            cy="140"
            r="120"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            style={{ color: phaseColor }}
          />
          <circle
            className="progress-ring-fill"
            cx="140"
            cy="140"
            r="120"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            strokeDasharray={753.98} // 2 * PI * 120
            strokeDashoffset={753.98 * (1 - cycleProgress)}
            strokeLinecap="round"
            style={{ color: phaseColor }}
          />
        </svg>

        {/* Inner animated circle */}
        <div
          className="breathing-circle"
          style={{
            backgroundColor: phaseColor,
            transform: `scale(${0.6 + phaseProgress * 0.4})`,
            boxShadow: `0 0 ${40 + phaseProgress * 60}px ${phaseColor}, 0 0 ${80 + phaseProgress * 100}px ${phaseColor}40`,
          }}
          aria-live="polite"
          aria-label={`${phaseLabel}: ${timeRemaining} seconds remaining`}
        >
          {/* Phase label */}
          <div className="phase-info">
            <div className="phase-label">{phaseLabel}</div>
            <div className="phase-description">{phaseDescription}</div>
            <div className="phase-timer" aria-label={`${timeRemaining} seconds remaining`}>
              {timeRemaining}
            </div>
          </div>

          {/* Animated particles */}
          <div className="particles" aria-hidden="true">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="particle"
                style={{
                  '--delay': `${i * 0.15}s`,
                  '--angle': `${i * 45}deg`,
                  '--color': phaseColor,
                }}
              />
            ))}
          </div>
        </div>

        {/* Center instruction text */}
        <div className="center-instruction" aria-live="polite">
          {isRunning ? (
            <>
              <span className="instruction-text">
                {phaseLabel === 'inhale' ? 'Breathe in...' : phaseLabel === 'exhale' ? 'Breathe out...' : 'Hold...'}
              </span>
            </>
          ) : (
            <>
              <span className="instruction-text">Press Space or tap to start</span>
            </>
          )}
        </div>
      </div>

      {/* Cycle counter */}
      <div className="cycle-counter" aria-label={`Completed cycles: ${completedCycles}`}>
        <span className="cycle-label">Cycles completed</span>
        <span className="cycle-count">{completedCycles}</span>
      </div>

      {/* Controls */}
      <div className="controls">
        <button
          className={`btn ${isRunning ? 'btn-pause' : 'btn-start'}`}
          onClick={isRunning ? pause : start}
          aria-label={isRunning ? 'Pause' : 'Start'}
          disabled={false}
        >
          {isRunning ? (
            <>
              <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="6" y="4" width="4" height="16" />
                <rect x="14" y="4" width="4" height="16" />
              </svg>
              <span>Pause</span>
            </>
          ) : (
            <>
              <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="5 3 19 12 5 21" />
              </svg>
              <span>Start</span>
            </>
          )}
        </button>

        <button
          className="btn btn-reset"
          onClick={reset}
          aria-label="Reset"
          disabled={!isRunning && completedCycles === 0 && phaseIndex === 0 && timeRemaining === stepDuration}
        >
          <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
          </svg>
          <span>Reset</span>
        </button>
      </div>

      {/* Settings panel */}
      <div className="settings-panel">
        <div className="setting-group">
          <label className="setting-label">
            <input
              type="checkbox"
              checked={isMuted}
              onChange={toggleMute}
              className="setting-checkbox"
            />
            <span className="setting-text">
              <svg className="setting-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {isMuted ? (
                  <>
                    <path d="M11 5L6 9H2v6h4l5 4V5z" />
                    <line x1="23" y1="9" x2="17" y2="15" />
                    <line x1="17" y1="9" x2="23" y2="15" />
                  </>
                ) : (
                  <>
                    <path d="M11 5L6 9H2v6h4l5 4V5z" />
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                  </>
                )}
              </svg>
              Mute audio
            </span>
          </label>
        </div>

        <div className="setting-group">
          <label className="setting-label">
            <input
              type="checkbox"
              checked={vibrationEnabled}
              onChange={toggleVibration}
              className="setting-checkbox"
            />
            <span className="setting-text">
              <svg className="setting-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M2 12a10 10 0 1 1 20 0" />
                <path d="M16 8a6 6 0 0 1 0 8" />
                <path d="M8 4a14 14 0 0 1 0 16" />
              </svg>
              Vibration
            </span>
          </label>
        </div>

        <div className="setting-group difficulty-selector">
          <span className="setting-text">Difficulty</span>
          <div className="difficulty-options" role="radiogroup" aria-label="Select difficulty level">
            {Object.entries({
              newbie: { label: 'Newbie', duration: '3s' },
              beginner: { label: 'Beginner', duration: '4s' },
              advanced: { label: 'Advanced', duration: '5s' },
            }).map(([key, value]) => (
              <button
                key={key}
                className={`difficulty-btn ${difficulty === key ? 'active' : ''}`}
                onClick={() => setDifficulty(key as 'newbie' | 'beginner' | 'advanced')}
                role="radio"
                aria-checked={difficulty === key}
                aria-label={`${value.label} - ${value.duration} per step`}
              >
                <span className="difficulty-label">{value.label}</span>
                <span className="difficulty-duration">{value.duration}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}