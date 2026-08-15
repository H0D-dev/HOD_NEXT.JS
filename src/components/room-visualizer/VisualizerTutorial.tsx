'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { X, ChevronRight, ChevronLeft, SkipForward } from 'lucide-react';

// ─── Tutorial Step Configuration ───────────────────────────────────────────
type TutorialStep = {
  id: string;
  target: string;         // data-tour selector
  title: string;
  description: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  shortcut?: string;
};

const tutorialSteps: TutorialStep[] = [
  {
    id: 'room-selector',
    target: '[data-tour="room-selector"]',
    title: 'Choose a Room',
    description: 'Pick a preset room scene or upload your own photo to visualize the rug in your space.',
    position: 'right',
  },
  {
    id: 'toolbar-corners',
    target: '[data-tour="toolbar-corners"]',
    title: 'Position Your Rug',
    description: 'Drag the four corner handles on the canvas to align the rug with your floor\'s perspective.',
    position: 'bottom',
    shortcut: 'C',
  },
  {
    id: 'toolbar-masking',
    target: '[data-tour="toolbar-masking"]',
    title: 'Tuck Rug Under Furniture',
    description: 'Make the rug sit realistically under furniture. Click the Magic Wand (W) on a table leg or sofa base to instantly select it, or paint and box-select for precision.',
    position: 'bottom',
    shortcut: 'W',
  },
  {
    id: 'lighting-controls',
    target: '[data-tour="lighting-controls"]',
    title: 'Fine-Tune Appearance',
    description: 'Adjust rug opacity and floor shadows for a realistic look.',
    position: 'right',
  },
  {
    id: 'toolbar-actions',
    target: '[data-tour="toolbar-actions"]',
    title: 'Compare & Export',
    description: 'Toggle before/after view, then export a high-res PNG of your visualization.',
    position: 'bottom',
  },
];

// ─── localStorage Key ──────────────────────────────────────────────────────
const STORAGE_KEY = 'hod_visualizer_tutorial_completed';

function isTutorialCompleted(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

function markTutorialCompleted(): void {
  try {
    localStorage.setItem(STORAGE_KEY, 'true');
  } catch {
    // silently ignore — quota exceeded / private mode
  }
}

export function resetTutorialFlag(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // silently ignore
  }
}

// ─── Target Rect Calculation ───────────────────────────────────────────────
type Rect = { top: number; left: number; width: number; height: number };

function getTargetRect(selector: string): Rect | null {
  const el = document.querySelector(selector);
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return { top: r.top, left: r.left, width: r.width, height: r.height };
}

function scrollTargetIntoView(selector: string): Promise<void> {
  return new Promise((resolve) => {
    const el = document.querySelector(selector);
    if (!el) {
      resolve();
      return;
    }

    const rect = el.getBoundingClientRect();
    const isVisible =
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= window.innerHeight &&
      rect.right <= window.innerWidth;

    if (isVisible) {
      resolve();
      return;
    }

    // Scroll the element into the visible area within its scrollable parent
    el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });

    // Wait for scroll to settle before resolving
    let settled = false;
    const timeout = setTimeout(() => {
      if (!settled) {
        settled = true;
        resolve();
      }
    }, 600);

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !settled) {
          settled = true;
          clearTimeout(timeout);
          observer.disconnect();
          // Small delay to let scroll animation finish
          setTimeout(resolve, 80);
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
  });
}

// ─── Tooltip Position Calculation ──────────────────────────────────────────
const TOOLTIP_GAP = 12;
const TOOLTIP_WIDTH = 280;

type TooltipPos = { top: number; left: number; actualPosition: string };

function calculateTooltipPosition(
  targetRect: Rect,
  preferredPosition: string,
  tooltipHeight: number
): TooltipPos {
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  // On narrow viewports force bottom/top only to avoid sidebar overlap
  const isMobile = vw < 1024;

  const positions = isMobile
    ? ['bottom', 'top']
    : [preferredPosition, 'bottom', 'top', 'right', 'left'];

  for (const pos of positions) {
    const result = tryPosition(pos, targetRect, tooltipHeight, vw, vh);
    if (result) return { ...result, actualPosition: pos };
  }

  // Fallback: center on screen
  return {
    top: Math.max(16, (vh - tooltipHeight) / 2),
    left: Math.max(16, (vw - TOOLTIP_WIDTH) / 2),
    actualPosition: 'bottom',
  };
}

