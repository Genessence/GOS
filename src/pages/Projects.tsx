import React, { useState } from 'react';
import { Kanban, FileText, CheckCircle, Clock, Plus, BarChart4, Filter, Trash2, ArrowRight, ArrowLeft, X } from 'lucide-react';

interface KanbanTask {
  id: string;
  title: string;
  project: string;
  priority: 'High' | 'Medium' | 'Low';
}

interface KanbanColumn {
  id: 'todo' | 'progress' | 'done';
  title: string;
  tasks: KanbanTask[];
}

export const Projects: React.FC = () => {
  const [columns, setColumns] = useState<KanbanColumn[]>([
    {
      id: 'todo',
      title: 'To Do',
      tasks: [
        { id: 't-1', title: 'Define OAuth scopes', project: 'Integrations Hub', priority: 'High' },
        { id: 't-2', title: 'Design sidebar collapse states', project: 'Frontend UI', priority: 'Medium' }
      ]
    },
    {
      id: 'progress',
      title: 'In Progress',
      tasks: [
        { id: 't-3', title: 'Scaffold React folder structure', project: 'Core Layer', priority: 'High' }
      ]
    },
    {
      id: 'done',
      title: 'Completed',
      tasks: [
        { id: 't-4', title: 'Initialize Git workflow', project: 'Repository Setup', priority: 'Low' }
      ]
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskProject, setNewTaskProject] = useState('Core Layer');
  const [newTaskPriority, setNewTaskPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');

  const moveTask = (taskId: string, currentColumnId: string, direction: 'forward' | 'backward') => {
    let targetColumnId: 'todo' | 'progress' | 'done';
    
    if (currentColumnId === 'todo') {
      targetColumnId = 'progress';
    } else if (currentColumnId === 'progress') {
      targetColumnId = direction === 'forward' ? 'done' : 'todo';
    } else {
      targetColumnId = 'progress';
    }

    let foundTask: KanbanTask | null = null;
    
    // Remove task from old column and insert into new one
    const updatedColumns = columns.map(col => {
      if (col.id === currentColumnId) {
        foundTask = col.tasks.find(t => t.id === taskId) || null;
        return {
          ...col,
          tasks: col.tasks.filter(t => t.id !== taskId)
        };
      }
      return col;
    });

    if (foundTask) {
      const finalColumns = updatedColumns.map(col => {
        if (col.id === targetColumnId && foundTask) {
          return {
            ...col,
            tasks: [...col.tasks, foundTask]
          };
        }
        return col;
      });
      setColumns(finalColumns);
    }
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    const newTask: KanbanTask = {
      id: `t-${Math.floor(Math.random() * 1000)}`,
      title: newTaskTitle,
      project: newTaskProject,
      priority: newTaskPriority
    };

    setColumns(prev => prev.map(col => col.id === 'todo' ? { ...col, tasks: [...col.tasks, newTask] } : col));
    
    setNewTaskTitle('');
    setShowAddModal(false);
  };

  const deleteTask = (taskId: string, columnId: string) => {
    setColumns(prev => prev.map(col => col.id === columnId ? {
      ...col,
      tasks: col.tasks.filter(t => t.id !== taskId)
    } : col));
  };

  return (
    <div className="p-6 space-y-6 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white m-0 flex items-center space-x-2">
            <Kanban className="w-5 h-5 text-indigo-400" />
            <span>Projects & Kanban Board</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">Manage project boards, kanbans, and unified work context.</p>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-1 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold rounded-xl text-white transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Task</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((col) => (
          <div key={col.id} className="bg-[#101220] border border-slate-800/60 p-4 rounded-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-850 pb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">{col.title}</h3>
              <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded-full text-slate-300 font-semibold">{col.tasks.length}</span>
            </div>

            <div className="space-y-3">
              {col.tasks.map((task) => (
                <div key={task.id} className="bg-[#141624]/60 border border-slate-800/80 p-4 rounded-xl space-y-3 hover:border-slate-700/80 transition-all">
                  <div>
                    <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-wider">{task.project}</span>
                    <h4 className="text-xs font-semibold text-white mt-1 leading-tight">{task.title}</h4>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 pt-2 border-t border-slate-800/30">
                    <span className={`font-semibold px-2 py-0.5 rounded ${
                      task.priority === 'High' ? 'bg-rose-500/10 text-rose-400' :
                      task.priority === 'Medium' ? 'bg-amber-500/10 text-amber-400' : 'bg-slate-800 text-slate-400'
                    }`}>{task.priority}</span>
                    
                    {/* Shift controllers and delete */}
                    <div className="flex items-center space-x-1">
                      {col.id !== 'todo' && (
                        <button 
                          onClick={() => moveTask(task.id, col.id, 'backward')}
                          className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
                          title="Move Left"
                        >
                          <ArrowLeft className="w-3 h-3" />
                        </button>
                      )}
                      
                      <button 
                        onClick={() => deleteTask(task.id, col.id)}
                        className="p-1 rounded hover:bg-slate-800 text-slate-500 hover:text-rose-400"
                        title="Delete Task"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>

                      {col.id !== 'done' && (
                        <button 
                          onClick={() => moveTask(task.id, col.id, 'forward')}
                          className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
                          title="Move Right"
                        >
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {col.tasks.length === 0 && (
                <div className="border border-dashed border-slate-800/40 rounded-xl py-12 text-center text-xs text-slate-500">
                  No tasks here
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Task Creation Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-[#101220] border border-slate-800 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-slate-800/60 flex items-center justify-between bg-[#0c0d14]">
              <span className="text-xs font-bold text-white uppercase tracking-wider">Create New Task</span>
              <button 
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/40 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <form onSubmit={handleCreateTask} className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Task Title</label>
                <input
                  type="text"
                  required
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="Task title details..."
                  className="w-full bg-[#141624] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Project Cluster</label>
                <input
                  type="text"
                  required
                  value={newTaskProject}
                  onChange={(e) => setNewTaskProject(e.target.value)}
                  placeholder="Core Layer, Frontend UI..."
                  className="w-full bg-[#141624] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Priority</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['High', 'Medium', 'Low'] as const).map((pri) => (
                    <button
                      key={pri}
                      type="button"
                      onClick={() => setNewTaskPriority(pri)}
                      className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all ${
                        newTaskPriority === pri
                          ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400'
                          : 'border-slate-800 bg-[#141624] text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {pri}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-800 hover:bg-slate-800/40 text-xs font-semibold rounded-xl text-slate-400 hover:text-slate-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-all cursor-pointer"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default Projects;
