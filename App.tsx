
import React, { useState, useEffect, useCallback } from 'react';
import type { Session } from '@supabase/supabase-js';
import { HashRouter, Routes, Route, Link } from 'react-router-dom';
import { User, Task, Reward, Submission, RewardClaim } from './types';
import { supabase } from './services/supabaseClient';
import { compressImage } from './services/image';
import Dashboard from './components/Dashboard';
import TasksView from './components/TasksView';
import RewardsView from './components/RewardsView';
import AdminPanel from './components/AdminPanel';
import AdminHistory from './components/AdminHistory';
import Auth from './components/Auth';

const mapSubmission = (row: any): Submission => ({
  id: row.id,
  userId: row.user_id,
  taskId: row.task_id,
  taskTitle: row.task_title,
  proofNote: row.proof_note,
  proofImagePath: row.proof_image_path,
  timestamp: row.created_at,
  updatedAt: row.updated_at,
  status: row.status,
  pointsAwarded: row.points_awarded,
});

const mapRewardClaim = (row: any): RewardClaim => ({
  id: row.id,
  userId: row.user_id,
  rewardId: row.reward_id,
  rewardTitle: row.reward_title,
  cost: row.cost,
  status: row.status,
  remark: row.remark,
  grantedBy: row.granted_by,
  timestamp: row.created_at,
});

