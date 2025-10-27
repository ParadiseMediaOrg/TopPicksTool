# Sub-ID Generator & Tracker - Design Guidelines

## Design Approach

**Selected Approach:** Design System - Linear/Notion-inspired productivity interface

**Justification:** This is a utility-focused, data-heavy productivity tool requiring efficient workflows, clear information hierarchy, and consistent patterns. Linear's design language excels at data-dense interfaces while maintaining visual clarity.

**Core Principles:**
- Functional clarity over decorative elements
- Information hierarchy through typography and spacing
- Consistent, predictable interactions
- Streamlined workflows for frequent tasks

---

## Typography System

**Font Families:**
- Primary: Inter (via Google Fonts) - UI elements, body text, tables
- Monospace: JetBrains Mono - Sub-ID displays, format patterns, code-like content

**Type Scale:**
- Page Titles: text-2xl, font-semibold (32px)
- Section Headers: text-lg, font-semibold (20px)
- Card Titles: text-base, font-medium (16px)
- Body Text: text-sm, font-normal (14px)
- Labels/Captions: text-xs, font-medium, uppercase tracking (12px)
- Sub-IDs/Patterns: text-sm, font-mono (14px monospace)

---

## Layout System

**Spacing Primitives:** Tailwind units of 2, 4, 6, and 8
- Micro spacing: p-2, gap-2 (8px)
- Standard spacing: p-4, gap-4, mb-4 (16px)
- Section spacing: p-6, mb-6 (24px)
- Major sections: p-8, gap-8 (32px)

**Dashboard Structure:**
- Fixed sidebar: w-64 (256px), full height
- Main content area: flex-1 with max-w-7xl container
- Content padding: p-8 on desktop, p-4 on mobile
- Card spacing: gap-6 between major sections

**Grid System:**
- Website cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 with gap-4
- Form layouts: Two-column on desktop (grid-cols-2), single on mobile
- Table layouts: Full-width responsive with horizontal scroll on mobile

---

## Component Library

### Navigation & Sidebar

**Sidebar Component:**
- Full-height fixed panel with subtle border-right
- Logo/App name at top: p-6, text-lg font-semibold
- Website list section with scrollable overflow
- "Add Website" button at bottom: w-full, p-4
- Each website item: p-3, rounded-md, hover state with subtle background shift
- Active website: distinct background treatment with left border accent

### Dashboard Main Panel

**Header Section:**
- Sticky top header: p-6 with border-bottom
- Website name: text-2xl font-semibold
- Action buttons row: flex justify-between items-center
- Primary action (Generate ID): prominent button styling
- Secondary actions (Export CSV): ghost button style

**Sub-ID Display Area:**
- Table layout for ID history:
  - Column headers: text-xs uppercase tracking-wide, p-4
  - Row height: h-12, border-bottom
  - Columns: Sub-ID (monospace), Timestamp, Actions
  - Hover state on rows for better scanning
- Empty state: centered with icon, text-lg message, and CTA button

**Statistics Cards (Optional Dashboard Enhancement):**
- Three-card grid at top: Total Sites, Total IDs Generated, Recent Activity
- Card structure: p-6, rounded-lg, border
- Metric: text-3xl font-bold
- Label: text-sm, opacity-70

### Forms & Modals

**Add Website Modal:**
- Modal overlay: fixed inset-0, backdrop blur
- Modal content: max-w-2xl, centered, p-8
- Form layout: space-y-6 for vertical rhythm
- Input groups: label (text-sm font-medium mb-2), input field, helper text
- Format pattern field with live preview below showing example output
- Actions: flex justify-end gap-4, primary + cancel buttons

**Input Fields:**
- Standard height: h-12
- Padding: px-4
- Border radius: rounded-md
- Border: border with subtle treatment
- Focus state: ring treatment (ring-2)
- Helper text: text-xs, mt-2, opacity-70

**Format Builder Section:**
- Available variables displayed as tags: inline-flex items-center gap-2
- Each variable tag: px-3 py-1, rounded-full, text-xs font-mono, cursor-pointer
- Preview output: p-4, rounded-md, font-mono, background treatment, mt-4
- Real-time generation: "Preview: ABC-4829-XYZ" updates as user types

