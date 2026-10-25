import React, { useEffect, useState } from 'react';
import { ContactMessage } from '../types';
import { supabase } from '../services/supabaseClient';

const mapMessage = (row: any): ContactMessage => ({
  id: row.id,
  name: row.name,
  email: row.email,
  message: row.message,
  userId: row.user_id,
  status: row.status,
  handledAt: row.handled_at,
  handledBy: row.handled_by,
  timestamp: row.created_at,
});

// Messages from the public Contact page. RLS lets only admins read the
// table; status changes go through set_contact_message_status.
const ContactInbox: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadMessages = async () => {
    const { data, error: loadError } = await supabase
      .from('contact_messages')
      .select('*')
      .eq('status', 'open')
      .order('created_at', { ascending: false });
    if (loadError) setError(loadError.message);
    setMessages((data ?? []).map(mapMessage));
    setLoading(false);
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const markHandled = async (id: string) => {
    setUpdatingId(id);
    setError(null);
    const { error: rpcError } = await supabase.rpc('set_contact_message_status', {
      p_message_id: id,
      p_status: 'handled',
    });
    if (rpcError) {
      setError(rpcError.message);
    } else {
      await loadMessages();
    }
    setUpdatingId(null);
  };

  return (
    <section className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
      <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
        <i className="fa-solid fa-inbox text-slate-400"></i>
        Contact Messages
        {messages.length > 0 && (
          <span className="bg-rose-100 text-rose-600 text-xs font-bold px-2.5 py-0.5 rounded-full">{messages.length}</span>
        )}
      </h3>
      <p className="text-sm text-slate-400 mb-6">
        Sent from the public Contact page. Reply by email, then mark the message handled.
      </p>

      {error && (
        <div className="p-4 mb-4 rounded-2xl bg-rose-50 text-rose-700 border border-rose-100 text-sm font-semibold">{error}</div>
      )}

      <div className="space-y-4">
        {loading ? (
          <p className="text-center py-8 text-slate-400">Loading messages...</p>
        ) : messages.length > 0 ? (
          messages.map((m) => (
            <div key={m.id} className="p-6 rounded-3xl bg-slate-50 border border-slate-100 space-y-3">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-bold text-slate-800">{m.name}</p>
                  <a href={`mailto:${m.email}`} className="text-sm text-rose-500 hover:underline break-all">
                    {m.email}
                  </a>
                  <p className="text-xs text-slate-400 mt-1">
                    {new Date(m.timestamp).toLocaleString()}
                    {m.userId && ' · signed-in member'}
                  </p>
                </div>
                <button
                  onClick={() => markHandled(m.id)}
                  disabled={updatingId === m.id}
                  className="bg-emerald-500 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-emerald-600 transition-all disabled:opacity-50 whitespace-nowrap"
                >
                  {updatingId === m.id ? 'Saving...' : 'Mark handled'}
                </button>
              </div>
              <p className="text-sm text-slate-700 bg-white border border-slate-200 rounded-2xl p-4 whitespace-pre-wrap break-words">
                {m.message}
              </p>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-slate-400">
            <i className="fa-solid fa-circle-check text-4xl mb-3 block opacity-20"></i>
            <p>No open messages.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ContactInbox;
