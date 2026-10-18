import { home } from '../data/content';

export const EVENT_CONFIG = {
  name: 'Compute 50',
  headline: home.headline,
  tagline: home.tagline,
  dates: 'October 15 - 16, 2026',
  dateStart: 'October 15, 2026',
  dateEnd: 'October 16, 2026',
  isoDate: '2026-10-15T09:00:00',
  duration: '50 Years of M.E. CSE Legacy',
  venue: 'Round 1 Online · Finals at PSG Tech',
  venueFull: 'Department of CSE, PSG College of Technology, Peelamedu, Coimbatore - 641004',
  venueMapsUrl: 'https://maps.google.com/?q=PSG+College+of+Technology,+Peelamedu,+Coimbatore',
  prizePool: '₹2,50,000+',
  prizePoolNumeric: 250000,
  prizes: {
    first: 100000,
    second: 60000,
    third: 40000,
    categories: 50000,
    total: 250000,
    totalFormatted: '₹2,50,000+',
    firstFormatted: '1st: ₹1,00,000',
    secondFormatted: '2nd: ₹60,000',
    thirdFormatted: '3rd: ₹40,000',
    categoriesFormatted: 'Track prizes: ₹50,000',
    chips: [
      { label: '1st', amount: '₹1,00,000' },
      { label: '2nd', amount: '₹60,000' },
      { label: '3rd', amount: '₹40,000' },
      { label: 'Track prizes', amount: '₹50,000' },
    ],
  },
  teamSize: '2 - 4 Members',
  // TO CONFIRM: Official announcement does not specify participant eligibility restrictions yet
  eligibility: 'Undergraduate and postgraduate students currently enrolled in recognized colleges or universities',
  contactEmail: 'csea@psgtech.ac.in',
  contactPhone: '+91 98765 43210 / +91 91234 56789',
  contactPhones: {
    general: '+91 98765 43210',
    registration: '+91 91234 56789',
    event: '+91 98765 43210',
  },
  whatsappLink: 'https://chat.whatsapp.com/compute50-official',
  instagramUrl: 'https://instagram.com/csea_psgtech',
  organizerFull: 'CSEA – Computer Science and Engineering Association',
  organizerShort: 'CSEA',
  organizerWebsite: 'https://csea.psgtech.ac.in/',
  college: 'PSG College of Technology',
  collegeShort: 'PSG Tech',
  collegeWebsite: 'https://psgtech.edu',
  footerCopyright: '© 2026 Compute 50 · CSEA, PSG College of Technology',
} as const;

export interface SupportContact {
  id: string;
  category: string;
  contactName: string;
  role: string;
  phone?: string;
  email: string;
  description: string;
}

export const SUPPORT_CONTACTS: SupportContact[] = [
  {
    id: 'general',
    category: 'GENERAL QUERIES',
    contactName: 'CSEA Secretariat',
    role: 'Convenor & Helpdesk',
    phone: '+91 98765 43210',
    email: 'csea@psgtech.ac.in',
    description: 'General enquiries, schedule info, and event coordination',
  },
  {
    id: 'registration',
    category: 'REGISTRATION SUPPORT',
    contactName: 'Registration Committee',
    role: 'Participant Coordination',
    phone: '+91 91234 56789',
    email: 'csea@psgtech.ac.in',
    description: 'Account signup, team formation, and roster updates',
  },
  {
    id: 'event',
    category: 'EVENT SUPPORT',
    contactName: 'Hackathon Operations',
    role: 'Track & Logistics Lead',
    phone: '+91 98765 43210',
    email: 'csea@psgtech.ac.in',
    description: 'Track rules, challenge guidelines, and venue check-in',
  },
  {
    id: 'technical',
    category: 'TECHNICAL SUPPORT',
    contactName: 'Tech & Platform Team',
    role: 'Portal Administration',
    email: 'csea@psgtech.ac.in',
    description: 'Website issues, authentication, and technical problems',
  },
];

export default EVENT_CONFIG;
