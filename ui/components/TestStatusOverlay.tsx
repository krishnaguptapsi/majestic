/**
 * Test Status Overlay Component
 * Displays test execution progress with bot mascot and animated progress bar
 * Uses glassmorphism and neon effects for futuristic appearance
 */

import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import { BotMascot } from './BotMascot';
import { useThemeColors, useThemeSpacing, useThemeShadows } from '../context/ThemeContext';

// ============================================================================
// TYPES
// ============================================================================

interface TestStatusOverlayProps {
  isRunning: boolean;
  passedCount: number;
  failedCount: number;
  totalCount: number;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'center';
  showBot?: boolean;
  compact?: boolean;
}

// ============================================================================
// STYLED COMPONENTS
// ============================================================================

const Container = styled(motion.div)<{ position: string; compact: boolean }>`
  position: fixed;
  ${({ position }) => {
    switch (position) {
      case 'bottom-right':
        return 'bottom: 20px; right: 20px;';
      case 'bottom-left':
        return 'bottom: 20px; left: 20px;';
      case 'top-right':
        return 'top: 20px; right: 20px;';
      case 'top-left':
        return 'top: 20px; left: 20px;';
      case 'center':
        return 'top: 50%; left: 50%; transform: translate(-50%, -50%);';
      default:
        return 'bottom: 20px; right: 20px;';
    }
  }}

  max-width: ${({ compact }) => (compact ? '280px' : '360px')};
  background: rgba(30, 30, 50, 0.95);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(200, 50, 255, 0.3);
  border-radius: 16px;
  padding: ${({ compact }) => (compact ? '16px' : '24px')};
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), 0 0 20px rgba(200, 50, 255, 0.2);
  z-index: 900;
  will-change: opacity, transform;

  @media (max-width: 640px) {
    max-width: 280px;
    padding: ${({ compact }) => (compact ? '12px' : '16px')};
    bottom: 12px;
    right: 12px;
    left: auto;
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none !important;
  }
`;

const Content = styled.div<{ compact: boolean }>`
  display: flex;
  flex-direction: ${({ compact }) => (compact ? 'row' : 'column')};
  gap: ${({ compact }) => (compact ? '12px' : '16px')};
  align-items: ${({ compact }) => (compact ? 'center' : 'center')};
`;

