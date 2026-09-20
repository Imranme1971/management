import React from 'react';
import { useTaskContext } from '../context/TaskContext';
import {
  Kanban,
  List,
  Calendar as CalendarIcon,
  BarChart3,
  Search,
  Plus,
  Timer,
  Calculator,
  Download,
  Filter,
  X,
  RotateCcw
} from 'lucide-react';

export const Header = () => {
  const {
    currentView,
    setCurrentView,
    searchQuery,
    setSearchQuery,
    priorityFilter,
    setPriorityFilter,
    tagFilter,
    setTagFilter,
    tags,
    openCreateTaskModal,
    startPomodoroForTask,
    setIsExportImportOpen,
    setIsCalculatorOpen,
    resetToDefaultData,
    tasks
  } = useTaskContext();

  const isFiltered = searchQuery || priorityFilter !== 'all' || tagFilter !== 'all';

  const clearFilters = () => {
    setSearchQuery('');
    setPriorityFilter('all');
    setTagFilter('all');
  };

  return (
    <header className="sticky top-0 z-30 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand / Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-xl theme-gradient-bg flex items-center justify-center text-white shadow-lg shadow-theme-glow transition-all duration-300">
              <Kanban className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight theme-gradient-text">
                  Imran Khan
                </span>
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-theme-light text-theme-primary rounded-full border border-theme-light transition-colors">
                  PRO
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
                Task & Focus Engine
              </p>
            </div>
          </div>

          {/* Navigation View Switcher */}
          <nav className="flex items-center p-1 bg-slate-100 dark:bg-slate-800/70 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
            <button
              onClick={() => setCurrentView('kanban')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                currentView === 'kanban'
                  ? 'bg-white dark:bg-slate-700 text-theme-primary shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Kanban className="w-4 h-4" />
              <span className="hidden md:inline">Kanban</span>
            </button>

            <button
              onClick={() => setCurrentView('list')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                currentView === 'list'
                  ? 'bg-white dark:bg-slate-700 text-theme-primary shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <List className="w-4 h-4" />
              <span className="hidden md:inline">List</span>
            </button>

            <button
              onClick={() => setCurrentView('calendar')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                currentView === 'calendar'
                  ? 'bg-white dark:bg-slate-700 text-theme-primary shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <CalendarIcon className="w-4 h-4" />
              <span className="hidden md:inline">Calendar</span>
            </button>

            <button
              onClick={() => setCurrentView('analytics')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                currentView === 'analytics'
                  ? 'bg-white dark:bg-slate-700 text-theme-primary shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span className="hidden md:inline">Analytics</span>
            </button>
          </nav>

          {/* Quick Action Tools */}
          <div className="flex items-center gap-2">
            
            {/* Pomodoro Launcher */}
            <button
              onClick={() => startPomodoroForTask(tasks[0] || null)}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Focus Timer (Pomodoro)"
            >
              <Timer className="w-5 h-5 text-theme-primary" />
            </button>

            {/* Calculator Launcher */}
            <button
              onClick={() => setIsCalculatorOpen(true)}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative group"
              title="Productivity Calculator"
            >
              <Calculator className="w-5 h-5 text-slate-600 dark:text-slate-300 group-hover:text-theme-primary transition-colors" />
            </button>

            {/* Export / Import Modal */}
            <button
              onClick={() => setIsExportImportOpen(true)}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Backup / Export JSON"
            >
              <Download className="w-5 h-5" />
            </button>

            {/* Create Task Button */}
            <button
              onClick={() => openCreateTaskModal('todo')}
              className="flex items-center gap-1.5 px-4 py-2 bg-theme-primary hover:bg-theme-primary-hover active:opacity-90 text-white rounded-xl font-semibold text-sm shadow-lg shadow-theme-glow transition-all duration-150 transform hover:-translate-y-0.5"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>New Task</span>
            </button>
          </div>

        </div>

        {/* Sub-Header: Search & Filter Toolbar */}
        <div className="py-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
          
          {/* Search Input */}
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search tasks, descriptions, or tags..."
              className="w-full pl-9 pr-8 py-1.5 bg-slate-100 dark:bg-slate-800/80 text-xs sm:text-sm rounded-lg border border-transparent focus:border-theme-primary focus:bg-white dark:focus:bg-slate-900 focus:outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Priority Filter */}
            <div className="flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-slate-400 hidden sm:inline" />
              <select
                value={priorityFilter}
                onChange={e => setPriorityFilter(e.target.value)}
                className="px-2.5 py-1.5 bg-slate-100 dark:bg-slate-800 text-xs rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-theme-primary"
              >
                <option value="all">All Priorities</option>
                <option value="urgent">🔴 Urgent</option>
                <option value="high">🟠 High</option>
                <option value="medium">🟡 Medium</option>
                <option value="low">🟢 Low</option>
              </select>
            </div>

            {/* Tag Filter */}
            <select
              value={tagFilter}
              onChange={e => setTagFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-100 dark:bg-slate-800 text-xs rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-theme-primary"
            >
              <option value="all">All Tags</option>
              {tags.map(tag => (
                <option key={tag.id} value={tag.id}>
                  {tag.name}
                </option>
              ))}
            </select>

            {/* Clear Filters reset */}
            {isFiltered && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors font-medium"
              >
                <X className="w-3.5 h-3.5" />
                <span>Clear Filters</span>
              </button>
            )}

            {/* Reset to Demo Data button */}
            <button
              onClick={resetToDefaultData}
              className="flex items-center gap-1 px-2 py-1 text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors ml-1"
              title="Reset tasks to sample dataset"
            >
              <RotateCcw className="w-3 h-3" />
              <span className="hidden sm:inline">Reset Demo</span>
            </button>
          </div>

        </div>

      </div>
    </header>
  );
};
