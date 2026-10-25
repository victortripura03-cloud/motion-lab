import { useEffect, useRef, useState, type MouseEvent } from 'react';

export type ClickRipple = { id: number; x: number; y: number };

/** Animate anchor navigation only; wheel, touch, and keyboard scrolling stay native. */
export function useInteractions(reduced: boolean) {
  const frame = useRef(0);
  const sequence = useRef(0);
  const [ripples, setRipples] = useState<ClickRipple[]>([]);
  const [activeSection, setActiveSection] = useState('experiments');

  useEffect(() => {
    const cancel = () => cancelAnimationFrame(frame.current);
    const onKey = (event: KeyboardEvent) => {
      if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' '].includes(event.key)) cancel();
    };
    window.addEventListener('wheel', cancel, { passive: true });
    window.addEventListener('touchstart', cancel, { passive: true });
    window.addEventListener('keydown', onKey);
    return () => {
      cancel();
      window.removeEventListener('wheel', cancel);
      window.removeEventListener('touchstart', cancel);
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  useEffect(() => {
    if (reduced) {
      cancelAnimationFrame(frame.current);
      setRipples([]);
    }
  }, [reduced]);

  useEffect(() => {
    let scheduled = 0;
    const update = () => {
      scheduled = 0;
      const notes = document.getElementById('notes');
      const atBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 8;
      setActiveSection(notes && (notes.getBoundingClientRect().top < window.innerHeight * 0.55 || atBottom) ? 'notes' : 'experiments');
    };
    const onScroll = () => { if (!scheduled) scheduled = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(scheduled);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  function scrollToSection(id: string, moveFocus = false) {
    cancelAnimationFrame(frame.current);
    const target = id ? document.getElementById(id) : null;
    if (id && !target) return;
    const start = window.scrollY;
    const destination = target ? Math.max(0, Math.min(target.getBoundingClientRect().top + start - 100, document.documentElement.scrollHeight - window.innerHeight)) : 0;
    const finish = () => {
      if (!moveFocus || !target) return;
      // Anchor destinations are programmatically focusable, outside the normal tab order.
      target.focus({ preventScroll: true });
    };
    if (reduced || Math.abs(destination - start) < 2) {
      window.scrollTo({ top: destination, behavior: 'instant' });
      finish();
      return;
    }
    const duration = Math.min(1000, Math.max(450, Math.abs(destination - start) * 0.65));
    const began = performance.now();
    const tick = (now: number) => {
      const progress = Math.min(1, (now - began) / duration);
      const eased = progress < 0.5 ? 4 * progress ** 3 : 1 - (-2 * progress + 2) ** 3 / 2;
      window.scrollTo({ top: start + (destination - start) * eased, behavior: 'instant' });
      if (progress < 1) frame.current = requestAnimationFrame(tick);
      else finish();
    };
    frame.current = requestAnimationFrame(tick);
  }

  function onClickCapture(event: MouseEvent<HTMLDivElement>) {
    if (!(event.target instanceof Element)) return;
    const control = event.target.closest<HTMLElement>('button, a');
    if (!control || control.hasAttribute('disabled')) return;
    if (!reduced) {
      const rect = control.getBoundingClientRect();
      const ripple = { id: ++sequence.current, x: event.detail ? event.clientX : rect.left + rect.width / 2, y: event.detail ? event.clientY : rect.top + rect.height / 2 };
      // Keep rapid clicking bounded; animation completion removes each ring.
      setRipples(previous => [...previous.slice(-7), ripple]);
    }
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    const href = control.tagName === 'A' ? control.getAttribute('href') : null;
    if (href === null || !href.startsWith('#')) return;
    const id = href.slice(1);
    if (id && !document.getElementById(id)) return;
    event.preventDefault();
    history.pushState(null, '', id ? `#${id}` : location.pathname + location.search);
    scrollToSection(id, event.detail === 0);
  }

  return { ripples, activeSection, onClickCapture, scrollToSection, removeRipple: (id: number) => setRipples(previous => previous.filter(ripple => ripple.id !== id)) };
}
