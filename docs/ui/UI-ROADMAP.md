# Majestic Pro — UI Redesign Roadmap

**Document Version:** 1.0  
**Created:** 2026-09-24  
**Status:** In Planning  
**Last Updated:** 2026-09-24

---

## Executive Summary

This document defines the complete UI redesign roadmap for Majestic Pro, a futuristic React test-runner application. The redesign modernizes the visual system from a basic developer-tool interface into a premium, futuristic developer-tool experience while preserving all existing functionality, test execution behavior, state management, routing, APIs, and test-runner logic.

**Key Goals:**
- Transform Majestic into a cohesive, futuristic developer-tool UI
- Preserve 100% of existing functionality and test-runner logic
- Create a signature Test Bot component as a visual centerpiece
- Implement a modern 3-column workspace layout
- Achieve production-grade visual quality by Q4 2026

**Timeline:** 8 phases, sequential execution  
**Scope:** UI/UX redesign only; no business logic refactoring

---

## Current UI Assessment

### Existing Application Structure

**Tech Stack:**
- React 18.3.1
- TypeScript
- styled-components 6.1.11
- Apollo Client 3.10.4
- react-resizable-panels 2.0.19
- react-feather 2.0.10
- react-icons 5.0.0
- Framer Motion 11.0.0
- GraphQL / GraphQL Yoga

**Current Component Architecture:**

```
ui/
├── app.tsx                    # Main app container (2-panel layout)
├── theme.ts                   # Old theme (basic colors)
├── design-system/
│   └── tokens.ts             # NEW: Comprehensive design tokens (dark/light)
├── context/
│   └── ThemeContext.tsx       # NEW: Theme provider with dark/light support
├── components/
│   ├── BackgroundAnimation.tsx # NEW: Futuristic particle effects
│   ├── BotMascot.tsx          # NEW: Bot mascot with states
│   ├── TestStatusOverlay.tsx  # NEW: Status overlay with bot
│   ├── ThemeToggle.tsx        # NEW: Theme switcher
│   └── button.tsx             # Basic button component
├── sidebar/
│   ├── index.tsx              # Test explorer sidebar
│   ├── tree.tsx               # Test tree (recursive)
│   ├── file-item.tsx          # File/folder tree item
│   ├── summary/               # Summary metrics
│   └── [many .gql files]      # GraphQL queries
├── test-file/
│   ├── index.tsx              # Test execution workspace
│   ├── test-item.tsx          # Individual test row
│   ├── summary/               # Test file summary
│   ├── error-panel/           # Error details
│   ├── console-panel/         # Console output
│   └── [many .gql files]      # GraphQL queries
├── coverage-panel/            # Coverage display
├── search/                    # Global search
└── hooks/                     # Custom hooks

server/
├── api/
│   ├── app/                   # App state mutations
│   ├── workspace/             # Workspace queries
│   ├── runner/                # Test runner status/control
│   └── (GraphQL resolvers)
```

### Current Design

**Colors (theme.ts):**
- Background: #262529
- Dark: #242326
- Text: #F5F5F5
- Primary: #FDC055 (orange/gold)
- Success: #19E28D (green)
- Danger: #ff4f56 (red)

**Layout:**
- 2-column horizontal split using react-resizable-panels
- Left: sidebar (test explorer)
- Right: main content (test file execution)
- No dedicated bot panel
- Test status shown as overlay in bottom-right

**Existing Features That Must Remain Functional:**
- Test tree navigation with filtering
- Real-time test execution
- Watch mode
- Snapshot updates
- Test result display with failures
- Coverage panel
- Global search (Ctrl+K)
- Run / Stop / Watch / Refresh
- Apollo Client queries/subscriptions
- All keyboard shortcuts

### Recent Additions (NEW WORK)

The codebase already has new work started:

1. **Design Tokens System** (`ui/design-system/tokens.ts`)
   - Comprehensive dark/light theme support
   - CSS variables approach
   - Includes colors, shadows, spacing, typography, transitions, breakpoints, z-index
   - Ready to use; properly structured for futuristic aesthetic

2. **Theme Context** (`ui/context/ThemeContext.tsx`)
   - Theme provider with dynamic switching
   - Supports dark/light modes
   - Applies CSS variables to document root
   - Ready to wrap App component

3. **Bot Mascot Component** (`ui/components/BotMascot.tsx`)
   - Animated robot (using emoji + Framer Motion)
   - States: idle, running, success, failed
   - Respects prefers-reduced-motion
   - Ready for integration

4. **Background Animation** (`ui/components/BackgroundAnimation.tsx`)
   - Particle effects (tsparticles)
   - Futuristic and dense themes available
   - Can be layered as background

5. **Test Status Overlay** (`ui/components/TestStatusOverlay.tsx`)
   - Displays test metrics
   - Integrates bot mascot
   - Multiple layout variants available

6. **Theme Toggle** (`ui/components/ThemeToggle.tsx`)
   - UI for switching themes
   - Multiple layout variants

**Current app.tsx Usage:**
- Renders BackgroundFuturistic
- Uses TestStatusOverlay with bot in bottom-right
- But these are NOT integrated into the main layout architecture yet

### Key Observations

**Strengths:**
- Design system foundation already exists (tokens)
- Bot mascot already implemented
- Background animation available
- Theme context ready
- 2-panel resizable layout stable and working
- All APIs stable via GraphQL

**Weaknesses:**
- New components are cosmetic overlays; not part of main layout system
- No true 3-column workspace
- No top navigation bar
- No bottom status bar
- No dedicated bot panel
- Theme tokens not yet used consistently throughout UI
- No responsive behavior (tablet/mobile)
- New design components not integrated into sidebar/test-file
- Existing components still use old color scheme

---

## Target UI Vision

### Visual Direction

**Aesthetic:**
- Futuristic developer tool (premium IDEs + CI/CD dashboards + AI assistants)
- Dark-first with light mode support
- Cyber/AI inspired with neon accents
- Glassmorphism used sparingly for panels
- Smooth micro-interactions
- Dense but readable information architecture
- Professional, not gaming-like
- Reference: Premium test-runner dashboard (see reference screenshots in `/docs/ui/reference/`)

**Color Palette (Futuristic Dark Theme — Reference Based):**
- **Background:** #0D1424 (deep purple-black, primary)
- **Surfaces:** #0A1020 (elevated surfaces, primary)
- **Surface Alt:** #111827 (slightly lighter for hover/active)
- **Primary Action:** #5555FF or #6366F1 (blue)
- **Secondary:** #22D3EE (cyan)
- **Success/Passed:** #20E3B2 (neon green)
- **Warning/Running:** #F5B83D (amber/yellow)
- **Error/Failed:** #FF4D67 (neon red)
- **Pending:** #64748B (gray)
- **Text Primary:** #F8FAFC (off-white)
- **Text Secondary:** #94A3B8 (muted gray)
- **Accent Alt:** #7C3AED (purple for highlights)
- **Borders:** Low-opacity variations of surface colors