### Buttons & Actions

**Button Hierarchy:**
- Primary: px-6 py-3, rounded-md, font-medium, shadow-sm
- Secondary: px-6 py-3, rounded-md, border, font-medium
- Ghost: px-4 py-2, rounded-md, hover background only
- Icon buttons: w-10 h-10, rounded-md, centered icon
- Destructive actions: warning treatment for delete operations

**Copy to Clipboard:**
- Icon button next to each Sub-ID in table
- Tooltip on hover: "Copy to clipboard"
- Success feedback: brief checkmark animation

**Export CSV:**
- Secondary button in header
- Downloads CSV with filename: [website-name]-subids-[date].csv

### Cards & Containers

**Website Card (Grid View Alternative):**
- Aspect ratio: roughly 4:3
- Structure: p-6, rounded-lg, border, hover shadow
- Header: website name (text-lg font-semibold) + format pattern (text-xs font-mono)
- Stats: small metrics showing ID count
- Actions: Generate button + overflow menu (edit/delete)

**Sub-ID Item Card (Alternative to Table):**
- Horizontal layout: flex items-center justify-between
- Left: Sub-ID in monospace, large and prominent
- Right: Timestamp + copy button
- Border-bottom separator between items

### Data Display

**Table Component:**
- Minimal borders: border-b on rows only
- Alternating row backgrounds for better scanning
- Sticky header when scrolling long lists
- Column widths: Sub-ID (flex-1), Timestamp (w-48), Actions (w-24)
- Responsive: collapse to cards on mobile (stack vertically)

**Badge/Tag Components:**
- Format pattern display: inline-block, px-2 py-1, rounded, text-xs font-mono
- Status indicators: small dot + text for generation status
- Variable tags: as described in Format Builder

### Empty States

**No Websites Yet:**
- Centered content: max-w-md mx-auto, text-center
- Icon: large, simplified illustration or icon
- Heading: text-xl font-semibold, mb-2
- Description: text-sm, opacity-70, mb-6
- CTA: prominent "Add Your First Website" button

**No Sub-IDs Generated:**
- Similar pattern but contextual to selected website
- Shows format pattern as preview
- CTA: "Generate First Sub-ID"

---

## Responsive Behavior

**Breakpoints:**
- Mobile: < 768px - single column, stacked layout, hidden sidebar (drawer)
- Tablet: 768px-1024px - two-column grids, visible sidebar
- Desktop: > 1024px - full multi-column layout, wide tables

**Mobile Adaptations:**
- Sidebar becomes slide-out drawer with menu icon trigger
- Tables collapse to card layout with vertical stacking
- Form fields always single column
- Action buttons stack vertically with full width
- Reduce padding: p-4 instead of p-8

---

## Interactions & Micro-interactions

**Minimal Animation Philosophy:**
- No scroll-triggered animations
- No page transitions
- Focus on functional feedback only

**Allowed Interactions:**
- Hover states: subtle background changes, no transforms
- Button feedback: slight opacity change on press
- Copy success: brief checkmark icon swap (200ms)
- Modal: simple fade-in (150ms)
- Form validation: instant inline error display

---

## Accessibility Standards

- All interactive elements meet 44x44px touch targets
- Form labels properly associated with inputs
- Focus indicators clearly visible with ring treatment
- Error messages announced to screen readers
- Table headers properly marked up with scope
- Modal focus trap and keyboard navigation (Escape to close)
- Skip navigation link for keyboard users
- Color contrast ratios meet WCAG AA standards (handled by color selection)

---

## Content Guidelines

**Microcopy:**
- Button labels: Action-oriented ("Generate New Sub-ID", not "Generate")
- Empty states: Encouraging tone ("Let's create your first website")
- Error messages: Specific and actionable ("This format pattern is invalid. Use {random4digits} for numbers.")
- Success messages: Brief confirmations ("Sub-ID copied!", "Website added successfully")

**Format Pattern Documentation:**
- Inline help text showing available variables
- Example outputs next to variable descriptions
- Real-time preview prevents user error

---

This design creates a professional, efficient productivity tool that prioritizes function while maintaining visual polish. The Linear-inspired approach ensures users can quickly manage multiple websites and generate Sub-IDs without unnecessary cognitive load.