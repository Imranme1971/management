import React, { useState } from 'react';
import { useTaskContext } from '../context/TaskContext';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus } from 'lucide-react';

export const CalendarView = () => {
  const { filteredTasks, openEditTaskModal, openCreateTaskModal } = useTaskContext();
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // First day of current month & total days
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Build grid calendar cells
  const calendarCells = [];

  // Previous month trailing days
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    calendarCells.push({
      dayNumber: daysInPrevMonth - i,
      isCurrentMonth: false,
      dateStr: null
    });
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const formattedMonth = String(month + 1).padStart(2, '0');
    const formattedDay = String(d).padStart(2, '0');
    const dateStr = `${year}-${formattedMonth}-${formattedDay}`;

    calendarCells.push({
      dayNumber: d,
      isCurrentMonth: true,
      dateStr
    });
  }

  // Next month leading days to complete 35 or 42 grid cells
  const remainingCells = (7 - (calendarCells.length % 7)) % 7;
  for (let i = 1; i <= remainingCells; i++) {
    calendarCells.push({
      dayNumber: i,
      isCurrentMonth: false,
      dateStr: null
    });
  }

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Month Navigation Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 mb-4 shadow-sm border border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-theme-light rounded-xl text-theme-primary">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {monthNames[month]} {year}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Manage deadlines & scheduled tasks
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={goToToday}
            className="px-3 py-1.5 text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg transition-colors"
          >
            Today
          </button>
          <div className="flex items-center rounded-lg border border-slate-200 dark:border-slate-700 p-0.5">
            <button
              onClick={prevMonth}
              className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md text-slate-600 dark:text-slate-300"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextMonth}
              className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md text-slate-600 dark:text-slate-300"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Days of week header */}
        <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-center text-xs font-bold text-slate-500 dark:text-slate-400 py-3 uppercase tracking-wider">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>

        {/* Days Cells */}
        <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-slate-100 dark:divide-slate-800">
          {calendarCells.map((cell, idx) => {
            const isToday = cell.dateStr === todayStr;
            const dayTasks = cell.dateStr
              ? filteredTasks.filter(t => t.dueDate === cell.dateStr)
              : [];

            return (
              <div
                key={idx}
                className={`min-h-[110px] p-2 transition-colors flex flex-col justify-between ${
                  !cell.isCurrentMonth
                    ? 'bg-slate-50/50 dark:bg-slate-950/40 opacity-40'
                    : 'hover:bg-slate-50/70 dark:hover:bg-slate-800/30'
                }`}
              >
                {/* Date Number Header */}
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      isToday
                        ? 'bg-theme-primary text-white shadow-md shadow-theme-glow'
                        : cell.isCurrentMonth
                        ? 'text-slate-700 dark:text-slate-300'
                        : 'text-slate-400 dark:text-slate-600'
                    }`}
                  >
                    {cell.dayNumber}
                  </span>

                  {cell.isCurrentMonth && (
                    <button
                      onClick={() => openCreateTaskModal('todo')}
                      className="opacity-0 group-hover:opacity-100 p-0.5 text-slate-400 hover:text-theme-primary rounded transition-opacity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Day Tasks List */}
                <div className="space-y-1 overflow-y-auto max-h-[85px] pr-0.5">
                  {dayTasks.map(task => (
                    <div
                      key={task.id}
                      onClick={() => openEditTaskModal(task)}
                      className={`px-2 py-1 rounded-md text-[11px] font-medium border truncate cursor-pointer transition-all hover:scale-[1.02] ${
                        task.status === 'completed'
                          ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20 line-through opacity-70'
                          : task.priority === 'urgent'
                          ? 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20'
                          : task.priority === 'high'
                          ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20'
                          : 'bg-theme-light text-theme-primary border-theme-light'
                      }`}
                      title={`${task.title} (${task.status})`}
                    >
                      {task.title}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