**Layout Structure:**
```
┌─────────────────────────────────────────────────────────────────┐
│  TOP NAVIGATION (fixed, ~60px)                                  │
│  Logo | Run (blue) | Stop | Watch | Refresh | Search | Settings │
├──────────────────┬─────────────────────────────┬────────────────┤
│                  │                             │                │
│ LEFT SIDEBAR     │   CENTER CONTENT            │  RIGHT BOT     │
│ 280-320px        │   (Test Execution Workspace)│  PANEL         │
│ (fixed)          │   (fluid width)             │  280-320px     │
│                  │                             │  (fixed)       │
│ • Metrics        │ • Breadcrumb                │ • Test Bot     │
│ • Search         │ • Test Header + Badges     │ • Bot Avatar   │
│ • Test Tree      │ • Metrics Grid (2x3)       │ • Queue        │
│ • Status         │ • Progress Bar             │ • Activity     │
│   Indicators     │ • Suite/Test Cards         │   Indicator    │
│                  │ • Failure Display          │                │
├──────────────────┴─────────────────────────────┴────────────────┤
│ BOTTOM STATUS BAR (fixed, ~32px)                                │
│ ● Connected | Environment: local | Branch | Node | Elapsed ...  │
│ Keyboard Shortcuts: ⌘ R Run | ⌘ S Stop | ⌘ D Debug | ⌘ / Search │
└─────────────────────────────────────────────────────────────────┘
```

**Panel Widths (Desktop):**
- Left Sidebar: Fixed 280-320px (user-resizable via handle)
- Right Bot Panel: Fixed 280-320px (user-resizable via handle)
- Center: Fluid, expands/contracts with resize handles
- All panels visible simultaneously on desktop
- No hidden tabs or collapsible state on desktop

**Key Visual Elements:**

1. **Metrics Grid (Center Content)**
   - Layout: 2 columns × 3 rows (fixed grid, not flexible)
   - Row 1: Passing Suites | Failing Suites
   - Row 2: Passing Tests | Failing Tests
   - Row 3: Skipped Tests | Total Duration
   - Each card: Icon + number + label
   - Colors: Green for passing, red for failing, gray for skipped
   - Real data only (no mock values)

2. **Progress Visualization (Center Content)**
   - Horizontal segmented bar with colored sections
   - Colors: Green (passing), Red (failing), Amber (running), Gray (pending)
   - Below bar: "X / Y" count (e.g., "3 / 6")
   - Below count: "Z%" percentage (e.g., "50%")
   - Animated during test execution

3. **Test Bot** (Right Panel - Signature Element)
   - SVG-based animated robot (not emoji)
   - Blue/cyan glowing effects with holographic ring
   - Floating animation when idle
   - Status display: "Running X/Y" or "Passed", "Failed", etc.
   - Execution queue:
     - Current running test highlighted (animated indicator)
     - Completed tests with green checkmark
     - Pending tests grayed out
     - Show 6 items; scrollable for more
     - Duration per item
   - Activity indicator: Animated waveform or pulse at bottom
   - States: Idle, Running (animated), Success (green), Failure (red), Paused

4. **Breadcrumb Navigation (Center Header)**
   - Format: "UI > src > Login > ChangePassword"
   - Clickable elements for navigation
   - Clickable test file name next to breadcrumb

5. **Badges/Pills (Center Header)**
   - Examples: "Suite", "5 Tests", "MFA", "Bug Condition"
   - Small pill containers with padding
   - Color indicates category or status
   - Optional icons
   - Compact display below breadcrumb

6. **Suite/Test Cards (Center Content)**
   - Expandable suite containers
   - Status icon + suite name + test count
   - Running indicator: Animated orange pulse
   - Duration display
   - Expand/collapse with chevron icon
   - Test rows nested inside:
     - Status icon (✓ green, ⊙ amber, ✕ red)
     - Test name
     - Duration (e.g., "1.2s")
     - Running animation if executing
   - Failure display when test fails:
     - Red-tinted translucent background
     - Error message in monospace font
     - Stack trace with line numbers
     - Source location link
     - Copy error button

---

## Design Principles

1. **Preserve Functionality First**
   - No business logic changes unless absolutely required
   - All existing features must work exactly as before
   - Test execution behavior unchanged
   - State management unchanged

2. **Use Existing Infrastructure**
   - Design tokens system is ready; use it everywhere
   - Theme context is ready; wrap App
   - Bot mascot is ready; integrate into panel
   - Don't duplicate existing functionality

3. **Dense Professional UI**
   - Information density > whitespace
   - Developer-tool aesthetic (like VS Code)
   - No bloat or unnecessary decorative elements
   - Clear visual hierarchy

4. **Consistent Visual Language**
   - All colors from design tokens
   - All spacing from spacing scale
   - All animations use timing functions
   - No scattered hard-coded values

5. **Accessibility First**
   - Keyboard navigation throughout
   - Visible focus states
   - Semantic HTML/ARIA
   - Sufficient contrast ratios
   - Color + icon for status (not color alone)
   - Support prefers-reduced-motion

6. **Performance Conscious**
   - CSS animations preferred over JS
   - Memoization for expensive components
   - Virtualization for large trees
   - SVG/CSS for visuals, not bitmaps

7. **Responsive by Design**
   - Desktop: 3-column layout
   - Tablet: collapsible panels
   - Mobile: drawer-based UI
   - Touch-friendly target sizes

---

## Design System Strategy

### CSS Variables Architecture

All design tokens are exposed as CSS variables on `:root`:

```css
/* Colors - Backgrounds */
--color-background: #0D1424;
--color-surface: #0A1020;
--color-surface-alt: #111827;
--color-surface-hover: #151D2D;
--color-surface-active: #1A2240;

/* Colors - Semantic */
--color-primary: #5555FF;
--color-secondary: #22D3EE;
--color-success: #20E3B2;
--color-warning: #F5B83D;
--color-error: #FF4D67;
--color-pending: #64748B;

/* Colors - Text */
--color-text-primary: #F8FAFC;
--color-text-secondary: #94A3B8;
--color-text-muted: #64748B;

/* Colors - Borders */
--color-border: rgba(255, 255, 255, 0.1);
--color-border-light: rgba(255, 255, 255, 0.05);

/* Colors - Interactive */
--color-link: #22D3EE;
--color-link-hover: #06B6D4;
--color-accent: #7C3AED;

/* Shadows */
--shadow-xs: 0 2px 8px rgba(0, 0, 0, 0.15);
--shadow-md: 0 8px 24px rgba(0, 0, 0, 0.2);
--shadow-glow-primary: 0 0 20px rgba(200, 50, 255, 0.5), 0 0 40px rgba(200, 50, 255, 0.3);
--shadow-glow-cyan: 0 0 20px rgba(34, 211, 238, 0.5), 0 0 40px rgba(34, 211, 238, 0.3);
--shadow-glow-success: 0 0 20px rgba(32, 227, 178, 0.5), 0 0 40px rgba(32, 227, 178, 0.3);
--shadow-glow-error: 0 0 20px rgba(255, 77, 103, 0.5), 0 0 40px rgba(255, 77, 103, 0.3);

/* Spacing */
--spacing-xs: 4px;
--spacing-sm: 8px;
--spacing-md: 16px;
--spacing-lg: 24px;
--spacing-xl: 32px;
--spacing-xxl: 48px;

/* Radius */
--radius-xs: 2px;
--radius-sm: 4px;
--radius-md: 8px;
--radius-lg: 12px;

/* Typography */
--font-family-base: "Open Sans", system-ui;
--font-family-mono: "Monaco", "Menlo", monospace;
--font-size-xs: 12px;
--font-size-sm: 14px;
--font-size-base: 16px;
--font-size-lg: 18px;

/* Transitions */
--transition-fast: 150ms ease-in-out;
--transition-base: 250ms ease-in-out;
--transition-slow: 350ms ease-in-out;

/* Panel Widths */
--sidebar-width: 300px;
--right-panel-width: 300px;
```

**Usage Example:**
```css
.button {
  background-color: var(--color-primary);
  color: var(--color-text-primary);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}

.button:hover {
  box-shadow: var(--shadow-glow-primary);
}
```

