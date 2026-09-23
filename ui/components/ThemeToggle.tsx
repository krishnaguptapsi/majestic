/**
 * Theme Toggle Button Component
 * Smooth dark/light mode switcher with animated sun/moon icons
 * Uses Framer Motion for fluid transitions
 */

import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { Moon, Sun } from 'react-feather';
import { useThemeToggle, useDarkMode } from '../context/ThemeContext';
import Tippy from '@tippyjs/react';

// ============================================================================
// STYLED COMPONENTS
// ============================================================================

const ToggleButton = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  padding: 0;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(200, 50, 255, 0.2);
  border-radius: 8px;
  cursor: pointer;
  color: var(--color-text-primary);
  transition: all 250ms ease-in-out;
  position: relative;
  overflow: hidden;

  /* Neon glow effect */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at center, rgba(200, 50, 255, 0.1), transparent);
    opacity: 0;
    transition: opacity 250ms ease-in-out;
    pointer-events: none;
  }

  &:hover {
    background: rgba(200, 50, 255, 0.1);
    border-color: rgba(200, 50, 255, 0.5);
    box-shadow: 0 0 15px rgba(200, 50, 255, 0.3);

    &::before {
      opacity: 1;
    }
  }

  &:active {
    transform: scale(0.95);
  }

  /* Accessibility: focus state */
  &:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }

  /* Respect prefers-reduced-motion */
  @media (prefers-reduced-motion: reduce) {
    transition: none;

    &::before {
      display: none;
    }
  }
`;

const IconWrapper = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

// ============================================================================
// ANIMATION VARIANTS
// ============================================================================

const iconVariants = {
  enter: {
    y: 0,
    opacity: 1,
    rotate: 0,
    transition: {
      type: 'spring',
      damping: 15,
      stiffness: 200,
    },
  },
  exit: {
    y: -20,
    opacity: 0,
    rotate: -180,
    transition: {
      duration: 0.2,
    },
  },
};

const buttonVariants = {
  tap: {
    scale: 0.95,
  },
  hover: {
    scale: 1.05,
  },
};

// ============================================================================
// THEME TOGGLE COMPONENT
// ============================================================================

export const ThemeToggle: React.FC = () => {
  const isDark = useDarkMode();
  const toggleTheme = useThemeToggle();

  const handleToggle = () => {
    toggleTheme();
  };

  return (
    <Tippy
      content={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      placement="bottom"
      duration={[200, 150]}
      arrow={false}
      theme="light"
    >
      <ToggleButton
        onClick={handleToggle}
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      >
        <IconWrapper
          key={isDark ? 'sun' : 'moon'}
          variants={iconVariants}
          initial="exit"
          animate="enter"
          exit="exit"
        >
          {isDark ? (
            <Sun size={20} strokeWidth={2} />
          ) : (
            <Moon size={20} strokeWidth={2} />
          )}
        </IconWrapper>
      </ToggleButton>
    </Tippy>
  );
};

// ============================================================================
// FLOATING THEME TOGGLE - ALTERNATIVE POSITION
// ============================================================================

const FloatingContainer = styled(motion.div)`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 800;
  will-change: opacity;

  @media (max-width: 640px) {
    top: 12px;
    right: 12px;
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none !important;
  }
`;

const floatingVariants = {
  initial: { opacity: 0, y: -20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      damping: 12,
      stiffness: 200,
    },
  },
};

export const FloatingThemeToggle: React.FC = () => {
  return (
    <FloatingContainer variants={floatingVariants} initial="initial" animate="animate">
      <ThemeToggle />
    </FloatingContainer>
  );
};

// ============================================================================
// INLINE THEME TOGGLE - FOR SIDEBARS/HEADERS
// ============================================================================

const InlineContainer = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
`;

interface InlineThemeToggleProps {
  label?: boolean;
}

export const InlineThemeToggle: React.FC<InlineThemeToggleProps> = ({ label = false }) => {
  const isDark = useDarkMode();

  return (
    <InlineContainer>
      {label && (
        <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
          {isDark ? '🌙 Dark' : '☀️ Light'}
        </span>
      )}
      <ThemeToggle />
    </InlineContainer>
  );
};

// ============================================================================
// THEME TOGGLE GROUP - MULTIPLE BUTTONS
// ============================================================================

const GroupContainer = styled.div`
  display: flex;
  gap: 8px;
  background: rgba(255, 255, 255, 0.03);
  padding: 8px;
  border-radius: 12px;
  border: 1px solid rgba(200, 50, 255, 0.1);
`;

const GroupButton = styled(motion.button) <{ active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  padding: 0;
  background: ${({ active }) =>
    active ? 'rgba(200, 50, 255, 0.2)' : 'transparent'};
  border: 1px solid ${({ active }) =>
    active ? 'rgba(200, 50, 255, 0.5)' : 'rgba(200, 50, 255, 0.2)'};
  border-radius: 8px;
  cursor: pointer;
  color: var(--color-text-primary);
  transition: all 250ms ease-in-out;

  &:hover {
    background: rgba(200, 50, 255, 0.15);
    border-color: rgba(200, 50, 255, 0.4);
    box-shadow: ${({ active }) =>
    active ? '0 0 10px rgba(200, 50, 255, 0.4)' : 'none'};
  }

  &:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

interface ThemeToggleGroupProps {
  onThemeChange?: (theme: 'dark' | 'light') => void;
}

export const ThemeToggleGroup: React.FC<ThemeToggleGroupProps> = ({ onThemeChange }) => {
  const isDark = useDarkMode();
  const toggleTheme = useThemeToggle();

  const handleToggle = (theme: 'dark' | 'light') => {
    if (isDark && theme === 'light') {
      toggleTheme();
    } else if (!isDark && theme === 'dark') {
      toggleTheme();
    }
    onThemeChange?.(theme);
  };

  return (
    <GroupContainer>
      <Tippy content="Dark mode" placement="top" duration={[200, 150]}>
        <GroupButton
          active={isDark}
          onClick={() => handleToggle('dark')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Dark mode"
        >
          <Moon size={18} strokeWidth={2} />
        </GroupButton>
      </Tippy>
      <Tippy content="Light mode" placement="top" duration={[200, 150]}>
        <GroupButton
          active={!isDark}
          onClick={() => handleToggle('light')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Light mode"
        >
          <Sun size={18} strokeWidth={2} />
        </GroupButton>
      </Tippy>
    </GroupContainer>
  );
};
