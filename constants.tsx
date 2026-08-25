
// Tasks, rewards, and users now live in Supabase (see supabase/migrations).
// This file only holds data that has no reason to be in the database.

export const ZEN_QUOTES: string[] = [
  'The journey of a thousand miles begins with a single step.',
  'Wherever you are, be there totally.',
  'Peace comes from within. Do not seek it without.',
  'The quieter you become, the more you can hear.',
  'Growth is a spiral process, doubling back on itself, reassessing and regrouping.',
  'You are the sky. Everything else is just the weather.',
  'Let go of who you think you are supposed to be; embrace who you are.',
  'Every moment is a fresh beginning.',
  'Small steps every day lead to big changes over time.',
  'The present moment is the only moment available to us.',
];

export const getDailyQuote = (): string => {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  return ZEN_QUOTES[dayOfYear % ZEN_QUOTES.length];
};
