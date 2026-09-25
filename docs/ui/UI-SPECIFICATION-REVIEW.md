# UI Roadmap Review — Specification Validation

**Purpose:** Confirm all specifications match your reference design vision before Phase-1 implementation begins.

**Status:** Ready for Your Review & Approval

**Location:** `docs/ui/UI-SPECIFICATION-REVIEW.md`

---

## Executive Specification Review

### 1. OVERALL LAYOUT

**Your Reference Shows:**
```
┌────────────────────────────────────────┐
│ TOP BAR (60px)                         │
├────────┬──────────────┬────────────────┤
│ SIDEBAR│ CENTER WORK  │ BOT PANEL      │
│ 300px  │ AREA (fluid) │ 300px          │
│        │              │                │
│        │              │                │
│        │              │                │
├────────┴──────────────┴────────────────┤
│ BOTTOM STATUS BAR (32px)               │
└────────────────────────────────────────┘
```

**Roadmap Specifies:**
- ✅ Left Sidebar: 280-320px (fixed, resizable)
- ✅ Center: Fluid (expands when panels resize)
- ✅ Right Bot Panel: 280-320px (fixed, resizable)
- ✅ All three panels ALWAYS visible on desktop
- ✅ NOT collapsed/tabbed/hidden

**Questions for You:**
- Is 280-320px the right width, or do you prefer different dimensions?
- Should panels be resizable by dragging handles, or fixed size?
- Should there be a minimum/maximum width for panels?

---

### 2. TOP NAVIGATION BAR

**Your Reference Shows:**
- Left: Majestic logo with lightning icon
- Center-Left: **Run (blue button)** | Stop (dark) | Watch | Refresh
- Center-Right: Search input with Ctrl+K hint
- Right: Settings icon, theme toggle, user avatar (BG)

**Roadmap Specifies:**
```
Left: Logo
Center-Left: Run (blue) | Stop | Watch | Refresh
Center-Right: Search "Search tests, suites, files..." [Ctrl+K]
Right: Settings | Theme Toggle | User Avatar
```

**Questions for You:**

