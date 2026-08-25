
import React, { useState, useMemo } from 'react';
import { Task, Submission } from '../types';
import TaskSubmissionModal from './TaskSubmissionModal';

interface Props {
  tasks: Task[];
  onStartTask: (task: Task) => Promise<Submission>;
  onSaveDraft: (submission: Submission, file: File | null, note: string) => Promise<void>;
  onSubmitDraft: (submission: Submission, file: File | null, note: string) => Promise<void>;
}

const CATEGORY_ORDER: Task['category'][] = ['Referral', 'Service', 'Content', 'Coordination'];

const TasksView: React.FC<Props> = ({ tasks, onStartTask, onSaveDraft, onSubmitDraft }) => {
  const [search, setSearch] = useState('');
  const [startingTaskId, setStartingTaskId] = useState<string | null>(null);
  const [activeDraft, setActiveDraft] = useState<Submission | null>(null);
  const [error, setError] = useState<string | null>(null);

  const groupedTasks = useMemo(() => {
    const query = search.trim().toLowerCase();
    const filtered = query
      ? tasks.filter(t => t.title.toLowerCase().includes(query) || t.description.toLowerCase().includes(query))
      : tasks;

    return CATEGORY_ORDER
      .map(category => ({ category, items: filtered.filter(t => t.category === category) }))
      .filter(group => group.items.length > 0);
  }, [tasks, search]);

  const handleStartTask = async (task: Task) => {
    setStartingTaskId(task.id);
    setError(null);
    try {
      const draft = await onStartTask(task);
      setActiveDraft(draft);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start this task.');
    } finally {
      setStartingTaskId(null);
    }
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-4xl font-serif font-bold text-slate-800">Mindful Tasks</h1>
        <p className="text-slate-500 mt-2">Earn Lotus Points by investing in yourself.</p>
      </header>

      <div className="relative">
        <i className="fa-solid fa-magnifying-glass absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"></i>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tasks..."
          className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-12 pr-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-200 transition-all"
        />
      </div>

      {error && (
        <p className="text-sm text-rose-600 bg-rose-50 border border-rose-100 rounded-xl p-3">{error}</p>
      )}

      {groupedTasks.length > 0 ? (
        <div className="space-y-10">
          {groupedTasks.map(({ category, items }) => (
            <section key={category}>
              <h2 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2">
                {category}
                <span className="text-xs font-medium text-slate-400">({items.length})</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((task) => (
                  <div key={task.id} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all flex flex-col group">
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-rose-500 group-hover:bg-rose-500 group-hover:text-white transition-colors duration-300 mb-4">
                      <i className={`fa-solid ${task.icon} text-xl`}></i>
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">{task.title}</h3>
                    <p className="text-slate-500 text-sm flex-grow">{task.description}</p>
                    <div className="mt-6 flex items-center justify-between">
                      <div className="flex items-center gap-1 text-rose-500 font-bold">
                        <i className="fa-solid fa-leaf text-sm"></i>
                        <span>{task.points}</span>
                      </div>
                      <button
                        onClick={() => handleStartTask(task)}
                        disabled={startingTaskId === task.id}
                        className="bg-slate-900 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-slate-800 transition-colors active:scale-95 disabled:opacity-50"
                      >
                        {startingTaskId === task.id ? 'Starting...' : 'Start Task'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-slate-400">
          <i className="fa-solid fa-magnifying-glass text-4xl mb-3 block opacity-20"></i>
          <p>No tasks match "{search}".</p>
        </div>
      )}

      {activeDraft && (
        <TaskSubmissionModal
          submission={activeDraft}
          onClose={() => setActiveDraft(null)}
          onSave={(file, note) => onSaveDraft(activeDraft, file, note)}
          onSubmit={(file, note) => onSubmitDraft(activeDraft, file, note)}
        />
      )}
    </div>
  );
};

export default TasksView;
