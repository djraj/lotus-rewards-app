
import React, { useState } from 'react';
import { Task, Submission } from '../types';

interface Props {
  tasks: Task[];
  onAddSubmission: (submission: Submission) => void;
}

const TasksView: React.FC<Props> = ({ tasks, onAddSubmission }) => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [proof, setProof] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask || !proof) return;

    setSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      const submission: Submission = {
        id: Math.random().toString(36).substr(2, 9),
        userId: 'u1',
        taskId: selectedTask.id,
        taskTitle: selectedTask.title,
        proof,
        timestamp: new Date().toISOString(),
        status: 'pending',
        pointsAwarded: selectedTask.points
      };
      onAddSubmission(submission);
      setSubmitting(false);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setSelectedTask(null);
        setProof('');
      }, 2000);
    }, 1500);
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-4xl font-serif font-bold text-slate-800">Mindful Tasks</h1>
        <p className="text-slate-500 mt-2">Earn Lotus Points by investing in yourself.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map((task) => (
          <div key={task.id} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all flex flex-col group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-rose-500 group-hover:bg-rose-500 group-hover:text-white transition-colors duration-300">
                <i className={`fa-solid ${task.icon} text-xl`}></i>
              </div>
              <span className="bg-rose-50 text-rose-600 text-xs font-bold px-3 py-1 rounded-full">{task.category}</span>
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">{task.title}</h3>
            <p className="text-slate-500 text-sm flex-grow">{task.description}</p>
            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center gap-1 text-rose-500 font-bold">
                <i className="fa-solid fa-leaf text-sm"></i>
                <span>{task.points}</span>
              </div>
              <button 
                onClick={() => setSelectedTask(task)}
                className="bg-slate-900 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-slate-800 transition-colors active:scale-95"
              >
                Start Task
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedTask && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl p-8 relative overflow-hidden">
            {success ? (
              <div className="py-12 text-center">
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
                  <i className="fa-solid fa-check"></i>
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Submitted!</h2>
                <p className="text-slate-500">Your proof has been sent for verification.</p>
              </div>
            ) : (
              <>
                <button 
                  onClick={() => setSelectedTask(null)}
                  className="absolute top-6 right-6 text-slate-400 hover:text-slate-600"
                >
                  <i className="fa-solid fa-xmark text-xl"></i>
                </button>
                <div className="mb-8">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center text-xl">
                      <i className={`fa-solid ${selectedTask.icon}`}></i>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-800">{selectedTask.title}</h2>
                      <p className="text-rose-500 font-bold text-sm">Worth {selectedTask.points} Lotus Points</p>
                    </div>
                  </div>
                  <p className="text-slate-600">{selectedTask.description}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Proof of Completion</label>
                    <textarea 
                      required
                      className="w-full h-40 bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-200 resize-none transition-all"
                      placeholder="Describe what you did or paste a link to your proof..."
                      value={proof}
                      onChange={(e) => setProof(e.target.value)}
                    ></textarea>
                    <p className="text-[11px] text-slate-400 mt-2">
                      <i className="fa-solid fa-info-circle mr-1"></i>
                      Your submission will be reviewed by our community admins.
                    </p>
                  </div>
                  <button 
                    disabled={submitting}
                    className="w-full bg-rose-500 text-white py-4 rounded-2xl font-bold text-lg hover:bg-rose-600 transition-all disabled:opacity-50 shadow-lg shadow-rose-100 flex items-center justify-center gap-3"
                  >
                    {submitting ? (
                      <>
                        <i className="fa-solid fa-spinner fa-spin"></i>
                        Verifying...
                      </>
                    ) : (
                      'Submit for Review'
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TasksView;
