# Understand and present Motion Lab

## A truthful introduction

“Motion Lab is an AI-assisted React and TypeScript portfolio project exploring six interaction patterns. It combines shared layout transitions, spring physics, dragging, and accessible controls. The public repository documents the implementation and its limitations.”

Describe your own contributions as you make them. Do not claim you wrote every line unaided or achieved measurements you have not recorded.

## Read the code in this order

1. `src/main.tsx`, `experiments`: the data describing the six cards.
2. `App`: filter/search state, shared spring controls, themes, motion preferences, and code dialog state.
3. `Demo`: the individual interaction implementations.
4. `src/useInteractions.ts`: interruptible anchor navigation, active-section tracking, and click feedback.
5. `CodeDialog`: native dialog focus behavior with entry and exit animation.
6. `src/styles.css` and `src/interactions.css`: layout, breakpoints, visual design, and feedback.

## Questions to practise

**What do the spring controls do?** Stiffness controls the restoring force, damping dissipates movement, and mass affects the simulated weight. Change one slider at a time and describe what you observe.

**Why use layout animations?** Motion can measure old and new element positions and animate between them. The filter grid uses layout animation with `AnimatePresence` to retain outgoing elements during their exit.

**How does smooth scrolling work?** Anchor clicks trigger a short eased animation through `requestAnimationFrame`. Wheel input, touch, and navigation keys can cancel it. Ordinary scrolling stays native.

**What supports accessibility?** Native buttons, named controls, focus indicators, tab arrow navigation, reorder buttons, native dialog focus handling, and reduced-motion settings. These features do not substitute for a full accessibility audit.

**What stays in memory?** Filters, theme, motion settings, likes, and demo state reset when the page reloads. There is no database or account system.

**What would you optimize?** Measure first. Profile on a phone, inspect rendering work, compare bundle size, and investigate dropped frames. Height animation in the disclosure performs layout work, unlike a transform-only animation.

## Hands-on exercises before an interview

- Add one new filter tag and verify search finds it.
- Change the default damping, then explain the visual difference.
- Navigate every control with a keyboard.
- Compare Full motion and Reduced motion.
- Add a seventh experiment yourself and document the tradeoffs.
- Record measurements on a specific device before making performance claims.

## Portfolio presentation

Use a live demo link and repository link together. Record a short clip showing filtering, spring tuning, the card drag, reordering, and reduced-motion behavior. Keep a concise explanation of what the project demonstrates and what you plan to improve.
