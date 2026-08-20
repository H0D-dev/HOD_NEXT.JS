'use client';

import React from 'react';
import { useVisualizerStore } from '@/src/lib/store/useVisualizerStore';
import { Product, ProductColor, ProductVariation } from '@/src/components/product-presentation/ProductPresentation';
import { useAnalytics } from '@/src/lib/analytics/useAnalytics';
import {
  Move,
  Layers,
  Square,
  Paintbrush,
  Eraser,
  Wand2,
  RotateCcw,
  Eye,
  Download,
  Sliders,
  Grid,
  Compass,
  Trash2,
  Magnet,
  EyeOff,
  Lock,
  Undo2,
  Redo2,
} from 'lucide-react';

type VisualizerToolbarProps = {
  product: Product;
  activeColor: ProductColor;
  onColorChange: (color: ProductColor) => void;
  selectedVariation: ProductVariation | null;
  onVariationChange: (variation: ProductVariation | null) => void;
  onExport: () => void;
  onClearMask: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
};

export default function VisualizerToolbar({
  product,
  activeColor,
  onColorChange,
  selectedVariation,
  onVariationChange,
  onExport,
  onClearMask,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
}: VisualizerToolbarProps) {
  const {
    dispatch,
    showOriginal,
    opacity,
    shadowOpacity,
    activeTool,
    brushSize,
    brushHardness,
    edgeSnap,
    showMaskPreview,
    preserveMask,
    floorTextureStrength,
    wandTolerance,
    wandContiguous,
  } = useVisualizerStore();

  const { trackVisualizerToolUse, trackVisualizerPerspectiveAdjust, trackVisualizerExport } = useAnalytics();
  const numericProductId = parseInt(product.id, 10) || 0;

  const handleToolSelect = (tool: any) => {
    trackVisualizerToolUse({ tool });
    dispatch({ type: 'SET_ACTIVE_TOOL', payload: { tool } });
  };

  const handleResetQuad = () => {
    trackVisualizerPerspectiveAdjust({ productId: numericProductId, tool: "corners" });
    dispatch({ type: 'RESET_TRANSFORM' });
  };

  const handleApplyPreset = (preset: 'center' | 'wide' | 'deep' | 'runner') => {
    trackVisualizerPerspectiveAdjust({ productId: numericProductId, tool: "corners" });
    const container = document.getElementById('visualizer-container');
    const w = container ? container.offsetWidth : 800;
    const h = container ? container.offsetHeight : 600;

    let corners;
    if (preset === 'center') {
      corners = {
        topLeft: { x: w * 0.28, y: h * 0.64 },
        topRight: { x: w * 0.72, y: h * 0.64 },
        bottomRight: { x: w * 0.85, y: h * 0.93 },
        bottomLeft: { x: w * 0.15, y: h * 0.93 },
      };
    } else if (preset === 'wide') {
      corners = {
        topLeft: { x: w * 0.15, y: h * 0.60 },
        topRight: { x: w * 0.85, y: h * 0.60 },
        bottomRight: { x: w * 0.95, y: h * 0.95 },
        bottomLeft: { x: w * 0.05, y: h * 0.95 },
      };
    } else if (preset === 'deep') {
      corners = {
        topLeft: { x: w * 0.38, y: h * 0.50 },
        topRight: { x: w * 0.62, y: h * 0.50 },
        bottomRight: { x: w * 0.88, y: h * 0.94 },
        bottomLeft: { x: w * 0.12, y: h * 0.94 },
      };
    } else {
      corners = {
        topLeft: { x: w * 0.38, y: h * 0.55 },
        topRight: { x: w * 0.62, y: h * 0.55 },
        bottomRight: { x: w * 0.68, y: h * 0.95 },
        bottomLeft: { x: w * 0.32, y: h * 0.95 },
      };
    }

    dispatch({ type: 'SET_QUAD_CORNERS', payload: { corners } });
  };

  const handleToggleBeforeAfter = () => {
    trackVisualizerToolUse({ tool: "beforeAfter" });
    dispatch({ type: 'TOGGLE_BEFORE_AFTER' });
  };

  const handleExportClick = () => {
    trackVisualizerExport({
      productId: numericProductId,
      exportFormat: "image/png",
    });
    onExport();
  };

  return (
    <div className="space-y-5 text-[var(--text-primary)]">
      {/* 2. Interactive Studio Tools Selector */}
      <div>
        <label className="text-xs font-semibold text-[var(--text-primary)] uppercase tracking-wider block mb-2">
          2. Object & Layer Tools
        </label>

        <div className="grid grid-cols-3 gap-1.5 p-1 bg-[var(--bg-tertiary)] rounded-lg border border-[var(--border-secondary)] mb-1.5">
          <button
            type="button"
            onClick={() => handleToolSelect('corners')}
            className={`flex flex-col items-center py-2 px-1 rounded text-[11px] font-medium transition-all cursor-pointer ${
              activeTool === 'corners'
                ? 'bg-[#2B2B2B] text-white shadow-sm'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
            }`}
          >
            <Move className="w-4 h-4 mb-1" />
            <span>Corner Align</span>
          </button>

          <button
            type="button"
            onClick={() => handleToolSelect('floorTexture')}
            className={`flex flex-col items-center py-2 px-1 rounded text-[11px] font-medium transition-all cursor-pointer ${
              activeTool === 'floorTexture'
                ? 'bg-[#2B2B2B] text-white shadow-sm'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
            }`}
          >
            <Layers className="w-4 h-4 mb-1" />
            <span>Floor Texture</span>
          </button>

          <button
            type="button"
            onClick={() => handleToolSelect('box')}
            className={`flex flex-col items-center py-2 px-1 rounded text-[11px] font-medium transition-all cursor-pointer ${
              activeTool === 'box'
                ? 'bg-[#2B2B2B] text-white shadow-sm'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
            }`}
          >
            <Square className="w-4 h-4 mb-1" />
            <span>Box Cutout</span>
          </button>
        </div>

        <div className="grid grid-cols-3 gap-1.5 p-1 bg-[var(--bg-tertiary)] rounded-lg border border-[var(--border-secondary)]">
          <button
            type="button"
            onClick={() => handleToolSelect('brush')}
            className={`flex flex-col items-center py-1.5 px-1 rounded text-[11px] font-medium transition-all cursor-pointer ${
              activeTool === 'brush'
                ? 'bg-[#2B2B2B] text-white shadow-sm'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
            }`}
          >
            <Paintbrush className="w-3.5 h-3.5 mb-0.5" />
            <span>Paint</span>
          </button>

          <button
            type="button"
            onClick={() => handleToolSelect('wand')}
            className={`flex flex-col items-center py-1.5 px-1 rounded text-[11px] font-medium transition-all cursor-pointer ${
              activeTool === 'wand'
                ? 'bg-[#2B2B2B] text-white shadow-sm'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
            }`}
          >
            <Wand2 className="w-3.5 h-3.5 mb-0.5" />
            <span>Magic Wand</span>
          </button>

          <button
            type="button"
            onClick={() => handleToolSelect('eraser')}
            className={`flex flex-col items-center py-1.5 px-1 rounded text-[11px] font-medium transition-all cursor-pointer ${
              activeTool === 'eraser'
                ? 'bg-[#2B2B2B] text-white shadow-sm'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
            }`}
          >
            <Eraser className="w-3.5 h-3.5 mb-0.5" />
            <span>Erase Mask</span>
          </button>
        </div>
      </div>

      {/* Floor Texture Tool Options Panel */}
      {activeTool === 'floorTexture' && (
        <div className="bg-[var(--bg-tertiary)]/70 p-3 rounded-lg border border-[var(--border-secondary)] space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#B89970]" />
              Floor Texture Blend
            </span>
            <span className="text-[11px] font-mono font-medium text-[var(--text-secondary)]">
              {Math.round(floorTextureStrength * 100)}%
            </span>
          </div>

          <div>
            <input
              type="range"
              min="0"
              max="0.7"
              step="0.05"
              value={floorTextureStrength}
              onChange={(e) => dispatch({ type: 'SET_FLOOR_TEXTURE_STRENGTH', payload: { strength: parseFloat(e.target.value) } })}
              className="w-full accent-[#B89970] cursor-pointer h-1.5 bg-[var(--bg-secondary)] rounded-lg appearance-none"
            />
          </div>

          <p className="text-[11px] text-[var(--text-secondary)] leading-tight">
            Blends the floor's lighting and grain into the rug surface using multiply compositing. Only affects the rug area — furniture stays crisp.
          </p>
        </div>
      )}

      {/* Table Box Cutout Tool Options Panel */}
      {activeTool === 'box' && (
        <div className="bg-[var(--bg-tertiary)]/70 p-3 rounded-lg border border-[var(--border-secondary)] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-1.5">
              <Square className="w-3.5 h-3.5 text-[#B89970]" />
              Rectangular Foreground Mask
            </span>
            <button
              type="button"
              onClick={onClearMask}
              className="text-[11px] font-medium text-red-600 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3 h-3" />
              Clear
            </button>
          </div>

          <p className="text-[11px] text-[var(--text-secondary)] leading-tight">
            Drag a rectangle over furniture to bring it above the rug. The selected area will render on top.
          </p>
        </div>
      )}

      {/* Magic Wand Tool Options Panel */}
      {activeTool === 'wand' && (
        <div className="bg-[var(--bg-tertiary)]/70 p-3 rounded-lg border border-[var(--border-secondary)] space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-1.5">
              <Wand2 className="w-3.5 h-3.5 text-[#B89970]" />
              Magic Wand Select
            </span>
            <button
              type="button"
              onClick={onClearMask}
              className="text-[11px] font-medium text-red-600 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3 h-3" />
              Clear
            </button>
          </div>

          <div>
            <div className="flex justify-between text-[11px] text-[var(--text-secondary)] mb-1">
              <span>Color Tolerance</span>
              <span className="font-mono">{wandTolerance}</span>
            </div>
            <input
              type="range"
              min="5"
              max="80"
              step="1"
              value={wandTolerance}
              onChange={(e) => dispatch({ type: 'SET_WAND_TOLERANCE', payload: { tolerance: parseInt(e.target.value, 10) } })}
              className="w-full accent-[#B89970] cursor-pointer h-1.5 bg-[var(--bg-secondary)] rounded-lg appearance-none"
            />
            <span className="text-[10px] text-[var(--text-muted)] block mt-1">
              Lower = stricter match. Higher = selects more similar colors.
            </span>
          </div>

          <div className="flex items-center justify-between gap-2 pt-1 border-t border-[var(--border-secondary)]">
            <label className="text-[11px] text-[var(--text-secondary)] font-medium cursor-pointer">
              Contiguous Fill Only
            </label>
            <button
              type="button"
              onClick={() => dispatch({ type: 'SET_WAND_CONTIGUOUS', payload: { contiguous: !wandContiguous } })}
              className={`inline-flex h-5 w-9 shrink-0 items-center rounded-full p-0.5 transition-colors cursor-pointer ${
                wandContiguous ? 'bg-[#B89970]' : 'bg-[var(--bg-tertiary)] border border-[var(--border-secondary)]'
              }`}
            >
              <span
                className={`h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
                  wandContiguous ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <p className="text-[11px] text-[var(--text-secondary)] leading-tight">
            {wandContiguous
              ? 'Click furniture to select connected region of similar color. Hold Alt to subtract.'
              : 'Click furniture to select ALL matching color pixels across the entire room. Hold Alt to subtract.'}
          </p>
        </div>
      )}

      {/* Paint Brush / Eraser Tool Options Panel */}
      {(activeTool === 'brush' || activeTool === 'eraser') && (
        <div className="bg-[var(--bg-tertiary)]/70 p-3 rounded-lg border border-[var(--border-secondary)] space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-1.5">
              {activeTool === 'brush' ? <Paintbrush className="w-3.5 h-3.5 text-[#B89970]" /> : <Eraser className="w-3.5 h-3.5 text-red-500" />}
              {activeTool === 'brush' ? 'Foreground Paint Brush' : 'Erase Foreground Mask'}
            </span>
            <button
              type="button"
              onClick={onClearMask}
              className="text-[11px] font-medium text-red-600 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3 h-3" />
              Clear
            </button>
          </div>

          <div>
            <div className="flex justify-between text-[11px] text-[var(--text-secondary)] mb-1">
              <span>Brush Diameter</span>
              <span className="font-mono">{brushSize}px</span>
            </div>
            <input
              type="range"
              min="10"
              max="90"
              step="5"
              value={brushSize}
              onChange={(e) => dispatch({ type: 'SET_BRUSH_SIZE', payload: { size: parseInt(e.target.value, 10) } })}
              className="w-full accent-[#B89970] cursor-pointer h-1.5 bg-[var(--bg-secondary)] rounded-lg appearance-none"
            />
          </div>

          <div>
            <div className="flex justify-between text-[11px] text-[var(--text-secondary)] mb-1">
              <span>Edge Hardness</span>
              <span className="font-mono">{brushHardness}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={brushHardness}
              onChange={(e) => dispatch({ type: 'SET_BRUSH_HARDNESS', payload: { hardness: parseInt(e.target.value, 10) } })}
              className="w-full accent-[#B89970] cursor-pointer h-1.5 bg-[var(--bg-secondary)] rounded-lg appearance-none"
            />
            <span className="text-[10px] text-[var(--text-muted)] block mt-1">
              0% = soft feathered edges · 100% = hard pixel edges
            </span>
          </div>

          {activeTool === 'brush' && (
            <div className="flex items-center justify-between pt-1 border-t border-[var(--border-secondary)]">
              <label className="flex items-center gap-1.5 text-[11px] text-[var(--text-secondary)] font-medium cursor-pointer">
                <Magnet className="w-3.5 h-3.5 text-[#B89970]" />
                Edge Snap
              </label>
              <button
                type="button"
                onClick={() => dispatch({ type: 'SET_EDGE_SNAP', payload: { enabled: !edgeSnap } })}
                className={`inline-flex h-5 w-9 shrink-0 items-center rounded-full p-0.5 transition-colors cursor-pointer ${
                  edgeSnap ? 'bg-[#B89970]' : 'bg-[var(--bg-tertiary)] border border-[var(--border-secondary)]'
                }`}
              >
                <span
                  className={`h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
                    edgeSnap ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Mask Management Options (visible for brush, wand, eraser, box) */}
      {(activeTool === 'brush' || activeTool === 'eraser' || activeTool === 'wand' || activeTool === 'box') && (
        <div className="bg-[var(--bg-tertiary)]/70 p-3 rounded-lg border border-[var(--border-secondary)] space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[var(--text-primary)] uppercase tracking-wider">
              Mask Options
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={onUndo}
                disabled={!canUndo}
                title="Undo (Ctrl+Z)"
                className={`p-1.5 rounded transition-colors ${
                  canUndo
                    ? 'text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] cursor-pointer'
                    : 'text-[var(--text-muted)] cursor-not-allowed opacity-40'
                }`}
              >
                <Undo2 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={onRedo}
                disabled={!canRedo}
                title="Redo (Ctrl+Shift+Z)"
                className={`p-1.5 rounded transition-colors ${
                  canRedo
                    ? 'text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] cursor-pointer'
                    : 'text-[var(--text-muted)] cursor-not-allowed opacity-40'
                }`}
              >
                <Redo2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2">
            <label className="flex items-center gap-1.5 text-[11px] text-[var(--text-secondary)] font-medium cursor-pointer">
              {showMaskPreview ? <Eye className="w-3.5 h-3.5 text-[#B89970]" /> : <EyeOff className="w-3.5 h-3.5" />}
              Show Mask Preview
            </label>
            <button
              type="button"
              onClick={() => dispatch({ type: 'SET_SHOW_MASK_PREVIEW', payload: { enabled: !showMaskPreview } })}
              className={`inline-flex h-5 w-9 shrink-0 items-center rounded-full p-0.5 transition-colors cursor-pointer ${
                showMaskPreview ? 'bg-[#B89970]' : 'bg-[var(--bg-tertiary)] border border-[var(--border-secondary)]'
              }`}
            >
              <span
                className={`h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
                  showMaskPreview ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between gap-2">
            <label className="flex items-center gap-1.5 text-[11px] text-[var(--text-secondary)] font-medium cursor-pointer">
              <Lock className="w-3.5 h-3.5" />
              Preserve on Room Switch
            </label>
            <button
              type="button"
              onClick={() => dispatch({ type: 'SET_PRESERVE_MASK', payload: { enabled: !preserveMask } })}
              className={`inline-flex h-5 w-9 shrink-0 items-center rounded-full p-0.5 transition-colors cursor-pointer ${
                preserveMask ? 'bg-[#B89970]' : 'bg-[var(--bg-tertiary)] border border-[var(--border-secondary)]'
              }`}
            >
              <span
                className={`h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
                  preserveMask ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <p className="text-[10px] text-[var(--text-muted)] leading-tight border-t border-[var(--border-secondary)] pt-2">
            Ctrl+Z to undo · Ctrl+Shift+Z to redo
          </p>
        </div>
      )}

      {/* 3. Floor Alignment Presets */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-semibold text-[var(--text-primary)] uppercase tracking-wider">
            3. Perspective Presets
          </label>
          <button
            onClick={handleResetQuad}
            className="inline-flex items-center space-x-1 text-[11px] text-[#B89970] hover:underline font-medium cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Quad</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-1.5">
          <button
            type="button"
            onClick={() => handleApplyPreset('center')}
            className="flex items-center space-x-2 rounded-md border border-[var(--border-secondary)] bg-[var(--bg-secondary)] px-3 py-2 text-xs font-medium text-[var(--text-primary)] hover:border-[var(--border-primary)] hover:bg-[var(--bg-tertiary)] transition-colors text-left cursor-pointer"
          >
            <Grid className="w-3.5 h-3.5 text-[#B89970]" />
            <span>Center Floor</span>
          </button>
          <button
            type="button"
            onClick={() => handleApplyPreset('wide')}
            className="flex items-center space-x-2 rounded-md border border-[var(--border-secondary)] bg-[var(--bg-secondary)] px-3 py-2 text-xs font-medium text-[var(--text-primary)] hover:border-[var(--border-primary)] hover:bg-[var(--bg-tertiary)] transition-colors text-left cursor-pointer"
          >
            <Move className="w-3.5 h-3.5 text-[#B89970]" />
            <span>Wide Area</span>
          </button>
          <button
            type="button"
            onClick={() => handleApplyPreset('deep')}
            className="flex items-center space-x-2 rounded-md border border-[var(--border-secondary)] bg-[var(--bg-secondary)] px-3 py-2 text-xs font-medium text-[var(--text-primary)] hover:border-[var(--border-primary)] hover:bg-[var(--bg-tertiary)] transition-colors text-left cursor-pointer"
          >
            <Compass className="w-3.5 h-3.5 text-[#B89970]" />
            <span>Deep Perspective</span>
          </button>
          <button
            type="button"
            onClick={() => handleApplyPreset('runner')}
            className="flex items-center space-x-2 rounded-md border border-[var(--border-secondary)] bg-[var(--bg-secondary)] px-3 py-2 text-xs font-medium text-[var(--text-primary)] hover:border-[var(--border-primary)] hover:bg-[var(--bg-tertiary)] transition-colors text-left cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5 text-[#B89970]" />
            <span>Hallway Runner</span>
          </button>
        </div>
      </div>

      {/* 4. Floor Lighting & Depth */}
      <div data-tour="lighting-controls">
        <label className="text-xs font-semibold text-[var(--text-primary)] uppercase tracking-wider block mb-1.5">
          4. Lighting & Shadows
        </label>
        <div className="space-y-3 bg-[var(--bg-secondary)] p-3 rounded-lg border border-[var(--border-secondary)]">
          <div>
            <div className="flex justify-between text-[11px] text-[var(--text-secondary)] mb-1 font-medium">
              <span>Rug Opacity</span>
              <span className="font-mono">{Math.round(opacity * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.3"
              max="1"
              step="0.05"
              value={opacity}
              onChange={(e) => dispatch({ type: 'SET_OPACITY', payload: { opacity: parseFloat(e.target.value) } })}
              className="w-full accent-[#B89970] cursor-pointer h-1.5 bg-[var(--bg-tertiary)] rounded-lg appearance-none"
            />
          </div>
          <div>
            <div className="flex justify-between text-[11px] text-[var(--text-secondary)] mb-1 font-medium">
              <span>Contact Floor Shadow</span>
              <span className="font-mono">{Math.round(shadowOpacity * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={shadowOpacity}
              onChange={(e) => dispatch({ type: 'SET_SHADOW_OPACITY', payload: { shadowOpacity: parseFloat(e.target.value) } })}
              className="w-full accent-[#B89970] cursor-pointer h-1.5 bg-[var(--bg-tertiary)] rounded-lg appearance-none"
            />
          </div>
        </div>
      </div>

      {/* Studio Action Buttons */}
      <div className="space-y-2 pt-2 border-t border-[var(--border-secondary)]">
        <button
          onClick={handleToggleBeforeAfter}
          type="button"
          className={`flex w-full items-center justify-center space-x-2 rounded-md border px-3 py-2 text-xs font-medium transition-colors cursor-pointer ${
            showOriginal
              ? 'border-amber-600 bg-amber-500/15 text-amber-800'
              : 'border-[var(--border-secondary)] bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:border-[var(--border-primary)]'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>{showOriginal ? 'Showing Before (Original)' : 'Toggle Compare View'}</span>
        </button>

        <button
          onClick={handleExportClick}
          type="button"
          className="flex w-full items-center justify-center space-x-2 rounded-md bg-[#A38A61] hover:bg-[#8F7752] px-3 py-2.5 text-xs font-semibold text-white shadow transition-colors cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Render PNG</span>
        </button>
      </div>
    </div>
  );
}
