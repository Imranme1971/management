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
  ArrowRightLeft,
  Palette,
  Volume2,
  VolumeX,
  CheckCircle2,
  Sparkles,
  HeartPulse,
  Scale,
  Flame,
  Activity,
  BookmarkPlus
} from 'lucide-react';

// Dedicated themes exclusively for the Calculator
export const CALC_THEMES = [
  {
    id: 'app-sync',
    name: 'App Synchronized',
    desc: 'Matches the global workspace theme and dark/light mode',
    badge: 'System',
    color: '#6366f1',
    gradient: 'from-indigo-500 to-purple-500',
    type: 'dynamic'
  },
  {
    id: 'cyberpunk',
    name: 'Cyber Neon Synth',
    desc: 'Glowing cyan digits, synthwave fuchsia keys & dark matrix',
    badge: 'Cyberpunk',
    color: '#d946ef',
    gradient: 'from-fuchsia-500 to-cyan-500',
    type: 'custom'
  },
  {
    id: 'retro-casio',
    name: 'Retro Casio 90s',
    desc: 'Classic vintage beige casing with olive LCD screen and orange AC',
    badge: 'Vintage',
    color: '#788d74',
    gradient: 'from-[#d8d3c5] to-[#788d74]',
    type: 'custom'
  },
  {
    id: 'matrix-hacker',
    name: 'Matrix Terminal',
    desc: 'Deep terminal black with luminous phosphor green glow',
    badge: 'Hacker',
    color: '#00ff66',
    gradient: 'from-[#00ff66] to-[#051a0a]',
    type: 'custom'
  },
  {
    id: 'solar-amber',
    name: 'Solar Gold',
    desc: 'Warm radiant amber glow on rich dark volcanic casing',
    badge: 'Warm',
    color: '#f59e0b',
    gradient: 'from-amber-500 to-orange-600',
    type: 'custom'
  },
  {
    id: 'ocean-depths',
    name: 'Ocean Depths',
    desc: 'Deep marine navy casing with icy cyan electric highlights',
    badge: 'Cool',
    color: '#06b6d4',
    gradient: 'from-cyan-500 to-blue-600',
    type: 'custom'
  },
  {
    id: 'sunset-rose',
    name: 'Sunset Blossom',
    desc: 'Velvet dark plum casing with vibrant crimson and rose keys',
    badge: 'Blossom',
    color: '#f43f5e',
    gradient: 'from-rose-500 to-pink-600',
    type: 'custom'
  },
  {
    id: 'midnight-oled',
    name: 'Pure Midnight OLED',
    desc: 'Pitch 100% black casing with sharp high-contrast white & silver',
    badge: 'OLED',
    color: '#ffffff',
    gradient: 'from-neutral-900 to-black',
    type: 'custom'
  },
  {
    id: 'minimal-nordic',
    name: 'Nordic Clean Studio',
    desc: 'Clean matte off-white architectural aesthetic',
    badge: 'Light',
    color: '#64748b',
    gradient: 'from-slate-100 to-slate-300',
    type: 'custom'
  }
];