### Theme Switching

- Default: dark theme
- Light mode available via ThemeContext
- User preference stored in localStorage
- Smooth transitions between themes
- No re-render required (CSS variables only)

### Search Input Specifications

**Left Sidebar Search:**
- Placeholder text: "Filter tests..."
- Filters tree items in real-time as user types
- Can filter by file name, suite name, or test name
- Shows matching items, collapses non-matching branches
- Optional: "Collapse All" / "Expand All" controls

**Top Center Global Search:**
- Placeholder text: "Search tests, suites, files..."
- Keyboard shortcut: Ctrl+K (shown in UI)
- Opens modal/overlay when focused or shortcut pressed
- Shows search results in dropdown
- Clickable results navigate to test file
- Fuzzy search across names and paths

### Badge/Pill System

**Badge Types:**
1. **Suite Badge** — "Suite" label (neutral gray or primary color)
2. **Test Count** — "5 Tests" or "1 Test" (primary color)
3. **Custom Tags** — "MFA", "Bug Condition", etc. (various colors)
4. **Status Badges** — "Running", "Passed", "Failed" (semantic colors)

**Badge Styling:**
- Small pill containers with subtle border/background
- Padding: 4-6px horizontal, 2-4px vertical
- Font size: 12px
- Optional icon before text
- Color indicates category or status
- Displayed inline in header area

### Left Sidebar Specifications

**Layout (Top to Bottom):**
1. Search input: "Filter tests..." (20px tall)
2. Metrics section (40-50px):
   - Row 1: "✓ 3 Passing suites" | "✕ 0 Failing suites"
   - Row 2: "✓ 6 Passing tests" | "✕ 0 Failing tests"
3. "Tests" header with count
4. Test tree (scrollable, fills remaining space)

**Test Tree Styling:**
- Folder icons for directories
- File icons for test files
- Chevron icons for expand/collapse
- Status indicators (colored dots or checkmarks):
  - ✓ Green (passed)
  - ⊙ Amber (running)
  - ✕ Red (failed)
  - ⊟ Gray (pending/skipped)
- Duration badge on right (e.g., "1.2s")
- Hierarchical indentation (8-16px per level)
- Selected item:
  - Light blue/cyan background
  - Left border accent (2-3px blue)
  - Smooth transition to selected state
- Hover state: Slightly lighter background

### Center Content Header Specifications

**Breadcrumb Navigation:**
- Format: "UI > src > Login > ChangePassword"
- Clickable segments (navigate on click)
- Separator: ">" character
- Responsive: Can truncate on small screens
- Links to parent folders/suites in tree

**Test File Name:**
- Displayed next to breadcrumb
- Font: Monospace, slightly larger (14-16px)
- Color: Primary text color
- Example: "ChangePassword.test.tsx"

**Badges Section:**
- Displayed below breadcrumb
- Horizontal row of pill badges
- Scrollable if many badges
- Types: Suite, Test Count, Custom Tags, Status

### Right Bot Panel Queue Specifications

**Queue Display Rules:**
- Show current running test at top (highlighted, animated)
- Show completed tests below (with green checkmark)
- Show pending tests at bottom (grayed out)
- Maximum 6 items visible without scrolling
- Scrollable if more items exist
- Smooth scroll animation when items change

**Queue Item Format:**
- Status icon (animated for running, checkmark for done, circle for pending)
- Test file name
- Duration or "Running..." text
- Optional progress indicator for running item

**Item Status Indicators:**
- Running: Pulsing orange dot or animated glow, shows elapsed time
- Completed: Green checkmark, shows total duration
- Pending: Gray circle, no duration yet

**Bottom Activity Indicator:**
- Animated waveform or bars
- Text: "Analyzing test execution..." or similar
- Shows ongoing bot activity
- Optional: Small animation (bars going up/down, waveform oscillating)

### Color Semantics

| Purpose | Light | Dark | Usage |
|---------|-------|------|-------|
| Primary Action | #6366F1 | #6366F1 | Buttons, links, active states |
| Success | #20E3B2 | #20E3B2 | Passing tests, positive indicators |
| Warning | #F5B83D | #F5B83D | Running tests, pending states |
| Error | #FF4D67 | #FF4D67 | Failing tests, alerts |
| Secondary | #22D3EE | #22D3EE | Secondary actions, accents |
| Text Primary | #1F2937 | #F8FAFC | Main text |
| Text Secondary | #6B7280 | #94A3B8 | Muted text, labels |
| Background | #F7F7F7 | #070B14 | Page background |
| Surface | #FFFFFF | #0A1020 | Panels, cards |
| Border | #E5E7EB | #1F2937 | Dividers, borders |

---

## Implementation Roadmap

### Phase Overview

| Phase | Name | Priority | Dependencies | Est. Components |
|-------|------|----------|--------------|-----------------|
| UI-Phase-1 | Foundation & Design System | P0 | None | 0 (setup) |
| UI-Phase-2 | Application Shell | P0 | Phase-1 | TopBar, StatusBar, AppShell |
| UI-Phase-3 | Test Explorer | P1 | Phase-1,2 | TestExplorer, TestTree, Metrics |
| UI-Phase-4 | Test Execution Workspace | P1 | Phase-1,2,3 | TestHeader, SuiteCard, TestRow |
| UI-Phase-5 | Test Bot Integration | P1 | Phase-1,2 | TestBotPanel, integration |
| UI-Phase-6 | Animations & Interactions | P2 | Phase-1-5 | Micro-interactions, transitions |
| UI-Phase-7 | Responsive & Accessibility | P2 | Phase-1-6 | Breakpoints, ARIA, keyboard |
| UI-Phase-8 | Visual QA & Polish | P3 | Phase-1-7 | Testing, refinement |

---

## Detailed Phase Specifications

### UI-Phase-1: Foundation & Design System

**Status:** [ ] Not Started

**Objective:**
Establish the design system as the single source of truth for colors, typography, spacing, and animations. No layout changes yet.

**Scope:**
- Integrate design tokens system into global styles
- Apply theme context provider to App component
- Create CSS variables on document root
- Establish color system document
- Establish typography scale
- Establish spacing scale
- Verify design tokens are accessible from styled-components

**Components Affected:**
- `ui/index.tsx` (inject GlobalStyles)
- `ui/app.tsx` (wrap with ThemeProvider)
- `ui/design-system/tokens.ts` (already exists, verify)
- `ui/context/ThemeContext.tsx` (already exists, verify)
- Create: `ui/styles/GlobalStyles.tsx`
- Create: `ui/styles/DesignSystem.md`

**Files/Areas to Change:**
- `ui/index.tsx` - Add GlobalStyle + ThemeProvider
- `ui/app.tsx` - Remove old theme.ts references
- `theme.ts` - Deprecate (keep for reference only)

**Deliverables:**
1. GlobalStyles component with CSS variable definitions
2. Design System documentation (colors, typography, spacing)
3. Theme tokens integrated into styled-components

