import React, { useState, useEffect } from 'react';
import { useTaskContext } from '../context/TaskContext';
import {
  X,
  Plus,
  Trash2,
  Calendar,
  Clock,
  Tag,
  AlignLeft,
  CheckSquare,
  Link as LinkIcon
} from 'lucide-react';

export const TaskModal = () => {
  const {
    isTaskModalOpen,
    closeTaskModal,
    editingTask,
    addTask,
    updateTask,
    columns,
    tags
  } = useTaskContext();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('todo');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [estimatedTime, setEstimatedTime] = useState(60);
  const [selectedTags, setSelectedTags] = useState([]);
  const [subtasks, setSubtasks] = useState([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [link, setLink] = useState('');

  const isEditMode = Boolean(editingTask && editingTask.id);

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title || '');
      setDescription(editingTask.description || '');
      setStatus(editingTask.status || 'todo');
      setPriority(editingTask.priority || 'medium');
      setDueDate(editingTask.dueDate || '');
      setEstimatedTime(editingTask.estimatedTime || 60);
      setSelectedTags(editingTask.tags || []);
      setSubtasks(editingTask.subtasks || []);
      setLink(editingTask.link || '');
    } else {
      setTitle('');
      setDescription('');
      setStatus('todo');
      setPriority('medium');
      setDueDate('');
      setEstimatedTime(60);
      setSelectedTags([]);
      setSubtasks([]);
      setLink('');
    }
  }, [editingTask]);

  if (!isTaskModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const taskPayload = {
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
      dueDate,
      estimatedTime: Number(estimatedTime) || 0,
      tags: selectedTags,
      subtasks,
      link: link.trim()
    };

    if (isEditMode) {
      updateTask(editingTask.id, taskPayload);
    } else {
      addTask(taskPayload);
    }

    closeTaskModal();
  };

  const toggleTag = (tagId) => {
    setSelectedTags(prev =>
      prev.includes(tagId) ? prev.filter(t => t !== tagId) : [...prev, tagId]
    );
  };

  const handleAddSubtask = () => {
    if (!newSubtaskTitle.trim()) return;
    const newSub = {
      id: `sub-${Date.now()}`,
      title: newSubtaskTitle.trim(),
      completed: false,
    };
    setSubtasks(prev => [...prev, newSub]);
    setNewSubtaskTitle('');
  };

  const handleToggleSubtask = (subId) => {
    setSubtasks(prev =>
      prev.map(s => (s.id === subId ? { ...s, completed: !s.completed } : s))
    );
  };

  const handleDeleteSubtask = (subId) => {
    setSubtasks(prev => prev.filter(s => s.id !== subId));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {isEditMode ? 'Edit Task Details' : 'Create New Task'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isEditMode ? 'Modify properties and track subtasks' : 'Add task details, estimation, and milestones'}
            </p>
          </div>
          <button
            onClick={closeTaskModal}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Content */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Task Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Redesign Navbar & Fix Mobile Responsive Layout"
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-theme-primary focus:bg-white dark:focus:bg-slate-900 transition-all"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1">
              <AlignLeft className="w-3.5 h-3.5 text-slate-400" /> Description
            </label>
            <textarea
              rows="3"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Add key context, acceptance criteria, or technical implementation notes..."
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-theme-primary focus:bg-white dark:focus:bg-slate-900 transition-all resize-y"
            />
          </div>

          {/* Status & Priority Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Status */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Workflow Stage
              </label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-slate-100 font-medium focus:outline-none focus:ring-2 focus:ring-theme-primary"
              >
                {columns.map(col => (
                  <option key={col.id} value={col.id}>
                    {col.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Priority Level
              </label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-slate-100 font-medium focus:outline-none focus:ring-2 focus:ring-theme-primary"
              >
                <option value="urgent">🔴 Urgent</option>
                <option value="high">🟠 High</option>
                <option value="medium">🟡 Medium</option>
                <option value="low">🟢 Low</option>
              </select>
            </div>

          </div>

          {/* Due Date & Estimated Minutes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" /> Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-slate-100 font-medium focus:outline-none focus:ring-2 focus:ring-theme-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" /> Estimated Time (minutes)
              </label>
              <input
                type="number"
                min="0"
                step="15"
                value={estimatedTime}
                onChange={e => setEstimatedTime(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-slate-100 font-medium focus:outline-none focus:ring-2 focus:ring-theme-primary"
              />
            </div>
          </div>

          {/* Tag Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-slate-400" /> Categories / Tags
            </label>
            <div className="flex flex-wrap gap-2 mt-1">
              {tags.map(tag => {
                const isSelected = selectedTags.includes(tag.id);
                return (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => toggleTag(tag.id)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${
                      isSelected
                        ? 'bg-theme-primary text-white border-theme-primary shadow-xs'
                        : `${tag.color} hover:opacity-80`
                    }`}
                  >
                    {tag.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Subtasks / Checklist */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <CheckSquare className="w-3.5 h-3.5 text-slate-400" /> Action Items / Subtasks
              </span>
              <span className="text-[11px] text-slate-500 font-normal">
                {subtasks.filter(s => s.completed).length} / {subtasks.length} completed
              </span>
            </label>

            {/* List of existing subtasks */}
            <div className="space-y-2 mb-2 max-h-36 overflow-y-auto">
              {subtasks.map(sub => (
                <div
                  key={sub.id}
                  className="flex items-center justify-between gap-2 p-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800 text-xs"
                >
                  <label className="flex items-center gap-2 cursor-pointer flex-1">
                    <input
                      type="checkbox"
                      checked={sub.completed}
                      onChange={() => handleToggleSubtask(sub.id)}
                      className="rounded text-theme-primary focus:ring-theme-primary w-4 h-4"
                    />
                    <span className={sub.completed ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200'}>
                      {sub.title}
                    </span>
                  </label>
                  <button
                    type="button"
                    onClick={() => handleDeleteSubtask(sub.id)}
                    className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Subtask Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newSubtaskTitle}
                onChange={e => setNewSubtaskTitle(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSubtask();
                  }
                }}
                placeholder="Add a step or subtask..."
                className="flex-1 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-theme-primary"
              />
              <button
                type="button"
                onClick={handleAddSubtask}
                className="px-3 py-1.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>
          </div>

          {/* Reference Link */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1">
              <LinkIcon className="w-3.5 h-3.5 text-slate-400" /> Reference URL / Link (Optional)
            </label>
            <input
              type="url"
              value={link}
              onChange={e => setLink(e.target.value)}
              placeholder="https://github.com/..."
              className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-theme-primary"
            />
          </div>

          {/* Modal Footer Buttons */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={closeTaskModal}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold bg-theme-primary hover:bg-theme-primary-hover text-white rounded-xl shadow-lg shadow-theme-glow transition-all"
            >
              {isEditMode ? 'Save Changes' : 'Create Task'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
