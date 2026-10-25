# Motion Lab

[Live demo](https://victortripura03-cloud.github.io/motion-lab/) · [Source code](https://github.com/victortripura03-cloud/motion-lab)

A portfolio project by [@victortripura03-cloud](https://github.com/victortripura03-cloud).

A free, open-source interaction playground built with React, TypeScript, Motion, and Tailwind CSS. Six small experiments explore how intentional motion makes an interface feel responsive and considered.

## Run locally

Requires Node.js 22.12+ and pnpm 11.25.0. The package manager version is declared in `package.json`.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

```sh
pnpm check:secrets
pnpm build
pnpm preview
```

## Experiments

- **Spring playground:** move an orb and tune stiffness, damping, and mass.
- **Fluid navigation:** shared-layout tab indicator with keyboard arrow navigation.
- **The playful stack:** a draggable card that returns to its origin.
- **A little appreciation:** a toggle with spring feedback and particle animation.
- **Find your flow:** drag to reorder, with accessible up/down alternatives.
- **Room to unfold:** a disclosure with animated content height.

The inspector changes spring settings across the demos. Motion effects defaults to your device preference; choose Full motion to explicitly enable all effects, or Reduced motion to minimize movement. Filters, search, dark theme, and copyable code examples are included. Data stays in browser memory and resets on refresh. No accounts, API keys, external images, or paid services are required.

## Interaction polish

- Eased, interruptible anchor scrolling with native wheel, touch, and keyboard behavior preserved.
- Sticky navigation and a scroll-linked reading progress bar.
- Click rings, press feedback, hover details, and animated appreciation counts.
- Animated filtering with a sliding category indicator and smooth card rearrangement.
- Scroll reveals, modal entry/exit, and soft theme color transitions.
- A Full motion / Reduced motion / Follow device control. Reduced motion suppresses click rings, decorative movement, and spatial transitions.

## Design decisions

1. A quiet editorial shell gives the experiments space to communicate. Color separates the demos without overwhelming the page.
2. Each demo explores one interaction rather than combining unrelated animation techniques.
3. A shared spring configuration helps compare how the same physics feels in different contexts.

## Accessibility

Semantic buttons, labeled controls, visible focus rings, modal focus handling through native `dialog`, keyboard tab navigation, reorder buttons, and reduced-motion support are included. These are implementation features, not a claim of a complete accessibility audit. For reduced motion, the floating illustration and particles are disabled; disclosure height transitions are immediate.

## Performance

The decorative illustration uses CSS and no image downloads. Most motion uses transforms and opacity. The disclosure intentionally animates height, which requires layout work. Profile on your target devices before making frame-rate claims. This project makes no guaranteed FPS or Lighthouse score claims.

## Publish on GitHub Pages for free

1. Create a public GitHub repository and upload only the files from this clean public source folder. Never upload `node_modules`, `dist`, local credentials, or another checkout’s `.git` directory.
2. In repository Settings → Pages, select **GitHub Actions**.
3. The included workflow builds and deploys pushes to `main`.

The Vite configuration uses relative asset paths, so it works under a repository URL. The clean public export contains no private preview configuration or local Git history. See [SECURITY.md](SECURITY.md) for the publication checks and their limits.

## Source guide

- `src/main.tsx`: UI, experiments, shared controls, and code snippets.
- `src/useInteractions.ts`: smooth anchor navigation, cancellation, section tracking, and bounded click feedback.
- `src/interactions.css`: interaction feedback and transitions.
- `src/styles.css`: visual design, responsive styles, Tailwind import, and reduced-motion styles.
- `vite.config.ts`: React and Tailwind build configuration.

The code snippets shown in the app are focused examples. The full implementations in the source include the additional accessibility controls.

## Project walkthrough

See [docs/PROJECT-WALKTHROUGH.md](docs/PROJECT-WALKTHROUGH.md) for a source map, design decisions, and interview practice tasks.

## License and credits

MIT licensed. Original CSS artwork; no third-party media assets. Dependencies retain their respective licenses, including React, Motion, Tailwind CSS, Vite, and Lucide icons. AI-assisted implementation; review and understand the code before presenting it in interviews.