function tryPosition(
  pos: string,
  rect: Rect,
  tooltipH: number,
  vw: number,
  vh: number
): { top: number; left: number } | null {
  let top = 0;
  let left = 0;

  switch (pos) {
    case 'bottom':
      top = rect.top + rect.height + TOOLTIP_GAP;
      left = rect.left + rect.width / 2 - TOOLTIP_WIDTH / 2;
      break;
    case 'top':
      top = rect.top - tooltipH - TOOLTIP_GAP;
      left = rect.left + rect.width / 2 - TOOLTIP_WIDTH / 2;
      break;
    case 'right':
      top = rect.top + rect.height / 2 - tooltipH / 2;
      left = rect.left + rect.width + TOOLTIP_GAP;
      break;
    case 'left':
      top = rect.top + rect.height / 2 - tooltipH / 2;
      left = rect.left - TOOLTIP_WIDTH - TOOLTIP_GAP;
      break;
  }

  // Clamp to viewport bounds with padding
  const pad = 12;
  left = Math.max(pad, Math.min(left, vw - TOOLTIP_WIDTH - pad));
  top = Math.max(pad, Math.min(top, vh - tooltipH - pad));

  // Verify it doesn't heavily overlap the target
  const tooltipRight = left + TOOLTIP_WIDTH;
  const tooltipBottom = top + tooltipH;
  const targetRight = rect.left + rect.width;
  const targetBottom = rect.top + rect.height;

  const overlapX = Math.max(0, Math.min(tooltipRight, targetRight) - Math.max(left, rect.left));
  const overlapY = Math.max(0, Math.min(tooltipBottom, targetBottom) - Math.max(top, rect.top));
  const overlapArea = overlapX * overlapY;
  const targetArea = rect.width * rect.height;

  // Allow the position if overlap is less than 30% of target area
  if (targetArea > 0 && overlapArea / targetArea > 0.3) return null;

  return { top, left };
}

// ─── Component ─────────────────────────────────────────────────────────────
interface VisualizerTutorialProps {
  forceOpen?: boolean;
  onForceClose?: () => void;
}

