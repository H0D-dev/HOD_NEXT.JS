'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import useImage from '@/src/lib/hooks/useImage';
import { useVisualizerStore } from '@/src/lib/store/useVisualizerStore';
import { useCanvasZoom } from '@/src/lib/hooks/useCanvasZoom';
import { sampleRooms } from '@/src/lib/data/rooms';
import { drawPerspectiveQuad, drawQuadShadow, QuadCorners, Point2D } from '@/src/lib/utils/visualization/quadWarp';
import { getEdgeMap, getEdgeStrength, clearEdgeMapCache } from '@/src/lib/utils/visualization/edgeDetection';
import { Product, ProductColor, ProductVariation } from '@/src/components/product-presentation/ProductPresentation';
import VisualizerToolbar from './VisualizerToolbar';
import RoomSelector from './RoomSelector';
import {
  Move,
  Layers,
  Square,
  Paintbrush,
  Eraser,
  Wand2,
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Eye,
  Download,
  HelpCircle,
  X,
  Keyboard,
  Info,
} from 'lucide-react';

interface VisualizationCanvasProps {
  product: Product;
  activeColor: ProductColor;
  onColorChange: (color: ProductColor) => void;
  selectedVariation: ProductVariation | null;
  onVariationChange: (variation: ProductVariation | null) => void;
  onClose: () => void;
}

const MAX_HISTORY = 30;

