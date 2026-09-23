/**
 * Styled UI Components Library
 * Production-grade components with glassmorphism, glow effects, and animations
 * Uses design tokens and theme system for consistency
 */

import styled from 'styled-components';
import { motion } from 'framer-motion';

// ============================================================================
// CARD COMPONENTS - GLASSMORPHISM
// ============================================================================

export const GlassCard = styled.div`
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
  transition: all 250ms ease-in-out;
  will-change: backdrop-filter, transform;

  &:hover {
    background: rgba(255, 255, 255, 0.12);
    border-color: rgba(255, 255, 255, 0.25);
    box-shadow: 0 8px 32px rgba(31, 38, 135, 0.45);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

export const MotionGlassCard = styled(motion.div)`
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
  will-change: backdrop-filter, transform;

  &:hover {
    background: rgba(255, 255, 255, 0.12);
    border-color: rgba(255, 255, 255, 0.25);
    box-shadow: 0 8px 32px rgba(31, 38, 135, 0.45);
  }
`;

// ============================================================================
// BUTTON COMPONENTS - NEON GLOWING
// ============================================================================

export const NeonButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 20px;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 250ms ease-in-out;
  box-shadow: 0 0 20px rgba(200, 50, 255, 0.5);
  will-change: transform, box-shadow;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 0 30px rgba(200, 50, 255, 0.8);
    background: var(--color-primaryLight);
  }

  &:active {
    transform: translateY(0);
  }

  &:focus-visible {
    outline: 2px solid var(--color-secondary);
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    box-shadow: none;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
    box-shadow: none;

    &:hover {
      box-shadow: none;
    }
  }
`;

export const MotionNeonButton = styled(motion.button)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 20px;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 0 20px rgba(200, 50, 255, 0.5);
  will-change: transform, box-shadow;

  &:hover {
    box-shadow: 0 0 30px rgba(200, 50, 255, 0.8);
    background: var(--color-primaryLight);
  }

  &:focus-visible {
    outline: 2px solid var(--color-secondary);
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    box-shadow: none;
  }
`;

// ============================================================================
// INPUT COMPONENTS - GLASSMORPHIC
// ============================================================================

export const GlassInput = styled.input`
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 8px;
  padding: 10px 16px;
  font-size: 14px;
  color: var(--color-text-primary);
  transition: all 250ms ease-in-out;
  will-change: border-color, box-shadow;

  &::placeholder {
    color: var(--color-text-secondary);
  }

  &:focus {
    outline: none;
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(200, 50, 255, 0.5);
    box-shadow: 0 0 15px rgba(200, 50, 255, 0.2);
  }

  &:hover:not(:focus) {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.2);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

export const GlassTextarea = styled.textarea`
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 8px;
  padding: 10px 16px;
  font-size: 14px;
  font-family: inherit;
  color: var(--color-text-primary);
  transition: all 250ms ease-in-out;
  resize: vertical;
  will-change: border-color, box-shadow;

  &::placeholder {
    color: var(--color-text-secondary);
  }

  &:focus {
    outline: none;
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(200, 50, 255, 0.5);
    box-shadow: 0 0 15px rgba(200, 50, 255, 0.2);
  }

  &:hover:not(:focus) {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.2);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

// ============================================================================
// BADGE & LABEL COMPONENTS
// ============================================================================

export const NeonBadge = styled.span<{ color?: string }>`
  display: inline-block;
  padding: 4px 12px;
  background: ${({ color }) => color || 'rgba(200, 50, 255, 0.2)'};
  border: 1px solid ${({ color }) => color || 'rgba(200, 50, 255, 0.5)'};
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: white;
  box-shadow: ${({ color }) => color ? `0 0 8px ${color}40` : '0 0 8px rgba(200, 50, 255, 0.4)'};
  will-change: box-shadow;

  &:hover {
    box-shadow: ${({ color }) => color ? `0 0 15px ${color}60` : '0 0 15px rgba(200, 50, 255, 0.6)'};
  }
`;

// ============================================================================
// DIVIDER & SEPARATOR COMPONENTS
// ============================================================================

export const GlassDivider = styled.div`
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(200, 50, 255, 0.3),
    transparent
  );
  margin: 20px 0;
  will-change: opacity;
`;

// ============================================================================
// CONTAINER COMPONENTS
// ============================================================================

export const GlassContainer = styled(motion.div)`
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  background: rgba(20, 20, 40, 0.9);
  border: 1px solid rgba(200, 50, 255, 0.2);
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), 0 0 20px rgba(200, 50, 255, 0.1);
  will-change: backdrop-filter;
`;

// ============================================================================
// TEXT COMPONENTS - GLOWING TEXT
// ============================================================================

export const GlowingText = styled.span<{ color?: string }>`
  color: ${({ color }) => color || 'hsl(200, 100%, 50%)'};
  text-shadow: 0 0 10px ${({ color }) => color || 'hsl(200, 100%, 50%)'}80,
    0 0 20px ${({ color }) => color || 'hsl(200, 100%, 50%)'}40;
  font-weight: 600;
  will-change: text-shadow;

  @media (prefers-reduced-motion: reduce) {
    text-shadow: none;
  }
`;

export const NeonHeading = styled.h1`
  color: var(--color-text-primary);
  text-shadow: 0 0 10px rgba(200, 50, 255, 0.6), 0 0 20px rgba(200, 50, 255, 0.3);
  font-size: 28px;
  font-weight: 700;
  margin: 0;
  will-change: text-shadow;

  @media (prefers-reduced-motion: reduce) {
    text-shadow: none;
  }
`;

// ============================================================================
// MOTION VARIANTS FOR ANIMATIONS
// ============================================================================

export const fadeInVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const slideInVariants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

export const slideUpVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
};

export const scaleInVariants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8 },
};

// ============================================================================
// INTERACTIVE VARIANTS
// ============================================================================

export const buttonHoverVariants = {
  rest: { scale: 1 },
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
};

export const cardHoverVariants = {
  rest: { y: 0 },
  hover: { y: -4 },
};

// ============================================================================
// FLEX CONTAINERS
// ============================================================================

export const FlexRow = styled.div<{ gap?: string; align?: string; justify?: string }>`
  display: flex;
  flex-direction: row;
  gap: ${({ gap }) => gap || '16px'};
  align-items: ${({ align }) => align || 'center'};
  justify-content: ${({ justify }) => justify || 'flex-start'};
`;

export const FlexColumn = styled.div<{ gap?: string; align?: string; justify?: string }>`
  display: flex;
  flex-direction: column;
  gap: ${({ gap }) => gap || '16px'};
  align-items: ${({ align }) => align || 'flex-start'};
  justify-content: ${({ justify }) => justify || 'flex-start'};
`;

// ============================================================================
// GRID LAYOUTS
// ============================================================================

export const GridLayout = styled.div<{ columns?: number; gap?: string }>`
  display: grid;
  grid-template-columns: repeat(${({ columns }) => columns || 2}, 1fr);
  gap: ${({ gap }) => gap || '20px'};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

// ============================================================================
// SPACING UTILITIES
// ============================================================================

export const Spacer = styled.div<{ size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' }>`
  ${({ size }) => {
    switch (size) {
      case 'xs':
        return 'height: 8px;';
      case 'sm':
        return 'height: 12px;';
      case 'md':
        return 'height: 20px;';
      case 'lg':
        return 'height: 32px;';
      case 'xl':
        return 'height: 48px;';
      default:
        return 'height: 20px;';
    }
  }}
`;