export default function VisualizerTutorial({ forceOpen, onForceClose }: VisualizerTutorialProps) {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState<Rect | null>(null);
  const [tooltipPos, setTooltipPos] = useState<TooltipPos | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number>(0);

  // ── Determine if tutorial should show ──
  useEffect(() => {
    if (forceOpen) {
      setCurrentStep(0);
      setIsActive(true);
      return;
    }
    // Delay slightly to let the visualizer DOM mount
    const timer = setTimeout(() => {
      if (!isTutorialCompleted()) {
        setIsActive(true);
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [forceOpen]);

  // ── Position update loop ──
  const updatePosition = useCallback(async () => {
    if (!isActive) return;
    const step = tutorialSteps[currentStep];
    if (!step) return;

    // Scroll target into view if needed
    await scrollTargetIntoView(step.target);

    const rect = getTargetRect(step.target);
    if (!rect) return;

    setTargetRect(rect);

    const tooltipH = tooltipRef.current?.offsetHeight || 160;
    const pos = calculateTooltipPosition(rect, step.position, tooltipH);
    setTooltipPos(pos);
  }, [isActive, currentStep]);

  // ── Continuous repositioning via resize + rAF polling ──
  useEffect(() => {
    if (!isActive) return;

    // Initial position
    updatePosition();

    // Recalculate on resize / orientation change
    const handleResize = () => updatePosition();
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    // Polling via rAF to catch layout shifts (sidebar scroll, dynamic content)
    let lastRect = '';
    const poll = () => {
      const step = tutorialSteps[currentStep];
      if (step) {
        const rect = getTargetRect(step.target);
        const key = rect ? `${rect.top},${rect.left},${rect.width},${rect.height}` : '';
        if (key !== lastRect) {
          lastRect = key;
          updatePosition();
        }
      }
      animFrameRef.current = requestAnimationFrame(poll);
    };
    animFrameRef.current = requestAnimationFrame(poll);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [isActive, currentStep, updatePosition]);

  // ── Keyboard navigation ──
  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        handleDismiss();
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        handleBack();
      }
    };

    // Use capture phase to intercept before visualizer's Escape handler
    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, currentStep]);

  // ── Navigation handlers ──
  const handleNext = useCallback(() => {
    if (currentStep < tutorialSteps.length - 1) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentStep((s) => s + 1);
        setIsTransitioning(false);
      }, 150);
    } else {
      handleDismiss();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep]);

  const handleBack = useCallback(() => {
    if (currentStep > 0) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentStep((s) => s - 1);
        setIsTransitioning(false);
      }, 150);
    }
  }, [currentStep]);

  const handleDismiss = useCallback(() => {
    setIsActive(false);
    markTutorialCompleted();
    onForceClose?.();
  }, [onForceClose]);

  // ── Render nothing when inactive ──
  if (!isActive) return null;

  const step = tutorialSteps[currentStep];
  const isLastStep = currentStep === tutorialSteps.length - 1;
  const isFirstStep = currentStep === 0;
  const highlightPad = 6;

  return (
    <div
      className="fixed inset-0 z-[3000]"
      style={{ pointerEvents: 'auto' }}
      aria-modal="true"
      role="dialog"
      aria-label={`Tutorial step ${currentStep + 1} of ${tutorialSteps.length}: ${step.title}`}
    >
      {/* ── SVG Backdrop with cutout ── */}
      <svg
        className="absolute inset-0 w-full h-full"
        style={{ pointerEvents: 'none' }}
      >
        <defs>
          <mask id="tutorial-mask">
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            {targetRect && (
              <rect
                x={targetRect.left - highlightPad}
                y={targetRect.top - highlightPad}
                width={targetRect.width + highlightPad * 2}
                height={targetRect.height + highlightPad * 2}
                rx="8"
                ry="8"
                fill="black"
              />
            )}
          </mask>
        </defs>
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="rgba(0, 0, 0, 0.6)"
          mask="url(#tutorial-mask)"
          style={{ pointerEvents: 'auto' }}
          onClick={handleDismiss}
        />
      </svg>

      {/* ── Highlight ring around target ── */}
      {targetRect && (
        <div
          className="absolute rounded-lg pointer-events-none"
          style={{
            top: targetRect.top - highlightPad,
            left: targetRect.left - highlightPad,
            width: targetRect.width + highlightPad * 2,
            height: targetRect.height + highlightPad * 2,
            boxShadow: '0 0 0 2px #B89970, 0 0 16px 2px rgba(184, 153, 112, 0.3)',
            transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        />
      )}

      {/* ── Tooltip Card ── */}
      {tooltipPos && (
        <div
          ref={tooltipRef}
          className={`absolute z-[3001] ${
            isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
          }`}
          style={{
            top: tooltipPos.top,
            left: tooltipPos.left,
            width: TOOLTIP_WIDTH,
            transformOrigin: 'center center',
            transition: 'top 0.3s cubic-bezier(0.22, 1, 0.36, 1), left 0.3s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.15s ease, transform 0.15s ease',
          }}
        >
          <div
            className="rounded-xl border shadow-2xl overflow-hidden"
            style={{
              backgroundColor: '#2B2B2B',
              borderColor: 'rgba(184, 153, 112, 0.35)',
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-4 py-2.5"
              style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}
            >
              <div className="flex items-center gap-2">
                <span
                  className="text-[10px] font-bold uppercase tracking-widest"
                  style={{ color: '#B89970' }}
                >
                  Step {currentStep + 1}/{tutorialSteps.length}
                </span>
              </div>
              <button
                onClick={handleDismiss}
                className="p-1 rounded-md transition-colors cursor-pointer"
                style={{ color: 'rgba(255, 255, 255, 0.5)' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255, 255, 255, 0.5)')}
                aria-label="Close tutorial"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Content */}
            <div className="px-4 py-3">
              <h3
                className="text-sm font-semibold mb-1.5"
                style={{ color: '#FFFFFF' }}
              >
                {step.title}
              </h3>
              <p
                className="text-[12px] leading-relaxed"
                style={{ color: 'rgba(255, 255, 255, 0.7)' }}
              >
                {step.description}
              </p>
              {step.shortcut && (
                <div className="mt-2 flex items-center gap-1.5">
                  <span
                    className="text-[10px] font-medium"
                    style={{ color: 'rgba(255, 255, 255, 0.4)' }}
                  >
                    Shortcut
                  </span>
                  <kbd
                    className="text-[10px] font-mono px-1.5 py-0.5 rounded"
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      color: '#B89970',
                    }}
                  >
                    {step.shortcut}
                  </kbd>
                </div>
              )}
            </div>

            {/* Footer */}
            <div
              className="flex items-center justify-between px-4 py-2.5"
              style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}
            >
              {/* Step Dots */}
              <div className="flex items-center gap-1.5">
                {tutorialSteps.map((_, i) => (
                  <div
                    key={i}
                    className="rounded-full transition-all duration-300"
                    style={{
                      width: i === currentStep ? 16 : 6,
                      height: 6,
                      backgroundColor:
                        i === currentStep
                          ? '#B89970'
                          : i < currentStep
                          ? 'rgba(184, 153, 112, 0.5)'
                          : 'rgba(255, 255, 255, 0.15)',
                      borderRadius: i === currentStep ? 3 : '50%',
                    }}
                  />
                ))}
              </div>

              {/* Navigation Buttons */}
              <div className="flex items-center gap-1.5">
                {!isFirstStep && (
                  <button
                    onClick={handleBack}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-colors cursor-pointer"
                    style={{
                      color: 'rgba(255, 255, 255, 0.6)',
                      backgroundColor: 'rgba(255, 255, 255, 0.06)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)';
                      e.currentTarget.style.color = '#fff';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)';
                      e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)';
                    }}
                    aria-label="Previous step"
                  >
                    <ChevronLeft className="w-3 h-3" />
                    Back
                  </button>
                )}

                {isFirstStep && (
                  <button
                    onClick={handleDismiss}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-colors cursor-pointer"
                    style={{
                      color: 'rgba(255, 255, 255, 0.4)',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255, 255, 255, 0.4)')}
                    aria-label="Skip tutorial"
                  >
                    <SkipForward className="w-3 h-3" />
                    Skip
                  </button>
                )}

                <button
                  onClick={handleNext}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer"
                  style={{
                    backgroundColor: '#B89970',
                    color: '#fff',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#A38760')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#B89970')}
                  aria-label={isLastStep ? 'Finish tutorial' : 'Next step'}
                >
                  {isLastStep ? 'Got It' : 'Next'}
                  {!isLastStep && <ChevronRight className="w-3 h-3" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
