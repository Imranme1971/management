import React, { useState } from 'react';
import { useTaskContext } from '../context/TaskContext';
import { X, Download, Upload, RotateCcw, CheckCircle2 } from 'lucide-react';

export const ExportImportModal = () => {
  const {
    isExportImportOpen,
    setIsExportImportOpen,
    exportTasksJSON,
    importTasksJSON,
    resetToDefaultData
  } = useTaskContext();

  const [jsonText, setJsonText] = useState('');

  if (!isExportImportOpen) return null;

  const handleImportSubmit = (e) => {
    e.preventDefault();
    if (!jsonText.trim()) return;
    const success = importTasksJSON(jsonText.trim());
    if (success) {
      setJsonText('');
      setIsExportImportOpen(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result;
      setJsonText(content);
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div
        className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-lg overflow-hidden p-6 space-y-5"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Download className="w-5 h-5 text-theme-primary" /> Data Backup & Migration
          </h2>
          <button
            onClick={() => setIsExportImportOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Export Action */}
        <div className="p-4 bg-theme-light rounded-2xl border border-theme-light flex items-center justify-between gap-4">
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
              Export Tasks as JSON
            </h4>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
              Download your current tasks, tags, subtasks, and logs to a backup file.
            </p>
          </div>
          <button
            onClick={exportTasksJSON}
            className="px-4 py-2 bg-theme-primary hover:bg-theme-primary-hover text-white font-semibold text-xs rounded-xl shadow-md shadow-theme-glow transition-all shrink-0 flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" /> Download JSON
          </button>
        </div>

        <div className="border-t border-slate-100 dark:border-slate-800 my-2"></div>

        {/* Import Action */}
        <form onSubmit={handleImportSubmit} className="space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Import Tasks from JSON
              </label>
              <label className="text-xs text-theme-primary font-semibold cursor-pointer hover:underline flex items-center gap-1">
                <Upload className="w-3.5 h-3.5" /> Upload File
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
            <textarea
              rows="4"
              value={jsonText}
              onChange={e => setJsonText(e.target.value)}
              placeholder="Paste JSON array data or upload a file above..."
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-theme-primary"
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={() => {
                resetToDefaultData();
                setIsExportImportOpen(false);
              }}
              className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1 font-medium"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset Demo Tasks
            </button>

            <button
              type="submit"
              disabled={!jsonText.trim()}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-semibold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" /> Restore Data
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
