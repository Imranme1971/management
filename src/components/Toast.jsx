import React from 'react';
import { useTaskContext } from '../context/TaskContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export const Toast = () => {
  const { toast } = useTaskContext();

  if (!toast) return null;

  const { message, type } = toast;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      default:
        return <Info className="w-4 h-4 text-indigo-500" />;
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 animate-bounce">
      <div className="flex items-center gap-2.5 px-4 py-3 bg-slate-900/95 dark:bg-slate-800/95 text-white text-xs font-semibold rounded-2xl shadow-2xl border border-slate-700/80 backdrop-blur-md">
        {getIcon()}
        <span>{message}</span>
      </div>
    </div>
  );
};