const BotSection = styled.div<{ compact: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  ${({ compact }) => (compact ? 'flex-shrink: 0;' : '')}
`;

const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
`;

const StatusText = styled(motion.div)<{ state: 'running' | 'success' | 'failed' | 'idle' }>`
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  text-align: center;
  color: ${({ state }) => {
    switch (state) {
      case 'success':
        return 'hsl(150, 100%, 50%)';
      case 'failed':
        return 'hsl(0, 100%, 50%)';
      case 'running':
        return 'hsl(200, 100%, 50%)';
      default:
        return 'var(--color-text-secondary)';
    }
  }};
  text-shadow: ${({ state }) => {
    switch (state) {
      case 'success':
        return '0 0 10px hsl(150, 100%, 50%)';
      case 'failed':
        return '0 0 10px hsl(0, 100%, 50%)';
      case 'running':
        return '0 0 10px hsl(200, 100%, 50%)';
      default:
        return 'none';
    }
  }};
  will-change: color, text-shadow;
`;

const TestCounter = styled.div`
  display: flex;
  justify-content: space-around;
  gap: 12px;
  font-size: 12px;
`;

const CountItem = styled.div<{ type: 'passed' | 'failed' | 'total' }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  flex: 1;

  label {
    color: var(--color-text-secondary);
    font-weight: 500;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.3px;
  }

  value {
    color: ${({ type }) => {
      switch (type) {
        case 'passed':
          return 'hsl(150, 100%, 50%)';
        case 'failed':
          return 'hsl(0, 100%, 50%)';
        default:
          return 'var(--color-text-primary)';
      }
    }};
    font-weight: 700;
    font-size: 16px;
    text-shadow: ${({ type }) => {
      switch (type) {
        case 'passed':
          return '0 0 8px hsl(150, 100%, 50%)';
        case 'failed':
          return '0 0 8px hsl(0, 100%, 50%)';
        default:
          return 'none';
      }
    }};
  }
`;

const ProgressContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ProgressLabel = styled.div`
  font-size: 12px;
  color: var(--color-text-secondary);
  text-align: center;
`;

const ProgressBarWrapper = styled.div`
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
`;

const ProgressBar = styled(motion.div)<{ state: 'success' | 'failed' | 'running' }>`
  height: 100%;
  background: ${({ state }) => {
    switch (state) {
      case 'success':
        return 'linear-gradient(90deg, hsl(150, 100%, 50%), hsl(200, 100%, 50%))';
      case 'failed':
        return 'linear-gradient(90deg, hsl(0, 100%, 50%), hsl(330, 100%, 50%))';
      default:
        return 'linear-gradient(90deg, hsl(280, 100%, 50%), hsl(200, 100%, 50%), hsl(150, 100%, 50%))';
    }
  }};
  box-shadow: ${({ state }) => {
    switch (state) {
      case 'success':
        return '0 0 10px hsl(150, 100%, 50%)';
      case 'failed':
        return '0 0 10px hsl(0, 100%, 50%)';
      default:
        return '0 0 15px hsl(200, 100%, 50%)';
    }
  }};
  border-radius: 3px;
  will-change: width;
`;

const EmptyState = styled.div`
  text-align: center;
  color: var(--color-text-secondary);
  font-size: 12px;
  padding: 8px;
`;

// ============================================================================
// ANIMATION VARIANTS
// ============================================================================

const containerVariants = {
  initial: { opacity: 0, scale: 0.8, y: 20 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      damping: 12,
      stiffness: 200,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    y: 20,
    transition: { duration: 0.2 },
  },
};

const statusTextVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

const progressVariants = {
  initial: { scaleX: 0 },
  animate: { scaleX: 1 },
  transition: { duration: 0.5, ease: 'easeOut' },
};

// ============================================================================
// TEST STATUS OVERLAY COMPONENT
// ============================================================================

export const TestStatusOverlay: React.FC<TestStatusOverlayProps> = ({
  isRunning,
  passedCount,
  failedCount,
  totalCount,
  position = 'bottom-right',
  showBot = true,
  compact = false,
}) => {
  // Calculate derived values
  const completedCount = passedCount + failedCount;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
  const isSuccess = !isRunning && failedCount === 0 && completedCount > 0;
  const isFailed = !isRunning && failedCount > 0;

  // Determine bot state
  const botState = useMemo(() => {
    if (isRunning) return 'running';
    if (isSuccess) return 'success';
    if (isFailed) return 'failed';
    return 'idle';
  }, [isRunning, isSuccess, isFailed]);

  // Determine status message
  const statusMessage = useMemo(() => {
    if (isRunning) return 'Testing...';
    if (isSuccess) return 'All Tests Pass! 🎉';
    if (isFailed) return `${failedCount} Test${failedCount !== 1 ? 's' : ''} Failed`;
    return 'Ready';
  }, [isRunning, isSuccess, isFailed, failedCount]);

  // Determine progress state for color
  const progressState = useMemo((): 'success' | 'failed' | 'running' => {
    if (isRunning) return 'running';
    if (isFailed) return 'failed';
    return 'success';
  }, [isRunning, isFailed]);

  // Only show overlay if running or just completed with failures
  if (!isRunning && completedCount === 0) {
    return null;
  }

  return (
    <AnimatePresence>
      <Container
        variants={containerVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        position={position}
        compact={compact}
      >
        <Content compact={compact}>
          {/* Bot Mascot */}
          {showBot && (
            <BotSection compact={compact}>
              <BotMascot state={botState} size={compact ? 'sm' : 'md'} showLabel={false} />
            </BotSection>
          )}

          {/* Info Section */}
          <InfoSection>
            {/* Status Text */}
            <StatusText state={botState} variants={statusTextVariants}>
              {statusMessage}
            </StatusText>

            {/* Test Counter */}
            {totalCount > 0 && (
              <TestCounter>
                <CountItem type="passed">
                  <label>Passed</label>
                  <value>{passedCount}</value>
                </CountItem>
                <CountItem type="failed">
                  <label>Failed</label>
                  <value>{failedCount}</value>
                </CountItem>
                <CountItem type="total">
                  <label>Total</label>
                  <value>{totalCount}</value>
                </CountItem>
              </TestCounter>
            )}

            {/* Progress Bar */}
            {totalCount > 0 && (
              <ProgressContainer>
                <ProgressLabel>
                  {completedCount}/{totalCount} ({Math.round(progress)}%)
                </ProgressLabel>
                <ProgressBarWrapper>
                  <ProgressBar
                    state={progressState}
                    variants={progressVariants}
                    initial="initial"
                    animate="animate"
                    style={{ width: `${progress}%` }}
                  />
                </ProgressBarWrapper>
              </ProgressContainer>
            )}

            {/* Empty state */}
            {totalCount === 0 && (
              <EmptyState>
                Waiting for tests...
              </EmptyState>
            )}
          </InfoSection>
        </Content>
      </Container>
    </AnimatePresence>
  );
};

// ============================================================================
// PRESET COMPOSITIONS
// ============================================================================

/**
 * Bottom right positioned overlay (default)
 */
export const TestStatusBottomRight: React.FC<
  Omit<TestStatusOverlayProps, 'position'>
> = (props) => <TestStatusOverlay {...props} position="bottom-right" />;

/**
 * Bottom left positioned overlay
 */
export const TestStatusBottomLeft: React.FC<
  Omit<TestStatusOverlayProps, 'position'>
> = (props) => <TestStatusOverlay {...props} position="bottom-left" />;

/**
 * Compact mode (horizontal layout)
 */
export const TestStatusCompact: React.FC<
  Omit<TestStatusOverlayProps, 'compact'>
> = (props) => <TestStatusOverlay {...props} compact showBot={false} />;

/**
 * Center positioned (full overlay)
 */
export const TestStatusCenter: React.FC<
  Omit<TestStatusOverlayProps, 'position'>
> = (props) => <TestStatusOverlay {...props} position="center" />;
