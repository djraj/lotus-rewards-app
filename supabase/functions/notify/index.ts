// Transactional email sender for Golden Lotus.
//
// Called by Postgres `after insert/update` triggers on `submissions` and
// `reward_claims` (see migration 20260831000000). Each call carries an
// `x-webhook-secret` header instead of a user JWT. The function figures out
// which lifecycle event the row change represents, looks up the recipient's
// email with the service-role key, and sends a message through the Brevo API.
//
// Env (set with `supabase secrets set` for the hosted project, or a root
// `.env` for `supabase functions serve`):
//   WEBHOOK_SECRET        - shared secret, must match the value the trigger sends
//   BREVO_API_KEY         - Brevo "API key" (SMTP & API > API keys), NOT the SMTP key
//   EMAIL_SENDER_ADDRESS  - a verified Brevo sender address
//   EMAIL_SENDER_NAME     - optional, defaults to "Golden Lotus Rewards"
//   APP_URL               - optional, deployed app origin, used for button links
//   SUPABASE_URL          - injected automatically on deploy
//   SUPABASE_SERVICE_ROLE_KEY - injected automatically on deploy

import { createClient } from "npm:@supabase/supabase-js@2";

const WEBHOOK_SECRET = Deno.env.get("WEBHOOK_SECRET") ?? "";
const BREVO_API_KEY = Deno.env.get("BREVO_API_KEY") ?? "";
const SENDER_ADDRESS = Deno.env.get("EMAIL_SENDER_ADDRESS") ?? "";
const SENDER_NAME = Deno.env.get("EMAIL_SENDER_NAME") ?? "Golden Lotus Rewards";
const APP_URL = (Deno.env.get("APP_URL") ?? "").replace(/\/$/, "");

const admin = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

type WebhookPayload = {
  type: "INSERT" | "UPDATE" | "DELETE";
  table: string;
  record: Record<string, any> | null;
  old_record: Record<string, any> | null;
};

type Mail = { subject: string; heading: string; body: string; ctaLabel?: string };

// Map a row change to an email, or null if this change isn't noteworthy.
function resolveMail(p: WebhookPayload): Mail | null {
  const r = p.record ?? {};
  const o = p.old_record ?? {};

  if (p.table === "submissions") {
    if (p.type === "INSERT" && r.status === "draft") {
      return {
        subject: `You started: ${r.task_title}`,
        heading: "Task started",
        body:
          `You've started <strong>${esc(r.task_title)}</strong> as a draft. ` +
          `Add your proof photo and a note whenever you're ready, then submit it for review to earn ${r.points_awarded} Lotus Points.`,
        ctaLabel: "Open my drafts",
      };
    }
    if (p.type === "UPDATE" && o.status === "draft" && r.status === "pending") {
      return {
        subject: `Submitted for review: ${r.task_title}`,
        heading: "Task submitted",
        body:
          `Your submission for <strong>${esc(r.task_title)}</strong> is in. ` +
          `An admin will review it shortly — you'll get ${r.points_awarded} Lotus Points once it's approved.`,
        ctaLabel: "View my activity",
      };
    }
    if (p.type === "UPDATE" && o.status !== "approved" && r.status === "approved") {
      return {
        subject: `Approved: ${r.task_title}`,
        heading: "Task approved",
        body:
          `Nice work — your submission for <strong>${esc(r.task_title)}</strong> has been approved and ` +
          `<strong>${r.points_awarded} Lotus Points</strong> have been added to your balance.`,
        ctaLabel: "View my points",
      };
    }
  }

  if (p.table === "reward_claims") {
    // Admin gift: inserted already-approved with a granted_by set.
    if (p.type === "INSERT" && r.status === "approved" && r.granted_by) {
      return {
        subject: `A reward was sent to you: ${r.reward_title}`,
        heading: "Reward sent",
        body:
          `An admin has sent you <strong>${esc(r.reward_title)}</strong>.` +
          (r.remark ? `<br /><br />Note from the team: “${esc(r.remark)}”` : "") +
          `<br /><br />No points were deducted for this gift.`,
        ctaLabel: "See my rewards",
      };
    }
    // User request that just got approved.
    if (p.type === "UPDATE" && o.status === "pending" && r.status === "approved") {
      return {
        subject: `Redemption approved: ${r.reward_title}`,
        heading: "Redeem successful",
        body:
          `Your redemption of <strong>${esc(r.reward_title)}</strong> for ${r.cost} Lotus Points has been approved. ` +
          `The team will be in touch about delivery.`,
        ctaLabel: "See my rewards",
      };
    }
  }

  return null;
}

