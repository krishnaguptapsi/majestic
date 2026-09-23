/**
 * Bot Mascot Component
 * Animated bot that responds to test execution states
 * Uses Framer Motion for smooth, performant animations
 */

import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import { useThemeColors } from '../context/ThemeContext';

// ============================================================================
// TYPES
// ============================================================================

export type BotState = 'idle' | 'running' | 'success' | 'failed';

interface BotMascotProps {
  state: BotState;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

// ============================================================================
// STYLED COMPONENTS
// ============================================================================

const BotContainer = styled(motion.div)<{ size: 'sm' | 'md' | 'lg' }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  will-change: transform;

  ${({ size }) => {
    switch (size) {
      case 'sm':
        return `font-size: 48px; gap: 8px;`;
      case 'lg':
        return `font-size: 120px; gap: 16px;`;
      case 'md':
      default:
        return `font-size: 80px; gap: 12px;`;
    }
  }}

  /* Respect prefers-reduced-motion */
  @media (prefers-reduced-motion: reduce) {
    * {
      animation: none !important;
      transition: none !important;
    }
  }
`;

const BotBody = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  will-change: transform;
  filter: drop-shadow(0 0 8px rgba(200, 50, 255, 0.3));

  @media (prefers-reduced-motion: reduce) {
    filter: none;
  }
`;

const BotLabel = styled(motion.div)`
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-secondary);
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  min-height: 20px;
  will-change: opacity;
`;

const Sparkle = styled(motion.div)`
  position: absolute;
  width: 8px;
  height: 8px;
  background: radial-gradient(circle, hsl(150, 100%, 50%), hsl(150, 100%, 30%));
  border-radius: 50%;
  box-shadow: 0 0 10px hsl(150, 100%, 50%);
  will-change: transform, opacity;
`;

const ProgressRing = styled(motion.div)`
  position: absolute;
  inset: -20px;
  border: 3px solid transparent;
  border-top-color: hsl(200, 100%, 50%);
  border-right-color: hsl(280, 100%, 50%);
  border-radius: 50%;
  will-change: transform;
`;

// ============================================================================
// ANIMATION VARIANTS
// ============================================================================

const idleVariants = {
  initial: { y: 0, rotate: 0, scale: 1 },
  animate: {
    y: [-8, 8, -8],
    rotate: [0, 2, -2, 0],
    scale: [1, 1.02, 1],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

const runningVariants = {
  initial: { rotate: 0, scale: 1 },
  animate: {
    rotate: 360,
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};

const successVariants = {
  initial: { scale: 1, rotate: 0 },
  animate: {
    scale: [1, 1.15, 1],
    rotate: 360,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

const failedVariants = {
  initial: { x: 0, y: 0, rotate: 0 },
  animate: {
    x: [-6, 6, -6, 6, -3, 3, 0],
    rotate: [0, 3, -3, 3, -3, 0],
    transition: {
      duration: 0.6,
      ease: 'easeInOut',
    },
  },
};

const labelVariants = {
  idle: { opacity: 0.6 },
  running: { opacity: 1, color: 'hsl(200, 100%, 50%)' },
  success: { opacity: 1, color: 'hsl(150, 100%, 45%)' },
  failed: { opacity: 1, color: 'hsl(0, 100%, 50%)' },
};

const progressRingVariants = {
  initial: { rotate: 0 },
  animate: {
    rotate: 360,
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};

const sparkleVariants = (index: number) => ({
  initial: { scale: 0, opacity: 0 },
  animate: {
    scale: [0, 1, 0],
    opacity: [0, 1, 0],
    x: [0, Math.cos((index / 3) * Math.PI * 2) * 30, Math.cos((index / 3) * Math.PI * 2) * 50],
    y: [0, Math.sin((index / 3) * Math.PI * 2) * 30, Math.sin((index / 3) * Math.PI * 2) * 50],
    transition: {
      duration: 0.8,
      delay: index * 0.1,
      ease: 'easeOut',
    },
  },
  exit: { scale: 0, opacity: 0 },
});

// ============================================================================
// BOT MASCOT COMPONENT
// ============================================================================

export const BotMascot: React.FC<BotMascotProps> = ({ state, size = 'md', showLabel = true }) => {
  const colors = useThemeColors();

  // Select animation variant based on state
  const botVariants = useMemo(() => {
    switch (state) {
      case 'idle':
        return idleVariants;
      case 'running':
        return runningVariants;
      case 'success':
        return successVariants;
      case 'failed':
        return failedVariants;
      default:
        return idleVariants;
    }
  }, [state]);

  // Get label text
  const labelText = useMemo(() => {
    switch (state) {
      case 'idle':
        return 'Ready';
      case 'running':
        return 'Testing...';
      case 'success':
        return 'All Pass! 🎉';
      case 'failed':
        return 'Need Fix';
      default:
        return '';
    }
  }, [state]);

  // Generate sparkles for success state
  const sparkles = state === 'success' ? Array.from({ length: 3 }) : [];

  return (
    <BotContainer
      size={size}
      initial="initial"
      animate="animate"
      variants={botVariants}
    >
      <BotBody>
        {/* Main bot emoji */}
        🤖

        {/* Progress ring for running state */}
        <AnimatePresence>
          {state === 'running' && (
            <ProgressRing
              variants={progressRingVariants}
              initial="initial"
              animate="animate"
              exit={{ opacity: 0 }}
            />
          )}
        </AnimatePresence>

        {/* Sparkles for success state */}
        <AnimatePresence>
          {sparkles.map((_, index) => (
            <Sparkle
              key={`sparkle-${index}`}
              variants={sparkleVariants(index)}
              initial="initial"
              animate="animate"
              exit="exit"
            />
          ))}
        </AnimatePresence>
      </BotBody>

      {/* Bot state label */}
      {showLabel && (
        <BotLabel
          variants={labelVariants}
          initial={state}
          animate={state}
          transition={{ duration: 0.3 }}
        >
          {labelText}
        </BotLabel>
      )}
    </BotContainer>
  );
};

// ============================================================================
// BOT WITH STATE COUNTER - BONUS COMPONENT
// ============================================================================

interface BotWithStatsProps extends BotMascotProps {
  passedCount?: number;
  failedCount?: number;
  totalCount?: number;
  showStats?: boolean;
}

const StatsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 12px;
  padding: 12px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: 12px;
`;

const StatRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: center;
`;

const StatLabel = styled.span`
  color: var(--color-text-secondary);
  font-weight: 500;
`;

const StatValue = styled.span<{ color?: string }>`
  color: ${(props) => props.color || 'var(--color-text-primary)'};
  font-weight: 600;
  font-size: 14px;
`;

export const BotWithStats: React.FC<BotWithStatsProps> = ({
  state,
  size = 'md',
  showLabel = true,
  passedCount = 0,
  failedCount = 0,
  totalCount = 0,
  showStats = true,
}) => {
  return (
    <div>
      <BotMascot state={state} size={size} showLabel={showLabel} />
      {showStats && totalCount > 0 && (
        <StatsContainer>
          <StatRow>
            <StatLabel>Passed:</StatLabel>
            <StatValue color="hsl(150, 100%, 45%)">{passedCount}</StatValue>
          </StatRow>
          <StatRow>
            <StatLabel>Failed:</StatLabel>
            <StatValue color="hsl(0, 100%, 50%)">{failedCount}</StatValue>
          </StatRow>
          <StatRow>
            <StatLabel>Total:</StatLabel>
            <StatValue>{totalCount}</StatValue>
          </StatRow>
        </StatsContainer>
      )}
    </div>
  );
};

// ============================================================================
// PRESET COMPOSITIONS - EASY BOT STATES
// ============================================================================

export const BotIdle: React.FC<Omit<BotMascotProps, 'state'>> = (props) => (
  <BotMascot state="idle" {...props} />
);

export const BotRunning: React.FC<Omit<BotMascotProps, 'state'>> = (props) => (
  <BotMascot state="running" {...props} />
);

export const BotSuccess: React.FC<Omit<BotMascotProps, 'state'>> = (props) => (
  <BotMascot state="success" {...props} />
);

export const BotFailed: React.FC<Omit<BotMascotProps, 'state'>> = (props) => (
  <BotMascot state="failed" {...props} />
);
