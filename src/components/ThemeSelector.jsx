import React, { useRef, useEffect } from 'react';
import { useTaskContext, ACCENT_THEMES, THEME_MODES, SURFACE_STYLES } from '../context/TaskContext';
import {
  Sun,
  Moon,
  Sparkles,
  Laptop,
  Palette,
  Check,
  RotateCcw,
  X,
  Layers,
  CheckCircle2,
  Clock
} from 'lucide-react';

export const ThemeSelector = ({ isOpen, onClose }) => {
  const {
    themeConfig,
    resolvedMode,
    setThemeMode,
    setAccentColor,
    setSurfaceStyle,
    resetThemeSettings,
  } = useTaskContext();

  const popoverRef = useRef(null);

  // Close on click outside or escape key
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        onClose();
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getModeIcon = (modeId) => {
    switch (modeId) {
      case 'light':
        return <Sun className="w-4 h-4 text-amber-500" />;
      case 'dark':
        return <Moon className="w-4 h-4 text-indigo-400" />;
      case 'oled':
        return <Sparkles className="w-4 h-4 text-purple-400" />;
      case 'system':
        return <Laptop className="w-4 h-4 text-slate-400" />;
      default:
        return <Sun className="w-4 h-4" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center sm:justify-end p-4 sm:p-6 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        ref={popoverRef}
        className="w-full max-w-md sm:mt-14 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl shadow-slate-900/20 overflow-hidden transform transition-all duration-200 animate-in zoom-in-95"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-theme-light text-theme-primary">
              <Palette className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Theme & Appearance
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Customize appearance, accent palettes, and surfaces
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-5 max-h-[80vh] overflow-y-auto">
          
          {/* 1. Appearance Mode */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <span>Color Mode</span>
              </label>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 capitalize">
                Active: {themeConfig.mode === 'system' ? `Auto (${resolvedMode})` : themeConfig.mode}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {THEME_MODES.map((mode) => {
                const isActive = themeConfig.mode === mode.id;
                return (
                  <button
                    key={mode.id}
                    onClick={() => setThemeMode(mode.id)}
                    className={`flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-xl border text-xs font-semibold transition-all duration-150 ${
                      isActive
                        ? 'border-theme-primary bg-theme-light text-theme-primary shadow-xs ring-1 ring-theme-primary'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    {getModeIcon(mode.id)}
                    <span>{mode.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Accent Color Palette */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <span>Accent Color</span>
              </label>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                {ACCENT_THEMES.find(t => t.id === themeConfig.accent)?.name || 'Electric Indigo'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {ACCENT_THEMES.map((palette) => {
                const isSelected = themeConfig.accent === palette.id;
                return (
                  <button
                    key={palette.id}
                    onClick={() => setAccentColor(palette.id)}
                    className={`group relative flex items-center gap-2.5 p-2.5 rounded-xl border text-left transition-all duration-150 ${
                      isSelected
                        ? 'border-slate-900 dark:border-slate-100 bg-slate-100/80 dark:bg-slate-800/80 shadow-xs'
                        : 'border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30'
                    }`}
                  >
                    <span
                      className="w-4 h-4 rounded-full shrink-0 shadow-xs flex items-center justify-center"
                      style={{ backgroundColor: palette.color }}
                    >
                      {isSelected && <Check className="w-2.5 h-2.5 text-white stroke-[3]" />}
                    </span>
                    <span className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate">
                      {palette.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Surface Background Texture */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-slate-400" />
                <span>Background Surface</span>
              </label>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {SURFACE_STYLES.map((style) => {
                const isActive = themeConfig.surface === style.id;
                return (
                  <button
                    key={style.id}
                    onClick={() => setSurfaceStyle(style.id)}
                    className={`flex flex-col items-start p-2.5 rounded-xl border text-left transition-all duration-150 ${
                      isActive
                        ? 'border-theme-primary bg-theme-light text-theme-primary ring-1 ring-theme-primary'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span className="text-xs font-bold">{style.name}</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                      {style.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Live Mini Preview */}
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Live Theme Preview
            </label>
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/60 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-theme-primary"></div>
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    Product Roadmap Sprint #4
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-theme-light text-theme-primary border border-theme-light">
                  Active Theme
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Due Tomorrow
                </span>
                <span className="flex items-center gap-1 text-emerald-500">
                  <CheckCircle2 className="w-3 h-3" /> 8/10 Tasks
                </span>
              </div>
              <div className="pt-1 flex gap-2">
                <button className="flex-1 py-1.5 rounded-lg bg-theme-primary text-white text-xs font-semibold shadow-xs hover:opacity-90 transition-opacity">
                  Primary Action
                </button>
                <button className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium">
                  Cancel
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 flex items-center justify-between">
          <button
            onClick={resetThemeSettings}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors font-medium"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-theme-primary text-white text-xs font-semibold rounded-lg hover:opacity-95 transition-opacity shadow-xs"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