function esc(s: unknown): string {
  return String(s ?? "").replace(/[&<>"']/g, (c) => (
    { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!
  ));
}

function renderHtml(m: Mail, name: string): string {
  const cta = m.ctaLabel && APP_URL
    ? `<tr><td style="padding-bottom:24px;">
         <a href="${APP_URL}" style="display:inline-block;background:#f43f5e;color:#ffffff;text-decoration:none;font-weight:700;font-size:15px;padding:13px 28px;border-radius:14px;">${esc(m.ctaLabel)}</a>
       </td></tr>`
    : "";
  return `<!doctype html><html><body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#0f172a;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:32px 12px;"><tr><td align="center">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background:#ffffff;border:1px solid #e2e8f0;border-radius:20px;padding:36px;">
      <tr><td style="font-size:22px;font-weight:700;color:#1e293b;padding-bottom:8px;">🪷&nbsp;Golden Lotus</td></tr>
      <tr><td style="font-size:20px;font-weight:700;padding:12px 0 4px;">${esc(m.heading)}</td></tr>
      <tr><td style="font-size:15px;line-height:1.6;color:#475569;padding:8px 0 24px;">Hi ${esc(name || "there")},<br /><br />${m.body}</td></tr>
      ${cta}
      <tr><td style="font-size:13px;line-height:1.6;color:#94a3b8;">You're receiving this because you have a Golden Lotus Rewards account.</td></tr>
    </table>
    <div style="max-width:480px;font-size:12px;color:#cbd5e1;padding:16px 8px;">&copy; Golden Lotus Rewards</div>
  </td></tr></table></body></html>`;
}

Deno.serve(async (req) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });

  if (!WEBHOOK_SECRET || req.headers.get("x-webhook-secret") !== WEBHOOK_SECRET) {
    return new Response("Unauthorized", { status: 401 });
  }

  let payload: WebhookPayload;
  try {
    payload = await req.json();
  } catch {
    return new Response("Bad request", { status: 400 });
  }

  const mail = resolveMail(payload);
  if (!mail) return json({ skipped: true });

  const userId = payload.record?.user_id;
  if (!userId) return json({ skipped: true, reason: "no user_id" });

  // Recipient email lives in auth.users; display name in profiles.
  const [{ data: userRes, error: userErr }, { data: profile }] = await Promise.all([
    admin.auth.admin.getUserById(userId),
    admin.from("profiles").select("name").eq("id", userId).single(),
  ]);
  if (userErr || !userRes?.user?.email) {
    console.error("recipient lookup failed", userErr);
    return json({ error: "recipient not found" }, 200);
  }
  const to = userRes.user.email;
  const name = profile?.name ?? "";

  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": BREVO_API_KEY,
      "content-type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify({
      sender: { name: SENDER_NAME, email: SENDER_ADDRESS },
      to: [{ email: to, name: name || undefined }],
      subject: mail.subject,
      htmlContent: renderHtml(mail, name),
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    console.error("brevo send failed", res.status, detail);
    return json({ error: "send failed", status: res.status }, 200);
  }

  return json({ sent: true, to, event: mail.heading });
});

function json(obj: unknown, status = 200): Response {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "content-type": "application/json" },
  });
}
