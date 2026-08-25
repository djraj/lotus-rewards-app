import { createClient } from '@supabase/supabase-js';

// PKCE puts the auth callback token in a `?code=` query param instead of a
// `#access_token=...` URL fragment — the app uses HashRouter, which would
// otherwise collide with an implicit-flow fragment and break magic links.
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
  {
    auth: {
      flowType: 'pkce',
    },
  }
);