**Functional Constraints:**
- All existing functionality must continue working
- No layout changes
- No component refactoring yet
- Old theme.ts still accessible (don't break imports)

**Accessibility Requirements:**
- CSS variables properly formatted
- No contrast regressions vs. existing theme
- Support dark/light modes equally

**Performance Considerations:**
- CSS variables are native browser features (no performance penalty)
- Prefer CSS variables over styled-components props
- No unnecessary re-renders

**Validation Criteria:**
- [ ] GlobalStyles component renders without errors
- [ ] CSS variables accessible in DevTools
- [ ] Colors match design system specification
- [ ] Dark theme applied by default
- [ ] Light theme switchable via ThemeContext
- [ ] All existing UI still renders correctly
- [ ] No console errors or warnings
- [ ] Design System.md created and documented

**Definition of Done:**
- Design system is the single source of truth
- All CSS variables applied to :root
- No scattered hard-coded colors remain
- Theme switching works smoothly
- Documentation complete

---

### UI-Phase-2: Application Shell

**Status:** [ ] Not Started

**Objective:**
Create the new 3-column workspace shell with top navigation and bottom status bar.

**Scope:**
- Replace current 2-column layout with 3-column layout
- Implement Top Navigation Bar (60px)
  - Left: Logo + "Tests" navigation
  - Center: Global search input
  - Right: Run/Stop/Watch/Refresh buttons
- Implement Bottom Status Bar (32px)
  - Left: Connection status indicator
  - Center: Environment, branch, Node version
  - Right: Elapsed time + keyboard shortcuts
- Implement Left Sidebar (300-360px)
  - Placeholder for test explorer (detailed in Phase-3)
- Implement Center Content (responsive)
  - Placeholder for test execution (detailed in Phase-4)
- Implement Right Panel (280-320px)
  - Placeholder for test bot (detailed in Phase-5)
- Use react-resizable-panels for panel management
- Responsive behavior: desktop/tablet
  - Tablet: collapse right panel into drawer
  - Mobile: defer to Phase-7

**Components to Create:**
- `ui/layout/AppShell.tsx` - Main layout container
- `ui/layout/TopBar.tsx` - Top navigation
- `ui/layout/StatusBar.tsx` - Bottom status bar
- `ui/layout/LeftSidebar.tsx` - Left panel wrapper
- `ui/layout/RightPanel.tsx` - Right panel wrapper
- `ui/components/SearchBar.tsx` - Global search input
- `ui/components/ActionButtons.tsx` - Run/Stop/Watch buttons
- `ui/components/StatusIndicator.tsx` - Connection indicator

**Components Affected:**
- `ui/app.tsx` - Replace entire layout structure
- `ui/sidebar/index.tsx` - Will move into LeftSidebar
- `ui/test-file/index.tsx` - Will move into center content

**Files/Areas to Change:**
- `ui/app.tsx` - New layout structure
- `ui/index.tsx` - May need to inject AppShell wrapper

**Dependencies:**
- Phase-1 (design system must be ready)
- react-resizable-panels (already in dependencies)
- Existing search/run/stop functionality

**Deliverables:**
1. New 3-column shell with resizable panels
2. Top navigation bar with controls
3. Bottom status bar with information
4. Responsive behavior for tablet
5. All existing functionality still works

**Functional Constraints:**
- Existing Run/Stop/Watch/Refresh mutations must still work
- Existing search functionality must still work
- Existing sidebar and test-file components must render
- Panel resize state can be lost (deferred to later phase if needed)

**Accessibility Requirements:**
- Top bar buttons have visible focus states
- All buttons keyboard-accessible
- Status bar information accessible via screen reader
- Search input labeled
- Tab order logical
- Focus management when panels collapse/expand

**Performance Considerations:**
- react-resizable-panels has minimal performance impact
- Measure render time; should not exceed current baseline
- Panel resize should be smooth (use CSS transforms)

**Validation Criteria:**
- [ ] Layout renders with 3 columns
- [ ] Top bar displays correctly
- [ ] Bottom bar displays correctly
- [ ] Panels resize without errors
- [ ] Run/Stop/Watch/Refresh buttons work
- [ ] Search bar works (existing functionality)
- [ ] Responsive layout changes at breakpoint
- [ ] All existing data queries still execute
- [ ] No console errors

**Definition of Done:**
- Shell structure complete and stable
- All panels resize smoothly
- Top and bottom bars functional
- Existing functionality preserved
- Responsive behavior working
- Ready for sidebar redesign (Phase-3)

---

### UI-Phase-3: Test Explorer

**Status:** [ ] Not Started

**Objective:**
Redesign the left sidebar test explorer with futuristic styling and improved UX.

**Scope:**
- Redesign test tree with:
  - Tree lines / visual hierarchy
  - Folder + file icons
  - Test status indicators (pass/fail/running/pending)
  - Execution duration badges
  - Selected state highlighting (neon border + translucent bg)
- Create metrics panel:
  - Passing suites
  - Failing suites
  - Passing tests
  - Failing tests
  - Skipped tests
  - Total duration
  - Real data from state (not hard-coded)
- Implement search/filter
- Maintain virtualization for large trees
- Add subtle animations:
  - Hover state transitions
  - Selection transitions
  - Tree expansion transitions

**Components to Create:**
- `ui/test-explorer/TestExplorer.tsx` - Main explorer component
- `ui/test-explorer/TestTree.tsx` - Tree rendering
- `ui/test-explorer/TestTreeNode.tsx` - Individual tree node
- `ui/test-explorer/TestMetrics.tsx` - Metrics display
- `ui/test-explorer/MetricCard.tsx` - Individual metric

**Components Refactored:**
- `ui/sidebar/tree.tsx` - Update styling with design system
- `ui/sidebar/file-item.tsx` - Redesign with new icons/colors
- `ui/sidebar/summary/` - Redesign metrics cards

**Files/Areas to Change:**
- `ui/layout/LeftSidebar.tsx` - Render TestExplorer component
- `ui/sidebar/` - Gradual migration to new component structure

**Dependencies:**
- Phase-1 (design system)
- Phase-2 (shell structure)
- Existing test tree data structure and queries

**Deliverables:**
1. Redesigned test explorer with futuristic styling
2. Metrics panel showing real data
3. Improved visual hierarchy and UX
4. Smooth animations and interactions
5. All selection and navigation features working

**Functional Constraints:**
- All existing selection behavior must work
- All existing filtering/search must work
- Tree performance must remain (virtualization)
- All queries and mutations must still execute

**Accessibility Requirements:**
- Keyboard navigation (arrow keys, Enter, Space)
- Screen reader support for tree structure (ARIA)
- Visual focus indicator
- Color + icon for status (not color alone)
- Tooltips for truncated text

**Performance Considerations:**
- Keep virtualization for trees > 1000 items
- Memoize tree nodes to prevent unnecessary re-renders
- Avoid color recalculations; use CSS variables
- Monitor render time; should not exceed current

**Validation Criteria:**
- [ ] Test tree renders with correct styling
- [ ] Metrics show real data
- [ ] Selection works (highlights with neon border)
- [ ] Tree expansion/collapse works smoothly
- [ ] Search/filter still works
- [ ] Large trees (1000+ items) remain performant
- [ ] All icons displaying correctly
- [ ] Status colors match design system
- [ ] Keyboard navigation works
- [ ] Screen reader accessible

**Definition of Done:**
- Test explorer fully redesigned with futuristic aesthetic
- All existing functionality preserved
- Real data displayed (no mocks)
- Performance acceptable
- Ready for test execution workspace redesign (Phase-4)

---

### UI-Phase-4: Test Execution Workspace

**Status:** [ ] Not Started

**Objective:**
Redesign the center content area with enhanced test execution visualization.

**Scope:**
- Test Header:
  - Breadcrumb navigation (UI > src > Login > ChangePassword)
  - Test file name
  - Badges (Suite, # Tests, custom tags)
  - Execution state (Running/Passed/Failed/Pending)
- Test Metrics Bar:
  - Compact metric cards (6 cards in 2x3 grid)
  - Real data from state
- Execution Progress Bar:
  - Horizontal bar with colored segments
  - Passing/failing/running/pending colors
  - Current/total count
  - Percentage display
- Suite Cards:
  - Expandable suite containers
  - Status icon + name + test count
  - Running indicator animation
  - Test rows inside each suite
- Test Rows:
  - Status icon + test name + duration
  - Running state animated indicator
  - Clickable to expand details
  - Failure details shown when failed
- Failure Display:
  - Error message with monospace font
  - Stack trace with line numbers
  - Source location link
  - Copy error button
- Console Output:
  - Collapsible console panel
  - ANSI color support
- Actions:
  - Run file button
  - Run failed tests button
  - Update snapshot button
  - Stop button

**Components to Create:**
- `ui/test-runner/TestRunner.tsx` - Main workspace component
- `ui/test-runner/TestHeader.tsx` - Header with breadcrumb/metadata
- `ui/test-runner/TestMetricsBar.tsx` - Metrics display
- `ui/test-runner/ExecutionProgress.tsx` - Progress visualization
- `ui/test-runner/SuiteCard.tsx` - Suite container
- `ui/test-runner/TestRow.tsx` - Individual test item
- `ui/test-runner/TestFailure.tsx` - Failure details
- `ui/components/MetricCard.tsx` - Reusable metric card
- `ui/components/ProgressBar.tsx` - Reusable progress bar
- `ui/components/Breadcrumb.tsx` - Breadcrumb navigation

**Components Refactored:**
- `ui/test-file/index.tsx` - Use new components
- `ui/test-file/test-item.tsx` - Update styling
- `ui/test-file/summary/` - Refactor metrics
- `ui/test-file/error-panel/` - Redesign failure display

**Files/Areas to Change:**
- `ui/layout/AppShell.tsx` - Center content area
- `ui/test-file/` - Gradual migration

**Dependencies:**
- Phase-1 (design system)
- Phase-2 (shell structure)
- Phase-3 (test explorer)
- Existing test file queries and mutations

**Deliverables:**
1. Redesigned test execution workspace
2. All metrics, progress, and status visualization
3. Improved failure display
4. Real data (no mocks)
5. All existing functionality working

**Functional Constraints:**
- All test execution behavior must be identical
- All mutations (run file, update snapshot, etc.) must work
- All subscriptions must update correctly
- Console output must display correctly

**Accessibility Requirements:**
- Breadcrumb keyboard-navigable
- Test rows keyboard-selectable
- Failure details screen-reader accessible
- Sufficient contrast in error display
- ARIA labels for status indicators
- Tooltips for truncated names

**Performance Considerations:**
- Memoize suite and test components
- Virtualize long test lists if needed
- Don't re-render entire tree on status update
- Use CSS animations for state transitions

**Validation Criteria:**
- [ ] Header displays correctly
- [ ] Metrics show real data
- [ ] Progress bar animates during test execution
- [ ] Suite cards expand/collapse smoothly
- [ ] Test rows display correct status
- [ ] Failures display with full stack trace
- [ ] Running animation visible
- [ ] All buttons (run, stop, snapshot, etc.) functional
- [ ] Console output displays with ANSI colors
- [ ] Large test files (100+ tests) performant
- [ ] Keyboard navigation works
- [ ] Screen reader accessible

**Definition of Done:**
- Test execution workspace fully redesigned
- All functionality preserved and working
- Real data displayed throughout
- Performance acceptable
- Ready for Test Bot integration (Phase-5)

---

### UI-Phase-5: Test Bot Integration

**Status:** [ ] Not Started

**Objective:**
Integrate and enhance the Test Bot as a signature visual element in the right panel.

**Scope:**
- Right panel structure:
  - Header: "✦ Test Bot" + status indicator + menu
  - Bot avatar (SVG-based, not emoji)
  - Status text (e.g., "Running 3/6")
  - Execution queue with real test names
  - Activity indicator (waveform or pulse)
- Bot states:
  - Idle: low-energy blue/purple animation
  - Running: glowing eyes, rotating ring, floating
  - Success: green accent, positive animation, reduced activity
  - Failure: red accent, warning pulse
  - Paused: frozen state
- Bot consumes real test-runner state:
  - `status`: current runner state
  - `progress`: tests completed / total tests
  - `currentTest`: name of test being run
  - `completedTests`: array of completed test names
  - `failedTests`: array of failed test names
- Animations:
  - CSS-based for performance
  - Respect prefers-reduced-motion
  - Smooth transitions between states
- Execution queue display:
  - Show current test (green highlight, animated)
  - Show completed tests (with checkmark)
  - Show pending tests (grayed out)
  - Show failed tests (red highlight)
  - Limit to ~5 items visible; scrollable
- Integration with test runner:
  - Subscribe to runner status
  - Subscribe to test summary
  - Update bot state based on real data

**Components to Create:**
- `ui/test-bot/TestBotPanel.tsx` - Main panel component
- `ui/test-bot/TestBotAvatar.tsx` - SVG bot visualization
- `ui/test-bot/TestBotQueue.tsx` - Execution queue display
- `ui/test-bot/TestBotWaveform.tsx` - Activity indicator
- `ui/test-bot/useTestBotState.ts` - Hook to derive bot state from data

**Components Enhanced:**
- `ui/components/BotMascot.tsx` - Replace emoji with SVG
- Implement proper bot SVG rendering

**Files/Areas to Change:**
- `ui/layout/RightPanel.tsx` - Render TestBotPanel
- `ui/components/BotMascot.tsx` - SVG implementation

**Dependencies:**
- Phase-1 (design system)
- Phase-2 (shell structure)
- Existing runner status subscriptions
- Existing summary subscriptions

**Deliverables:**
1. Right panel with Test Bot
2. SVG-based animated bot avatar
3. Real-time execution queue
4. State-based animations
5. All runner data integrated

**Functional Constraints:**
- No changes to runner state management
- Subscriptions must continue working
- Bot state derived from existing data (not new mutations)

**Accessibility Requirements:**
- Bot status announced to screen readers
- Queue items labeled
- Animations have reduced-motion alternative
- Color + text for status (not visual only)

**Performance Considerations:**
- SVG rendering should be performant
- CSS animations preferred over JS
- Avoid expensive re-renders of bot avatar
- Queue updates should be efficient

**Validation Criteria:**
- [ ] Right panel displays Test Bot
- [ ] Bot avatar renders as SVG
- [ ] Bot state matches runner status
- [ ] Idle animation plays correctly
- [ ] Running animation plays correctly
- [ ] Success animation plays correctly
- [ ] Failure animation plays correctly
- [ ] Execution queue updates in real-time
- [ ] prefers-reduced-motion respected
- [ ] Real test names shown in queue
- [ ] No performance regression during test execution
- [ ] Responsive behavior on tablet (drawer)

**Definition of Done:**
- Test Bot fully integrated and functional
- All animations working smoothly
- Real runner state displayed
- Signature visual element complete
- Ready for animations/interactions phase (Phase-6)

---

### UI-Phase-6: Animations & Micro-Interactions

**Status:** [ ] Not Started

**Objective:**
Add polished, subtle micro-interactions and transitions throughout the UI.

**Scope:**
- Button interactions:
  - Subtle glow on hover/focus
  - Press animation on click
  - Smooth transition to active state
- Tree interactions:
  - Smooth expand/collapse transitions
  - Hover state background fade-in
  - Selection transition with neon border
- Test execution state changes:
  - Smooth progress bar animation
  - Status color transitions
  - Duration counter animation
- Failure highlighting:
  - Subtle error pulse on first failure
  - Smooth expansion of failure details
- Test Bot reactions:
  - Smooth state transitions
  - Eye animation on status change
  - Particle bursts on success
- Panel transitions:
  - Smooth panel resize
  - Drawer open/close animations
  - Content fade-in on panel appear
- Global animations:
  - All durations under 300ms
  - Consistent easing functions
  - Respect prefers-reduced-motion globally

**Animation Specifications:**
- Fast: 150ms ease-in-out (hover, focus)
- Base: 250ms ease-in-out (state changes, expansions)
- Slow: 350ms ease-in-out (panel transitions, page changes)
- Easing: cubic-bezier values for natural feel

**Transitions File:**
- Create `ui/styles/animations.css` for keyframe definitions
- Use CSS @keyframes for all animations
- Define common animation patterns

**Files/Areas to Change:**
- All component files from Phases 2-5
- Add transition/animation props to styled components
- No new components; enhancement only

**Deliverables:**
1. Polished micro-interactions throughout
2. Consistent animation patterns
3. Animation documentation
4. prefers-reduced-motion support

**Functional Constraints:**
- Animations must not interfere with functionality
- Performance must remain acceptable
- No animation-triggered bugs

**Accessibility Requirements:**
- All animations respect prefers-reduced-motion
- Animations don't distract from content
- Focus states remain visible despite animations
- No vestibular triggers (spinning/flashing)

**Performance Considerations:**
- Use CSS transforms and opacity (GPU-accelerated)
- Avoid animating expensive properties (layout, box-shadow)
- Test animation performance on low-end devices

**Validation Criteria:**
- [ ] All buttons have smooth hover/active states
- [ ] Tree expansion is smooth
- [ ] Progress bar animates smoothly
- [ ] Test Bot animations are fluid
- [ ] Failure highlighting is noticeable but not jarring
- [ ] prefers-reduced-motion removes all animations
- [ ] Performance metrics acceptable
- [ ] No jank during test execution

**Definition of Done:**
- All micro-interactions polished and consistent
- Animation guidelines documented
- Performance acceptable on all supported devices
- Ready for responsive/accessibility phase (Phase-7)

---

### UI-Phase-7: Responsive & Accessibility

**Status:** [ ] Not Started

**Objective:**
Optimize UI for all device sizes and ensure full accessibility compliance.

**Scope:**

**Responsive Behavior:**
- Breakpoints:
  - Desktop (1280px+): 3-column layout (full shell)
  - Tablet (768px-1279px): 2-column + drawer
    - Left sidebar collapsible into drawer
    - Right bot panel collapsible into drawer
    - Center content expands to fill
  - Mobile (320px-767px): Drawer-based layout
    - Top bar with menu icon
    - Center content primary
    - Sidebar and bot in drawers
    - Touch-optimized sizing
- Touch optimization:
  - Buttons 44px minimum (mobile)
  - Touch-target padding
  - No hover-only states
  - Swipe gestures for drawers
- Tablet layout:
  - Preserve 3-column if space
  - Otherwise collapsible panels
- Mobile layout:
  - Hamburger menu for sidebar
  - Floating action button for bot
  - Bottom sheet for search results

**Accessibility Enhancements:**
- Keyboard navigation:
  - All interactive elements keyboard-accessible
  - Logical tab order
  - Keyboard shortcuts (Ctrl+K search, etc.)
  - Arrow keys for tree navigation
  - Enter/Space for selection
- ARIA labels:
  - Buttons have descriptive labels
  - Tree structure properly marked
  - Live regions for status updates
  - Icons have aria-label
- Focus management:
  - Visible focus indicator on all elements
  - Focus trap in modals
  - Focus restoration on drawer close
- Semantic HTML:
  - Use native buttons, not div buttons
  - Use nav for navigation
  - Use main for main content
  - Use section for sections
- Color accessibility:
  - Sufficient contrast (WCAG AA minimum)
  - Color not the only indicator of status
  - Test with contrast checker
- Screen reader testing:
  - VoiceOver (macOS/iOS)
  - NVDA (Windows)
  - Verify all content is announced

**Files/Areas to Change:**
- All component files
- Add media queries to responsive components
- Enhance ARIA attributes
- Add semantic HTML

**Deliverables:**
1. Responsive layout for all breakpoints
2. Touch-optimized UI for mobile
3. Full keyboard navigation
4. ARIA labels and semantic HTML
5. WCAG AA compliance

**Functional Constraints:**
- All functionality must work on all devices
- No feature removal on mobile
- Existing APIs unchanged

**Accessibility Requirements:**
- Keyboard navigation complete
- ARIA labels comprehensive
- Focus management correct
- Semantic HTML throughout
- Color contrast minimum WCAG AA
- Animations respect prefers-reduced-motion
- Screen reader support verified

**Performance Considerations:**
- Mobile layout should be lean (minimal JS)
- Media queries should not cause layout thrashing
- Touch events optimized
- Drawer animations smooth on low-end devices

**Validation Criteria:**
- [ ] Desktop layout functional at 1280px+
- [ ] Tablet layout functional at 768-1279px
- [ ] Mobile layout functional at 320-767px
- [ ] All buttons keyboard-navigable
- [ ] Tab order logical
- [ ] Focus indicators visible
- [ ] ARIA labels present
- [ ] Semantic HTML used
- [ ] Color contrast WCAG AA
- [ ] Screen reader tested
- [ ] Touch targets 44px+
- [ ] Drawer animations smooth
- [ ] No horizontal scroll on mobile

**Definition of Done:**
- Fully responsive layout
- Keyboard navigation complete
- ARIA and semantic HTML comprehensive
- Accessibility testing passed
- All devices supported
- Ready for visual QA (Phase-8)

---

### UI-Phase-8: Visual QA & Production Polish

**Status:** [ ] Not Started

**Objective:**
Final visual review, performance optimization, and regression testing.

**Scope:**
- Visual consistency review:
  - Compare against reference screenshots
  - Verify all colors use design system
  - Check spacing and alignment
  - Typography hierarchy correct
  - Icon sizes consistent
- Performance optimization:
  - Measure rendering time
  - Check for unnecessary re-renders
  - Verify large trees performant
  - Optimize images/assets
- Code cleanup:
  - Remove unused CSS/components
  - Consolidate duplicate styles
  - Clean up commented code
  - Update component documentation
- Regression testing:
  - Run all existing tests
  - Verify no functionality broken
  - Test all GraphQL queries/mutations
  - Test all keyboard shortcuts
  - Test search/filter
  - Test watch mode
  - Test snapshot updates
  - Test coverage panel
- Screenshot comparison:
  - Take reference screenshots
  - Compare to design vision
  - Document any deviations
  - Fix inconsistencies

**Files/Areas to Change:**
- All component files (cleanup)
- Theme documentation
- Component Storybook (if applicable)

**Deliverables:**
1. Final visual review and adjustments
2. Performance metrics and optimizations
3. Regression test results
4. Production-ready UI
5. Updated documentation

**Functional Constraints:**
- All existing functionality must work perfectly
- No bugs introduced in final polish

**Accessibility Requirements:**
- Full audit completed
- All issues resolved
- Verified on multiple browsers/devices

**Performance Considerations:**
- Measure baseline and optimized metrics
- Document performance improvements
- Identify any remaining bottlenecks

**Validation Criteria:**
- [ ] All colors use design system
- [ ] All spacing uses spacing scale
- [ ] All animations under 300ms
- [ ] Typography hierarchy clear
- [ ] Icons consistent size
- [ ] No hard-coded colors
- [ ] No commented code
- [ ] Render time acceptable
- [ ] Large trees performant
- [ ] All tests pass
- [ ] All GraphQL queries work
- [ ] All mutations work
- [ ] Keyboard shortcuts work
- [ ] Search/filter works
- [ ] Watch mode works
- [ ] Snapshot updates work
- [ ] Coverage panel works
- [ ] Visual matches design vision
- [ ] Documentation complete

**Definition of Done:**
- Production-ready UI delivered
- All tests passing
- Performance acceptable
- Documentation complete
- Ready for deployment

---

## Component Architecture

### Proposed Directory Structure

```
ui/
├── layout/
│   ├── AppShell.tsx           # Main container
│   ├── TopBar.tsx             # Top navigation
│   ├── StatusBar.tsx          # Bottom status
│   ├── LeftSidebar.tsx        # Left panel wrapper
│   └── RightPanel.tsx         # Right panel wrapper
├── test-explorer/
│   ├── TestExplorer.tsx       # Main component
│   ├── TestTree.tsx           # Tree rendering
│   ├── TestTreeNode.tsx       # Tree node
│   └── TestMetrics.tsx        # Metrics
├── test-runner/
│   ├── TestRunner.tsx         # Main component
│   ├── TestHeader.tsx         # Header
│   ├── TestMetricsBar.tsx     # Metrics
│   ├── ExecutionProgress.tsx  # Progress
│   ├── SuiteCard.tsx          # Suite
│   ├── TestRow.tsx            # Test item
│   └── TestFailure.tsx        # Failure display
├── test-bot/
│   ├── TestBotPanel.tsx       # Main panel
│   ├── TestBotAvatar.tsx      # Bot SVG
│   ├── TestBotQueue.tsx       # Queue
│   ├── TestBotWaveform.tsx    # Waveform
│   └── useTestBotState.ts     # Hook
├── components/
│   ├── Button.tsx             # Button (redesigned)
│   ├── MetricCard.tsx         # Metric card
│   ├── ProgressBar.tsx        # Progress bar
│   ├── SearchBar.tsx          # Search input
│   ├── StatusIndicator.tsx    # Status
│   ├── Breadcrumb.tsx         # Breadcrumb
│   ├── Tooltip.tsx            # Tooltip
│   ├── IconButton.tsx         # Icon button
│   ├── ThemeToggle.tsx        # Theme (existing)
│   ├── BotMascot.tsx          # Bot (existing)
│   ├── BackgroundAnimation.tsx # Background (existing)
│   └── TestStatusOverlay.tsx  # Overlay (existing)
├── context/
│   └── ThemeContext.tsx       # Theme provider (existing)
├── design-system/
│   └── tokens.ts              # Design tokens (existing)
├── styles/
│   ├── GlobalStyles.tsx       # Global CSS
│   ├── DesignSystem.md        # Documentation
│   └── animations.css         # Keyframes
├── hooks/
│   ├── use-keys.ts            # (existing)
│   └── [other hooks]          # (existing)
└── [other existing dirs]
```

### Reuse vs. New Components

**Reuse (Existing):**
- `BotMascot.tsx` - Update to SVG rendering
- `BackgroundAnimation.tsx` - Keep as-is, use in shell
- `TestStatusOverlay.tsx` - Deprecate (replace with TestBotPanel)
- `ThemeContext.tsx` - Keep, wrap App
- `ThemeToggle.tsx` - Keep, integrate in TopBar
- `design-system/tokens.ts` - Keep, extend if needed
- All sidebar/test-file components - Refactor gradually

**New:**
- TopBar, StatusBar (shell)
- TestExplorer, TestTree, TestTreeNode, TestMetrics
- TestRunner, TestHeader, TestMetricsBar, ExecutionProgress
- SuiteCard, TestRow, TestFailure
- TestBotPanel, TestBotAvatar, TestBotQueue, TestBotWaveform
- Various UI primitives (SearchBar, MetricCard, ProgressBar, etc.)

---

## Dependency Graph

```
Phase-1: Foundation & Design System
  ↓
Phase-2: Application Shell
  ├─ uses: Phase-1 tokens
  ├─ uses: react-resizable-panels
  └─ uses: react-feather (icons)
  ↓
Phase-3: Test Explorer
  ├─ uses: Phase-1, Phase-2
  ├─ uses: existing tree queries
  └─ must not break existing functionality
  ↓
Phase-4: Test Execution Workspace
  ├─ uses: Phase-1, Phase-2, Phase-3
  ├─ uses: existing test file queries
  └─ must not break existing functionality
  ↓
Phase-5: Test Bot Integration
  ├─ uses: Phase-1, Phase-2
  ├─ uses: existing runner subscriptions
  └─ independent from Phase-3, Phase-4 (can run in parallel if needed)
  ↓
Phase-6: Animations & Micro-Interactions
  ├─ uses: Phase-1-5
  └─ enhancement only
  ↓
Phase-7: Responsive & Accessibility
  ├─ uses: Phase-1-6
  └─ enhancement only
  ↓
Phase-8: Visual QA & Production Polish
  ├─ uses: Phase-1-7
  └─ final refinement
```

**Parallelization Opportunities:**
- Phase-5 could start in parallel with Phase-3 and Phase-4 (independent work)
- Phase-6 could start after Phase-5 if needed for time compression
- No earlier phases can be parallelized (too many dependencies)

---

## Key Technical Decisions

### 1. Design Tokens via CSS Variables

**Decision:** Use native CSS custom properties for all design values.

**Rationale:**
- No runtime performance cost (native browser feature)
- Easy theme switching without re-renders
- Works with styled-components seamlessly
- Standard approach in modern frontend development

**Implementation:**
- Tokens defined in `design-system/tokens.ts`
- Applied to document root in GlobalStyles
- Referenced as `var(--color-primary)`, etc. in styles

### 2. Bot Avatar as SVG (Not Emoji)

**Decision:** Implement bot as programmatic SVG with React components, not emoji.

**Rationale:**
- Greater control over appearance and animations
- Can create custom holographic rings, glowing effects
- Scales well across different sizes
- Matches futuristic aesthetic better
- More accessible (semantic SVG elements)

**Implementation:**
- `TestBotAvatar.tsx` renders SVG dynamically
- Eyes, body, ring as separate SVG groups
- Animations applied via CSS or Framer Motion

### 3. Real Data Only (No Mocks)

**Decision:** All displayed metrics and status must come from actual application state.

**Rationale:**
- Prevents disconnect between visual and actual state
- Ensures consistency and reliability
- Easier to test and verify
- Developer expectation: UI reflects reality

**Implementation:**
- All subscriptions/queries preserved
- New components subscribe to existing data
- State mapping hooks (e.g., `useTestBotState`) derive UI state

### 4. CSS Animations Preferred

**Decision:** Use CSS @keyframes and transitions for all animations, not JavaScript.

**Rationale:**
- Better performance (GPU-accelerated)
- Smoother on low-end devices
- Respects prefers-reduced-motion natively
- Simpler code
- Easier to coordinate animations

**Implementation:**
- All animations in `animations.css`
- Referenced via animation-name property
- Framer Motion used only where necessary (complex choreography)

### 5. Gradual Migration Strategy

**Decision:** Refactor existing components incrementally, not rewrite from scratch.

**Rationale:**
- Lower risk of regressions
- Easier to test and verify
- Can deploy in phases
- Maintains stability

**Implementation:**
- New layout wraps existing components first
- Components gradually refactored to use design system
- Old component code left in place until new is complete

---

## Performance Targets

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| Initial Load | < 2s | TBD | TBD |
| First Paint | < 1s | TBD | TBD |
| Tree Render (100 items) | < 100ms | TBD | TBD |
| Tree Render (1000 items) | < 300ms | TBD | TBD |
| State Update | < 50ms | TBD | TBD |
| Animation Frame Rate | 60 FPS | TBD | TBD |
| Memory Usage | < 100MB | TBD | TBD |

---

## Accessibility Targets

- **WCAG 2.1 Level AA** at minimum
- **Keyboard accessibility:** 100% of interactive elements
- **Screen reader support:** All content accessible
- **Focus management:** Visible, logical, managed correctly
- **Color contrast:** Minimum 4.5:1 for text
- **Motion:** prefers-reduced-motion fully supported

---

## Testing Strategy

### Unit Tests
- Component rendering
- State derivation
- Event handlers

### Integration Tests
- GraphQL queries/subscriptions
- Component interaction
- Navigation

### Visual Tests
- Screenshot comparison
- Responsive layout testing
- Animation verification

### Accessibility Tests
- Keyboard navigation
- Screen reader (VoiceOver, NVDA)
- Color contrast
- Focus management

### Performance Tests
- Large tree rendering
- Animation frame rate
- Memory usage
- State update latency

---

## Documentation Requirements

### Deliverables
1. **Design System Documentation** (Phase-1)
   - Colors, spacing, typography, animations
   - CSS variables reference
   - Usage guidelines

2. **Component Storybook** (Phase-2-8)
   - Component variants
   - Props documentation
   - Usage examples
   - Accessibility notes

3. **API Documentation** (Phase-5)
   - TestBot component API
   - State contract
   - Integration guide

4. **Accessibility Guide** (Phase-7)
   - ARIA practices used
   - Keyboard shortcuts
   - Screen reader support

5. **Migration Guide** (All phases)
   - Old → New component mapping
   - Breaking changes (if any)
   - Deprecation timeline

---

## Risk Analysis

### High Risk

1. **Breaking Existing Functionality**
   - **Mitigation:** Extensive regression testing, gradual migration, phase gates

2. **Performance Regression**
   - **Mitigation:** Baseline measurements, performance testing in each phase, optimization if needed

3. **Accessibility Compliance Miss**
   - **Mitigation:** Accessibility audit in Phase-7, testing with assistive tech

### Medium Risk

1. **Animation Performance on Low-End Devices**
   - **Mitigation:** Use CSS animations, test on mid-range devices, prefers-reduced-motion

2. **SVG Bot Rendering Issues**
   - **Mitigation:** Test SVG rendering across browsers, fallback to simple rendering if needed

3. **Responsive Layout Gaps**
   - **Mitigation:** Test all breakpoints, use standardized responsive patterns

### Low Risk

1. **Design Token Naming**
   - **Mitigation:** Clear naming convention, well-documented

2. **Component Naming Conflicts**
   - **Mitigation:** Organize in subdirectories, clear naming

---

## Roadmap Change Management

### Recording Changes

When implementation reveals needed changes:

1. Update this section with details
2. Note date, phase, reason, and impact
3. Preserve original plan for comparison
4. Get approval before deviating significantly

### Template

```markdown
### Roadmap Change #[N]

**Date:** YYYY-MM-DD
**Phase:** [Phase affected]
**Change:** [What changed]
**Reason:** [Why]
**Impact:** [What's affected]
**Approval:** [Approved by]
```

---

## Phase Execution Instructions

### Before Starting a Phase

1. Read the phase specification in this document
2. Check dependencies are complete
3. Review validation criteria
4. Plan component structure
5. Identify affected files

### During Phase Execution

1. Follow specification exactly
2. Preserve all existing functionality
3. Use design system for all colors/spacing
4. Run existing tests frequently
5. Document deviations in this roadmap

### After Phase Completion

1. Verify all validation criteria met
2. Run full test suite
3. Manual UI review against specification
4. Update phase status to [x] Completed
5. Add implementation notes
6. Record any discovered issues

---

## Current Phase Status

### Phase Overview

- [ ] UI-Phase-1 — Foundation & Design System
- [ ] UI-Phase-2 — Application Shell
- [ ] UI-Phase-3 — Test Explorer
- [ ] UI-Phase-4 — Test Execution Workspace
- [ ] UI-Phase-5 — Test Bot Integration
- [ ] UI-Phase-6 — Animations & Micro-Interactions
- [ ] UI-Phase-7 — Responsive & Accessibility
- [ ] UI-Phase-8 — Visual QA & Production Polish

### Next Steps

1. **Approval:** Review this roadmap; confirm direction
2. **Phase-1 Start:** Integrate design system into app
3. **Incremental Progress:** Complete phases sequentially
4. **Regular Validation:** After each phase, verify against reference

---

## Appendices

### A. Color Reference

**Design System Colors:**

Dark Theme:
- Primary: hsl(280, 100%, 50%) — Vibrant Purple (#9D4EDD)
- Secondary: hsl(200, 100%, 50%) — Bright Cyan (#00D9FF)
- Success: hsl(150, 100%, 45%) — Neon Green (#20E3B2)
- Warning: hsl(40, 100%, 50%) — Neon Yellow (#F5B83D)
- Error: hsl(0, 100%, 50%) — Neon Red (#FF4D67)
- Background: hsl(280, 20%, 8%) — Deep Purple (#070B14)
- Surface: hsl(280, 15%, 15%) — Purple Black (#0A1020)
- Text: hsl(0, 0%, 95%) — Off White (#F2F2F2)
- Muted: hsl(0, 0%, 70%) — Gray (#B3B3B3)

### B. Typography Scale

- xs: 12px
- sm: 14px
- base: 16px
- lg: 18px
- xl: 20px
- xxl: 24px
- xxxl: 32px

Font Stack:
- UI: Open Sans, system-ui
- Code: Monaco, Menlo, Courier New, monospace

### C. Spacing Scale

- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px
- xxl: 48px
- xxxl: 64px

### D. Border Radius

- xs: 2px
- sm: 4px
- md: 8px
- lg: 12px
- xl: 16px
- full: 9999px (pill shape)

### E. Shadow/Glow Reference

- Shadow XS: 0 2px 8px rgba(0, 0, 0, 0.1)
- Glow Primary: 0 0 20px rgba(200, 50, 255, 0.5)
- Glow Secondary: 0 0 20px rgba(0, 255, 200, 0.5)
- Glow Success: 0 0 20px rgba(100, 255, 150, 0.5)
- Glow Error: 0 0 20px rgba(255, 100, 100, 0.5)

### F. Breakpoints

- xs: 320px (mobile)
- sm: 640px (mobile large)
- md: 768px (tablet)
- lg: 1024px (laptop)
- xl: 1280px (desktop)
- xxl: 1536px (large desktop)

### G. Supported Browsers

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- iOS Safari 14+
- Chrome Android 90+

### H. Design Reference Assets

- Reference screenshots directory: `/docs/ui/reference/`
- Contains example layouts for all phases
- Used for visual validation in Phase-8

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-09-24 | AI | Initial roadmap document |

---

## Conclusion

This roadmap provides a clear, sequential path to modernizing Majestic's UI while preserving all functionality. By following the phases in order and respecting dependencies, the project can be completed reliably without regressions or major rewrites.

**Key Success Factors:**
1. Follow phases sequentially
2. Preserve functionality absolutely
3. Use design system consistently
4. Test frequently
5. Document deviations
6. Validate after each phase

The final result should be a production-grade, futuristic test-runner UI that developers love to use.