1. **Run Button Styling:**
   - Should it be solid blue (#5555FF) or gradient?
   - With dropdown (Run | Run Failed)?
   - Icon + text or icon only?

2. **Stop Button:**
   - Only visible when tests running?
   - Always visible but disabled?

3. **Watch Button:**
   - Toggle state (Watch / Unwatch)?
   - Shows active state when watch mode on?

4. **Search Bar:**
   - Width: Fixed 300px or responsive?
   - Should it show search results dropdown below?
   - Icon inside input? (magnifying glass)

5. **User Avatar (BG):**
   - Is this a user/profile section or just avatar?
   - Should it have dropdown menu?

---

### 3. LEFT SIDEBAR — STRUCTURE

**Your Reference Shows:**
```
┌─────────────────────┐
│ [Search input]      │ ← Filter tests...
├─────────────────────┤
│ ✓ 3 Passing suites  │ ← Metrics
│ ✕ 0 Failing suites  │
│ ✓ 6 Passing tests   │
│ ✕ 0 Failing tests   │
├─────────────────────┤
│ Tests   [6]         │ ← Header + count
├─────────────────────┤
│ ▼ UI                │ ← Expandable tree
│  ├─ src             │
│  │  ├─ Login        │
│  │  │  ├─ ✓ C.jsx   │ 1.2s
│  │  │  └─ ✓ C.tsx   │ 2.4s
│  │  └─ ...          │
│  └─ ...             │
│                     │
│ [scrollable]        │
└─────────────────────┘
```

**Roadmap Specifies:**
- ✅ Search input: "Filter tests..."
- ✅ Metrics: 2-column display (Passing/Failing)
- ✅ "Tests" header with count badge
- ✅ Expandable tree with:
  - Folder icons
  - File icons
  - Status indicators (✓ ✕ ⊙)
  - Duration badges (1.2s)
  - Hierarchical indentation

**Questions for You:**

1. **Metrics Display:**
   - Show 4 items always (Passing/Failing Suites & Tests)?
   - Should metrics be clickable to filter?
   - Should they update real-time during execution?

2. **Tree Expansion:**
   - Click on folder to toggle expand/collapse?
   - Chevron icon on left or right?
   - Animation duration for expand/collapse?

3. **Selected Item Highlighting:**
   - Blue/cyan background + left border?
   - How thick should left border be (2-3px)?
   - Should it extend full width or just text area?

4. **Duration Display:**
   - Always show (e.g., "1.2s")?
   - Only show on hover?
   - Font size and styling?

5. **Test Count Sorting:**
   - Should items be sorted by name, type, or status?
   - Any grouping by status?

---

### 4. CENTER CONTENT — HEADER

**Your Reference Shows:**
```
┌───────────────────────────────────────────────┐
│ UI > src > Login > ChangePassword             │ ← Breadcrumb
│ ChangePassword.test.tsx                       │ ← Test file
│ [Suite] [5 Tests] [MFA] [Bug Condition] 🟠    │ ← Badges + Status
│ Started 14:32:18                              │ ← Timestamp
└───────────────────────────────────────────────┘
```

**Roadmap Specifies:**
- ✅ Breadcrumb: "UI > src > Login > ChangePassword" (clickable)
- ✅ Test file name: "ChangePassword.test.tsx" (monospace, clickable)
- ✅ Badges: "Suite", "5 Tests", "MFA", "Bug Condition"
- ✅ Status: "Running" with timestamp

**Questions for You:**

1. **Breadcrumb Behavior:**
   - Click segment to navigate to that folder/suite?
   - Or just informational?
   - Should it truncate on small screens?

2. **Badges:**
   - "Suite" badge — always show?
   - "5 Tests" — always show current count?
   - Custom tags — editable or read-only?
   - What determines which badges appear?

3. **Status Indicator:**
   - Emoji (🟠) or icon?
   - Colors: 🟠 Running, 🟢 Passed, 🔴 Failed, ⚪ Pending?
   - Text label too ("Running", "Passed", etc.)?

4. **Timestamp:**
   - Always show "Started HH:MM:SS"?
   - Or show completion time when done?
   - Format: 24-hour or 12-hour?

---

### 5. CENTER CONTENT — METRICS GRID

**Your Reference Shows:**
```
┌───────┬───────────────┐
│ ✓ 3   │ ✓ 6           │
│ Passing Suites | Passing Tests
├───────┼───────────────┤
│ ✕ 0   │ ✕ 0           │
│ Failing Suites | Failing Tests
├───────┼───────────────┤
│ ⊟ 0   │ ⏱ 12.4s       │
│ Skipped Tests | Total Duration
└───────┴───────────────┘
```

**Roadmap Specifies:**
- ✅ Fixed 2×3 grid (6 cards)
- ✅ Row 1: Passing Suites | Failing Suites
- ✅ Row 2: Passing Tests | Failing Tests
- ✅ Row 3: Skipped Tests | Total Duration
- ✅ Real data only (no mock values)

**Questions for You:**

1. **Card Styling:**
   - Border? Border-radius?
   - Background color (darker surface)?
   - Hover effect?

2. **Icon + Number + Label:**
   - Icon size?
   - Number font size/weight?
   - Label font size?
   - All three on one line or stacked?

3. **Colors:**
   - Passing: Green (#20E3B2)?
   - Failing: Red (#FF4D67)?
   - Skipped: Gray (#64748B)?
   - Duration: Different color or neutral?

4. **Spacing:**
   - Gap between cards?
   - Padding inside each card?
   - Total grid size?

---

### 6. CENTER CONTENT — PROGRESS BAR

**Your Reference Shows:**
```
████████████░░░░░░░░  ← Filled segments
3 / 6              50%  ← Stats below
```

**Roadmap Specifies:**
- ✅ Horizontal segmented bar
- ✅ Colored segments: Green (pass) | Red (fail) | Amber (running) | Gray (pending)
- ✅ Below: "X / Y" count
- ✅ Below: "Z%" percentage
- ✅ Animated during execution

**Questions for You:**

1. **Segment Colors:**
   - Confirmed: Green (pass), Red (fail), Amber (running), Gray (pending)?
   - Any glow effect on running segments?
   - Smooth gradient or discrete segments?

2. **Bar Height & Length:**
   - Height: 8px, 12px, 16px?
   - Length: Full width or constrained?

3. **Animation:**
   - Smooth progress animation (100-200ms per update)?
   - Pulse effect on running segments?

4. **Responsiveness:**
   - Bar wraps to two lines on mobile?
   - Stays on one line?

---

### 7. CENTER CONTENT — SUITE & TEST CARDS

**Your Reference Shows:**
```
┌─ Login                          🟠 Running 3/6 8.7s ─┐
│                                                       │
│  ├─ ✓ ChangePassword.test.jsx        1.2s  ✓        │
│  ├─ 🟠 ChangePassword.test.tsx        2.4s  ⏳        │
│  ├─ ✓ CreatePassword.test.jsx         1.1s  ✓        │
│  ├─ ✓ CreatePassword.test.tsx         1.3s  ✓        │
│  ├─ ✓ ForgotPassword.test.jsx         1.0s  ✓        │
│  ├─ ⚪ LoginPage.test.tsx             (pending)      │
│  └─ ⚪ ResetPassword.test.tsx          (pending)      │
│                                                       │
└───────────────────────────────────────────────────────┘
```

**Roadmap Specifies:**
- ✅ Suite cards expandable/collapsible
- ✅ Suite header: Status + Name + Test Count + Duration
- ✅ Suite status: 🟠 Running 3/6 (shows current/total)
- ✅ Test rows inside:
  - Status icon (✓ green, 🟠 amber, ✕ red, ⚪ gray)
  - Test name
  - Duration
  - Animated indicator if running

**Questions for You:**

1. **Suite Card Styling:**
   - Border or just background color change?
   - Expanded state visually different (expanded arrow)?
   - Hover state effect?

2. **Indentation:**
   - Test rows indented 16px under suite?
   - Multiple nesting levels (e.g., file > suite > test)?

3. **Running Animation:**
   - Pulsing dot animation?
   - Spinning loader icon?
   - Glow effect?
   - Duration of animation (repeat every X ms)?

4. **Failure Display:**
   - Expand to show error when test fails?
   - Red background on row?
   - Separate error panel below suite?

5. **Test Row Interactions:**
   - Click row to show details?
   - Double-click to run just that test?
   - Hover shows additional buttons (debug, re-run, etc.)?

---

### 8. CENTER CONTENT — FAILURE DISPLAY

**Your Reference Shows:**
```
┌──────────────────────────────────────┐
│ ✕ calls mfaService.verifySession     │
│                                      │
│ AssertionError: expected 'TOTP'      │
│ to be 'EmailOTP'                     │
│                                      │
│ at verifySession                     │
│ at ChangePassword.test.tsx:78:12     │
│                                      │
│                   [View Error ↗]      │
└──────────────────────────────────────┘
```

**Roadmap Specifies:**
- ✅ Red-tinted translucent background
- ✅ Error message in monospace font
- ✅ Stack trace with line numbers
- ✅ Source location (clickable)
- ✅ Copy error button or "View Error" link

**Questions for You:**

1. **Display Location:**
   - Shown inside test row (expandable)?
   - Shown below suite?
   - Shown in separate panel?
   - Shown in modal/overlay?

2. **Error Panel Styling:**
   - Background: Dark red tint or red border?
   - Border radius?
   - Padding?

3. **Stack Trace:**
   - Show full trace or truncate?
   - Line numbers clickable (open source)?
   - Highlight error line?

4. **Action Buttons:**
   - Copy error message button?
   - View in editor button?
   - Dismiss button?

---

### 9. RIGHT PANEL — TEST BOT

**Your Reference Shows:**
```
┌─────────────────────────────┐
│ ✦ Test Bot          🟢 Active │
├─────────────────────────────┤
│                             │
│     [SVG Bot Avatar]        │  ← Animated robot
│     with glowing eyes       │     and ring
│                             │
│     Running 3/6             │
│     Executing tests...      │
│                             │
├─────────────────────────────┤
│ 🟠 ChangePassword.test.tsx  │
│    Running...         2.4s  │
│                             │
│ ✓ ChangePassword.test.jsx   │
│    Completed          1.2s  │
│                             │
│ ✓ CreatePassword.test.jsx   │
│    Completed          1.1s  │
│                             │
│ ⚪ CreatePassword.test.tsx   │
│    Pending                  │
│                             │
│ ⚪ LoginPage.test.tsx        │
│    Pending                  │
│                             │
│ ⚪ ResetPassword.test.jsx    │
│    Pending                  │
│                             │
├─────────────────────────────┤
│ ▁▂▃▂▁ Analyzing tests...    │
└─────────────────────────────┘
```

**Roadmap Specifies:**
- ✅ Header: "✦ Test Bot" + "🟢 Active" + Menu
- ✅ SVG bot avatar with animations
- ✅ Status: "Running X/Y" or "Passed", "Failed"
- ✅ Execution queue:
  - Current running (highlighted, animated)
  - Completed (checkmark)
  - Pending (grayed)
  - 6 items visible, scrollable
- ✅ Activity indicator: Animated waveform

**Questions for You:**

1. **Bot Avatar:**
   - Size: 120px, 150px, 200px square?
   - Glowing ring around bot?
   - Glowing eyes?
   - Animations: Floating when idle, pulsing when running?

2. **Bot States:**
   - Idle: Blue/purple low-energy glow?
   - Running: Cyan glow + animation?
   - Success: Green glow, happy animation?
   - Failure: Red glow, warning pulse?
   - How long animation loops?

3. **Queue Display:**
   - Show 6 items always visible?
   - Scrollable if more than 6?
   - Smooth scroll or jump?

4. **Queue Item Styling:**
   - Running item: Blue/cyan highlight + animated dot?
   - Completed: Green checkmark + duration time?
   - Pending: Gray text + no duration?
   - Font size for test names?

5. **Activity Indicator:**
   - Animated waveform bars (▁▂▃▂▁)?
   - Pulse dots?
   - Spinning animation?
   - Text changes: "Analyzing", "Executing", "Waiting"?

---

### 10. BOTTOM STATUS BAR

**Your Reference Shows:**
```
🟢 Runner Connected | Environment: local | main | Node 20.11.1 | Elapsed 00:00:08
                    ⌘ R Run | ⌘ S Stop | ⌘ D Debug | ⌘ / Search
```

**Roadmap Specifies:**
- ✅ Left: "🟢 Runner Connected" + Environment info
- ✅ Center: Branch, Node version, other info
- ✅ Right: Elapsed time counter
- ✅ Right-most: Keyboard shortcut hints

**Questions for You:**

1. **Status Indicator:**
   - Green dot when connected, red when disconnected?
   - Tooltip showing connection status details?
   - What if disconnected during test run?

2. **Environment Info:**
   - Show "Environment: local"?
   - Other environment variables to display?
   - Editable or read-only?

3. **Branch Display:**
   - Current git branch?
   - Clickable to switch branches?

4. **Node Version:**
   - Show "Node 20.11.1"?
   - Editable or read-only?

5. **Elapsed Time:**
   - Start counting when Run clicked?
   - Reset on new run?
   - Format: HH:MM:SS?
   - Paused during watch mode?

6. **Keyboard Shortcuts:**
   - Show hints: ⌘ R, ⌘ S, ⌘ D, ⌘ /?
   - Tooltips on hover?
   - Or just for reference (not interactive)?

---

### 11. COLOR PALETTE

**Exact Hex Values Specified:**

**Background & Surfaces:**
- Background: #0D1424 ✓
- Surface: #0A1020 ✓
- Surface Alt: #111827 ✓
- Surface Hover: #151D2D ✓

**Semantic Colors:**
- Primary Button: #5555FF ✓ (Blue)
- Secondary: #22D3EE ✓ (Cyan)
- Success/Passed: #20E3B2 ✓ (Neon Green)
- Warning/Running: #F5B83D ✓ (Amber)
- Error/Failed: #FF4D67 ✓ (Neon Red)
- Pending: #64748B ✓ (Gray)

**Text Colors:**
- Primary: #F8FAFC ✓ (Off-white)
- Secondary: #94A3B8 ✓ (Muted)
- Muted: #64748B ✓ (Dark gray)

**Questions for You:**

1. **Color Accuracy:**
   - Are these hex values exactly what you want?
   - Any slight adjustments needed?
   - Should primary button be different shade of blue?

2. **Light Theme:**
   - Should light theme invert all colors?
   - Or use different palette (not inverted)?
   - Priority: Dark first, light secondary?

3. **Glow Effects:**
   - Neon glows on active elements?
   - How intense (box-shadow blur)?
   - Applied to buttons, bot, active items?

---

### 12. RESPONSIVE BEHAVIOR

**Roadmap Specifies:**

**Desktop (1280px+):**
- Full 3-column layout (all visible)
- Panels user-resizable

**Tablet (768-1279px):**
- Collapsible left sidebar (hamburger menu)
- Collapsible right bot panel (drawer)
- Center content expands to fill

**Mobile (320-767px):**
- Top bar with hamburger menu
- Center content primary
- Sidebar and bot in drawers
- Touch-friendly sizes

**Questions for You:**

1. **Tablet Behavior:**
   - Should sidebar collapse at 1024px or 768px?
   - Should bot panel collapse at 1024px or 768px?
   - Or should they collapse independently?

2. **Mobile Layout:**
   - Sidebar in left drawer (swipe or hamburger)?
   - Bot in right drawer or floating button?
   - Bottom bar still visible or in menu?

3. **Breakpoints:**
   - Confirmed: 768px (tablet), 1024px (laptop), 1280px (desktop)?
   - Any mobile-specific optimizations (larger touch targets)?

---

## Critical Validation Questions

### Question Set A: Layout

**Question 1: Desktop Panel Visibility**
- ❓ On desktop (1280px+), should ALL THREE panels always be visible?
- ❓ Or should sidebar/bot be hidden by default (toggle/drawer)?
- **Reference shows:** All visible
- **Roadmap specifies:** All visible
- **Your confirmation needed:** YES / NO

**Question 2: Panel Resizing**
- ❓ Should users be able to drag panel handles to resize?
- ❓ Or should widths be fixed?
- **Reference shows:** Resizable (handles visible)
- **Roadmap specifies:** User-resizable
- **Your confirmation needed:** YES / NO

**Question 3: Center Content Expansion**
- ❓ When left sidebar is hidden (tablet), should center expand?
- ❓ When right panel is hidden (tablet), should center expand?
- **Reference shows:** (N/A - reference is desktop only)
- **Roadmap specifies:** Center expands when panels collapse
- **Your confirmation needed:** YES / NO

---

### Question Set B: Colors

**Question 4: Primary Button Color**
- ❓ Confirmed: #5555FF (bright blue)?
- ❓ Or should it be: #6366F1 (slightly different blue)?
- **Reference shows:** #5555FF approximately
- **Roadmap specifies:** #5555FF
- **Your confirmation needed:** #5555FF / #6366F1 / OTHER

**Question 5: Background Color**
- ❓ Confirmed: #0D1424 (deep purple)?
- ❓ Or should it be lighter/darker?
- **Reference shows:** #0D1424 approximately
- **Roadmap specifies:** #0D1424
- **Your confirmation needed:** YES / NO / ADJUST

**Question 6: Neon Green (Success)**
- ❓ Confirmed: #20E3B2?
- **Reference shows:** #20E3B2
- **Roadmap specifies:** #20E3B2
- **Your confirmation needed:** YES / NO / ADJUST

**Question 7: Neon Red (Failure)**
- ❓ Confirmed: #FF4D67?
- **Reference shows:** #FF4D67
- **Roadmap specifies:** #FF4D67
- **Your confirmation needed:** YES / NO / ADJUST

**Question 8: Amber (Running)**
- ❓ Confirmed: #F5B83D?
- **Reference shows:** #F5B83D
- **Roadmap specifies:** #F5B83D
- **Your confirmation needed:** YES / NO / ADJUST

---

### Question Set C: Components

**Question 9: Test Bot SVG Avatar**
- ❓ Size preference: 120px, 150px, or 200px?
- ❓ Should it have animated background ring?
- ❓ Glowing eyes animation?
- **Reference shows:** ~150px approx
- **Roadmap specifies:** SVG with animations (size TBD)
- **Your confirmation needed:** Size + animation details

**Question 10: Metrics Grid**
- ❓ Confirmed: Fixed 2×3 grid (6 cards always)?
- ❓ Or should grid be flexible/responsive?
- **Reference shows:** Fixed 2×3
- **Roadmap specifies:** Fixed 2×3
- **Your confirmation needed:** YES / NO

**Question 11: Progress Bar Animation**
- ❓ Should segments animate smoothly or jump?
- ❓ Animation duration per update?
- ❓ Pulsing effect on running segments?
- **Reference shows:** Smooth animation
- **Roadmap specifies:** Animated during execution
- **Your confirmation needed:** Smooth / Jump / Other

**Question 12: Test Bot Queue**
- ❓ Confirmed: Show 6 items max?
- ❓ Scroll behavior (smooth scroll or page)?
- ❓ Auto-scroll to current item?
- **Reference shows:** 6 items visible
- **Roadmap specifies:** 6 items max, scrollable
- **Your confirmation needed:** YES / NO / ADJUST

---

### Question Set D: Interactions

**Question 13: Breadcrumb Clickability**
- ❓ Should breadcrumb segments be clickable (navigate)?
- ❓ Or informational only?
- **Reference shows:** Appears clickable
- **Roadmap specifies:** Clickable for navigation
- **Your confirmation needed:** YES / NO

**Question 14: Test Row Interactions**
- ❓ Click test row to expand details?
- ❓ Double-click to run just that test?
- ❓ Right-click context menu?
- **Reference shows:** (Expandable suggested)
- **Roadmap specifies:** Expandable details if supported
- **Your confirmation needed:** Expand / Run / Both / Other

**Question 15: Failure Display**
- ❓ Should failure display inline (expand within row)?
- ❓ Or in separate panel below suite?
- ❓ Or in modal/overlay?
- **Reference shows:** Inline within test row
- **Roadmap specifies:** Red-tinted background, monospace text
- **Your confirmation needed:** Inline / Separate / Modal / Other

**Question 16: Running Animation**
- ❓ Pulsing dot, spinning loader, or glow effect?
- ❓ Animation speed (200ms, 500ms, 1000ms cycle)?
- **Reference shows:** Orange pulsing dot
- **Roadmap specifies:** Animated indicator
- **Your confirmation needed:** Pulse / Spinner / Glow / Speed

---

### Question Set E: Information Density

**Question 17: Sidebar Metrics Display**
- ❓ Should metrics always be visible in sidebar?
- ❓ Or collapsible/hidden until needed?
- **Reference shows:** Always visible
- **Roadmap specifies:** Always visible
- **Your confirmation needed:** YES / NO

**Question 18: Center Metrics Grid**
- ❓ Should metrics grid always be visible?
- ❓ Or collapsible/hidden?
- **Reference shows:** Always visible
- **Roadmap specifies:** Always visible
- **Your confirmation needed:** YES / NO

**Question 19: Test Tree Filtering**
- ❓ Real-time filter as user types in sidebar search?
- ❓ Or filter on Enter/submit?
- **Reference shows:** (Real-time filtering suggested)
- **Roadmap specifies:** Real-time
- **Your confirmation needed:** Real-time / On-Enter / Other

**Question 20: Keyboard Shortcuts**
- ❓ Confirmed: Ctrl+K for global search?
- ❓ Other shortcuts: Ctrl+R (run), Ctrl+S (stop), etc.?
- ❓ Should shortcuts be displayed in UI?
- **Reference shows:** Ctrl+K visible
- **Roadmap specifies:** Ctrl+K for search, others TBD
- **Your confirmation needed:** Shortcuts to support?

---

## Summary of Questions

**20 validation questions organized by category:**
- Layout: 3 questions
- Colors: 6 questions
- Components: 4 questions
- Interactions: 4 questions
- Information Density: 3 questions

---

## How to Validate

**Option 1: Detailed Review (Recommended)**
- Read through each section
- Answer the specific questions for that section
- Provide feedback/adjustments

**Option 2: Quick Scan Review**
- Review the critical validation questions (Set A-E)
- Answer only those 20 questions
- Can iterate on details during implementation

**Option 3: Screenshot Comparison**
- Compare your reference screenshot to roadmap
- Note any discrepancies
- List adjustments needed

---

## What Happens After Review

✅ **If you confirm specifications:**
- Proceed to Phase-1 immediately
- Integrate design system (1-2 days)
- Use exact specifications for implementation

✅ **If you suggest adjustments:**
- Update roadmap with clarifications
- Re-validate
- Then proceed to Phase-1

✅ **If you need clarification:**
- Ask specific questions
- Get detailed answers
- Then re-validate

---

## Next Steps After Approval

Once you approve:

1. **Phase-1 Begins** (1-2 days)
   - Create GlobalStyles component
   - Integrate design tokens
   - Apply CSS variables to app
   - Verify existing UI renders

2. **Phase-2 Begins** (2-3 days)
   - Build 3-column shell
   - Create top navigation
   - Create bottom status bar
   - Test panel resizing

3. **Continue through Phases 3-8**
   - Each phase builds on previous
   - All 8 phases complete full redesign

**Timeline:** ~6-8 weeks for full redesign (all phases)

---

## Ready for Your Review

This document provides complete specifications for your futuristic test-runner UI based on your reference design.

**Please review and:**
- ✅ Confirm what matches your vision
- ✅ Adjust what doesn't match
- ✅ Answer validation questions
- ✅ Give approval to proceed

Once approved, Phase-1 can start immediately.
