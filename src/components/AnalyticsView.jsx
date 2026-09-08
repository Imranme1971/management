import React from 'react';
import { useTaskContext } from '../context/TaskContext';
import {
  BarChart3,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Flame,
  ListTodo,
  TrendingUp,
  Award,
  Zap
} from 'lucide-react';

export const AnalyticsView = () => {
  const { tasks, columns, tags } = useTaskContext();

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const todayStr = new Date().toISOString().split('T')[0];
  const overdueTasks = tasks.filter(
    t => t.dueDate && t.dueDate < todayStr && t.status !== 'completed'
  ).length;

  const totalFocusMinutes = tasks.reduce((acc, t) => acc + (t.spentTime || 0), 0);
  const focusHours = (totalFocusMinutes / 60).toFixed(1);

  // Status Counts
  const statusCounts = columns.reduce((acc, col) => {
    acc[col.id] = tasks.filter(t => t.status === col.id).length;
    return acc;
  }, {});

  // Priority Counts
  const priorityCounts = {
    urgent: tasks.filter(t => t.priority === 'urgent').length,
    high: tasks.filter(t => t.priority === 'high').length,
    medium: tasks.filter(t => t.priority === 'medium').length,
    low: tasks.filter(t => t.priority === 'low').length,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Overview KPI Header */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Tasks */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Tasks
            </p>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">
              {totalTasks}
            </h3>
            <p className="text-xs text-slate-500 mt-1">Across all workflow stages</p>
          </div>
          <div className="p-3 bg-theme-light rounded-xl text-theme-primary">
            <ListTodo className="w-6 h-6" />
          </div>
        </div>

        {/* Completion Rate */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Completion Rate
            </p>
            <h3 className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
              {completionRate}%
            </h3>
            <p className="text-xs text-slate-500 mt-1">{completedTasks} of {totalTasks} finished</p>
          </div>
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 rounded-xl text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* Focus Hours */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Focus Time
            </p>
            <h3 className="text-2xl font-extrabold text-purple-600 dark:text-purple-400 mt-1">
              {focusHours} hrs
            </h3>
            <p className="text-xs text-slate-500 mt-1">{totalFocusMinutes} total focus minutes</p>
          </div>
          <div className="p-3 bg-purple-50 dark:bg-purple-950/60 rounded-xl text-purple-600 dark:text-purple-400">
            <Flame className="w-6 h-6" />
          </div>
        </div>

        {/* Overdue Count */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Overdue Tasks
            </p>
            <h3 className="text-2xl font-extrabold text-rose-600 dark:text-rose-400 mt-1">
              {overdueTasks}
            </h3>
            <p className="text-xs text-slate-500 mt-1">Requires immediate attention</p>
          </div>
          <div className="p-3 bg-rose-50 dark:bg-rose-950/60 rounded-xl text-rose-600 dark:text-rose-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Breakdown Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Status Distribution */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-theme-primary" /> Task Status Distribution
            </h3>
          </div>

          <div className="space-y-4">
            {columns.map(col => {
              const count = statusCounts[col.id] || 0;
              const pct = totalTasks > 0 ? Math.round((count / totalTasks) * 100) : 0;
              return (
                <div key={col.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-700 dark:text-slate-300">{col.title}</span>
                    <span className="text-slate-500">{count} tasks ({pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-2.5 rounded-full transition-all duration-500 ${
                        col.id === 'todo'
                          ? 'bg-slate-400'
                          : col.id === 'in_progress'
                          ? 'bg-theme-primary'
                          : col.id === 'review'
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Priority Breakdown */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" /> Priority Allocation
            </h3>
          </div>

          <div className="space-y-4">
            {[
              { label: 'Urgent', count: priorityCounts.urgent, color: 'bg-rose-500' },
              { label: 'High', count: priorityCounts.high, color: 'bg-amber-500' },
              { label: 'Medium', count: priorityCounts.medium, color: 'bg-blue-500' },
              { label: 'Low', count: priorityCounts.low, color: 'bg-slate-400' },
            ].map(p => {
              const pct = totalTasks > 0 ? Math.round((p.count / totalTasks) * 100) : 0;
              return (
                <div key={p.label} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-700 dark:text-slate-300">{p.label}</span>
                    <span className="text-slate-500">{p.count} tasks ({pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-2.5 rounded-full transition-all duration-500 ${p.color}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};