export const CalculatorModal = () => {
  const {
    isCalculatorOpen,
    setIsCalculatorOpen,
    showToast
  } = useTaskContext();

  // Active Tab: 'calc' | 'productivity' | 'bmi' | 'history' | 'themes'
  const [activeTab, setActiveTab] = useState('calc');

  // Calculator-Specific Theme State (Persisted in localStorage)
  const [calcTheme, setCalcTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('imran_khan_calc_theme');
      return saved || 'app-sync';
    } catch {
      return 'app-sync';
    }
  });

  // Sound Feedback State
  const [soundEnabled, setSoundEnabled] = useState(() => {
    try {
      return localStorage.getItem('imran_khan_calc_sound') === 'true';
    } catch {
      return false;
    }
  });

  // Font Style State ('modern' | 'digital' | 'terminal')
  const [fontStyle, setFontStyle] = useState(() => {
    try {
      return localStorage.getItem('imran_khan_calc_font') || 'digital';
    } catch {
      return 'digital';
    }
  });

  // Calculator Math State
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

  // BMI Calculator State
  const [bmiUnit, setBmiUnit] = useState('metric'); // 'metric' | 'imperial'
  const [bmiHeightCm, setBmiHeightCm] = useState('175');
  const [bmiWeightKg, setBmiWeightKg] = useState('70');
  const [bmiHeightFt, setBmiHeightFt] = useState('5');
  const [bmiHeightIn, setBmiHeightIn] = useState('9');
  const [bmiWeightLbs, setBmiWeightLbs] = useState('154');
  const [bmiAge, setBmiAge] = useState('28');
  const [bmiGender, setBmiGender] = useState('male'); // 'male' | 'female'
  const [bmiActivity, setBmiActivity] = useState('moderate');
  const [bmiRecords, setBmiRecords] = useState(() => {
    try {
      const saved = localStorage.getItem('imran_khan_bmi_records');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Save Settings to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('imran_khan_calc_theme', calcTheme);
    } catch (e) {
      console.error(e);
    }
  }, [calcTheme]);

  useEffect(() => {
    try {
      localStorage.setItem('imran_khan_calc_sound', String(soundEnabled));
    } catch (e) {
      console.error(e);
    }
  }, [soundEnabled]);

  useEffect(() => {
    try {
      localStorage.setItem('imran_khan_calc_font', fontStyle);
    } catch (e) {
      console.error(e);
    }
  }, [fontStyle]);

  useEffect(() => {
    try {
      localStorage.setItem('imran_khan_calc_history', JSON.stringify(history));
    } catch (e) {
      console.error(e);
    }
  }, [history]);

  useEffect(() => {
    try {
      localStorage.setItem('imran_khan_bmi_records', JSON.stringify(bmiRecords));
    } catch (e) {
      console.error(e);
    }
  }, [bmiRecords]);

  // Tactile Synthesized Audio Feedback
  const playBeep = (type = 'click') => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;
      if (type === 'equals') {
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.08); // G5
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.12);
      } else if (type === 'clear') {
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(160, now + 0.07);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
        osc.start(now);
        osc.stop(now + 0.09);
      } else {
        osc.frequency.setValueAtTime(650, now);
        gain.gain.setValueAtTime(0.035, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        osc.start(now);
        osc.stop(now + 0.04);
      }
    } catch {
      // Audio context blocked or unsupported
    }
  };

  // Safe Math Expression Evaluator
  const evaluateMath = (expr) => {
    if (!expr || !expr.trim()) return 0;
    try {
      let sanitized = expr
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/π/g, `${Math.PI}`)
        .replace(/e/g, `${Math.E}`);

      sanitized = sanitized.replace(/√\(([^)]+)\)/g, 'Math.sqrt($1)');
      sanitized = sanitized.replace(/√(\d+(\.\d+)?)/g, 'Math.sqrt($1)');
      sanitized = sanitized.replace(/\^/g, '**');

      if (!/^[\d\s+\-*/%.,()Math.sqrtPIE**]+$/.test(sanitized)) {
        return 'Error';
      }

      // eslint-disable-next-line no-new-func
      const evalFn = new Function('Math', `"use strict"; return (${sanitized});`);
      const val = evalFn(Math);

      if (typeof val !== 'number' || !isFinite(val) || isNaN(val)) {
        return 'Error';
      }

      const rounded = Number(val.toFixed(8));
      return String(rounded);
    } catch {
      return 'Error';
    }
  };

  const previewResult = () => {
    if (!expression.trim()) return '';
    const evaluated = evaluateMath(expression);
    return evaluated === 'Error' ? '' : evaluated;
  };

  // Keypad Handlers
  const handleInput = (val) => {
    playBeep('click');
    if (justCalculated) {
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
    playBeep('clear');
    setExpression('');
    setResult('0');
    setJustCalculated(false);
  };

  const handleBackspace = () => {
    playBeep('click');
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
      playBeep('clear');
      setResult('Error');
      showToast('Invalid Math Expression', 'warning');
      return;
    }

    playBeep('equals');
    setResult(finalResult);
    setJustCalculated(true);

    const newEntry = {
      id: `calc-${Date.now()}`,
      expression,
      result: finalResult,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setHistory((prev) => [newEntry, ...prev.slice(0, 29)]);
  };

  const handleToggleSign = () => {
    playBeep('click');
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
    playBeep('click');
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

  // BMI Math Calculations
  let heightInM = 0;
  let heightInCm = 0;
  let weightInKg = 0;

  if (bmiUnit === 'metric') {
    heightInCm = parseFloat(bmiHeightCm) || 0;
    heightInM = heightInCm / 100;
    weightInKg = parseFloat(bmiWeightKg) || 0;
  } else {
    const ft = parseFloat(bmiHeightFt) || 0;
    const inches = parseFloat(bmiHeightIn) || 0;
    const totalInches = ft * 12 + inches;
    heightInCm = totalInches * 2.54;
    heightInM = heightInCm / 100;
    weightInKg = (parseFloat(bmiWeightLbs) || 0) * 0.45359237;
  }

  const bmiScore = heightInM > 0 && weightInKg > 0 ? (weightInKg / (heightInM * heightInM)).toFixed(1) : '0.0';
  const numBmi = parseFloat(bmiScore);

  let bmiCategory = {
    label: 'Normal Weight',
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400',
    description: 'Optimal healthy weight. Low risk of weight-related health issues.',
    range: '18.5 – 24.9',
    badge: 'Optimal'
  };

  if (numBmi < 18.5) {
    bmiCategory = {
      label: 'Underweight',
      color: 'text-sky-400',
      bgColor: 'bg-sky-500/15 border-sky-500/30 text-sky-400',
      description: 'Below normal body weight. Consider nutrient-rich calorie intake.',
      range: '< 18.5',
      badge: 'Underweight'
    };
  } else if (numBmi >= 18.5 && numBmi <= 24.9) {
    bmiCategory = {
      label: 'Normal Weight',
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400',
      description: 'Optimal healthy weight. Great balance for stamina and productivity!',
      range: '18.5 – 24.9',
      badge: 'Optimal'
    };
  } else if (numBmi >= 25.0 && numBmi <= 29.9) {
    bmiCategory = {
      label: 'Overweight',
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/15 border-amber-500/30 text-amber-400',
      description: 'Slightly above standard range. Focus on regular movement and wholesome meals.',
      range: '25.0 – 29.9',
      badge: 'Overweight'
    };
  } else if (numBmi >= 30.0 && numBmi <= 34.9) {
    bmiCategory = {
      label: 'Obesity Class I',
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/15 border-orange-500/30 text-orange-400',
      description: 'Moderately high body fat. Regular cardio & fitness routine recommended.',
      range: '30.0 – 34.9',
      badge: 'Class I'
    };
  } else if (numBmi >= 35.0) {
    bmiCategory = {
      label: 'Obesity Class II/III',
      color: 'text-rose-400',
      bgColor: 'bg-rose-500/15 border-rose-500/30 text-rose-400',
      description: 'Higher health risk. Personalized fitness & medical advice is recommended.',
      range: '≥ 35.0',
      badge: 'High Risk'
    };
  }

  // Healthy Weight Range for this height
  const minHealthyKg = heightInM > 0 ? (18.5 * heightInM * heightInM).toFixed(1) : '0';
  const maxHealthyKg = heightInM > 0 ? (24.9 * heightInM * heightInM).toFixed(1) : '0';
  const minHealthyLbs = (parseFloat(minHealthyKg) * 2.20462).toFixed(1);
  const maxHealthyLbs = (parseFloat(maxHealthyKg) * 2.20462).toFixed(1);

  // BMR & TDEE Calculations
  const ageNum = parseFloat(bmiAge) || 28;
  let bmr = 0;
  if (heightInCm > 0 && weightInKg > 0) {
    if (bmiGender === 'male') {
      bmr = Math.round(10 * weightInKg + 6.25 * heightInCm - 5 * ageNum + 5);
    } else {
      bmr = Math.round(10 * weightInKg + 6.25 * heightInCm - 5 * ageNum - 161);
    }
  }

  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725
  };
  const tdee = Math.round(bmr * (activityMultipliers[bmiActivity] || 1.375));

  const handleSaveBmiRecord = () => {
    if (numBmi <= 0) return;
    const newRec = {
      id: `bmi-${Date.now()}`,
      bmi: numBmi,
      category: bmiCategory.label,
      weight: bmiUnit === 'metric' ? `${bmiWeightKg} kg` : `${bmiWeightLbs} lbs`,
      height: bmiUnit === 'metric' ? `${bmiHeightCm} cm` : `${bmiHeightFt}'${bmiHeightIn}"`,
      timestamp: new Date().toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    };
    setBmiRecords((prev) => [newRec, ...prev.slice(0, 19)]);
    playBeep('equals');
    showToast(`Saved BMI ${numBmi} (${bmiCategory.label}) to health records!`, 'success');
  };

  const handleClearBmiRecords = () => {
    setBmiRecords([]);
    showToast('BMI records cleared', 'info');
  };

  // Progress Bar percentage for meter
  const meterPercent = Math.min(100, Math.max(0, ((numBmi - 14) / (38 - 14)) * 100));

  // Theme Styling Configuration
  const getThemeStyles = () => {
    switch (calcTheme) {
      case 'cyberpunk':
        return {
          wrapper: 'bg-[#090414] border-fuchsia-500/50 shadow-2xl shadow-fuchsia-950/70 text-fuchsia-100',
          header: 'bg-[#120824]/90 border-fuchsia-500/30 text-fuchsia-100',
          tabs: 'bg-[#15092a] border-fuchsia-500/30',
          tabActive: 'bg-fuchsia-600 text-white shadow-md shadow-fuchsia-500/50',
          tabInactive: 'text-fuchsia-300 hover:text-white',
          screen: 'bg-[#05020a] border-fuchsia-500/50 text-cyan-300 shadow-inner shadow-fuchsia-950',
          screenFormula: 'text-fuchsia-400',
          screenPreview: 'text-cyan-400 font-bold',
          numKey: 'bg-[#180c30] text-cyan-100 border-purple-500/30 hover:bg-[#281450] hover:border-cyan-400/60 shadow-sm',
          opKey: 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/40 hover:bg-fuchsia-500/30',
          fnKey: 'bg-purple-900/40 text-purple-200 border-purple-500/30 hover:bg-purple-900/70',
          equalsKey: 'bg-gradient-to-r from-fuchsia-500 to-cyan-500 text-black font-extrabold shadow-lg shadow-fuchsia-500/50 hover:brightness-110',
          acKey: 'bg-rose-950/60 text-rose-300 border-rose-500/40 hover:bg-rose-900/80',
          badge: 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/40',
          accentText: 'text-cyan-400'
        };

      case 'retro-casio':
        return {
          wrapper: 'bg-[#d8d3c5] border-[#b4ad9a] shadow-2xl text-[#2a2926]',
          header: 'bg-[#cdc7b7] border-[#b4ad9a] text-[#2a2926]',
          tabs: 'bg-[#c3bcab] border-[#b0a996]',
          tabActive: 'bg-[#ece8dc] text-[#2a2926] shadow-sm font-bold',
          tabInactive: 'text-[#585348] hover:text-[#2a2926]',
          screen: 'bg-[#98b093] border-[#72886e] text-[#142612] shadow-inner font-mono',
          screenFormula: 'text-[#2e472a]',
          screenPreview: 'text-[#142612] font-bold',
          numKey: 'bg-[#eae6da] text-[#2a2926] border-[#bfb7a4] hover:bg-white shadow-sm font-bold',
          opKey: 'bg-[#7c8694] text-white border-[#616c7a] hover:bg-[#6c7785]',
          fnKey: 'bg-[#a39c8c] text-[#2a2926] border-[#8e8777] hover:bg-[#b0a998]',
          equalsKey: 'bg-[#3b414a] text-white font-bold hover:bg-[#2a2e35] shadow-md',
          acKey: 'bg-[#e65c00] text-white border-[#b84a00] hover:bg-[#cc5200] font-extrabold',
          badge: 'bg-[#788d74]/30 text-[#1b2b19] border-[#788d74]',
          accentText: 'text-[#e65c00]'
        };

      case 'matrix-hacker':
        return {
          wrapper: 'bg-[#020b04] border-[#00ff66]/40 shadow-2xl shadow-emerald-950/80 text-[#00ff66]',
          header: 'bg-[#041407] border-[#00ff66]/30 text-[#00ff66]',
          tabs: 'bg-[#061e0b] border-[#00ff66]/30',
          tabActive: 'bg-[#00ff66] text-black shadow-md font-bold shadow-[#00ff66]/40',
          tabInactive: 'text-[#00aa44] hover:text-[#00ff66]',
          screen: 'bg-[#010602] border-[#00ff66]/60 text-[#00ff66] font-mono shadow-inner shadow-emerald-950',
          screenFormula: 'text-[#00aa44]',
          screenPreview: 'text-[#00ff66] font-bold',
          numKey: 'bg-[#061f0c] text-[#80ffaa] border-[#00ff66]/20 hover:bg-[#0a2e13] hover:border-[#00ff66]/50 font-mono',
          opKey: 'bg-[#00ff66]/15 text-[#00ff66] border-[#00ff66]/40 hover:bg-[#00ff66]/25 font-mono',
          fnKey: 'bg-[#08260f] text-[#66ff99] border-[#00ff66]/25 hover:bg-[#0e3b18] font-mono',
          equalsKey: 'bg-[#00ff66] text-black font-extrabold hover:bg-[#33ff85] shadow-lg shadow-[#00ff66]/40 font-mono',
          acKey: 'bg-rose-950/70 text-rose-400 border-rose-500/40 hover:bg-rose-900 font-mono',
          badge: 'bg-[#00ff66]/20 text-[#00ff66] border-[#00ff66]/40',
          accentText: 'text-[#00ff66]'
        };

      case 'solar-amber':
        return {
          wrapper: 'bg-[#181005] border-amber-500/40 shadow-2xl text-amber-100',
          header: 'bg-[#221707] border-amber-500/30 text-amber-100',
          tabs: 'bg-[#2b1d09] border-amber-500/30',
          tabActive: 'bg-amber-500 text-black shadow-md font-bold',
          tabInactive: 'text-amber-300 hover:text-white',
          screen: 'bg-[#0c0702] border-amber-500/40 text-amber-300 font-mono shadow-inner',
          screenFormula: 'text-amber-500',
          screenPreview: 'text-amber-300 font-bold',
          numKey: 'bg-[#261908] text-amber-200 border-amber-600/30 hover:bg-[#38260d]',
          opKey: 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30',
          fnKey: 'bg-[#33220b] text-amber-200 border-amber-600/25 hover:bg-[#473010]',
          equalsKey: 'bg-gradient-to-r from-amber-500 to-orange-500 text-black font-extrabold shadow-lg shadow-amber-500/30 hover:brightness-110',
          acKey: 'bg-rose-950/50 text-rose-300 border-rose-500/30 hover:bg-rose-900/80',
          badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          accentText: 'text-amber-400'
        };

      case 'ocean-depths':
        return {
          wrapper: 'bg-[#051321] border-cyan-500/40 shadow-2xl text-cyan-100',
          header: 'bg-[#091e33] border-cyan-500/30 text-cyan-100',
          tabs: 'bg-[#0d2742] border-cyan-500/30',
          tabActive: 'bg-cyan-500 text-slate-950 shadow-md font-bold',
          tabInactive: 'text-cyan-300 hover:text-white',
          screen: 'bg-[#020a12] border-cyan-500/50 text-cyan-300 font-mono shadow-inner',
          screenFormula: 'text-sky-400',
          screenPreview: 'text-cyan-300 font-bold',
          numKey: 'bg-[#0b243d] text-cyan-100 border-cyan-700/30 hover:bg-[#12365c]',
          opKey: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 hover:bg-cyan-500/30',
          fnKey: 'bg-[#103152] text-cyan-200 border-cyan-600/30 hover:bg-[#184675]',
          equalsKey: 'bg-gradient-to-r from-sky-400 to-cyan-500 text-slate-950 font-extrabold shadow-lg shadow-cyan-500/40 hover:brightness-110',
          acKey: 'bg-rose-950/50 text-rose-300 border-rose-500/30 hover:bg-rose-900/80',
          badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
          accentText: 'text-cyan-400'
        };

      case 'sunset-rose':
        return {
          wrapper: 'bg-[#18060d] border-rose-500/40 shadow-2xl text-rose-100',
          header: 'bg-[#240a14] border-rose-500/30 text-rose-100',
          tabs: 'bg-[#300d1b] border-rose-500/30',
          tabActive: 'bg-rose-500 text-white shadow-md font-bold',
          tabInactive: 'text-rose-300 hover:text-white',
          screen: 'bg-[#0d0206] border-rose-500/50 text-rose-300 font-mono shadow-inner',
          screenFormula: 'text-pink-400',
          screenPreview: 'text-rose-300 font-bold',
          numKey: 'bg-[#290c17] text-rose-100 border-rose-700/30 hover:bg-[#3d1222]',
          opKey: 'bg-rose-500/20 text-rose-300 border-rose-500/40 hover:bg-rose-500/30',
          fnKey: 'bg-[#381020] text-rose-200 border-rose-600/30 hover:bg-[#4f172e]',
          equalsKey: 'bg-gradient-to-r from-rose-500 to-pink-500 text-white font-extrabold shadow-lg shadow-rose-500/40 hover:brightness-110',
          acKey: 'bg-red-950/50 text-red-300 border-red-500/30 hover:bg-red-900/80',
          badge: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
          accentText: 'text-rose-400'
        };

      case 'midnight-oled':
        return {
          wrapper: 'bg-black border-neutral-800 shadow-2xl text-white',
          header: 'bg-[#080808] border-neutral-800 text-white',
          tabs: 'bg-[#111111] border-neutral-800',
          tabActive: 'bg-white text-black shadow-md font-bold',
          tabInactive: 'text-neutral-400 hover:text-white',
          screen: 'bg-[#030303] border-neutral-800 text-white font-mono shadow-inner',
          screenFormula: 'text-neutral-500',
          screenPreview: 'text-white font-bold',
          numKey: 'bg-[#101010] text-white border-neutral-800 hover:bg-[#202020]',
          opKey: 'bg-[#1c1c1c] text-neutral-200 border-neutral-700 hover:bg-[#2a2a2a]',
          fnKey: 'bg-[#161616] text-neutral-300 border-neutral-800 hover:bg-[#242424]',
          equalsKey: 'bg-white text-black font-extrabold hover:bg-neutral-200 shadow-md',
          acKey: 'bg-neutral-900 text-rose-400 border-neutral-800 hover:bg-neutral-800',
          badge: 'bg-neutral-900 text-white border-neutral-700',
          accentText: 'text-white'
        };

      case 'minimal-nordic':
        return {
          wrapper: 'bg-[#f8fafc] border-slate-300 shadow-2xl text-slate-800',
          header: 'bg-slate-100 border-slate-200 text-slate-800',
          tabs: 'bg-slate-200/80 border-slate-300',
          tabActive: 'bg-white text-slate-900 shadow-sm font-bold',
          tabInactive: 'text-slate-600 hover:text-slate-900',
          screen: 'bg-white border-slate-200 text-slate-900 font-mono shadow-inner',
          screenFormula: 'text-slate-500',
          screenPreview: 'text-slate-900 font-bold',
          numKey: 'bg-white text-slate-800 border-slate-200 hover:bg-slate-100 shadow-xs font-semibold',
          opKey: 'bg-slate-200 text-slate-700 border-slate-300 hover:bg-slate-300 font-bold',
          fnKey: 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200 font-semibold',
          equalsKey: 'bg-slate-900 text-white font-extrabold hover:bg-slate-800 shadow-sm',
          acKey: 'bg-rose-100 text-rose-700 border-rose-200 hover:bg-rose-200 font-bold',
          badge: 'bg-slate-200 text-slate-800 border-slate-300',
          accentText: 'text-slate-900'
        };

      case 'app-sync':
      default:
        return {
          wrapper: 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100',
          header: 'bg-slate-50/70 dark:bg-slate-900/70 border-slate-100 dark:border-slate-800 text-slate-900 dark:text-slate-100',
          tabs: 'bg-slate-100 dark:bg-slate-800/80 border-slate-200/60 dark:border-slate-700/60',
          tabActive: 'bg-white dark:bg-slate-700 text-theme-primary shadow-sm font-bold',
          tabInactive: 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200',
          screen: 'bg-slate-900 dark:bg-slate-950 border-slate-800 text-white shadow-inner',
          screenFormula: 'text-slate-400',
          screenPreview: 'text-theme-primary font-bold',
          numKey: 'bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 shadow-sm border border-slate-200/50 dark:border-slate-700/50 font-semibold',
          opKey: 'bg-theme-light text-theme-primary border border-theme-light hover:brightness-110 font-bold',
          fnKey: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 font-semibold',
          equalsKey: 'bg-theme-primary hover:bg-theme-primary-hover text-white shadow-lg shadow-theme-glow font-extrabold',
          acKey: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 font-bold',
          badge: 'bg-theme-light text-theme-primary border-theme-light',
          accentText: 'text-theme-primary'
        };
    }
  };

  const currentStyles = getThemeStyles();
  const fontClass = fontStyle === 'digital' ? 'font-mono tracking-widest' : fontStyle === 'terminal' ? 'font-mono' : 'font-sans';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/65 backdrop-blur-md animate-fadeIn">
      <div
        className={`rounded-3xl shadow-2xl border w-full max-w-md overflow-hidden flex flex-col transition-all duration-300 max-h-[92vh] ${currentStyles.wrapper}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className={`flex items-center justify-between px-5 py-3.5 border-b backdrop-blur-sm ${currentStyles.header}`}>
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center border ${currentStyles.badge}`}>
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold">
                  Calculator & Wellness Tools
                </h2>
                <span className={`px-2 py-0.2 text-[9px] font-extrabold uppercase tracking-wider rounded-full border ${currentStyles.badge}`}>
                  {CALC_THEMES.find(t => t.id === calcTheme)?.name || 'Custom'}
                </span>
              </div>
              <p className="text-[10px] opacity-75">
                Math, Time Estimates, BMI Health & Themes
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {/* Quick Sound Toggle */}
            <button
              onClick={() => {
                const next = !soundEnabled;
                setSoundEnabled(next);
                if (next) playBeep('click');
                showToast(next ? 'Calculator key sounds enabled' : 'Calculator sound muted', 'info');
              }}
              className={`p-1.5 rounded-lg transition-colors ${
                soundEnabled ? currentStyles.accentText : 'opacity-40 hover:opacity-100'
              }`}
              title={soundEnabled ? 'Mute Key Sounds' : 'Enable Key Sounds'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Quick Theme Switcher Button */}
            <button
              onClick={() => setActiveTab('themes')}
              className={`p-1.5 rounded-lg transition-colors ${
                activeTab === 'themes' ? currentStyles.accentText : 'opacity-60 hover:opacity-100'
              }`}
              title="Calculator Skins & Themes"
            >
              <Palette className="w-4 h-4" />
            </button>

            {/* Close Button */}
            <button
              onClick={() => setIsCalculatorOpen(false)}
              className="p-1.5 opacity-50 hover:opacity-100 rounded-full transition-colors"
              title="Close calculator (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className={`flex items-center p-1.5 mx-4 mt-3 rounded-2xl border ${currentStyles.tabs}`}>
          <button
            onClick={() => setActiveTab('calc')}
            className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-xl text-xs transition-all ${
              activeTab === 'calc' ? currentStyles.tabActive : currentStyles.tabInactive
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>Keypad</span>
          </button>

          <button
            onClick={() => setActiveTab('productivity')}
            className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-xl text-xs transition-all ${
              activeTab === 'productivity' ? currentStyles.tabActive : currentStyles.tabInactive
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Time</span>
          </button>

          <button
            onClick={() => setActiveTab('bmi')}
            className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-xl text-xs transition-all ${
              activeTab === 'bmi' ? currentStyles.tabActive : currentStyles.tabInactive
            }`}
          >
            <HeartPulse className="w-3.5 h-3.5" />
            <span>BMI</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-xl text-xs transition-all relative ${
              activeTab === 'history' ? currentStyles.tabActive : currentStyles.tabInactive
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Tape</span>
            {history.length > 0 && (
              <span className="ml-0.5 px-1 py-0.2 text-[8px] bg-theme-primary text-white rounded-full font-bold">
                {history.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('themes')}
            className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-xl text-xs transition-all ${
              activeTab === 'themes' ? currentStyles.tabActive : currentStyles.tabInactive
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Skins</span>
          </button>
        </div>

        {/* Tab 1: Standard Keypad Calculator */}
        {activeTab === 'calc' && (
          <div className="p-4 space-y-3.5 overflow-y-auto">
            {/* Display Screen */}
            <div className={`p-4 rounded-2xl border shadow-inner relative group ${currentStyles.screen}`}>
              {/* Formula & Live Preview */}
              <div className="h-6 flex items-center justify-between text-xs font-mono overflow-x-auto">
                <span className={`truncate ${currentStyles.screenFormula}`}>
                  {expression || '0'}
                </span>
                {previewResult() && (
                  <span className={`shrink-0 ml-2 ${currentStyles.screenPreview}`}>
                    ≈ {previewResult()}
                  </span>
                )}
              </div>

              {/* Main Result Display */}
              <div className="flex items-baseline justify-between mt-1 gap-2">
                <div className={`text-3xl sm:text-4xl font-extrabold tracking-tight overflow-x-auto select-all ${fontClass}`}>
                  {result}
                </div>
                <button
                  onClick={() => handleCopyResult(result)}
                  className="p-1.5 rounded-lg opacity-60 hover:opacity-100 hover:bg-white/10 transition-colors shrink-0"
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
                className={`py-2.5 rounded-xl font-bold text-xs active:scale-95 transition-all ${currentStyles.acKey}`}
                title="All Clear (AC)"
              >
                AC
              </button>
              <button
                onClick={handleBackspace}
                className={`py-2.5 rounded-xl font-bold text-xs active:scale-95 transition-all flex items-center justify-center ${currentStyles.fnKey}`}
                title="Backspace (⌫)"
              >
                <Delete className="w-4 h-4" />
              </button>
              <button
                onClick={handleToggleSign}
                className={`py-2.5 rounded-xl font-bold text-xs active:scale-95 transition-all ${currentStyles.fnKey}`}
                title="Toggle Sign (+/-)"
              >
                ±
              </button>
              <button
                onClick={handleSqrt}
                className={`py-2.5 rounded-xl font-bold text-xs active:scale-95 transition-all font-mono ${currentStyles.fnKey}`}
                title="Square Root (√)"
              >
                √
              </button>
              <button
                onClick={() => handleInput('^')}
                className={`py-2.5 rounded-xl font-bold text-xs active:scale-95 transition-all font-mono ${currentStyles.fnKey}`}
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
                className={`py-3 rounded-xl font-semibold text-sm active:scale-95 transition-all ${currentStyles.fnKey}`}
              >
                (
              </button>
              <button
                onClick={() => handleInput(')')}
                className={`py-3 rounded-xl font-semibold text-sm active:scale-95 transition-all ${currentStyles.fnKey}`}
              >
                )
              </button>
              <button
                onClick={() => handleInput('%')}
                className={`py-3 rounded-xl font-semibold text-sm active:scale-95 transition-all ${currentStyles.fnKey}`}
              >
                %
              </button>
              <button
                onClick={() => handleInput('÷')}
                className={`py-3 rounded-xl font-bold text-base active:scale-95 transition-all ${currentStyles.opKey}`}
              >
                ÷
              </button>

              {/* Row 2 */}
              <button
                onClick={() => handleInput('7')}
                className={`py-3 rounded-xl text-base active:scale-95 transition-all ${currentStyles.numKey}`}
              >
                7
              </button>
              <button
                onClick={() => handleInput('8')}
                className={`py-3 rounded-xl text-base active:scale-95 transition-all ${currentStyles.numKey}`}
              >
                8
              </button>
              <button
                onClick={() => handleInput('9')}
                className={`py-3 rounded-xl text-base active:scale-95 transition-all ${currentStyles.numKey}`}
              >
                9
              </button>
              <button
                onClick={() => handleInput('×')}
                className={`py-3 rounded-xl font-bold text-base active:scale-95 transition-all ${currentStyles.opKey}`}
              >
                ×
              </button>

              {/* Row 3 */}
              <button
                onClick={() => handleInput('4')}
                className={`py-3 rounded-xl text-base active:scale-95 transition-all ${currentStyles.numKey}`}
              >
                4
              </button>
              <button
                onClick={() => handleInput('5')}
                className={`py-3 rounded-xl text-base active:scale-95 transition-all ${currentStyles.numKey}`}
              >
                5
              </button>
              <button
                onClick={() => handleInput('6')}
                className={`py-3 rounded-xl text-base active:scale-95 transition-all ${currentStyles.numKey}`}
              >
                6
              </button>
              <button
                onClick={() => handleInput('-')}
                className={`py-3 rounded-xl font-bold text-base active:scale-95 transition-all ${currentStyles.opKey}`}
              >
                -
              </button>

              {/* Row 4 */}
              <button
                onClick={() => handleInput('1')}
                className={`py-3 rounded-xl text-base active:scale-95 transition-all ${currentStyles.numKey}`}
              >
                1
              </button>
              <button
                onClick={() => handleInput('2')}
                className={`py-3 rounded-xl text-base active:scale-95 transition-all ${currentStyles.numKey}`}
              >
                2
              </button>
              <button
                onClick={() => handleInput('3')}
                className={`py-3 rounded-xl text-base active:scale-95 transition-all ${currentStyles.numKey}`}
              >
                3
              </button>
              <button
                onClick={() => handleInput('+')}
                className={`py-3 rounded-xl font-bold text-base active:scale-95 transition-all ${currentStyles.opKey}`}
              >
                +
              </button>

              {/* Row 5 */}
              <button
                onClick={() => handleInput('0')}
                className={`col-span-2 py-3 rounded-xl text-base active:scale-95 transition-all ${currentStyles.numKey}`}
              >
                0
              </button>
              <button
                onClick={() => handleInput('.')}
                className={`py-3 rounded-xl text-base active:scale-95 transition-all ${currentStyles.numKey}`}
              >
                .
              </button>
              <button
                onClick={handleCalculate}
                className={`py-3 rounded-xl font-extrabold text-lg active:scale-95 transition-all ${currentStyles.equalsKey}`}
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
            <div className={`p-3.5 rounded-2xl border space-y-2.5 bg-black/10 dark:bg-white/5 border-current/10`}>
              <div className="flex items-center gap-2 text-xs font-bold">
                <Clock className={`w-4 h-4 ${currentStyles.accentText}`} />
                <span>Task Time Converter</span>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[10px] font-semibold opacity-70 uppercase tracking-wider block mb-1">
                    Hours → Minutes
                  </label>
                  <input
                    type="number"
                    step="0.25"
                    placeholder="e.g. 2.5"
                    value={timeInputHours}
                    onChange={(e) => setTimeInputHours(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-black/10 dark:bg-white/10 border border-current/20 rounded-lg text-xs font-mono focus:outline-none focus:ring-1"
                  />
                  <p className={`text-[11px] font-bold mt-1 ${currentStyles.accentText}`}>
                    = {calcMinsFromHours} mins
                  </p>
                </div>

                <div>
                  <label className="text-[10px] font-semibold opacity-70 uppercase tracking-wider block mb-1">
                    Minutes → Hours
                  </label>
                  <input
                    type="number"
                    step="5"
                    placeholder="e.g. 90"
                    value={timeInputMinutes}
                    onChange={(e) => setTimeInputMinutes(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-black/10 dark:bg-white/10 border border-current/20 rounded-lg text-xs font-mono focus:outline-none focus:ring-1"
                  />
                  <p className={`text-[11px] font-bold mt-1 truncate ${currentStyles.accentText}`}>
                    = {calcHoursFromMins}
                  </p>
                </div>
              </div>
            </div>

            {/* Tool 2: Buffer / Risk Multiplier */}
            <div className={`p-3.5 rounded-2xl border space-y-2.5 bg-black/10 dark:bg-white/5 border-current/10`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold">
                  <Percent className="w-4 h-4 text-amber-500" />
                  <span>Estimation Buffer Multiplier</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 bg-amber-500/20 text-amber-400 font-semibold rounded-full border border-amber-500/30">
                  Realistic Planning
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[10px] font-semibold opacity-70 block mb-1">
                    Base Est. Hours
                  </label>
                  <input
                    type="number"
                    value={bufferHours}
                    onChange={(e) => setBufferHours(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-black/10 dark:bg-white/10 border border-current/20 rounded-lg text-xs font-mono focus:outline-none focus:ring-1"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold opacity-70 block mb-1">
                    Buffer Added (%)
                  </label>
                  <div className="flex gap-1">
                    {['15', '25', '50'].map((p) => (
                      <button
                        key={p}
                        onClick={() => setBufferPercent(p)}
                        className={`flex-1 py-1 text-[10px] font-bold rounded-md transition-all ${
                          bufferPercent === p
                            ? 'bg-amber-500 text-black shadow-sm'
                            : 'bg-black/10 dark:bg-white/10 border border-current/20 opacity-75 hover:opacity-100'
                        }`}
                      >
                        +{p}%
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="pt-1 flex items-center justify-between text-xs border-t border-current/10">
                <span className="opacity-70">Buffered Estimate:</span>
                <span className="font-extrabold text-amber-400 font-mono">
                  {bufferedEstimate} hours
                </span>
              </div>
            </div>

            {/* Tool 3: Billable Rate Calculator */}
            <div className={`p-3.5 rounded-2xl border space-y-2.5 bg-black/10 dark:bg-white/5 border-current/10`}>
              <div className="flex items-center gap-2 text-xs font-bold">
                <DollarSign className="w-4 h-4 text-emerald-500" />
                <span>Billable Task Cost Estimator</span>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[10px] font-semibold opacity-70 block mb-1">
                    Hours Worked
                  </label>
                  <input
                    type="number"
                    value={estHours}
                    onChange={(e) => setEstHours(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-black/10 dark:bg-white/10 border border-current/20 rounded-lg text-xs font-mono focus:outline-none focus:ring-1"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold opacity-70 block mb-1">
                    Rate ($ / Hour)
                  </label>
                  <input
                    type="number"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-black/10 dark:bg-white/10 border border-current/20 rounded-lg text-xs font-mono focus:outline-none focus:ring-1"
                  />
                </div>
              </div>
              <div className="pt-1 flex items-center justify-between text-xs border-t border-current/10">
                <span className="opacity-70">Total Project Value:</span>
                <span className="font-extrabold text-emerald-400 font-mono">
                  {totalBillable}
                </span>
              </div>
            </div>

            {/* Tool 4: Daily Workload Splitter */}
            <div className={`p-3.5 rounded-2xl border space-y-2.5 bg-black/10 dark:bg-white/5 border-current/10`}>
              <div className="flex items-center gap-2 text-xs font-bold">
                <Calendar className="w-4 h-4 text-cyan-400" />
                <span>Daily Sprint Pace Splitter</span>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[10px] font-semibold opacity-70 block mb-1">
                    Total Sprint Hours
                  </label>
                  <input
                    type="number"
                    value={sprintTotalHours}
                    onChange={(e) => setSprintTotalHours(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-black/10 dark:bg-white/10 border border-current/20 rounded-lg text-xs font-mono focus:outline-none focus:ring-1"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold opacity-70 block mb-1">
                    Working Days
                  </label>
                  <input
                    type="number"
                    value={sprintDays}
                    onChange={(e) => setSprintDays(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-black/10 dark:bg-white/10 border border-current/20 rounded-lg text-xs font-mono focus:outline-none focus:ring-1"
                  />
                </div>
              </div>
              <div className="pt-1 flex items-center justify-between text-xs border-t border-current/10">
                <span className="opacity-70">Target Pace / Day:</span>
                <span className="font-extrabold text-cyan-400 font-mono">
                  {dailyFocusGoal} hrs / day
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: BMI Health & Calorie Calculator */}
        {activeTab === 'bmi' && (
          <div className="p-4 space-y-3.5 overflow-y-auto max-h-[60vh]">
            {/* Unit & Gender Switcher */}
            <div className="flex items-center justify-between gap-2">
              {/* Unit Toggle */}
              <div className="flex items-center p-1 rounded-xl bg-black/10 dark:bg-white/5 border border-current/10">
                <button
                  onClick={() => setBmiUnit('metric')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    bmiUnit === 'metric'
                      ? 'bg-theme-primary text-white shadow-sm'
                      : 'opacity-60 hover:opacity-100'
                  }`}
                >
                  Metric (cm, kg)
                </button>
                <button
                  onClick={() => setBmiUnit('imperial')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    bmiUnit === 'imperial'
                      ? 'bg-theme-primary text-white shadow-sm'
                      : 'opacity-60 hover:opacity-100'
                  }`}
                >
                  Imperial (ft, lbs)
                </button>
              </div>

              {/* Gender Toggle */}
              <div className="flex items-center p-1 rounded-xl bg-black/10 dark:bg-white/5 border border-current/10">
                <button
                  onClick={() => setBmiGender('male')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    bmiGender === 'male'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'opacity-60 hover:opacity-100'
                  }`}
                >
                  Male
                </button>
                <button
                  onClick={() => setBmiGender('female')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    bmiGender === 'female'
                      ? 'bg-pink-600 text-white shadow-sm'
                      : 'opacity-60 hover:opacity-100'
                  }`}
                >
                  Female
                </button>
              </div>
            </div>

            {/* Main Result Card */}
            <div className={`p-4 rounded-2xl border relative overflow-hidden ${currentStyles.screen}`}>
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-wider opacity-70 font-semibold flex items-center gap-1">
                    <Scale className="w-3.5 h-3.5" /> Body Mass Index (BMI)
                  </span>
                  <div className="flex items-baseline gap-2.5 mt-1">
                    <span className={`text-4xl font-extrabold tracking-tight font-mono ${bmiCategory.color}`}>
                      {bmiScore}
                    </span>
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${bmiCategory.bgColor}`}>
                      {bmiCategory.label}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleSaveBmiRecord}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all border ${currentStyles.badge} hover:brightness-110`}
                  title="Save BMI reading to records"
                >
                  <BookmarkPlus className="w-3.5 h-3.5" /> Save
                </button>
              </div>

              {/* Description */}
              <p className="text-[11px] opacity-80 mt-2">
                {bmiCategory.description}
              </p>

              {/* Visual Spectrum Gauge */}
              <div className="mt-3 space-y-1">
                <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden flex relative">
                  <div className="h-full w-[20%] bg-sky-400" title="Underweight (<18.5)" />
                  <div className="h-full w-[35%] bg-emerald-400" title="Normal (18.5 - 24.9)" />
                  <div className="h-full w-[25%] bg-amber-400" title="Overweight (25.0 - 29.9)" />
                  <div className="h-full w-[20%] bg-rose-500" title="Obesity (30.0+)" />

                  {/* Marker Pin */}
                  <div
                    className="absolute top-0 bottom-0 w-1.5 bg-white shadow-md rounded-full -translate-x-1/2 transition-all duration-300"
                    style={{ left: `${meterPercent}%` }}
                  />
                </div>
                <div className="flex justify-between text-[9px] opacity-60 font-mono">
                  <span>15.0</span>
                  <span>18.5</span>
                  <span>25.0</span>
                  <span>30.0</span>
                  <span>40.0</span>
                </div>
              </div>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-2 gap-2.5 p-3 rounded-2xl border bg-black/10 dark:bg-white/5 border-current/10">
              {/* Height Input */}
              {bmiUnit === 'metric' ? (
                <div>
                  <label className="text-[10px] font-semibold opacity-70 block mb-1">
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    value={bmiHeightCm}
                    onChange={(e) => setBmiHeightCm(e.target.value)}
                    placeholder="175"
                    className="w-full px-2.5 py-1.5 bg-black/10 dark:bg-white/10 border border-current/20 rounded-lg text-xs font-mono focus:outline-none focus:ring-1"
                  />
                </div>
              ) : (
                <div className="flex gap-1.5">
                  <div className="flex-1">
                    <label className="text-[10px] font-semibold opacity-70 block mb-1">
                      Feet
                    </label>
                    <input
                      type="number"
                      value={bmiHeightFt}
                      onChange={(e) => setBmiHeightFt(e.target.value)}
                      placeholder="5"
                      className="w-full px-2.5 py-1.5 bg-black/10 dark:bg-white/10 border border-current/20 rounded-lg text-xs font-mono focus:outline-none focus:ring-1"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-[10px] font-semibold opacity-70 block mb-1">
                      Inches
                    </label>
                    <input
                      type="number"
                      value={bmiHeightIn}
                      onChange={(e) => setBmiHeightIn(e.target.value)}
                      placeholder="9"
                      className="w-full px-2.5 py-1.5 bg-black/10 dark:bg-white/10 border border-current/20 rounded-lg text-xs font-mono focus:outline-none focus:ring-1"
                    />
                  </div>
                </div>
              )}

              {/* Weight Input */}
              {bmiUnit === 'metric' ? (
                <div>
                  <label className="text-[10px] font-semibold opacity-70 block mb-1">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    value={bmiWeightKg}
                    onChange={(e) => setBmiWeightKg(e.target.value)}
                    placeholder="70"
                    className="w-full px-2.5 py-1.5 bg-black/10 dark:bg-white/10 border border-current/20 rounded-lg text-xs font-mono focus:outline-none focus:ring-1"
                  />
                </div>
              ) : (
                <div>
                  <label className="text-[10px] font-semibold opacity-70 block mb-1">
                    Weight (lbs)
                  </label>
                  <input
                    type="number"
                    value={bmiWeightLbs}
                    onChange={(e) => setBmiWeightLbs(e.target.value)}
                    placeholder="154"
                    className="w-full px-2.5 py-1.5 bg-black/10 dark:bg-white/10 border border-current/20 rounded-lg text-xs font-mono focus:outline-none focus:ring-1"
                  />
                </div>
              )}

              {/* Age */}
              <div>
                <label className="text-[10px] font-semibold opacity-70 block mb-1">
                  Age (years)
                </label>
                <input
                  type="number"
                  value={bmiAge}
                  onChange={(e) => setBmiAge(e.target.value)}
                  placeholder="28"
                  className="w-full px-2.5 py-1.5 bg-black/10 dark:bg-white/10 border border-current/20 rounded-lg text-xs font-mono focus:outline-none focus:ring-1"
                />
              </div>

              {/* Activity Level */}
              <div>
                <label className="text-[10px] font-semibold opacity-70 block mb-1">
                  Activity Level
                </label>
                <select
                  value={bmiActivity}
                  onChange={(e) => setBmiActivity(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-black/10 dark:bg-white/10 border border-current/20 rounded-lg text-xs focus:outline-none focus:ring-1"
                >
                  <option value="sedentary">Sedentary (Desk job)</option>
                  <option value="light">Light (1-2 days/wk)</option>
                  <option value="moderate">Moderate (3-5 days/wk)</option>
                  <option value="active">Active (6-7 days/wk)</option>
                </select>
              </div>
            </div>

            {/* Health & Calorie Insights Box */}
            <div className="grid grid-cols-2 gap-2.5">
              {/* Healthy Target Range */}
              <div className="p-3 rounded-xl border bg-black/10 dark:bg-white/5 border-current/10 space-y-1">
                <span className="text-[10px] opacity-70 flex items-center gap-1 font-semibold">
                  <Activity className="w-3.5 h-3.5 text-emerald-400" /> Ideal Weight Target
                </span>
                <p className="text-xs font-extrabold font-mono text-emerald-400">
                  {bmiUnit === 'metric' ? `${minHealthyKg} – ${maxHealthyKg} kg` : `${minHealthyLbs} – ${maxHealthyLbs} lbs`}
                </p>
                <p className="text-[9px] opacity-60">
                  Healthy normal BMI (18.5 – 24.9)
                </p>
              </div>

              {/* Daily Energy / Calories */}
              <div className="p-3 rounded-xl border bg-black/10 dark:bg-white/5 border-current/10 space-y-1">
                <span className="text-[10px] opacity-70 flex items-center gap-1 font-semibold">
                  <Flame className="w-3.5 h-3.5 text-orange-400" /> Daily Calorie Goal
                </span>
                <p className="text-xs font-extrabold font-mono text-orange-400">
                  ~{tdee.toLocaleString()} kcal/day
                </p>
                <p className="text-[9px] opacity-60">
                  BMR base: {bmr.toLocaleString()} kcal
                </p>
              </div>
            </div>

            {/* Saved BMI Records */}
            {bmiRecords.length > 0 && (
              <div className="pt-2 border-t border-current/10 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold">Recent Saved BMI Logs ({bmiRecords.length})</span>
                  <button
                    onClick={handleClearBmiRecords}
                    className="text-[10px] text-rose-400 hover:underline"
                  >
                    Clear Logs
                  </button>
                </div>
                <div className="space-y-1.5 max-h-24 overflow-y-auto">
                  {bmiRecords.map((rec) => (
                    <div
                      key={rec.id}
                      className="p-2 rounded-lg bg-black/10 dark:bg-white/5 text-[11px] flex items-center justify-between font-mono"
                    >
                      <span className="font-bold">{rec.bmi} ({rec.category})</span>
                      <span className="opacity-70">{rec.weight} • {rec.timestamp}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

        {/* Tab 4: History Tape */}
        {activeTab === 'history' && (
          <div className="p-4 space-y-3 overflow-y-auto max-h-[60vh]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold">
                Calculation History ({history.length})
              </span>
              {history.length > 0 && (
                <button
                  onClick={handleClearHistory}
                  className="flex items-center gap-1 text-[11px] text-rose-400 hover:text-rose-500 font-medium"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Clear All
                </button>
              )}
            </div>

            {history.length === 0 ? (
              <div className="text-center py-10 space-y-2">
                <History className="w-8 h-8 opacity-30 mx-auto" />
                <p className="text-xs opacity-70 font-medium">
                  No calculations yet.
                </p>
                <p className="text-[11px] opacity-50">
                  Calculations performed on the keypad will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {history.map((item) => (
                  <div
                    key={item.id}
                    className={`p-3 rounded-xl border flex items-center justify-between transition-colors group bg-black/10 dark:bg-white/5 border-current/10 hover:border-current/30`}
                  >
                    <div className="space-y-0.5 overflow-hidden pr-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] opacity-50 font-mono">
                          {item.timestamp}
                        </span>
                        <span className="text-xs opacity-75 font-mono truncate">
                          {item.expression}
                        </span>
                      </div>
                      <div className="text-base font-bold font-mono">
                        = {item.result}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleCopyResult(item.result)}
                        className="p-1.5 opacity-60 hover:opacity-100 rounded-lg hover:bg-white/10 transition-colors"
                        title="Copy result"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleRestoreHistory(item)}
                        className={`p-1.5 rounded-lg transition-colors text-xs font-semibold flex items-center gap-1 ${currentStyles.badge}`}
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

        {/* Tab 5: Themes & Customization (Dedicated solely to Calculator) */}
        {activeTab === 'themes' && (
          <div className="p-4 space-y-4 overflow-y-auto max-h-[60vh]">
            {/* Header / Intro */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold flex items-center gap-1.5">
                  <Sparkles className={`w-4 h-4 ${currentStyles.accentText}`} />
                  <span>Calculator Exclusive Skins</span>
                </h3>
                <p className="text-[11px] opacity-70">
                  Customizes only the calculator without altering your app theme.
                </p>
              </div>
              <button
                onClick={() => {
                  setCalcTheme('app-sync');
                  setFontStyle('digital');
                  showToast('Calculator theme reset to App Default', 'info');
                }}
                className="text-[10px] opacity-60 hover:opacity-100 underline"
              >
                Reset Default
              </button>
            </div>

            {/* Skins Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {CALC_THEMES.map((t) => {
                const isSelected = calcTheme === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => {
                      setCalcTheme(t.id);
                      playBeep('click');
                      showToast(`Applied ${t.name} skin to calculator!`, 'success');
                    }}
                    className={`p-3 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                      isSelected
                        ? 'ring-2 ring-current border-transparent shadow-lg scale-[1.02] bg-white/15 dark:bg-white/10'
                        : 'border-current/15 bg-black/5 dark:bg-white/5 hover:border-current/30'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1.5">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3.5 h-3.5 rounded-full shadow-sm"
                          style={{ backgroundColor: t.color }}
                        />
                        <span className="text-xs font-bold">{t.name}</span>
                      </div>
                      {isSelected && (
                        <CheckCircle2 className={`w-4 h-4 ${currentStyles.accentText}`} />
                      )}
                    </div>

                    <p className="text-[10px] opacity-70 line-clamp-2">
                      {t.desc}
                    </p>

                    {/* Gradient preview bar */}
                    <div
                      className={`h-1.5 w-full rounded-full mt-2.5 bg-gradient-to-r ${t.gradient}`}
                    />
                  </button>
                );
              })}
            </div>

            {/* Display Font Preference */}
            <div className="pt-2 border-t border-current/10 space-y-2">
              <label className="text-xs font-bold block">
                Display Font Style
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'digital', name: 'Digital LCD', preview: '88:88' },
                  { id: 'terminal', name: 'Terminal Mono', preview: '>_' },
                  { id: 'modern', name: 'Clean Modern', preview: '123' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => {
                      setFontStyle(f.id);
                      playBeep('click');
                    }}
                    className={`py-2 px-2.5 rounded-xl border text-center transition-all ${
                      fontStyle === f.id
                        ? 'bg-current/15 border-current font-bold'
                        : 'border-current/15 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <div className="text-xs">{f.name}</div>
                    <div className="text-[10px] opacity-60 font-mono mt-0.5">{f.preview}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Key Sound Preference */}
            <div className="pt-2 border-t border-current/10 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold">Keypad Tactile Sound</div>
                <div className="text-[10px] opacity-70">
                  Audio synthesis clicks when pressing calculator buttons
                </div>
              </div>
              <button
                onClick={() => {
                  const next = !soundEnabled;
                  setSoundEnabled(next);
                  if (next) playBeep('click');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  soundEnabled
                    ? 'bg-emerald-500 text-white shadow-md'
                    : 'bg-black/10 dark:bg-white/10 border border-current/20 opacity-70'
                }`}
              >
                {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                <span>{soundEnabled ? 'Enabled' : 'Muted'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Footer info bar */}
        <div className={`px-5 py-2.5 border-t flex items-center justify-between text-[11px] opacity-70 ${currentStyles.header}`}>
          <span>
            Press <kbd className="px-1.5 py-0.5 bg-black/10 dark:bg-white/10 rounded font-mono text-[10px]">Esc</kbd> to close
          </span>
          <button
            onClick={() => setIsCalculatorOpen(false)}
            className={`text-xs font-semibold hover:underline ${currentStyles.accentText}`}
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
