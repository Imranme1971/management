import React, { useState, useEffect } from 'react';
import { useTaskContext } from '../context/TaskContext';
import {
  X,
  Calculator,
  History,
  Trash2,
  Copy,
  Clock,
  Zap,
  Percent,
  DollarSign,
  Calendar,
  Delete,
  ArrowRightLeft
} from 'lucide-react';

export const CalculatorModal = () => {
  const {
    isCalculatorOpen,
    setIsCalculatorOpen,
    showToast
  } = useTaskContext();

  // Active Tab: 'calc' | 'productivity' | 'history'
  const [activeTab, setActiveTab] = useState('calc');

  // Calculator State
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('0');
  const [justCalculated, setJustCalculated] = useState(false);
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('imran_khan_calc_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Time & Productivity Helper State
  const [timeInputHours, setTimeInputHours] = useState('');
  const [timeInputMinutes, setTimeInputMinutes] = useState('');
  const [hourlyRate, setHourlyRate] = useState('50');
  const [estHours, setEstHours] = useState('10');
  const [bufferHours, setBufferHours] = useState('10');
  const [bufferPercent, setBufferPercent] = useState('25');
  const [sprintTotalHours, setSprintTotalHours] = useState('40');
  const [sprintDays, setSprintDays] = useState('5');

  // Sync History to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('imran_khan_calc_history', JSON.stringify(history));
    } catch (e) {
      console.error(e);
    }
  }, [history]);

  // Safe Math Expression Evaluator
  const evaluateMath = (expr) => {
    if (!expr || !expr.trim()) return 0;
    try {
      // Normalize operators: × -> *, ÷ -> /, √ -> Math.sqrt, ^ -> **
      let sanitized = expr
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/π/g, `${Math.PI}`)
        .replace(/e/g, `${Math.E}`);

      // Handle square roots: √(number or expression)
      sanitized = sanitized.replace(/√\(([^)]+)\)/g, 'Math.sqrt($1)');
      sanitized = sanitized.replace(/√(\d+(\.\d+)?)/g, 'Math.sqrt($1)');

      // Handle exponents: ^ -> **
      sanitized = sanitized.replace(/\^/g, '**');

      // Security validation: only allow numbers, math operators, parentheses, Math.* functions
      if (!/^[\d\s+\-*/%.,()Math.sqrtPIE**]+$/.test(sanitized)) {
        return 'Error';
      }

      // Evaluate safely via Function constructor with sandbox math
      // eslint-disable-next-line no-new-func
      const evalFn = new Function('Math', `"use strict"; return (${sanitized});`);
      const val = evalFn(Math);

      if (typeof val !== 'number' || !isFinite(val) || isNaN(val)) {
        return 'Error';
      }

      // Clean float precision
      const rounded = Number(val.toFixed(8));
      return String(rounded);
    } catch {
      return 'Error';
    }
  };

  // Live preview evaluation
  const previewResult = () => {
    if (!expression.trim()) return '';
    const evaluated = evaluateMath(expression);
    return evaluated === 'Error' ? '' : evaluated;
  };

  // Button handlers
  const handleInput = (val) => {
    if (justCalculated) {
      // If pressing an operator after calculation, continue with previous result
      if (['+', '-', '×', '÷', '%', '^'].includes(val)) {
        setExpression(result + val);
      } else {
        setExpression(val);
      }
      setJustCalculated(false);
      return;
    }

    setExpression((prev) => prev + val);
  };

  const handleClear = () => {
    setExpression('');
    setResult('0');
    setJustCalculated(false);
  };

  const handleBackspace = () => {
    if (justCalculated) {
      handleClear();
      return;
    }
    setExpression((prev) => prev.slice(0, -1));
  };

  const handleCalculate = () => {
    if (!expression.trim()) return;
    const finalResult = evaluateMath(expression);
    if (finalResult === 'Error') {
      setResult('Error');
      showToast('Invalid Math Expression', 'warning');
      return;
    }

    setResult(finalResult);
    setJustCalculated(true);

    // Add to history
    const newEntry = {
      id: `calc-${Date.now()}`,
      expression,
      result: finalResult,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setHistory((prev) => [newEntry, ...prev.slice(0, 29)]);
  };

  const handleToggleSign = () => {
    if (!expression) {
      if (result !== '0' && result !== 'Error') {
        const negated = String(-Number(result));
        setResult(negated);
        setExpression(negated);
      }
      return;
    }
    if (expression.startsWith('-')) {
      setExpression(expression.slice(1));
    } else {
      setExpression('-' + expression);
    }
  };

  const handleSqrt = () => {
    if (justCalculated && result !== '0' && result !== 'Error') {
      setExpression(`√(${result})`);
      setJustCalculated(false);
    } else {
      setExpression((prev) => prev + '√(');
    }
  };

  const handleCopyResult = (valToCopy = result) => {
    if (!valToCopy || valToCopy === 'Error') return;
    navigator.clipboard.writeText(valToCopy);
    showToast(`Copied ${valToCopy} to clipboard!`, 'success');
  };

  const handleRestoreHistory = (entry) => {
    setExpression(entry.expression);
    setResult(entry.result);
    setJustCalculated(true);
    setActiveTab('calc');
    showToast('Loaded calculation into display', 'info');
  };

  const handleClearHistory = () => {
    setHistory([]);
    showToast('Calculation history cleared', 'info');
  };

  // Keyboard Event Listener
  useEffect(() => {
    if (!isCalculatorOpen) return;

    const handleKeyDown = (e) => {
      // Don't intercept typing in inputs or textareas (e.g. within productivity tab)
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) {
        if (e.key === 'Escape') {
          setIsCalculatorOpen(false);
        }
        return;
      }

      if (e.key >= '0' && e.key <= '9') {
        e.preventDefault();
        handleInput(e.key);
      } else if (e.key === '.') {
        e.preventDefault();
        handleInput('.');
      } else if (e.key === '+') {
        e.preventDefault();
        handleInput('+');
      } else if (e.key === '-') {
        e.preventDefault();
        handleInput('-');
      } else if (e.key === '*') {
        e.preventDefault();
        handleInput('×');
      } else if (e.key === '/') {
        e.preventDefault();
        handleInput('÷');
      } else if (e.key === '%') {
        e.preventDefault();
        handleInput('%');
      } else if (e.key === '(' || e.key === ')') {
        e.preventDefault();
        handleInput(e.key);
      } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        handleCalculate();
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        handleBackspace();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setIsCalculatorOpen(false);
      } else if (e.key.toLowerCase() === 'c') {
        e.preventDefault();
        handleClear();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  if (!isCalculatorOpen) return null;

  // Productivity Helpers Calculations
  const calcMinsFromHours = parseFloat(timeInputHours) ? (parseFloat(timeInputHours) * 60).toFixed(1) : '0';
  const calcHoursFromMins = parseFloat(timeInputMinutes)
    ? `${Math.floor(parseFloat(timeInputMinutes) / 60)}h ${Math.round(parseFloat(timeInputMinutes) % 60)}m (${(parseFloat(timeInputMinutes) / 60).toFixed(2)} hrs)`
    : '0h 0m';

  const totalBillable = (parseFloat(hourlyRate || 0) * parseFloat(estHours || 0)).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD'
  });

  const bufferedEstimate = (
    parseFloat(bufferHours || 0) * (1 + parseFloat(bufferPercent || 0) / 100)
  ).toFixed(1);

  const dailyFocusGoal = (
    parseFloat(sprintTotalHours || 0) / Math.max(1, parseFloat(sprintDays || 1))
  ).toFixed(1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div
        className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-md overflow-hidden flex flex-col transition-all duration-200 max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-theme-light text-theme-primary flex items-center justify-center border border-theme-light">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Calculator & Time Tools
              </h2>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                Keyboard shortcuts enabled (0-9, +, -, *, /, Enter)
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsCalculatorOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Close calculator (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center p-1.5 mx-4 mt-3 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200/60 dark:border-slate-700/60">
          <button
            onClick={() => setActiveTab('calc')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'calc'
                ? 'bg-white dark:bg-slate-700 text-theme-primary shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>Keypad</span>
          </button>

          <button
            onClick={() => setActiveTab('productivity')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'productivity'
                ? 'bg-white dark:bg-slate-700 text-theme-primary shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Time & Estimates</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-xl text-xs font-semibold transition-all relative ${
              activeTab === 'history'
                ? 'bg-white dark:bg-slate-700 text-theme-primary shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>History</span>
            {history.length > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 text-[9px] bg-theme-primary text-white rounded-full font-bold">
                {history.length}
              </span>
            )}
          </button>
        </div>

        {/* Tab 1: Standard Keypad Calculator */}
        {activeTab === 'calc' && (
          <div className="p-4 space-y-3.5 overflow-y-auto">
            {/* Display Screen */}
            <div className="p-4 bg-slate-900 dark:bg-slate-950 text-white rounded-2xl border border-slate-800 shadow-inner relative group">
              {/* Formula & Live Preview */}
              <div className="h-6 flex items-center justify-between text-xs text-slate-400 font-mono overflow-x-auto">
                <span className="truncate">{expression || '0'}</span>
                {previewResult() && (
                  <span className="text-theme-primary font-bold shrink-0 ml-2">
                    ≈ {previewResult()}
                  </span>
                )}
              </div>

              {/* Main Result Display */}
              <div className="flex items-baseline justify-between mt-1 gap-2">
                <div className="text-3xl sm:text-4xl font-extrabold font-mono tracking-tight text-white overflow-x-auto select-all">
                  {result}
                </div>
                <button
                  onClick={() => handleCopyResult(result)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shrink-0"
                  title="Copy result"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Scientific / Extra Utility Row */}
            <div className="grid grid-cols-5 gap-2">
              <button
                onClick={handleClear}
                className="py-2.5 rounded-xl font-bold text-xs bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 active:scale-95 transition-all"
                title="All Clear (AC)"
              >
                AC
              </button>
              <button
                onClick={handleBackspace}
                className="py-2.5 rounded-xl font-bold text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 transition-all flex items-center justify-center"
                title="Backspace (⌫)"
              >
                <Delete className="w-4 h-4" />
              </button>
              <button
                onClick={handleToggleSign}
                className="py-2.5 rounded-xl font-bold text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 transition-all"
                title="Toggle Sign (+/-)"
              >
                ±
              </button>
              <button
                onClick={handleSqrt}
                className="py-2.5 rounded-xl font-bold text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 transition-all font-mono"
                title="Square Root (√)"
              >
                √
              </button>
              <button
                onClick={() => handleInput('^')}
                className="py-2.5 rounded-xl font-bold text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 transition-all font-mono"
                title="Power (x^y)"
              >
                xʸ
              </button>
            </div>

            {/* Standard Keypad Grid */}
            <div className="grid grid-cols-4 gap-2">
              {/* Row 1 */}
              <button
                onClick={() => handleInput('(')}
                className="py-3 rounded-xl font-semibold text-sm bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 transition-all"
              >
                (
              </button>
              <button
                onClick={() => handleInput(')')}
                className="py-3 rounded-xl font-semibold text-sm bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 transition-all"
              >
                )
              </button>
              <button
                onClick={() => handleInput('%')}
                className="py-3 rounded-xl font-semibold text-sm bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 transition-all"
              >
                %
              </button>
              <button
                onClick={() => handleInput('÷')}
                className="py-3 rounded-xl font-bold text-base bg-theme-light text-theme-primary border border-theme-light hover:brightness-110 active:scale-95 transition-all"
              >
                ÷
              </button>

              {/* Row 2 */}
              <button
                onClick={() => handleInput('7')}
                className="py-3 rounded-xl font-semibold text-base bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 transition-all shadow-sm border border-slate-200/50 dark:border-slate-700/50"
              >
                7
              </button>
              <button
                onClick={() => handleInput('8')}
                className="py-3 rounded-xl font-semibold text-base bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 transition-all shadow-sm border border-slate-200/50 dark:border-slate-700/50"
              >
                8
              </button>
              <button
                onClick={() => handleInput('9')}
                className="py-3 rounded-xl font-semibold text-base bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 transition-all shadow-sm border border-slate-200/50 dark:border-slate-700/50"
              >
                9
              </button>
              <button
                onClick={() => handleInput('×')}
                className="py-3 rounded-xl font-bold text-base bg-theme-light text-theme-primary border border-theme-light hover:brightness-110 active:scale-95 transition-all"
              >
                ×
              </button>

              {/* Row 3 */}
              <button
                onClick={() => handleInput('4')}
                className="py-3 rounded-xl font-semibold text-base bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 transition-all shadow-sm border border-slate-200/50 dark:border-slate-700/50"
              >
                4
              </button>
              <button
                onClick={() => handleInput('5')}
                className="py-3 rounded-xl font-semibold text-base bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 transition-all shadow-sm border border-slate-200/50 dark:border-slate-700/50"
              >
                5
              </button>
              <button
                onClick={() => handleInput('6')}
                className="py-3 rounded-xl font-semibold text-base bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 transition-all shadow-sm border border-slate-200/50 dark:border-slate-700/50"
              >
                6
              </button>
              <button
                onClick={() => handleInput('-')}
                className="py-3 rounded-xl font-bold text-base bg-theme-light text-theme-primary border border-theme-light hover:brightness-110 active:scale-95 transition-all"
              >
                -
              </button>

              {/* Row 4 */}
              <button
                onClick={() => handleInput('1')}
                className="py-3 rounded-xl font-semibold text-base bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 transition-all shadow-sm border border-slate-200/50 dark:border-slate-700/50"
              >
                1
              </button>
              <button
                onClick={() => handleInput('2')}
                className="py-3 rounded-xl font-semibold text-base bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 transition-all shadow-sm border border-slate-200/50 dark:border-slate-700/50"
              >
                2
              </button>
              <button
                onClick={() => handleInput('3')}
                className="py-3 rounded-xl font-semibold text-base bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 transition-all shadow-sm border border-slate-200/50 dark:border-slate-700/50"
              >
                3
              </button>
              <button
                onClick={() => handleInput('+')}
                className="py-3 rounded-xl font-bold text-base bg-theme-light text-theme-primary border border-theme-light hover:brightness-110 active:scale-95 transition-all"
              >
                +
              </button>

              {/* Row 5 */}
              <button
                onClick={() => handleInput('0')}
                className="col-span-2 py-3 rounded-xl font-semibold text-base bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 transition-all shadow-sm border border-slate-200/50 dark:border-slate-700/50"
              >
                0
              </button>
              <button
                onClick={() => handleInput('.')}
                className="py-3 rounded-xl font-semibold text-base bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 transition-all shadow-sm border border-slate-200/50 dark:border-slate-700/50"
              >
                .
              </button>
              <button
                onClick={handleCalculate}
                className="py-3 rounded-xl font-extrabold text-lg bg-theme-primary hover:bg-theme-primary-hover text-white shadow-lg shadow-theme-glow active:scale-95 transition-all"
              >
                =
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Time & Estimates Productivity Helpers */}
        {activeTab === 'productivity' && (
          <div className="p-4 space-y-4 overflow-y-auto max-h-[60vh]">
            
            {/* Tool 1: Hours to Minutes Converter */}
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/70 dark:border-slate-700/70 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-slate-100">
                <Clock className="w-4 h-4 text-theme-primary" />
                <span>Task Time Converter</span>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                    Hours → Minutes
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.25"
                      placeholder="e.g. 2.5"
                      value={timeInputHours}
                      onChange={(e) => setTimeInputHours(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono focus:outline-none focus:ring-1 focus:ring-theme-primary"
                    />
                  </div>
                  <p className="text-[11px] font-bold text-theme-primary mt-1">
                    = {calcMinsFromHours} mins
                  </p>
                </div>

                <div>
                  <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                    Minutes → Hours
                  </label>
                  <input
                    type="number"
                    step="5"
                    placeholder="e.g. 90"
                    value={timeInputMinutes}
                    onChange={(e) => setTimeInputMinutes(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono focus:outline-none focus:ring-1 focus:ring-theme-primary"
                  />
                  <p className="text-[11px] font-bold text-theme-primary mt-1 truncate">
                    = {calcHoursFromMins}
                  </p>
                </div>
              </div>
            </div>

            {/* Tool 2: Buffer / Risk Multiplier */}
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/70 dark:border-slate-700/70 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-slate-100">
                  <Percent className="w-4 h-4 text-amber-500" />
                  <span>Estimation Buffer Multiplier</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold rounded-full">
                  Realistic Planning
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[10px] font-semibold text-slate-500 block mb-1">
                    Base Est. Hours
                  </label>
                  <input
                    type="number"
                    value={bufferHours}
                    onChange={(e) => setBufferHours(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono focus:outline-none focus:ring-1 focus:ring-theme-primary"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-slate-500 block mb-1">
                    Buffer Added (%)
                  </label>
                  <div className="flex gap-1">
                    {['15', '25', '50'].map((p) => (
                      <button
                        key={p}
                        onClick={() => setBufferPercent(p)}
                        className={`flex-1 py-1 text-[10px] font-bold rounded-md transition-all ${
                          bufferPercent === p
                            ? 'bg-amber-500 text-white'
                            : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        +{p}%
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="pt-1 flex items-center justify-between text-xs border-t border-slate-200/50 dark:border-slate-700/50">
                <span className="text-slate-500">Buffered Estimate:</span>
                <span className="font-extrabold text-amber-600 dark:text-amber-400 font-mono">
                  {bufferedEstimate} hours
                </span>
              </div>
            </div>

            {/* Tool 3: Billable Rate Calculator */}
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/70 dark:border-slate-700/70 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-slate-100">
                <DollarSign className="w-4 h-4 text-emerald-500" />
                <span>Billable Task Cost Estimator</span>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[10px] font-semibold text-slate-500 block mb-1">
                    Hours Worked
                  </label>
                  <input
                    type="number"
                    value={estHours}
                    onChange={(e) => setEstHours(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono focus:outline-none focus:ring-1 focus:ring-theme-primary"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-slate-500 block mb-1">
                    Rate ($ / Hour)
                  </label>
                  <input
                    type="number"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono focus:outline-none focus:ring-1 focus:ring-theme-primary"
                  />
                </div>
              </div>
              <div className="pt-1 flex items-center justify-between text-xs border-t border-slate-200/50 dark:border-slate-700/50">
                <span className="text-slate-500">Total Project Value:</span>
                <span className="font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                  {totalBillable}
                </span>
              </div>
            </div>

            {/* Tool 4: Daily Workload Splitter */}
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/70 dark:border-slate-700/70 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-slate-100">
                <Calendar className="w-4 h-4 text-cyan-500" />
                <span>Daily Sprint Pace Splitter</span>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[10px] font-semibold text-slate-500 block mb-1">
                    Total Sprint Hours
                  </label>
                  <input
                    type="number"
                    value={sprintTotalHours}
                    onChange={(e) => setSprintTotalHours(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono focus:outline-none focus:ring-1 focus:ring-theme-primary"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-slate-500 block mb-1">
                    Working Days
                  </label>
                  <input
                    type="number"
                    value={sprintDays}
                    onChange={(e) => setSprintDays(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono focus:outline-none focus:ring-1 focus:ring-theme-primary"
                  />
                </div>
              </div>
              <div className="pt-1 flex items-center justify-between text-xs border-t border-slate-200/50 dark:border-slate-700/50">
                <span className="text-slate-500">Target Pace / Day:</span>
                <span className="font-extrabold text-cyan-600 dark:text-cyan-400 font-mono">
                  {dailyFocusGoal} hrs / day
                </span>
              </div>
            </div>

          </div>
        )}

        {/* Tab 3: History Tape */}
        {activeTab === 'history' && (
          <div className="p-4 space-y-3 overflow-y-auto max-h-[60vh]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Calculation History ({history.length})
              </span>
              {history.length > 0 && (
                <button
                  onClick={handleClearHistory}
                  className="flex items-center gap-1 text-[11px] text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 font-medium"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Clear All
                </button>
              )}
            </div>

            {history.length === 0 ? (
              <div className="text-center py-10 space-y-2">
                <History className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto" />
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  No calculations yet.
                </p>
                <p className="text-[11px] text-slate-400 dark:text-slate-500">
                  Calculations performed on the keypad will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {history.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/70 dark:border-slate-700/70 flex items-center justify-between hover:border-theme-primary/50 transition-colors group"
                  >
                    <div className="space-y-0.5 overflow-hidden pr-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-400 font-mono">
                          {item.timestamp}
                        </span>
                        <span className="text-xs text-slate-600 dark:text-slate-400 font-mono truncate">
                          {item.expression}
                        </span>
                      </div>
                      <div className="text-base font-bold text-slate-900 dark:text-slate-100 font-mono">
                        = {item.result}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleCopyResult(item.result)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                        title="Copy result"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleRestoreHistory(item)}
                        className="p-1.5 text-theme-primary hover:bg-theme-light rounded-lg transition-colors text-xs font-semibold flex items-center gap-1"
                        title="Load into keypad"
                      >
                        <ArrowRightLeft className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Use</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Footer info bar */}
        <div className="px-5 py-2.5 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <span>Tip: Press <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-800 rounded font-mono text-[10px] text-slate-700 dark:text-slate-300">Esc</kbd> to close</span>
          <button
            onClick={() => setIsCalculatorOpen(false)}
            className="text-xs font-semibold text-theme-primary hover:underline"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
