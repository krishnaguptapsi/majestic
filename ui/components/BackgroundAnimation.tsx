/**
 * Background Animation Component
 * Creates a futuristic particle system with animated gradient flow
 * Uses react-tsparticles for high-performance particle effects
 */

import React, { useCallback, useMemo } from 'react';
import Particles from 'react-tsparticles';
import type { Engine } from 'tsparticles-engine';
import { loadFull } from 'tsparticles';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

// ============================================================================
// TYPES
// ============================================================================

export type ParticleStyle = 'default' | 'dense' | 'sparse' | 'matrix' | 'gradient';

interface BackgroundAnimationProps {
  style?: ParticleStyle;
  interactive?: boolean;
  showGradient?: boolean;
  intensity?: 'low' | 'medium' | 'high';
}

// ============================================================================
// STYLED COMPONENTS
// ============================================================================

const BackgroundContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: var(--zIndex-base, 0);
  pointer-events: none;
  overflow: hidden;

  /* Ensure it doesn't interfere with content */
  canvas {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
  }
`;

const GradientOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: var(--zIndex-base, 0);
  pointer-events: none;
  background: linear-gradient(
    135deg,
    hsl(280, 100%, 10%) 0%,
    hsl(280, 50%, 15%) 25%,
    hsl(200, 100%, 15%) 50%,
    hsl(280, 100%, 10%) 75%,
    hsl(330, 100%, 10%) 100%
  );
  opacity: 0.3;
  filter: blur(80px);
  will-change: opacity;

  @media (prefers-reduced-motion: reduce) {
    animation: none !important;
  }
`;

const GradientAnimatedOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 200%;
  height: 200%;
  z-index: var(--zIndex-base, 0);
  pointer-events: none;
  background: linear-gradient(
    45deg,
    hsl(280, 100%, 50%) 0%,
    hsl(200, 100%, 50%) 25%,
    hsl(330, 100%, 50%) 50%,
    hsl(150, 100%, 45%) 75%,
    hsl(280, 100%, 50%) 100%
  );
  opacity: 0.05;
  filter: blur(60px);
  will-change: transform;

  @media (prefers-reduced-motion: reduce) {
    animation: none !important;
  }