const App: React.FC = () => {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [profile, setProfile] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [rewardClaims, setRewardClaims] = useState<RewardClaim[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const refetchProfile = useCallback(async (userId: string) => {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single();
    setProfile(data as User | null);
  }, []);

  // Scoped to the signed-in user even for admins, who would otherwise see
  // everyone's rows here (RLS lets admins read all submissions/claims for
  // the Admin Panel's own separate queries - this state is "my own", not that).
  const refetchSubmissions = useCallback(async (userId: string) => {
    const { data } = await supabase.from('submissions').select('*').eq('user_id', userId).order('created_at', { ascending: false });
    setSubmissions((data ?? []).map(mapSubmission));
  }, []);

  const refetchRewardClaims = useCallback(async (userId: string) => {
    const { data } = await supabase.from('reward_claims').select('*').eq('user_id', userId).order('created_at', { ascending: false });
    setRewardClaims((data ?? []).map(mapRewardClaim));
  }, []);

  useEffect(() => {
    if (!session) {
      setProfile(null);
      setTasks([]);
      setRewards([]);
      setSubmissions([]);
      setRewardClaims([]);
      return;
    }

    let cancelled = false;
    setLoadingData(true);

    (async () => {
      const [{ data: profileData }, { data: taskData }, { data: rewardData }, { data: submissionData }, { data: claimData }] =
        await Promise.all([
          supabase.from('profiles').select('*').eq('id', session.user.id).single(),
          supabase.from('tasks').select('*').eq('active', true),
          supabase.from('rewards').select('*'),
          supabase.from('submissions').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false }),
          supabase.from('reward_claims').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false }),
        ]);

      if (cancelled) return;
      setProfile(profileData as User | null);
      setTasks((taskData ?? []) as Task[]);
      setRewards((rewardData ?? []) as Reward[]);
      setSubmissions((submissionData ?? []).map(mapSubmission));
      setRewardClaims((claimData ?? []).map(mapRewardClaim));
      setLoadingData(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [session]);

  const startTask = async (task: Task): Promise<Submission> => {
    if (!session) throw new Error('Not signed in');
    const { data, error } = await supabase
      .from('submissions')
      .insert({
        user_id: session.user.id,
        task_id: task.id,
        task_title: task.title,
        points_awarded: task.points,
        status: 'draft',
      })
      .select()
      .single();
    if (error) throw error;
    await refetchSubmissions(session.user.id);
    return mapSubmission(data);
  };

  const saveDraft = async (submission: Submission, file: File | null, note: string) => {
    const updates: { proof_note: string | null; proof_image_path?: string } = { proof_note: note || null };

    if (file) {
      const compressed = await compressImage(file);
      const path = `${submission.userId}/${crypto.randomUUID()}.jpg`;
      const { error: uploadError } = await supabase.storage
        .from('proof-photos')
        .upload(path, compressed, { contentType: 'image/jpeg' });
      if (uploadError) throw uploadError;
      updates.proof_image_path = path;
    }

    const { error } = await supabase.from('submissions').update(updates).eq('id', submission.id);
    if (error) throw error;

    if (file && submission.proofImagePath) {
      await supabase.storage.from('proof-photos').remove([submission.proofImagePath]);
    }

    await refetchSubmissions(submission.userId);
  };

  const submitDraft = async (submission: Submission, file: File | null, note: string) => {
    await saveDraft(submission, file, note);
    const { error } = await supabase.rpc('submit_task', { p_submission_id: submission.id });
    if (error) throw error;
    await refetchSubmissions(submission.userId);
  };

  const updateSubmissionStatus = async (id: string, status: 'approved' | 'rejected') => {
    const { error } = await supabase.rpc('approve_submission', { p_submission_id: id, p_decision: status });
    if (error) throw error;
    if (session) {
      await refetchSubmissions(session.user.id);
      await refetchProfile(session.user.id);
    }
  };

  const requestReward = async (rewardId: string): Promise<{ ok: boolean; message?: string }> => {
    const { error } = await supabase.rpc('request_reward', { p_reward_id: rewardId });
    if (error) return { ok: false, message: error.message };
    if (session) {
      await refetchRewardClaims(session.user.id);
      await refetchProfile(session.user.id);
    }
    return { ok: true };
  };

  const refreshOwnProfile = async () => {
    if (session) await refetchProfile(session.user.id);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  if (session === undefined) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-400">Loading...</div>;
  }

  if (!session) {
    return <Auth />;
  }

  if (loadingData || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-400">
        Setting up your account...
      </div>
    );
  }

  const isAdmin = profile.role === 'admin';

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-rose-300 rounded-full flex items-center justify-center text-white text-xl shadow-lg">
                  <i className="fa-solid fa-seedling"></i>
                </div>
                <span className="text-2xl font-serif font-bold text-slate-800 tracking-tight">Golden Lotus</span>
              </div>

              <div className="hidden md:flex items-center space-x-8">
                <Link to="/" className="text-slate-600 hover:text-rose-500 font-medium transition-colors">Dashboard</Link>
                <Link to="/tasks" className="text-slate-600 hover:text-rose-500 font-medium transition-colors">Tasks</Link>
                <Link to="/rewards" className="text-slate-600 hover:text-rose-500 font-medium transition-colors">Rewards</Link>
                {isAdmin && <Link to="/admin" className="text-rose-600 font-bold">Admin</Link>}
                {isAdmin && <Link to="/admin/history" className="text-slate-600 hover:text-rose-500 font-medium transition-colors">History</Link>}
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center bg-rose-50 px-4 py-2 rounded-full border border-rose-100 shadow-sm">
                  <span className="text-rose-600 font-bold mr-2">{profile.points}</span>
                  <i className="fa-solid fa-leaf text-rose-400"></i>
                </div>
                <button
                  onClick={handleSignOut}
                  className="p-2 rounded-lg bg-slate-100 text-slate-400 hover:bg-slate-200 transition-all"
                  title="Sign out"
                >
                  <i className="fa-solid fa-right-from-bracket"></i>
                </button>
                {profile.avatar && (
                  <img src={profile.avatar} className="w-9 h-9 rounded-full ring-2 ring-rose-200" alt="Avatar" />
                )}
              </div>
            </div>
          </div>
        </nav>

        <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route
              path="/"
              element={
                <Dashboard
                  profile={profile}
                  submissions={submissions}
                  rewards={rewards}
                  onSaveDraft={saveDraft}
                  onSubmitDraft={submitDraft}
                />
              }
            />
            <Route
              path="/tasks"
              element={<TasksView tasks={tasks} onStartTask={startTask} onSaveDraft={saveDraft} onSubmitDraft={submitDraft} />}
            />
            <Route
              path="/rewards"
              element={
                <RewardsView
                  rewards={rewards}
                  points={profile.points}
                  myClaims={rewardClaims}
                  onRequestReward={requestReward}
                  isAdmin={isAdmin}
                />
              }
            />
            <Route
              path="/admin"
              element={
                isAdmin ? (
                  <AdminPanel
                    rewards={rewards}
                    onUpdateStatus={updateSubmissionStatus}
                    onPointsAdjusted={refreshOwnProfile}
                  />
                ) : (
                  <div className="text-center py-20">
                    <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
                    <p>You must be an administrator to view this page.</p>
                  </div>
                )
              }
            />
            <Route
              path="/admin/history"
              element={
                isAdmin ? (
                  <AdminHistory />
                ) : (
                  <div className="text-center py-20">
                    <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
                    <p>You must be an administrator to view this page.</p>
                  </div>
                )
              }
            />
          </Routes>
        </main>

        <footer className="bg-white border-t border-slate-200 py-6 mt-12">
          <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
            <p>&copy; 2026 Golden Lotus Rewards System. Nurturing growth, one step at a time.</p>
          </div>
        </footer>

        {/* Mobile Nav */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around py-3 px-2 z-50">
          <Link to="/" className="flex flex-col items-center gap-1 text-slate-500">
            <i className="fa-solid fa-chart-pie"></i>
            <span className="text-[10px]">Home</span>
          </Link>
          <Link to="/tasks" className="flex flex-col items-center gap-1 text-slate-500">
            <i className="fa-solid fa-list-check"></i>
            <span className="text-[10px]">Tasks</span>
          </Link>
          <Link to="/rewards" className="flex flex-col items-center gap-1 text-slate-500">
            <i className="fa-solid fa-gift"></i>
            <span className="text-[10px]">Rewards</span>
          </Link>
          {isAdmin && (
            <Link to="/admin" className="flex flex-col items-center gap-1 text-rose-500 font-bold">
              <i className="fa-solid fa-shield-halved"></i>
              <span className="text-[10px]">Admin</span>
            </Link>
          )}
          {isAdmin && (
            <Link to="/admin/history" className="flex flex-col items-center gap-1 text-slate-500">
              <i className="fa-solid fa-clock-rotate-left"></i>
              <span className="text-[10px]">History</span>
            </Link>
          )}
        </div>
      </div>
    </HashRouter>
  );
};

export default App;