export default function VisualizationCanvas({
  product,
  activeColor,
  onColorChange,
  selectedVariation,
  onVariationChange,
  onClose,
}: VisualizationCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const maskCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Store state & dispatch
  const {
    roomImage,
    quadCorners,
    opacity,
    shadowOpacity,
    showOriginal,
    activeTool,
    brushSize,
    brushHardness,
    edgeSnap,
    showMaskPreview,
    preserveMask,
    floorTextureStrength,
    wandTolerance,
    wandContiguous,
    showShortcutModal,
    dispatch,
  } = useVisualizerStore();

  // Helper to proxy remote images via same-origin image-proxy route to avoid CORS / canvas tainting
  const getProxiedImageUrl = (url: string | null | undefined) => {
    if (!url) return '';
    // Do NOT proxy local relative assets (/images/rooms/...) or data URIs (data:image/...)
    if (url.startsWith('/') || url.startsWith('data:')) {
      return url;
    }
    // Proxy remote HTTP/HTTPS images through same-origin endpoint
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return `/api/image-proxy?url=${encodeURIComponent(url)}`;
    }
    return url;
  };

  // Rug image URL from active color
  const rawRugImageUrl = activeColor.textureUrl || activeColor.lifestyleUrl || product.image || '';
  const rugImageUrl = getProxiedImageUrl(rawRugImageUrl);
  const proxiedRoomUrl = getProxiedImageUrl(roomImage);

  // Images
  const [rugImageKonva] = useImage(rugImageUrl, 'anonymous');
  const [roomImageKonva] = useImage(proxiedRoomUrl, 'anonymous');

  // Zoom / Pan Hook
  const {
    zoom,
    pan,
    isPanning,
    zoomIn,
    zoomOut,
    resetZoom,
    handleWheel,
    startPan,
    updatePan,
    endPan,
    screenToCanvas,
  } = useCanvasZoom(1, 1, 4);

  // Local interaction states
  const [containerSize, setContainerSize] = useState<{ width: number; height: number }>({ width: 800, height: 600 });
  const [activeCorner, setActiveCorner] = useState<keyof QuadCorners | null>(null);
  const [hoveredCorner, setHoveredCorner] = useState<keyof QuadCorners | null>(null);
  const [mousePos, setMousePos] = useState<Point2D>({ x: 0, y: 0 });
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [lastPaintPos, setLastPaintPos] = useState<Point2D | null>(null);

  // Box Cutout Tool State
  const [boxStart, setBoxStart] = useState<Point2D | null>(null);
  const [boxCurrent, setBoxCurrent] = useState<Point2D | null>(null);

  // Key modifier states
  const [isSpacePressed, setIsSpacePressed] = useState(false);
  const [isAltPressed, setIsAltPressed] = useState(false);
  const [isShiftPressed, setIsShiftPressed] = useState(false);

  // Undo / Redo stacks
  const undoStackRef = useRef<ImageData[]>([]);
  const redoStackRef = useRef<ImageData[]>([]);
  const [historyVersion, setHistoryVersion] = useState(0);

  const prevRoomImageRef = useRef<string | null>(null);

  // Save current mask state to undo stack
  const saveMaskSnapshot = useCallback(() => {
    const maskCanvas = maskCanvasRef.current;
    if (!maskCanvas) return;
    const maskCtx = maskCanvas.getContext('2d', { willReadFrequently: true });
    if (!maskCtx) return;

    const snapshot = maskCtx.getImageData(0, 0, maskCanvas.width, maskCanvas.height);
    undoStackRef.current.push(snapshot);
    if (undoStackRef.current.length > MAX_HISTORY) {
      undoStackRef.current.shift();
    }
    redoStackRef.current = [];
    setHistoryVersion((v) => v + 1);
  }, []);

  const handleUndo = useCallback(() => {
    const maskCanvas = maskCanvasRef.current;
    if (!maskCanvas || undoStackRef.current.length === 0) return;
    const maskCtx = maskCanvas.getContext('2d', { willReadFrequently: true });
    if (!maskCtx) return;

    const currentSnapshot = maskCtx.getImageData(0, 0, maskCanvas.width, maskCanvas.height);
    redoStackRef.current.push(currentSnapshot);

    const previousSnapshot = undoStackRef.current.pop()!;
    maskCtx.putImageData(previousSnapshot, 0, 0);
    setHistoryVersion((v) => v + 1);
  }, []);

  const handleRedo = useCallback(() => {
    const maskCanvas = maskCanvasRef.current;
    if (!maskCanvas || redoStackRef.current.length === 0) return;
    const maskCtx = maskCanvas.getContext('2d', { willReadFrequently: true });
    if (!maskCtx) return;

    const currentSnapshot = maskCtx.getImageData(0, 0, maskCanvas.width, maskCanvas.height);
    undoStackRef.current.push(currentSnapshot);

    const nextSnapshot = redoStackRef.current.pop()!;
    maskCtx.putImageData(nextSnapshot, 0, 0);
    setHistoryVersion((v) => v + 1);
  }, []);

  const handleClearMask = useCallback(() => {
    const maskCanvas = maskCanvasRef.current;
    if (!maskCanvas) return;
    saveMaskSnapshot();
    const maskCtx = maskCanvas.getContext('2d');
    if (maskCtx) {
      maskCtx.clearRect(0, 0, maskCanvas.width, maskCanvas.height);
      setHistoryVersion((v) => v + 1);
    }
  }, [saveMaskSnapshot]);

  // Initial room selection if none in store
  useEffect(() => {
    if (!roomImage) {
      dispatch({ type: 'SET_ROOM_SAMPLE', payload: { image: sampleRooms[0].image } });
    }
  }, [roomImage, dispatch]);

  // Handle room switch & mask preservation
  useEffect(() => {
    if (prevRoomImageRef.current && prevRoomImageRef.current !== roomImage) {
      clearEdgeMapCache();
      if (!preserveMask) {
        handleClearMask();
      }
    }
    prevRoomImageRef.current = roomImage;
  }, [roomImage, preserveMask, handleClearMask]);

  // Container resize observer
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const w = containerRef.current.offsetWidth;
        const h = containerRef.current.offsetHeight;
        setContainerSize({ width: w, height: h });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Initialize or resize offscreen mask canvas
  useEffect(() => {
    if (containerSize.width <= 0 || containerSize.height <= 0) return;

    if (!maskCanvasRef.current) {
      const mc = document.createElement('canvas');
      mc.width = containerSize.width;
      mc.height = containerSize.height;
      maskCanvasRef.current = mc;
    } else if (
      maskCanvasRef.current.width !== containerSize.width ||
      maskCanvasRef.current.height !== containerSize.height
    ) {
      const oldCanvas = maskCanvasRef.current;
      const newCanvas = document.createElement('canvas');
      newCanvas.width = containerSize.width;
      newCanvas.height = containerSize.height;
      const nCtx = newCanvas.getContext('2d');
      if (nCtx) {
        nCtx.drawImage(oldCanvas, 0, 0);
      }
      maskCanvasRef.current = newCanvas;
    }
  }, [containerSize]);

  // Default quad corners calculation
  useEffect(() => {
    if (quadCorners || containerSize.width <= 0) return;

    const currentRoom = sampleRooms.find((r) => r.image === roomImage);
    const w = containerSize.width;
    const h = containerSize.height;

    let defaultCorners: QuadCorners;
    if (currentRoom) {
      const q = currentRoom.defaultQuad;
      defaultCorners = {
        topLeft: { x: q.topLeft.u * w, y: q.topLeft.v * h },
        topRight: { x: q.topRight.u * w, y: q.topRight.v * h },
        bottomRight: { x: q.bottomRight.u * w, y: q.bottomRight.v * h },
        bottomLeft: { x: q.bottomLeft.u * w, y: q.bottomLeft.v * h },
      };
    } else {
      defaultCorners = {
        topLeft: { x: w * 0.25, y: h * 0.65 },
        topRight: { x: w * 0.75, y: h * 0.65 },
        bottomRight: { x: w * 0.88, y: h * 0.94 },
        bottomLeft: { x: w * 0.12, y: h * 0.94 },
      };
    }

    dispatch({ type: 'SET_QUAD_CORNERS', payload: { corners: defaultCorners } });
  }, [quadCorners, containerSize, roomImage, dispatch]);

  // Keyboard Shortcuts Engine
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = (document.activeElement?.tagName || '').toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select') return;

      if (e.key === ' ') {
        e.preventDefault();
        setIsSpacePressed(true);
      }
      if (e.key === 'Alt') {
        setIsAltPressed(true);
      }
      if (e.key === 'Shift') {
        setIsShiftPressed(true);
      }

      if (e.ctrlKey || e.metaKey) {
        if (e.key.toLowerCase() === 'z') {
          e.preventDefault();
          if (e.shiftKey) handleRedo();
          else handleUndo();
          return;
        }
        if (e.key.toLowerCase() === 'y') {
          e.preventDefault();
          handleRedo();
          return;
        }
      }

      switch (e.key.toLowerCase()) {
        case 'c':
          dispatch({ type: 'SET_ACTIVE_TOOL', payload: { tool: 'corners' } });
          break;
        case 'b':
          dispatch({ type: 'SET_ACTIVE_TOOL', payload: { tool: 'brush' } });
          break;
        case 'w':
          dispatch({ type: 'SET_ACTIVE_TOOL', payload: { tool: 'wand' } });
          break;
        case 'e':
          dispatch({ type: 'SET_ACTIVE_TOOL', payload: { tool: 'eraser' } });
          break;
        case 't':
          dispatch({ type: 'SET_ACTIVE_TOOL', payload: { tool: 'floorTexture' } });
          break;
        case 'x':
          dispatch({ type: 'SET_ACTIVE_TOOL', payload: { tool: 'box' } });
          break;
        case '[':
          dispatch({ type: 'SET_BRUSH_SIZE', payload: { size: Math.max(10, brushSize - 5) } });
          break;
        case ']':
          dispatch({ type: 'SET_BRUSH_SIZE', payload: { size: Math.min(90, brushSize + 5) } });
          break;
        case '?':
          dispatch({ type: 'SET_SHOW_SHORTCUT_MODAL', payload: { open: !showShortcutModal } });
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === ' ') setIsSpacePressed(false);
      if (e.key === 'Alt') setIsAltPressed(false);
      if (e.key === 'Shift') setIsShiftPressed(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [dispatch, brushSize, showShortcutModal, handleUndo, handleRedo]);

  // Apply Box Cutout
  const applyBoxCutout = useCallback(
    (p1: Point2D, p2: Point2D) => {
      const maskCanvas = maskCanvasRef.current;
      if (!maskCanvas || !roomImageKonva) return;
      const maskCtx = maskCanvas.getContext('2d');
      if (!maskCtx) return;

      const bx = Math.min(p1.x, p2.x);
      const by = Math.min(p1.y, p2.y);
      const bw = Math.abs(p1.x - p2.x);
      const bh = Math.abs(p1.y - p2.y);

      if (bw < 10 || bh < 10) return;

      saveMaskSnapshot();
      maskCtx.drawImage(roomImageKonva, bx, by, bw, bh, bx, by, bw, bh);
      setHistoryVersion((v) => v + 1);
    },
    [roomImageKonva, saveMaskSnapshot]
  );

  // Apply Brush / Eraser segment
  const applyBrushSegment = useCallback(
    (start: Point2D, end: Point2D) => {
      const maskCanvas = maskCanvasRef.current;
      if (!maskCanvas || !roomImageKonva) return;
      const maskCtx = maskCanvas.getContext('2d', { willReadFrequently: true });
      if (!maskCtx) return;

      const isEraserMode = activeTool === 'eraser' || isAltPressed;
      const radius = brushSize / 2;
      const dist = Math.hypot(end.x - start.x, end.y - start.y);
      const steps = Math.max(1, Math.ceil(dist / (radius * 0.3)));

      const strokePoints: Point2D[] = [];
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        strokePoints.push({
          x: start.x + (end.x - start.x) * t,
          y: start.y + (end.y - start.y) * t,
        });
      }

      let minX = containerSize.width;
      let minY = containerSize.height;
      let maxX = 0;
      let maxY = 0;

      for (const p of strokePoints) {
        minX = Math.min(minX, Math.floor(p.x - radius - 2));
        minY = Math.min(minY, Math.floor(p.y - radius - 2));
        maxX = Math.max(maxX, Math.ceil(p.x + radius + 2));
        maxY = Math.max(maxY, Math.ceil(p.y + radius + 2));
      }

      minX = Math.max(0, minX);
      minY = Math.max(0, minY);
      maxX = Math.min(containerSize.width, maxX);
      maxY = Math.min(containerSize.height, maxY);

      const regionW = maxX - minX;
      const regionH = maxY - minY;
      if (regionW <= 0 || regionH <= 0) return;

      const roomOffscreen = document.createElement('canvas');
      roomOffscreen.width = containerSize.width;
      roomOffscreen.height = containerSize.height;
      const rCtx = roomOffscreen.getContext('2d', { willReadFrequently: true });
      if (!rCtx) return;
      rCtx.drawImage(roomImageKonva, 0, 0, containerSize.width, containerSize.height);

      const roomData = rCtx.getImageData(minX, minY, regionW, regionH);
      const maskData = maskCtx.getImageData(minX, minY, regionW, regionH);
      const roomPixels = roomData.data;
      const maskPixels = maskData.data;

      const edgeMap = edgeSnap && !isEraserMode ? getEdgeMap(roomImageKonva, containerSize.width, containerSize.height) : null;
      const radiusSq = radius * radius;
      const hardnessFactor = brushHardness / 100;

      for (let ry = 0; ry < regionH; ry++) {
        const canvasY = minY + ry;
        for (let rx = 0; rx < regionW; rx++) {
          const canvasX = minX + rx;

          let minDistSq = Infinity;
          for (const sp of strokePoints) {
            const dx = canvasX - sp.x;
            const dy = canvasY - sp.y;
            const dSq = dx * dx + dy * dy;
            if (dSq < minDistSq) minDistSq = dSq;
          }

          if (minDistSq <= radiusSq) {
            const normalizedDist = Math.sqrt(minDistSq) / radius;
            let falloff = Math.max(0, 1 - Math.pow(normalizedDist, 0.5 + hardnessFactor * 2.5));

            if (edgeMap) {
              const edgeStr = getEdgeStrength(edgeMap, canvasX, canvasY, 30);
              falloff *= Math.max(0.15, edgeStr);
            }

            const pixelIdx = (ry * regionW + rx) * 4;

            if (isEraserMode) {
              const eraseAmount = Math.round(220 * falloff);
              maskPixels[pixelIdx + 3] = Math.max(0, maskPixels[pixelIdx + 3] - eraseAmount);
            } else {
              const alpha = Math.round(255 * falloff);
              if (alpha > maskPixels[pixelIdx + 3]) {
                maskPixels[pixelIdx] = roomPixels[pixelIdx];
                maskPixels[pixelIdx + 1] = roomPixels[pixelIdx + 1];
                maskPixels[pixelIdx + 2] = roomPixels[pixelIdx + 2];
                maskPixels[pixelIdx + 3] = alpha;
              }
            }
          }
        }
      }

      maskCtx.putImageData(maskData, minX, minY);
      setHistoryVersion((v) => v + 1);
    },
    [activeTool, isAltPressed, brushSize, brushHardness, edgeSnap, roomImageKonva, containerSize, saveMaskSnapshot]
  );

  // Apply Magic Wand Tool
  const applyMagicWand = useCallback(
    (pos: Point2D) => {
      const maskCanvas = maskCanvasRef.current;
      if (!maskCanvas || !roomImageKonva) return;
      const maskCtx = maskCanvas.getContext('2d', { willReadFrequently: true });
      if (!maskCtx) return;

      const w = containerSize.width;
      const h = containerSize.height;
      const seedX = Math.round(pos.x);
      const seedY = Math.round(pos.y);

      if (seedX < 0 || seedX >= w || seedY < 0 || seedY >= h) return;

      saveMaskSnapshot();

      const roomOff = document.createElement('canvas');
      roomOff.width = w;
      roomOff.height = h;
      const rCtx = roomOff.getContext('2d', { willReadFrequently: true });
      if (!rCtx) return;
      rCtx.drawImage(roomImageKonva, 0, 0, w, h);

      const roomData = rCtx.getImageData(0, 0, w, h);
      const maskData = maskCtx.getImageData(0, 0, w, h);
      const rPix = roomData.data;
      const mPix = maskData.data;

      const seedIdx = (seedY * w + seedX) * 4;
      const seedR = rPix[seedIdx];
      const seedG = rPix[seedIdx + 1];
      const seedB = rPix[seedIdx + 2];

      const tolSq = wandTolerance * wandTolerance * 3;
      const isSubtract = isAltPressed;

      if (wandContiguous) {
        const visited = new Uint8Array(w * h);
        const stack: number[] = [seedX, seedY];
        visited[seedY * w + seedX] = 1;

        while (stack.length > 0) {
          const cy = stack.pop()!;
          const cx = stack.pop()!;
          const idx = (cy * w + cx) * 4;

          const dr = rPix[idx] - seedR;
          const dg = rPix[idx + 1] - seedG;
          const db = rPix[idx + 2] - seedB;
          const colorDistSq = dr * dr + dg * dg + db * db;

          if (colorDistSq <= tolSq) {
            if (isSubtract) {
              mPix[idx + 3] = 0;
            } else {
              mPix[idx] = rPix[idx];
              mPix[idx + 1] = rPix[idx + 1];
              mPix[idx + 2] = rPix[idx + 2];
              mPix[idx + 3] = 255;
            }

            const neighbors = [
              [cx + 1, cy],
              [cx - 1, cy],
              [cx, cy + 1],
              [cx, cy - 1],
            ];

            for (const [nx, ny] of neighbors) {
              if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
                const nPos = ny * w + nx;
                if (!visited[nPos]) {
                  visited[nPos] = 1;
                  stack.push(nx, ny);
                }
              }
            }
          }
        }
      } else {
        for (let i = 0; i < w * h; i++) {
          const idx = i * 4;
          const dr = rPix[idx] - seedR;
          const dg = rPix[idx + 1] - seedG;
          const db = rPix[idx + 2] - seedB;
          const colorDistSq = dr * dr + dg * dg + db * db;

          if (colorDistSq <= tolSq) {
            if (isSubtract) {
              mPix[idx + 3] = 0;
            } else {
              mPix[idx] = rPix[idx];
              mPix[idx + 1] = rPix[idx + 1];
              mPix[idx + 2] = rPix[idx + 2];
              mPix[idx + 3] = 255;
            }
          }
        }
      }

      maskCtx.putImageData(maskData, 0, 0);
      setHistoryVersion((v) => v + 1);
    },
    [roomImageKonva, containerSize, wandTolerance, wandContiguous, isAltPressed, saveMaskSnapshot]
  );

  // Main Canvas Render Pipeline
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = containerSize.width;
    const h = containerSize.height;
    canvas.width = w;
    canvas.height = h;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, w, h);

    ctx.save();

    // Zoom & Pan Transform Matrix
    if (zoom > 1 || pan.x !== 0 || pan.y !== 0) {
      const cx = w / 2;
      const cy = h / 2;
      ctx.translate(cx + pan.x, cy + pan.y);
      ctx.scale(zoom, zoom);
      ctx.translate(-cx, -cy);
    }

    // Layer 1: Room Background
    if (roomImageKonva) {
      ctx.drawImage(roomImageKonva, 0, 0, w, h);
    }

    // Render rug layers only when not showing original
    if (!showOriginal && quadCorners) {
      // Layer 2: Contact Shadow
      if (shadowOpacity > 0) {
        drawQuadShadow(ctx, quadCorners, shadowOpacity);
      }

      // Layer 3: Perspective Rug Quad
      if (rugImageKonva) {
        drawPerspectiveQuad(ctx, rugImageKonva, quadCorners, 16, opacity);
      }

      // Layer 4: Floor Texture Blend (Multiply mode)
      if (floorTextureStrength > 0 && rugImageKonva && roomImageKonva) {
        const offA = document.createElement('canvas');
        offA.width = w;
        offA.height = h;
        const ctxA = offA.getContext('2d');
        if (ctxA) {
          drawPerspectiveQuad(ctxA, rugImageKonva, quadCorners, 16, 1);

          const offB = document.createElement('canvas');
          offB.width = w;
          offB.height = h;
          const ctxB = offB.getContext('2d');
          if (ctxB) {
            ctxB.drawImage(offA, 0, 0);
            ctxB.globalCompositeOperation = 'multiply';
            ctxB.drawImage(roomImageKonva, 0, 0, w, h);
            ctxB.globalCompositeOperation = 'destination-in';
            ctxB.drawImage(offA, 0, 0);

            ctx.save();
            ctx.globalAlpha = floorTextureStrength;
            ctx.drawImage(offB, 0, 0);
            ctx.restore();
          }
        }
      }
    }

    // Layer 5: Foreground Mask
    if (maskCanvasRef.current) {
      ctx.drawImage(maskCanvasRef.current, 0, 0);

      // Layer 5b: Mask Preview Overlay (indigo tint)
      if (showMaskPreview) {
        const prevCanvas = document.createElement('canvas');
        prevCanvas.width = w;
        prevCanvas.height = h;
        const pCtx = prevCanvas.getContext('2d');
        if (pCtx) {
          pCtx.drawImage(maskCanvasRef.current, 0, 0);
          pCtx.globalCompositeOperation = 'source-atop';
          pCtx.fillStyle = 'rgba(99, 102, 241, 0.45)';
          pCtx.fillRect(0, 0, w, h);

          ctx.drawImage(prevCanvas, 0, 0);
        }
      }
    }

    // Layer 6: UI Overlays
    if (!showOriginal) {
      if (activeTool === 'corners' && quadCorners) {
        drawPerspectiveGrid(ctx, quadCorners);
        drawQuadHandles(ctx, quadCorners, hoveredCorner, activeCorner);
      } else if (activeTool === 'brush' || activeTool === 'eraser') {
        drawBrushCursor(ctx, mousePos, brushSize, brushHardness, activeTool === 'eraser' || isAltPressed, isShiftPressed);
      } else if (activeTool === 'box' && isMouseDown && boxStart && boxCurrent) {
        drawBoxPreview(ctx, boxStart, boxCurrent);
      } else if (activeTool === 'wand') {
        drawWandCursor(ctx, mousePos, isAltPressed);
      }
    }

    ctx.restore();
  }, [
    containerSize,
    roomImageKonva,
    rugImageKonva,
    quadCorners,
    opacity,
    shadowOpacity,
    showOriginal,
    floorTextureStrength,
    showMaskPreview,
    activeTool,
    hoveredCorner,
    activeCorner,
    mousePos,
    brushSize,
    brushHardness,
    isAltPressed,
    isShiftPressed,
    isMouseDown,
    boxStart,
    boxCurrent,
    zoom,
    pan,
    historyVersion,
  ]);

  // UI Drawing Helpers
  function drawPerspectiveGrid(ctx: CanvasRenderingContext2D, corners: QuadCorners) {
    const { topLeft: tl, topRight: tr, bottomRight: br, bottomLeft: bl } = corners;
    ctx.save();
    ctx.strokeStyle = '#B89970';
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.3;
    ctx.setLineDash([3, 3]);

    const steps = 4;
    for (let i = 1; i < steps; i++) {
      const u = i / steps;

      const topX = (1 - u) * tl.x + u * tr.x;
      const topY = (1 - u) * tl.y + u * tr.y;
      const botX = (1 - u) * bl.x + u * br.x;
      const botY = (1 - u) * bl.y + u * br.y;

      ctx.beginPath();
      ctx.moveTo(topX, topY);
      ctx.lineTo(botX, botY);
      ctx.stroke();

      const leftX = (1 - u) * tl.x + u * bl.x;
      const leftY = (1 - u) * tl.y + u * bl.y;
      const rightX = (1 - u) * tr.x + u * br.x;
      const rightY = (1 - u) * tr.y + u * br.y;

      ctx.beginPath();
      ctx.moveTo(leftX, leftY);
      ctx.lineTo(rightX, rightY);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawQuadHandles(
    ctx: CanvasRenderingContext2D,
    corners: QuadCorners,
    hovered: keyof QuadCorners | null,
    active: keyof QuadCorners | null
  ) {
    const keys: (keyof QuadCorners)[] = ['topLeft', 'topRight', 'bottomRight', 'bottomLeft'];
    ctx.save();

    ctx.beginPath();
    ctx.moveTo(corners.topLeft.x, corners.topLeft.y);
    ctx.lineTo(corners.topRight.x, corners.topRight.y);
    ctx.lineTo(corners.bottomRight.x, corners.bottomRight.y);
    ctx.lineTo(corners.bottomLeft.x, corners.bottomLeft.y);
    ctx.closePath();
    ctx.strokeStyle = '#B89970';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([5, 5]);
    ctx.stroke();

    for (const k of keys) {
      const pt = corners[k];
      const isHover = hovered === k || active === k;
      const radius = isHover ? 8 : 6;

      if (isHover) {
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 12, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(184, 153, 112, 0.35)';
        ctx.fill();
      }

      ctx.beginPath();
      ctx.arc(pt.x, pt.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = isHover ? '#B89970' : '#F5F2EC';
      ctx.fill();
      ctx.strokeStyle = '#2B2B2B';
      ctx.lineWidth = 2;
      ctx.setLineDash([]);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawBrushCursor(
    ctx: CanvasRenderingContext2D,
    pos: Point2D,
    size: number,
    hardness: number,
    isEraser: boolean,
    isShift: boolean
  ) {
    const radius = size / 2;
    ctx.save();

    ctx.beginPath();
    ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
    ctx.strokeStyle = isEraser ? '#f43f5e' : '#6366f1';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.stroke();

    if (hardness < 100) {
      const innerRadius = radius * (hardness / 100);
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, Math.max(2, innerRadius), 0, Math.PI * 2);
      ctx.strokeStyle = isEraser ? 'rgba(244, 63, 94, 0.6)' : 'rgba(99, 102, 241, 0.6)';
      ctx.lineWidth = 1;
      ctx.setLineDash([]);
      ctx.stroke();
    }

    ctx.beginPath();
    ctx.arc(pos.x, pos.y, 2, 0, Math.PI * 2);
    ctx.fillStyle = isEraser ? '#f43f5e' : '#6366f1';
    ctx.fill();

    ctx.font = '10px sans-serif';
    ctx.fillStyle = isEraser ? '#f43f5e' : '#6366f1';
    if (isEraser) {
      ctx.fillText('–', pos.x + radius + 4, pos.y + 4);
    } else if (isShift) {
      ctx.fillText('+', pos.x + radius + 4, pos.y + 4);
    }

    ctx.restore();
  }

  function drawBoxPreview(ctx: CanvasRenderingContext2D, start: Point2D, current: Point2D) {
    const x = Math.min(start.x, current.x);
    const y = Math.min(start.y, current.y);
    const w = Math.abs(start.x - current.x);
    const h = Math.abs(start.y - current.y);

    ctx.save();
    ctx.fillStyle = 'rgba(99, 102, 241, 0.15)';
    ctx.fillRect(x, y, w, h);

    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.strokeRect(x, y, w, h);
    ctx.restore();
  }

  function drawWandCursor(ctx: CanvasRenderingContext2D, pos: Point2D, isSubtract: boolean) {
    ctx.save();
    ctx.strokeStyle = isSubtract ? '#f43f5e' : '#6366f1';
    ctx.lineWidth = 1.5;

    ctx.beginPath();
    ctx.moveTo(pos.x - 10, pos.y);
    ctx.lineTo(pos.x + 10, pos.y);
    ctx.moveTo(pos.x, pos.y - 10);
    ctx.lineTo(pos.x, pos.y + 10);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(pos.x, pos.y, 4, 0, Math.PI * 2);
    ctx.setLineDash([2, 2]);
    ctx.stroke();

    if (isSubtract) {
      ctx.font = '10px sans-serif';
      ctx.fillStyle = '#f43f5e';
      ctx.fillText('–', pos.x + 12, pos.y + 4);
    }

    ctx.restore();
  }

  // Mouse Handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (showOriginal || !canvasRef.current || !containerRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const pos = screenToCanvas(e.clientX, e.clientY, rect, containerSize.width, containerSize.height);

    setIsMouseDown(true);
    setMousePos(pos);

    if (isSpacePressed || e.button === 1) {
      startPan({ x: e.clientX, y: e.clientY });
      return;
    }

    if (activeTool === 'corners' && quadCorners) {
      const keys: (keyof QuadCorners)[] = ['topLeft', 'topRight', 'bottomRight', 'bottomLeft'];
      for (const k of keys) {
        const pt = quadCorners[k];
        if (Math.hypot(pt.x - pos.x, pt.y - pos.y) <= 24) {
          setActiveCorner(k);
          return;
        }
      }
    } else if (activeTool === 'box') {
      setBoxStart(pos);
      setBoxCurrent(pos);
    } else if (activeTool === 'brush' || activeTool === 'eraser') {
      saveMaskSnapshot();
      setLastPaintPos(pos);
      applyBrushSegment(pos, pos);
    } else if (activeTool === 'wand') {
      applyMagicWand(pos);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !containerRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const pos = screenToCanvas(e.clientX, e.clientY, rect, containerSize.width, containerSize.height);

    setMousePos(pos);

    if (isPanning) {
      updatePan({ x: e.clientX, y: e.clientY });
      return;
    }

    if (activeTool === 'corners' && quadCorners) {
      if (activeCorner) {
        const clampedX = Math.max(0, Math.min(containerSize.width, pos.x));
        const clampedY = Math.max(0, Math.min(containerSize.height, pos.y));
        dispatch({
          type: 'UPDATE_QUAD_CORNER',
          payload: { corner: activeCorner, x: clampedX, y: clampedY },
        });
      } else {
        const keys: (keyof QuadCorners)[] = ['topLeft', 'topRight', 'bottomRight', 'bottomLeft'];
        let found: keyof QuadCorners | null = null;
        for (const k of keys) {
          const pt = quadCorners[k];
          if (Math.hypot(pt.x - pos.x, pt.y - pos.y) <= 24) {
            found = k;
            break;
          }
        }
        setHoveredCorner(found);
      }
    } else if (activeTool === 'box' && isMouseDown && boxStart) {
      setBoxCurrent(pos);
    } else if ((activeTool === 'brush' || activeTool === 'eraser') && isMouseDown) {
      const prev = lastPaintPos || pos;
      applyBrushSegment(prev, pos);
      setLastPaintPos(pos);
    }
  };

  const handleMouseUp = () => {
    if (isPanning) {
      endPan();
    }
    if (activeTool === 'corners') {
      setActiveCorner(null);
    } else if (activeTool === 'box' && boxStart && boxCurrent) {
      applyBoxCutout(boxStart, boxCurrent);
      setBoxStart(null);
      setBoxCurrent(null);
    } else if (activeTool === 'brush' || activeTool === 'eraser') {
      setLastPaintPos(null);
    }
    setIsMouseDown(false);
  };

  // Touch Handlers
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length !== 1 || !canvasRef.current) return;
    const touch = e.touches[0];
    const rect = canvasRef.current.getBoundingClientRect();
    const pos = screenToCanvas(touch.clientX, touch.clientY, rect, containerSize.width, containerSize.height);

    setIsMouseDown(true);
    setMousePos(pos);

    if (activeTool === 'corners' && quadCorners) {
      const keys: (keyof QuadCorners)[] = ['topLeft', 'topRight', 'bottomRight', 'bottomLeft'];
      for (const k of keys) {
        const pt = quadCorners[k];
        if (Math.hypot(pt.x - pos.x, pt.y - pos.y) <= 30) {
          setActiveCorner(k);
          return;
        }
      }
    } else if (activeTool === 'brush' || activeTool === 'eraser') {
      saveMaskSnapshot();
      setLastPaintPos(pos);
      applyBrushSegment(pos, pos);
    } else if (activeTool === 'wand') {
      applyMagicWand(pos);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length !== 1 || !canvasRef.current) return;
    const touch = e.touches[0];
    const rect = canvasRef.current.getBoundingClientRect();
    const pos = screenToCanvas(touch.clientX, touch.clientY, rect, containerSize.width, containerSize.height);

    setMousePos(pos);

    if (activeTool === 'corners' && activeCorner && quadCorners) {
      const clampedX = Math.max(0, Math.min(containerSize.width, pos.x));
      const clampedY = Math.max(0, Math.min(containerSize.height, pos.y));
      dispatch({
        type: 'UPDATE_QUAD_CORNER',
        payload: { corner: activeCorner, x: clampedX, y: clampedY },
      });
    } else if ((activeTool === 'brush' || activeTool === 'eraser') && isMouseDown) {
      const prev = lastPaintPos || pos;
      applyBrushSegment(prev, pos);
      setLastPaintPos(pos);
    }
  };

  const handleTouchEnd = () => {
    handleMouseUp();
  };

  // High Quality Render PNG Export (2x Resolution)
  const handleExport = useCallback(() => {
    if (!roomImageKonva || !quadCorners) return;

    const w = containerSize.width * 2;
    const h = containerSize.height * 2;
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = w;
    exportCanvas.height = h;
    const ctx = exportCanvas.getContext('2d');
    if (!ctx) return;

    ctx.scale(2, 2);

    // 1. Room Background
    ctx.drawImage(roomImageKonva, 0, 0, containerSize.width, containerSize.height);

    // 2. Contact Shadow
    if (!showOriginal && shadowOpacity > 0) {
      drawQuadShadow(ctx, quadCorners, shadowOpacity);
    }

    // 3. Perspective Rug (High step grid = 24)
    if (!showOriginal && rugImageKonva) {
      drawPerspectiveQuad(ctx, rugImageKonva, quadCorners, 24, opacity);
    }

    // 4. Floor Texture Blend
    if (!showOriginal && floorTextureStrength > 0 && rugImageKonva && roomImageKonva) {
      const offA = document.createElement('canvas');
      offA.width = containerSize.width;
      offA.height = containerSize.height;
      const ctxA = offA.getContext('2d');
      if (ctxA) {
        drawPerspectiveQuad(ctxA, rugImageKonva, quadCorners, 24, 1);

        const offB = document.createElement('canvas');
        offB.width = containerSize.width;
        offB.height = containerSize.height;
        const ctxB = offB.getContext('2d');
        if (ctxB) {
          ctxB.drawImage(offA, 0, 0);
          ctxB.globalCompositeOperation = 'multiply';
          ctxB.drawImage(roomImageKonva, 0, 0, containerSize.width, containerSize.height);
          ctxB.globalCompositeOperation = 'destination-in';
          ctxB.drawImage(offA, 0, 0);

          ctx.save();
          ctx.globalAlpha = floorTextureStrength;
          ctx.drawImage(offB, 0, 0);
          ctx.restore();
        }
      }
    }

    // 5. Foreground Mask
    if (maskCanvasRef.current) {
      ctx.drawImage(maskCanvasRef.current, 0, 0);
    }

    try {
      const dataUrl = exportCanvas.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      link.download = `${product.slug || 'hod'}-floor-visualization.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export canvas:', err);
      alert('Canvas export failed due to browser security restrictions on the image source.');
    }
  }, [roomImageKonva, rugImageKonva, quadCorners, containerSize, opacity, shadowOpacity, floorTextureStrength, showOriginal, product.slug]);

  // Cursor style determination
  const getCursorClass = () => {
    if (isSpacePressed) return isMouseDown ? 'cursor-grabbing' : 'cursor-grab';
    if (activeTool === 'corners') {
      if (activeCorner) return 'cursor-grabbing';
      if (hoveredCorner) return 'cursor-grab';
      return 'cursor-crosshair';
    }
    if (activeTool === 'wand') return 'cursor-crosshair';
    if (activeTool === 'brush' || activeTool === 'eraser' || activeTool === 'box') return 'cursor-none';
    return 'cursor-default';
  };

  return (
    <div className="flex flex-col lg:flex-row h-full min-h-[600px] w-full bg-[var(--bg-primary)] text-[var(--text-primary)]">
      {/* Sidebar Inspector Panel */}
      <aside
        data-lenis-prevent
        className="w-full lg:w-80 h-full max-h-full shrink-0 border-r border-[var(--border-secondary)] bg-[var(--bg-primary)] p-4 overflow-y-auto overscroll-contain pb-12"
      >
        <RoomSelector />
        <VisualizerToolbar
          product={product}
          activeColor={activeColor}
          onColorChange={onColorChange}
          selectedVariation={selectedVariation}
          onVariationChange={onVariationChange}
          onExport={handleExport}
          onClearMask={handleClearMask}
          onUndo={handleUndo}
          onRedo={handleRedo}
          canUndo={undoStackRef.current.length > 0}
          canRedo={redoStackRef.current.length > 0}
        />
      </aside>

      {/* Interactive CAD Canvas Viewport */}
      <div
        id="visualizer-container"
        ref={containerRef}
        className="relative flex-1 bg-[#1A1A1A] overflow-hidden min-h-[500px] flex items-center justify-center select-none"
      >
        {/* Floating Top Floating Bar */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 p-1 rounded-xl bg-[#2B2B2B]/90 backdrop-blur-md border border-white/10 shadow-2xl text-white">
          <button
            type="button"
            onClick={() => dispatch({ type: 'SET_ACTIVE_TOOL', payload: { tool: 'corners' } })}
            className={`p-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeTool === 'corners' ? 'bg-[#A38A61] text-white shadow' : 'text-gray-300 hover:text-white hover:bg-white/10'
            }`}
            title="Corner Align Tool (C)"
          >
            <Move className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => dispatch({ type: 'SET_ACTIVE_TOOL', payload: { tool: 'floorTexture' } })}
            className={`p-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeTool === 'floorTexture' ? 'bg-[#A38A61] text-white shadow' : 'text-gray-300 hover:text-white hover:bg-white/10'
            }`}
            title="Floor Texture Blend Tool (T)"
          >
            <Layers className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => dispatch({ type: 'SET_ACTIVE_TOOL', payload: { tool: 'box' } })}
            className={`p-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeTool === 'box' ? 'bg-[#A38A61] text-white shadow' : 'text-gray-300 hover:text-white hover:bg-white/10'
            }`}
            title="Box Cutout Mask Tool (X)"
          >
            <Square className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => dispatch({ type: 'SET_ACTIVE_TOOL', payload: { tool: 'brush' } })}
            className={`p-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeTool === 'brush' ? 'bg-[#A38A61] text-white shadow' : 'text-gray-300 hover:text-white hover:bg-white/10'
            }`}
            title="Paint Brush Tool (B)"
          >
            <Paintbrush className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => dispatch({ type: 'SET_ACTIVE_TOOL', payload: { tool: 'wand' } })}
            className={`p-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeTool === 'wand' ? 'bg-[#A38A61] text-white shadow' : 'text-gray-300 hover:text-white hover:bg-white/10'
            }`}
            title="Magic Wand Tool (W)"
          >
            <Wand2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => dispatch({ type: 'SET_ACTIVE_TOOL', payload: { tool: 'eraser' } })}
            className={`p-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeTool === 'eraser' ? 'bg-[#A38A61] text-white shadow' : 'text-gray-300 hover:text-white hover:bg-white/10'
            }`}
            title="Eraser Mask Tool (E)"
          >
            <Eraser className="w-4 h-4" />
          </button>

          <div className="h-4 w-px bg-white/20 mx-1"></div>

          <button
            type="button"
            onClick={handleUndo}
            disabled={undoStackRef.current.length === 0}
            className={`p-2 rounded-lg text-xs transition-all cursor-pointer ${
              undoStackRef.current.length > 0 ? 'text-gray-300 hover:text-white hover:bg-white/10' : 'text-gray-600 cursor-not-allowed'
            }`}
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleRedo}
            disabled={redoStackRef.current.length === 0}
            className={`p-2 rounded-lg text-xs transition-all cursor-pointer ${
              redoStackRef.current.length > 0 ? 'text-gray-300 hover:text-white hover:bg-white/10' : 'text-gray-600 cursor-not-allowed'
            }`}
            title="Redo (Ctrl+Shift+Z)"
          >
            <Redo2 className="w-4 h-4" />
          </button>

          <div className="h-4 w-px bg-white/20 mx-1"></div>

          <button
            type="button"
            onClick={zoomIn}
            className="p-2 rounded-lg text-xs text-gray-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={zoomOut}
            className="p-2 rounded-lg text-xs text-gray-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={resetZoom}
            className="p-2 rounded-lg text-xs text-gray-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            title="Reset Zoom (100%)"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <div className="h-4 w-px bg-white/20 mx-1"></div>

          <button
            type="button"
            onClick={() => dispatch({ type: 'TOGGLE_BEFORE_AFTER' })}
            className={`p-2 rounded-lg text-xs transition-all cursor-pointer ${
              showOriginal ? 'bg-amber-600 text-white' : 'text-gray-300 hover:text-white hover:bg-white/10'
            }`}
            title="Toggle Compare Original"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleExport}
            className="p-2 rounded-lg text-xs text-gray-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            title="Export High-Res PNG"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => dispatch({ type: 'SET_SHOW_SHORTCUT_MODAL', payload: { open: true } })}
            className="p-2 rounded-lg text-xs text-gray-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            title="Keyboard Shortcuts (?)"
          >
            <Keyboard className="w-4 h-4" />
          </button>
        </div>

        {/* HTML5 Canvas */}
        <canvas
          ref={canvasRef}
          className={`${getCursorClass()} touch-none transition-opacity duration-300`}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        />

        {/* Bottom Right Floating Status & Helper Indicator */}
        <div className="absolute bottom-4 right-4 z-20 pointer-events-none flex items-center space-x-2 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-lg text-[11px] text-gray-200 border border-white/10 shadow-lg">
          <Info className="w-3.5 h-3.5 text-[#A38A61]" />
          <span>
            {activeTool === 'corners' && 'Drag gold corners to align rug on floor'}
            {activeTool === 'floorTexture' && 'Adjust floor texture slider in sidebar'}
            {activeTool === 'box' && 'Drag rectangle over furniture to bring above rug'}
            {activeTool === 'brush' && 'Paint furniture pixels above rug (Hold Alt to erase)'}
            {activeTool === 'wand' && 'Click furniture to select color (Hold Alt to subtract)'}
            {activeTool === 'eraser' && 'Erase painted mask pixels to reveal rug'}
          </span>
          {zoom > 1 && <span className="font-mono text-amber-400 font-medium ml-2">[{Math.round(zoom * 100)}%]</span>}
        </div>

        {/* Before / After Original Badge */}
        {showOriginal && (
          <div className="absolute top-18 right-4 z-20 pointer-events-none bg-amber-600 text-white font-semibold text-xs px-3 py-1.5 rounded-md shadow-lg flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5" />
            BEFORE (Original Room)
          </div>
        )}

        {/* Keyboard Shortcuts Cheat Sheet Modal */}
        {showShortcutModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-md bg-[#2B2B2B] text-white rounded-xl p-5 border border-white/10 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center space-x-2">
                  <Keyboard className="w-5 h-5 text-[#A38A61]" />
                  <h3 className="text-sm font-semibold">Studio Keyboard Shortcuts</h3>
                </div>
                <button
                  onClick={() => dispatch({ type: 'SET_SHOW_SHORTCUT_MODAL', payload: { open: false } })}
                  className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex justify-between p-2 rounded bg-white/5">
                  <span className="text-gray-400">Corner Align</span>
                  <kbd className="font-mono bg-white/10 px-1.5 rounded">C</kbd>
                </div>
                <div className="flex justify-between p-2 rounded bg-white/5">
                  <span className="text-gray-400">Paint Brush</span>
                  <kbd className="font-mono bg-white/10 px-1.5 rounded">B</kbd>
                </div>
                <div className="flex justify-between p-2 rounded bg-white/5">
                  <span className="text-gray-400">Magic Wand</span>
                  <kbd className="font-mono bg-white/10 px-1.5 rounded">W</kbd>
                </div>
                <div className="flex justify-between p-2 rounded bg-white/5">
                  <span className="text-gray-400">Eraser</span>
                  <kbd className="font-mono bg-white/10 px-1.5 rounded">E</kbd>
                </div>
                <div className="flex justify-between p-2 rounded bg-white/5">
                  <span className="text-gray-400">Floor Texture</span>
                  <kbd className="font-mono bg-white/10 px-1.5 rounded">T</kbd>
                </div>
                <div className="flex justify-between p-2 rounded bg-white/5">
                  <span className="text-gray-400">Box Cutout</span>
                  <kbd className="font-mono bg-white/10 px-1.5 rounded">X</kbd>
                </div>
                <div className="flex justify-between p-2 rounded bg-white/5">
                  <span className="text-gray-400">Brush Size - / +</span>
                  <kbd className="font-mono bg-white/10 px-1.5 rounded">[ / ]</kbd>
                </div>
                <div className="flex justify-between p-2 rounded bg-white/5">
                  <span className="text-gray-400">Undo / Redo</span>
                  <kbd className="font-mono bg-white/10 px-1.5 rounded">Ctrl+Z/Y</kbd>
                </div>
                <div className="flex justify-between p-2 rounded bg-white/5">
                  <span className="text-gray-400">Pan Canvas</span>
                  <kbd className="font-mono bg-white/10 px-1.5 rounded">Space+Drag</kbd>
                </div>
                <div className="flex justify-between p-2 rounded bg-white/5">
                  <span className="text-gray-400">Erase / Subtract</span>
                  <kbd className="font-mono bg-white/10 px-1.5 rounded">Alt+Click</kbd>
                </div>
              </div>

              <div className="pt-2 text-center">
                <button
                  onClick={() => dispatch({ type: 'SET_SHOW_SHORTCUT_MODAL', payload: { open: false } })}
                  className="w-full py-2 bg-[#A38A61] hover:bg-[#8F7752] text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                >
                  Got It
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
