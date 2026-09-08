import React, { useState } from 'react';
import { useTaskContext } from '../context/TaskContext';
import {
  CheckCircle2,
  Circle,
  Edit2,
  Trash2,
  Timer,
  ArrowUpDown,
  Calendar
} from 'lucide-react';

export const ListView = () => {
  const {
    filteredTasks,
    columns,
    tags,
    openEditTaskModal,
    moveTaskStatus,
    deleteTask,
    batchCompleteTasks,
    batchDeleteTasks,
    startPomodoroForTask
  } = useTaskContext();

  const [selectedTaskIds, setSelectedTaskIds] = useState([]);
  const [sortField, setSortField] = useState('dueDate');
  const [sortOrder, setSortOrder] = useState('asc');

  // Select all logic
  const isAllSelected = filteredTasks.length > 0 && selectedTaskIds.length === filteredTasks.length;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedTaskIds([]);
    } else {
      setSelectedTaskIds(filteredTasks.map(t => t.id));
    }
  };

  const toggleSelectTask = (id) => {
    setSelectedTaskIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Sorted tasks
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    let aVal = a[sortField] || '';
    let bVal = b[sortField] || '';

    if (sortField === 'priority') {
      const pWeights = { urgent: 4, high: 3, medium: 2, low: 1 };
      aVal = pWeights[a.priority] || 0;
      bVal = pWeights[b.priority] || 0;
    }

    if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'urgent':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">Urgent</span>;
      case 'high':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">High</span>;
      case 'medium':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">Medium</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20">Low</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Batch Action Toolbar */}
      {selectedTaskIds.length > 0 && (
        <div className="mb-4 p-3 bg-theme-light border border-theme-light rounded-xl flex items-center justify-between gap-4 transition-all">
          <span className="text-xs font-semibold text-theme-primary">
            {selectedTaskIds.length} task(s) selected
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                batchCompleteTasks(selectedTaskIds);
                setSelectedTaskIds([]);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors shadow-xs"
            >
              <CheckCircle2 className="w-3.5 h-3.5" /> Mark Completed
            </button>
            <button
              onClick={() => {
                batchDeleteTasks(selectedTaskIds);
                setSelectedTaskIds([]);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-colors shadow-xs"
            >
              <Trash2 className="w-3.5 h-3.5" /> Delete Selected
            </button>
          </div>
        </div>
      )}

      {/* Main Table Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={toggleSelectAll}
                    className="rounded border-slate-300 dark:border-slate-700 text-theme-primary focus:ring-theme-primary"
                  />
                </th>
                <th
                  onClick={() => handleSort('title')}
                  className="py-3.5 px-4 cursor-pointer hover:text-slate-900 dark:hover:text-slate-200"
                >
                  <div className="flex items-center gap-1">
                    <span>Task Title</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('status')}
                  className="py-3.5 px-4 cursor-pointer hover:text-slate-900 dark:hover:text-slate-200"
                >
                  <div className="flex items-center gap-1">
                    <span>Status</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('priority')}
                  className="py-3.5 px-4 cursor-pointer hover:text-slate-900 dark:hover:text-slate-200"
                >
                  <div className="flex items-center gap-1">
                    <span>Priority</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3.5 px-4">Tags</th>
                <th
                  onClick={() => handleSort('dueDate')}
                  className="py-3.5 px-4 cursor-pointer hover:text-slate-900 dark:hover:text-slate-200"
                >
                  <div className="flex items-center gap-1">
                    <span>Due Date</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3.5 px-4 text-center">Subtasks</th>
                <th className="py-3.5 px-4 text-center">Time Spent</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {sortedTasks.length === 0 ? (
                <tr>
                  <td colSpan="9" className="py-12 text-center text-slate-400 dark:text-slate-500">
                    No tasks found matching your criteria.
                  </td>
                </tr>
              ) : (
                sortedTasks.map(task => {
                  const isSelected = selectedTaskIds.includes(task.id);
                  const isCompleted = task.status === 'completed';
                  const completedSubtasks = (task.subtasks || []).filter(s => s.completed).length;
                  const totalSubtasks = (task.subtasks || []).length;

                  return (
                    <tr
                      key={task.id}
                      className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors ${
                        isSelected ? 'bg-theme-light' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-3 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectTask(task.id)}
                          className="rounded border-slate-300 dark:border-slate-700 text-theme-primary focus:ring-theme-primary"
                        />
                      </td>

                      {/* Title & Quick toggle */}
                      <td className="py-3 px-4">
                        <div className="flex items-start gap-2.5">
                          <button
                            onClick={() =>
                              moveTaskStatus(task.id, isCompleted ? 'todo' : 'completed')
                            }
                            className="mt-0.5 text-slate-400 hover:text-emerald-500 transition-colors shrink-0"
                          >
                            {isCompleted ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-emerald-500/10" />
                            ) : (
                              <Circle className="w-4 h-4" />
                            )}
                          </button>
                          <div>
                            <span
                              onClick={() => openEditTaskModal(task)}
                              className={`font-semibold cursor-pointer hover:text-theme-primary transition-colors ${
                                isCompleted
                                  ? 'line-through text-slate-400 dark:text-slate-500 font-normal'
                                  : 'text-slate-900 dark:text-slate-100'
                              }`}
                            >
                              {task.title}
                            </span>
                            {task.description && (
                              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                                {task.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Status Dropdown */}
                      <td className="py-3 px-4">
                        <select
                          value={task.status}
                          onChange={e => moveTaskStatus(task.id, e.target.value)}
                          className={`text-xs font-semibold rounded-lg px-2.5 py-1 border focus:outline-none ${
                            task.status === 'completed'
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                              : task.status === 'in_progress'
                              ? 'bg-theme-light text-theme-primary border-theme-light'
                              : task.status === 'review'
                              ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                              : 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20'
                          }`}
                        >
                          {columns.map(c => (
                            <option key={c.id} value={c.id}>
                              {c.title}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Priority */}
                      <td className="py-3 px-4">{getPriorityBadge(task.priority)}</td>

                      {/* Tags */}
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {(task.tags || []).map(tId => {
                            const tagObj = tags.find(t => t.id === tId);
                            if (!tagObj) return null;
                            return (
                              <span
                                key={tId}
                                className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${tagObj.color}`}
                              >
                                {tagObj.name}
                              </span>
                            );
                          })}
                        </div>
                      </td>

                      {/* Due Date */}
                      <td className="py-3 px-4 text-xs font-medium text-slate-600 dark:text-slate-300">
                        {task.dueDate ? (
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            <span>{task.dueDate}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>

                      {/* Subtasks Count */}
                      <td className="py-3 px-4 text-center text-xs font-medium text-slate-600 dark:text-slate-300">
                        {totalSubtasks > 0 ? (
                          <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-md">
                            {completedSubtasks}/{totalSubtasks}
                          </span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>

                      {/* Focus Spent Time */}
                      <td className="py-3 px-4 text-center font-mono text-xs text-slate-600 dark:text-slate-300">
                        {task.spentTime > 0 ? `${task.spentTime}m` : '-'}
                      </td>

                      {/* Action buttons */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => startPomodoroForTask(task)}
                            className="p-1.5 text-slate-400 hover:text-theme-primary hover:bg-theme-light rounded-lg transition-colors"
                            title="Start Focus Timer"
                          >
                            <Timer className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openEditTaskModal(task)}
                            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                            title="Edit Task"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteTask(task.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                            title="Delete Task"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
