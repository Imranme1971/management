import React, { useState, useEffect } from 'react';
import { useTaskContext } from '../context/TaskContext';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  Timer,
  Flame
} from 'lucide-react';

export const PomodoroModal = () => {
  const {
    isPomodoroOpen,
    setIsPomodoroOpen,
    pomodoroTask,
    tasks,
    logFocusTime,
    showToast
  } = useTaskContext();

  const [mode, setMode] = useState('work'); // 'work' | 'short_break' | 'long_break'
  const [selectedTaskId, setSelectedTaskId] = useState('');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);

  const MODE_TIMES = {
    work: 25 * 60,
    short_break: 5 * 60,
    long_break: 15 * 60
  };

  useEffect(() => {
    if (pomodoroTask) {
      setSelectedTaskId(pomodoroTask.id);
    } else if (tasks.length > 0) {
      setSelectedTaskId(tasks[0].id);
    }
  }, [pomodoroTask, tasks]);

  // Mode change handler
  const handleModeChange = (newMode) => {
    setMode(newMode);
    setIsRunning(false);
    setTimeLeft(MODE_TIMES[newMode]);
  };

  // Timer countdown effect
  useEffect(() => {
    let timer = null;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      setIsRunning(false);
      if (mode === 'work' && selectedTaskId) {
        logFocusTime(selectedTaskId, 25);
        showToast('Pomodoro session completed! 25 minutes logged.', 'success');
      } else {
        showToast('Break session completed!', 'info');
      }
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, mode, selectedTaskId, logFocusTime, showToast]);

  if (!isPomodoroOpen) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(MODE_TIMES[mode]);
  };

  const handleManualLog = () => {
    if (selectedTaskId) {
      logFocusTime(selectedTaskId, 25);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div
        className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-md overflow-hidden text-center p-6 space-y-6"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-theme-primary font-bold text-sm">
            <Timer className="w-5 h-5" />
            <span>Focus Pomodoro Timer</span>
          </div>
          <button
            onClick={() => setIsPomodoroOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Switcher */}
        <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl">
          <button
            onClick={() => handleModeChange('work')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
              mode === 'work'
                ? 'bg-theme-primary text-white shadow-md shadow-theme-glow'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Work (25m)
          </button>
          <button
            onClick={() => handleModeChange('short_break')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
              mode === 'short_break'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Short Break (5m)
          </button>
          <button
            onClick={() => handleModeChange('long_break')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
              mode === 'long_break'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Long Break (15m)
          </button>
        </div>

        {/* Active Task Selector */}
        <div className="text-left">
          <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Focus Task Target
          </label>
          <select
            value={selectedTaskId}
            onChange={e => setSelectedTaskId(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 font-medium focus:outline-none focus:ring-2 focus:ring-theme-primary"
          >
            {tasks.map(t => (
              <option key={t.id} value={t.id}>
                {t.title} ({t.spentTime || 0}m logged)
              </option>
            ))}
          </select>
        </div>

        {/* Digital Clock Display */}
        <div className="py-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 relative">
          <div className="text-6xl font-extrabold font-mono tracking-tighter text-slate-900 dark:text-slate-100">
            {formattedTime}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">
            {isRunning ? '🔥 Focus Mode active...' : 'Paused'}
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm text-white shadow-lg transition-all transform hover:scale-105 ${
              isRunning
                ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/30'
                : 'bg-theme-primary hover:bg-theme-primary-hover shadow-theme-glow'
            }`}
          >
            {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
            <span>{isRunning ? 'Pause' : 'Start Focus'}</span>
          </button>

          <button
            onClick={resetTimer}
            className="p-3 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-2xl transition-colors"
            title="Reset timer"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Log Button */}
        <button
          onClick={handleManualLog}
          className="text-xs text-theme-primary font-semibold hover:underline flex items-center justify-center gap-1 mx-auto"
        >
          <Flame className="w-3.5 h-3.5" /> + Quick Log 25m Focus Time
        </button>

      </div>
    </div>
  );
};
