
import React, { useState, useEffect } from 'react';
import { Submission } from '../types';
import { supabase } from '../services/supabaseClient';

interface Props {
  submission: Submission;
  onClose: () => void;
  onSave: (file: File | null, note: string) => Promise<void>;
  onSubmit: (file: File | null, note: string) => Promise<void>;
}

const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10MB, compressed further before upload

const TaskSubmissionModal: React.FC<Props> = ({ submission, onClose, onSave, onSubmit }) => {
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [note, setNote] = useState(submission.proofNote ?? '');
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!submission.proofImagePath) return;
    let cancelled = false;
    supabase.storage
      .from('proof-photos')
      .createSignedUrl(submission.proofImagePath, 60 * 60)
      .then(({ data }) => {
        if (!cancelled && data) setExistingImageUrl(data.signedUrl);
      });
    return () => {
      cancelled = true;
    };
  }, [submission.proofImagePath]);

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

  const clearPickedFile = () => {
    setFile(null);
    setPreviewUrl(null);
  };

  const hasPhoto = Boolean(previewUrl || existingImageUrl);
  const displayUrl = previewUrl ?? existingImageUrl;

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      await onSave(file, note);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save draft.');
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasPhoto) return;
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit(file, note);
      onClose();
    } catch (err) {
      setSubmitting(false);
      setError(err instanceof Error ? err.message : 'Failed to submit for review.');
      return;
    }
    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl p-8 relative overflow-hidden max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-400 hover:text-slate-600"
        >
          <i className="fa-solid fa-xmark text-xl"></i>
        </button>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-800">{submission.taskTitle}</h2>
          <p className="text-rose-500 font-bold text-sm">Worth {submission.pointsAwarded} Lotus Points</p>
          <p className="text-[11px] text-slate-400 mt-2">
            Started {new Date(submission.timestamp).toLocaleString()}
            {submission.updatedAt !== submission.timestamp && (
              <> &middot; Last edited {new Date(submission.updatedAt).toLocaleString()}</>
            )}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Proof Photo</label>
            {displayUrl ? (
              <div className="relative">
                <img src={displayUrl} alt="Proof preview" className="w-full h-48 object-cover rounded-2xl border border-slate-200" />
                <button
                  type="button"
                  onClick={clearPickedFile}
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
          </div>

          {error && (
            <p className="text-sm text-rose-600 bg-rose-50 border border-rose-100 rounded-xl p-3">{error}</p>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || submitting}
              className="flex-1 bg-slate-100 text-slate-700 py-4 rounded-2xl font-bold hover:bg-slate-200 transition-all disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Draft'}
            </button>
            <button
              disabled={saving || submitting || !hasPhoto}
              className="flex-1 bg-rose-500 text-white py-4 rounded-2xl font-bold hover:bg-rose-600 transition-all disabled:opacity-50 shadow-lg shadow-rose-100 flex items-center justify-center gap-2"
              title={!hasPhoto ? 'Add a proof photo before submitting' : undefined}
            >
              {submitting ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin"></i>
                  Submitting...
                </>
              ) : (
                'Submit for Review'
              )}
            </button>
          </div>
          <p className="text-[11px] text-slate-400">
            <i className="fa-solid fa-info-circle mr-1"></i>
            Save to keep editing later, or submit once you're satisfied - admins are notified when you submit.
          </p>
        </form>
      </div>
    </div>
  );
};

export default TaskSubmissionModal;
