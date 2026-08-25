
import React, { useState, useEffect } from 'react';
import { Task } from '../types';

interface Props {
  tasks: Task[];
  onAddSubmission: (task: Task, file: File, note: string) => Promise<void>;
}

const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10MB, compressed further before upload

const TasksView: React.FC<Props> = ({ tasks, onAddSubmission }) => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const closeModal = () => {
    setSelectedTask(null);
    setFile(null);
    setPreviewUrl(null);
    setNote('');
    setError(null);
    setSuccess(false);
  };

  // Revoke the previous blob URL whenever it's replaced or the component unmounts.
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = e.target.files?.[0];
    setError(null);
    if (!picked) return;
    if (!picked.type.startsWith('image/')) {
      setError('Please choose an image file.');
      return;
    }
    if (picked.size > MAX_FILE_BYTES) {
      setError('That photo is too large (max 10MB).');
      return;
    }
    setFile(picked);
    setPreviewUrl(URL.createObjectURL(picked));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask || !file) return;

    setSubmitting(true);
    setError(null);
    try {
      await onAddSubmission(selectedTask, file, note);
      setSubmitting(false);
      setSuccess(true);
      setTimeout(closeModal, 2000);
    } catch (err) {
      setSubmitting(false);
      setError(err instanceof Error ? err.message : 'Failed to submit proof.');
    }
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
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl p-8 relative overflow-hidden max-h-[90vh] overflow-y-auto">
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
                  onClick={closeModal}
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
                    <label className="block text-sm font-bold text-slate-700 mb-2">Proof Photo</label>
                    {previewUrl ? (
                      <div className="relative">
                        <img src={previewUrl} alt="Proof preview" className="w-full h-48 object-cover rounded-2xl border border-slate-200" />
                        <button
                          type="button"
                          onClick={() => { setFile(null); setPreviewUrl(null); }}
                          className="absolute top-2 right-2 bg-white/90 rounded-full w-8 h-8 flex items-center justify-center text-slate-500 hover:text-rose-500"
                        >
                          <i className="fa-solid fa-xmark"></i>
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-full h-40 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:border-rose-300 transition-colors">
                        <i className="fa-solid fa-camera text-2xl text-slate-400 mb-2"></i>
                        <span className="text-sm text-slate-500">Take or upload a photo</span>
                        <input
                          required
                          type="file"
                          accept="image/*"
                          capture="environment"
                          className="hidden"
                          onChange={handleFileChange}
                        />
                      </label>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Note (optional)</label>
                    <textarea
                      className="w-full h-24 bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-200 resize-none transition-all"
                      placeholder="Add any context for the reviewer..."
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                    ></textarea>
                    <p className="text-[11px] text-slate-400 mt-2">
                      <i className="fa-solid fa-info-circle mr-1"></i>
                      Your submission will be reviewed by our community admins.
                    </p>
                  </div>

                  {error && (
                    <p className="text-sm text-rose-600 bg-rose-50 border border-rose-100 rounded-xl p-3">{error}</p>
                  )}

                  <button
                    disabled={submitting || !file}
                    className="w-full bg-rose-500 text-white py-4 rounded-2xl font-bold text-lg hover:bg-rose-600 transition-all disabled:opacity-50 shadow-lg shadow-rose-100 flex items-center justify-center gap-3"
                  >
                    {submitting ? (
                      <>
                        <i className="fa-solid fa-spinner fa-spin"></i>
                        Uploading...
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
