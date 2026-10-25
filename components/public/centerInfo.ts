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
