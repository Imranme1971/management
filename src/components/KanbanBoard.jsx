import React, { useState } from 'react';
import { useTaskContext } from '../context/TaskContext';
import {
  Plus,
  Clock,
  MoreVertical,
  Timer,
  Edit2,
  Trash2,
  Calendar,
  CheckSquare
} from 'lucide-react';

export const KanbanBoard = () => {
  const {
    columns,
    filteredTasks,
    openCreateTaskModal,
    openEditTaskModal,
    deleteTask,
    moveTaskStatus,
    startPomodoroForTask,
    tags
  } = useTaskContext();

  const [draggedTaskId, setDraggedTaskId] = useState(null);
  const [dragOverColumnId, setDragOverColumnId] = useState(null);
  const [activeMenuTaskId, setActiveMenuTaskId] = useState(null);

  // Drag and Drop handlers
  const handleDragStart = (e, taskId) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.setData('text/plain', taskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, columnId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverColumnId !== columnId) {
      setDragOverColumnId(columnId);
    }
  };

  const handleDragLeave = (columnId) => {
    if (dragOverColumnId === columnId) {
      setDragOverColumnId(null);
    }
  };

  const handleDrop = (e, columnId) => {
    e.preventDefault();
    setDragOverColumnId(null);
    const taskId = e.dataTransfer.getData('text/plain') || draggedTaskId;
    if (taskId) {
      moveTaskStatus(taskId, columnId);
      setDraggedTaskId(null);
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'urgent':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            Urgent
          </span>
        );
      case 'high':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            High
          </span>
        );
      case 'medium':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            Medium
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
            Low
          </span>
        );
    }
  };

  const isDueSoonOrPast = (dueDateStr) => {
    if (!dueDateStr) return false;
    const due = new Date(dueDateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return due <= today;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-start">
        {columns.map(column => {
          const columnTasks = filteredTasks.filter(t => t.status === column.id);
          const isOver = dragOverColumnId === column.id;

          return (
            <div
              key={column.id}
              onDragOver={e => handleDragOver(e, column.id)}
              onDragLeave={() => handleDragLeave(column.id)}
              onDrop={e => handleDrop(e, column.id)}
              className={`flex flex-col rounded-2xl bg-slate-100/70 dark:bg-slate-900/50 border transition-all duration-200 min-h-[500px] p-3 ${
                isOver
                  ? 'border-theme-primary ring-2 ring-theme-primary bg-theme-light'
                  : 'border-slate-200/80 dark:border-slate-800/80'
              }`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 px-1 border-b border-slate-200/60 dark:border-slate-800/60">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      column.id === 'todo'
                        ? 'bg-slate-400'
                        : column.id === 'in_progress'
                        ? 'bg-theme-primary'
                        : column.id === 'review'
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                  />
                  <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">
                    {column.title}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    {columnTasks.length}
                  </span>
                </div>

                <button
                  onClick={() => openCreateTaskModal(column.id)}
                  className="p-1 text-slate-500 hover:text-theme-primary hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-lg transition-colors"
                  title={`Add task to ${column.title}`}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Task Cards Stack */}
              <div className="flex-1 space-y-3 mt-3 overflow-y-auto max-h-[calc(100vh-220px)] pr-0.5">
                {columnTasks.length === 0 ? (
                  <div className="h-32 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl flex flex-col items-center justify-center text-slate-400 dark:text-slate-600">
                    <p className="text-xs font-medium">No tasks here</p>
                    <button
                      onClick={() => openCreateTaskModal(column.id)}
                      className="mt-1.5 text-[11px] text-theme-primary hover:underline font-semibold"
                    >
                      + Create one
                    </button>
                  </div>
                ) : (
                  columnTasks.map(task => {
                    const completedSubtasks = (task.subtasks || []).filter(s => s.completed).length;
                    const totalSubtasks = (task.subtasks || []).length;
                    const subtaskPercent = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;
                    const isDueWarning = isDueSoonOrPast(task.dueDate) && task.status !== 'completed';

                    return (
                      <div
                        key={task.id}
                        draggable
                        onDragStart={e => handleDragStart(e, task.id)}
                        className={`group relative bg-white dark:bg-slate-800/90 rounded-xl p-4 shadow-sm hover:shadow-md border border-slate-200/80 dark:border-slate-700/60 transition-all duration-200 cursor-grab active:cursor-grabbing hover:-translate-y-0.5 ${
                          draggedTaskId === task.id ? 'opacity-40 scale-95' : ''
                        }`}
                      >
                        {/* Top Metadata Row: Priority & Actions */}
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex flex-wrap items-center gap-1.5">
                            {getPriorityBadge(task.priority)}
                            
                            {/* Tags */}
                            {(task.tags || []).map(tagId => {
                              const tagObj = tags.find(t => t.id === tagId);
                              if (!tagObj) return null;
                              return (
                                <span
                                  key={tagId}
                                  className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${tagObj.color}`}
                                >
                                  {tagObj.name}
                                </span>
                              );
                            })}
                          </div>

                          {/* Action Options Dropdown trigger */}
                          <div className="relative">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveMenuTaskId(activeMenuTaskId === task.id ? null : task.id);
                              }}
                              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700/50"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>

                            {/* Dropdown Menu */}
                            {activeMenuTaskId === task.id && (
                              <div
                                onMouseLeave={() => setActiveMenuTaskId(null)}
                                className="absolute right-0 top-6 z-20 w-44 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-1 text-xs"
                              >
                                <button
                                  onClick={() => {
                                    setActiveMenuTaskId(null);
                                    openEditTaskModal(task);
                                  }}
                                  className="w-full px-3 py-2 text-left text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2"
                                >
                                  <Edit2 className="w-3.5 h-3.5" /> Edit Details
                                </button>

                                <button
                                  onClick={() => {
                                    setActiveMenuTaskId(null);
                                    startPomodoroForTask(task);
                                  }}
                                  className="w-full px-3 py-2 text-left text-theme-primary hover:bg-theme-light flex items-center gap-2"
                                >
                                  <Timer className="w-3.5 h-3.5" /> Start Focus Session
                                </button>

                                <div className="border-t border-slate-100 dark:border-slate-700 my-1"></div>

                                {/* Status Move Shortcuts */}
                                <div className="px-3 py-1 text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                                  Move to
                                </div>
                                {columns.map(col => {
                                  if (col.id === task.status) return null;
                                  return (
                                    <button
                                      key={col.id}
                                      onClick={() => {
                                        setActiveMenuTaskId(null);
                                        moveTaskStatus(task.id, col.id);
                                      }}
                                      className="w-full px-3 py-1.5 text-left text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-1.5"
                                    >
                                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                                      <span>{col.title}</span>
                                    </button>
                                  );
                                })}

                                <div className="border-t border-slate-100 dark:border-slate-700 my-1"></div>

                                <button
                                  onClick={() => {
                                    setActiveMenuTaskId(null);
                                    deleteTask(task.id);
                                  }}
                                  className="w-full px-3 py-2 text-left text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2"
                                >
                                  <Trash2 className="w-3.5 h-3.5" /> Delete Task
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Title & Description */}
                        <h4
                          onClick={() => openEditTaskModal(task)}
                          className="font-semibold text-sm text-slate-900 dark:text-slate-100 hover:text-theme-primary transition-colors line-clamp-2 cursor-pointer mb-1.5"
                        >
                          {task.title}
                        </h4>

                        {task.description && (
                          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-3 leading-relaxed">
                            {task.description}
                          </p>
                        )}

                        {/* Subtasks Progress */}
                        {totalSubtasks > 0 && (
                          <div className="mb-3 space-y-1">
                            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                              <span className="flex items-center gap-1">
                                <CheckSquare className="w-3 h-3 text-theme-primary" /> Subtasks
                              </span>
                              <span>{completedSubtasks}/{totalSubtasks} ({subtaskPercent}%)</span>
                            </div>
                            <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                              <div
                                className="bg-theme-primary h-1.5 rounded-full transition-all duration-300"
                                style={{ width: `${subtaskPercent}%` }}
                              />
                            </div>
                          </div>
                        )}

                        {/* Footer Info: Due Date, Time Spent, Focus Trigger */}
                        <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between gap-2 text-xs">
                          {/* Due Date Indicator */}
                          {task.dueDate ? (
                            <div
                              className={`flex items-center gap-1 text-[11px] font-medium ${
                                isDueWarning
                                  ? 'text-rose-600 dark:text-rose-400 font-semibold'
                                  : 'text-slate-500 dark:text-slate-400'
                              }`}
                            >
                              <Calendar className="w-3.5 h-3.5" />
                              <span>{task.dueDate}</span>
                            </div>
                          ) : (
                            <div />
                          )}

                          {/* Time Spent & Focus Button */}
                          <div className="flex items-center gap-2">
                            {task.spentTime > 0 && (
                              <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                <Clock className="w-3 h-3 text-theme-primary" />
                                {task.spentTime}m
                              </span>
                            )}

                            <button
                              onClick={() => startPomodoroForTask(task)}
                              className="p-1 rounded-md text-slate-400 hover:text-theme-primary hover:bg-theme-light transition-colors"
                              title="Start Focus Timer"
                            >
                              <Timer className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
