import { FAQItem } from '../types/hackathon';
import { EVENT_CONFIG } from '../config/event';

export const mockFaqs: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'General',
    question: 'What is Compute 50?',
    answer:
      'COMPUTE 50 HACKATHON is a two-day technical innovation event organised by CSEA – Computer Science and Engineering Association as part of the celebrations commemorating 50 years of the M.E. Computer Science and Engineering programme at PSG College of Technology.',
  },
  {
    id: 'faq-format',
    category: 'Hackathon',
    question: 'What is the event format?',
    answer:
      'Round 1 Online · Finals at PSG Tech. The first round will be held online, and shortlisted teams will be invited to the PSG Tech campus for the final round.',
  },
  {
    id: 'faq-2',
    category: 'Registration',
    question: 'What is the team size limit for the hackathon?',
    answer:
      'Teams can consist of 2 to 4 members. Individual registration is supported, but team formation must be finalized before the deadline.',
  },
  {
    id: 'faq-3',
    category: 'General',
    question: 'Who is eligible to participate?',
    answer: `${EVENT_CONFIG.eligibility} are eligible.`,
  },
  {
    id: 'faq-4',
    category: 'Accommodation',
    question: 'Is accommodation provided for outstation participants?',
    answer:
      'Yes, basic accommodation facilities and meals will be arranged on campus for registered outstation teams attending the campus finale.',
  },
  {
    id: 'faq-5',
    category: 'Hackathon',
    question: 'Are hardware projects allowed?',
    answer:
      'Yes, teams can build software, hardware, or hybrid solutions depending on the chosen problem track.',
  },
];
