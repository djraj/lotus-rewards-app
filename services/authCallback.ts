import type { EmailOtpType } from '@supabase/supabase-js';
import { supabase } from './supabaseClient';

const ERROR_KEY = 'gl_auth_error';

// Supabase drops redirect params in the query string on some flows and in the
// hash fragment on others, so read both and merge them.
function readCallbackParams(): URLSearchParams {
  const merged = new URLSearchParams();
  const add = (raw: string) => {
    const q = raw.replace(/^[#?]/, '');
    if (q) new URLSearchParams(q).forEach((v, k) => merged.set(k, v));
  };
  add(window.location.search);
  add(window.location.hash);
  return merged;
}

// Drop the callback params so they can't be reprocessed on reload and don't
// confuse HashRouter once the signed-in app mounts.
function stripCallbackFromUrl() {
  window.history.replaceState(null, '', window.location.pathname);
}

function setAuthError(message: string) {
  try {
    sessionStorage.setItem(ERROR_KEY, message);
  } catch {
    /* sessionStorage unavailable (private mode, etc.) - non-fatal */
  }
}

/**
 * Reads and clears the last auth-callback error. Call from the sign-in screen so
 * a failed magic link shows a reason instead of a blank form.
 */
export function takeAuthError(): string | null {
  try {
    const v = sessionStorage.getItem(ERROR_KEY);
    if (v) sessionStorage.removeItem(ERROR_KEY);
    return v;
  } catch {
    return null;
  }
}

/**
 * Runs once before the app mounts. Handles two auth redirect shapes:
 *
 *  - `error=...&error_description=...` from a failed Supabase verify (e.g. an
 *    expired or already-used magic link). Without this the app just renders the
 *    login screen with no explanation.
 *
 *  - `token_hash=...&type=...` from our magic-link email. Verifying here (rather
 *    than letting Supabase's `/auth/v1/verify` GET do it) means a mail-security
 *    scanner that pre-fetches the link can't burn the single-use token: a
 *    scanner fetches HTML, it doesn't run this code.
 *
 * The PKCE `?code=` flow (password reset, email confirmation) is left alone for
 * supabase-js to pick up via `detectSessionInUrl`.
 */
export async function consumeAuthCallback(): Promise<void> {
  const params = readCallbackParams();

  if (params.get('code')) return;

  const errorDescription = params.get('error_description') ?? params.get('error');
  if (errorDescription) {
    stripCallbackFromUrl();
    setAuthError(errorDescription);
    return;
  }

  const tokenHash = params.get('token_hash');
  const type = params.get('type');
  if (tokenHash && type) {
    stripCallbackFromUrl();
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: type as EmailOtpType,
    });
    if (error) setAuthError(error.message);
  }
}
