// Single place for the center's public details - contact info on the
// Contact page / footer and the bank details on the Donate page. Every value
// marked PLACEHOLDER must be replaced with the real one before release.

export const CENTER_NAME = 'Golden Lotus Healing Center';
export const CENTER_SHORT_NAME = 'GLHC';
export const CENTER_TAGLINE = 'Nurturing growth, one step at a time.';

export const CONTACT_DETAILS = [
  { icon: 'fa-envelope', label: 'Email', value: 'hello@glhc.example' }, // PLACEHOLDER
  { icon: 'fa-phone', label: 'Phone', value: '+60 3-0000 0000' }, // PLACEHOLDER
  { icon: 'fa-location-dot', label: 'Address', value: 'Center address to be confirmed' }, // PLACEHOLDER
];

export const DONATION_BANK = {
  bankName: 'Bank name to be confirmed', // PLACEHOLDER
  accountName: 'Golden Lotus Healing Center', // PLACEHOLDER - must match the bank record exactly
  accountNumber: '0000 0000 0000', // PLACEHOLDER
  swiftCode: 'XXXXMYKL', // PLACEHOLDER - for overseas transfers
  reference: 'DONATION + your name',
};

// Drop the center's DuitNow QR image at public/duitnow-qr.png; until it
// exists the Donate page shows a "coming soon" placeholder instead.
export const DUITNOW_QR_SRC = '/duitnow-qr.png';

export type TeamMember = {
  name: string;
  role: string;
  bio: string;
  photo?: string; // path under public/, e.g. '/team/jane.jpg'; initials avatar when absent
};

// SAMPLE team for layout only - every entry is a PLACEHOLDER to be replaced
// with the center's real people (with their consent to be listed). While
// TEAM_IS_SAMPLE is true the About page labels the section as sample
// profiles, so a deployed build never passes them off as real staff.
export const TEAM_IS_SAMPLE = true;

export const TEAM: TeamMember[] = [
  { name: 'Mei Ling Tan', role: 'Center Director', bio: 'Leads the center and its healing program; certified Pranic Healing instructor.' },
  { name: 'Arjun Nair', role: 'Senior Pranic Healer', bio: 'Runs healing sessions and energy scanning, in person and at a distance.' },
  { name: 'Nurul Aisyah', role: 'Workshop Instructor', bio: 'Teaches the Basic and Advanced Pranic Healing workshops.' },
  { name: 'Daniel Wong', role: 'Pranic Psychotherapy Practitioner', bio: 'Supports clients with stress, grief and emotional healing.' },
  { name: 'Priya Devi', role: 'Meditation Facilitator', bio: 'Guides the weekly Meditation on Twin Hearts sessions.' },
  { name: 'Hafiz Rahman', role: 'Community & Volunteer Coordinator', bio: 'Looks after members, volunteers and GLHC Member Rewards.' },
];