`;

// ============================================================================
// PARTICLE CONFIGURATIONS
// ============================================================================

const getParticleConfig = (style: ParticleStyle, isDark: boolean) => {
  const baseColor = isDark ? 'hsl(200, 100%, 50%)' : 'hsl(200, 80%, 45%)';
  const glowColor = isDark ? 'hsl(200, 100%, 60%)' : 'hsl(200, 80%, 55%)';

  const configs = {
    default: {
      particles: {
        number: {
          value: 80,
          density: {
            enable: true,
            value_area: 800,
          },
        },
        color: {
          value: [baseColor, 'hsl(280, 100%, 50%)', 'hsl(330, 100%, 50%)'],
        },
        shape: {
          type: 'circle',
        },
        opacity: {
          value: { min: 0.2, max: 0.6 },
          animation: {
            enable: true,
            speed: 0.5,
            minimumValue: 0.1,
          },
        },
        size: {
          value: { min: 1, max: 4 },
          animation: {
            enable: true,
            speed: 1,
            minimumValue: 0.5,
          },
        },
        move: {
          enable: true,
          speed: 1.5,
          direction: 'none',
          random: true,
          straight: false,
          outMode: 'bounce',
          attract: {
            enable: false,
          },
        },
        links: {
          enable: true,
          distance: 150,
          color: glowColor,
          opacity: 0.2,
          width: 1,
        },
      },
      interactivity: {
        detectsOn: 'canvas',
        events: {
          onHover: {
            enable: true,
            mode: 'repulse',
          },
          onClick: {
            enable: true,
            mode: 'push',
          },
        },
        modes: {
          repulse: {
            distance: 100,
            duration: 0.4,
          },
          push: {
            quantity: 4,
          },
        },
      },
    },
    dense: {
      particles: {
        number: {
          value: 150,
          density: {
            enable: true,
            value_area: 600,
          },
        },
        color: {
          value: [baseColor, 'hsl(280, 100%, 50%)', 'hsl(200, 100%, 50%)'],
        },
        shape: {
          type: 'circle',
        },
        opacity: {
          value: { min: 0.3, max: 0.7 },
          animation: {
            enable: true,
            speed: 0.8,
            minimumValue: 0.2,
          },
        },
        size: {
          value: { min: 1.5, max: 5 },
          animation: {
            enable: true,
            speed: 1.5,
            minimumValue: 1,
          },
        },
        move: {
          enable: true,
          speed: 2,
          direction: 'none',
          random: true,
          straight: false,
          outMode: 'bounce',
        },
        links: {
          enable: true,
          distance: 120,
          color: glowColor,
          opacity: 0.3,
          width: 1.2,
        },
      },
    },
    sparse: {
      particles: {
        number: {
          value: 40,
          density: {
            enable: true,
            value_area: 1000,
          },
        },
        color: {
          value: baseColor,
        },
        shape: {
          type: 'circle',
        },
        opacity: {
          value: { min: 0.2, max: 0.5 },
          animation: {
            enable: true,
            speed: 0.3,
            minimumValue: 0.1,
          },
        },
        size: {
          value: { min: 2, max: 6 },
          animation: {
            enable: true,
            speed: 0.8,
            minimumValue: 1,
          },
        },
        move: {
          enable: true,
          speed: 1,
          direction: 'none',
          random: true,
          straight: false,
          outMode: 'bounce',
        },
        links: {
          enable: false,
        },
      },
    },
    matrix: {
      particles: {
        number: {
          value: 100,
          density: {
            enable: true,
            value_area: 700,
          },
        },
        color: {
          value: 'hsl(150, 100%, 50%)',
        },
        shape: {
          type: 'square',
        },
        opacity: {
          value: { min: 0.1, max: 0.4 },
          animation: {
            enable: true,
            speed: 1,
            minimumValue: 0.05,
          },
        },
        size: {
          value: { min: 2, max: 3 },
          animation: {
            enable: false,
          },
        },
        move: {
          enable: true,
          speed: 0.8,
          direction: 'down',
          random: true,
          straight: false,
          outMode: 'out',
        },
        links: {
          enable: false,
        },
      },
    },
    gradient: {
      particles: {
        number: {
          value: 60,
          density: {
            enable: true,
            value_area: 900,
          },
        },
        color: {
          value: [
            'hsl(280, 100%, 50%)',
            'hsl(200, 100%, 50%)',
            'hsl(330, 100%, 50%)',
            'hsl(150, 100%, 45%)',
          ],
        },
        shape: {
          type: 'circle',
        },
        opacity: {
          value: { min: 0.15, max: 0.5 },
          animation: {
            enable: true,
            speed: 0.6,
            minimumValue: 0.1,
          },
        },
        size: {
          value: { min: 1, max: 3 },
          animation: {
            enable: true,
            speed: 1.2,
            minimumValue: 0.5,
          },
        },
        move: {
          enable: true,
          speed: 1.2,
          direction: 'none',
          random: true,
          straight: false,
          outMode: 'bounce',
          attract: {
            enable: true,
            rotateX: 600,
            rotateY: 1200,
          },
        },
        links: {
          enable: true,
          distance: 180,
          color: glowColor,
          opacity: 0.15,
          width: 1,
        },
      },
    },
  };

  return configs[style] || configs.default;
};

// ============================================================================
// GRADIENT ANIMATION VARIANTS
// ============================================================================

const gradientVariants = {
  animate: {
    backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
    opacity: [0.2, 0.4, 0.2],
    transition: {
      duration: 20,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

// ============================================================================
// BACKGROUND ANIMATION COMPONENT
// ============================================================================

export const BackgroundAnimation: React.FC<BackgroundAnimationProps> = ({
  style = 'default',
  interactive = true,
  showGradient = true,
  intensity = 'medium',
}) => {
  const { isDark, themeName } = useTheme();

  // Particles initialization callback
  const particlesInit = useCallback(async (engine: Engine) => {
    try {
      await loadFull(engine);
    } catch (error) {
      console.error('[BackgroundAnimation] Failed to initialize particles:', error);
    }
  }, []);

  // Get particle configuration based on style and theme
  const particleConfig = useMemo(() => {
    const baseConfig = getParticleConfig(style, isDark);
    
    // Create a deep clone to avoid mutations
    const config = JSON.parse(JSON.stringify(baseConfig));

    // Adjust density based on intensity
    if (config.particles?.number?.density) {
      switch (intensity) {
        case 'low':
          config.particles.number.density.value_area = (config.particles.number.density.value_area || 800) * 1.5;
          break;
        case 'high':
          config.particles.number.density.value_area = (config.particles.number.density.value_area || 800) * 0.7;
          break;
        case 'medium':
        default:
          break;
      }
    }

    // Configure interactivity
    if (!config.interactivity) {
      config.interactivity = {};
    }

    if (interactive) {
      config.interactivity.detectsOn = 'canvas';
    } else {
      config.interactivity.events = {
        onHover: { enable: false },
        onClick: { enable: false },
      };
    }

    return config;
  }, [style, isDark, intensity, interactive]);

  return (
    <BackgroundContainer>
      {/* Gradient overlay */}
      {showGradient && (
        <>
          <GradientOverlay />
          <GradientAnimatedOverlay
            variants={gradientVariants}
            animate="animate"
          />
        </>
      )}

      {/* Particle system */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={particleConfig}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />
    </BackgroundContainer>
  );
};

// ============================================================================
// PRESET COMPOSITIONS
// ============================================================================

/**
 * Default futuristic style - balanced particles and gradient
 */
export const BackgroundFuturistic: React.FC = () => (
  <BackgroundAnimation style="default" interactive showGradient intensity="medium" />
);

/**
 * Dense particles - more visually impressive
 */
export const BackgroundDense: React.FC = () => (
  <BackgroundAnimation style="dense" interactive={false} showGradient intensity="high" />
);

/**
 * Sparse particles - minimal, clean look
 */
export const BackgroundSparse: React.FC = () => (
  <BackgroundAnimation style="sparse" interactive showGradient={false} intensity="low" />
);

/**
 * Matrix style - falling green squares
 */
export const BackgroundMatrix: React.FC = () => (
  <BackgroundAnimation style="matrix" interactive={false} showGradient={false} intensity="medium" />
);

/**
 * Gradient flow - smooth color transitions
 */
export const BackgroundGradient: React.FC = () => (
  <BackgroundAnimation style="gradient" interactive showGradient intensity="medium" />
);

/**
 * High performance - optimized for low-end devices
 */
export const BackgroundLowEnd: React.FC = () => (
  <BackgroundAnimation style="sparse" interactive={false} showGradient={false} intensity="low" />
);
