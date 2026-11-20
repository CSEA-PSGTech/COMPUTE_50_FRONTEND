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
    question: 'What is the event format and timeline?',
    answer:
      'Registration closes on November 22nd at 4:30 PM. Round 1 is held online on November 23, 24, and 25 where teams develop a working prototype based on one of the 10 Round 1 domains. Round 1 results are announced on November 30 at 10:00 AM. Shortlisted finalists then attend the on-campus finale at PSG College of Technology on December 4 & 5.',
  },
  {
    id: 'faq-r1-domains',
    category: 'Hackathon',
    question: 'What are the domains for Round 1, and what must be submitted?',
    answer:
      'The 10 domains announced on the website are strictly for Round 1 prototype development. Teams must build and submit an end-to-end working prototype in one of these domains during the online round (Nov 23–25).',
  },
  {
    id: 'faq-r2-statements',
    category: 'Hackathon',
    question: 'When will Round 2 problem statements be provided?',
    answer:
      'Round 2 problem statements will be released exclusively at the beginning of the final hackathon at PSG Tech (December 4 & 5) for all shortlisted teams.',
  },
  {
    id: 'faq-2',
    category: 'Registration',
    question: 'What is the team size limit for the hackathon?',
    answer:
      'Teams can consist of 3 to 4 members. Everyone registers individually first — team formation opens after registrations close, and the details will be shared in the participants WhatsApp group.',
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
    {
    id: 'faq-certificates',
    category: 'General',
    question: 'Will participants receive certificates?',
    answer:
      'Yes. Every team that takes part in Round 1 will receive an e-certificate of participation, and the teams shortlisted for the finals at PSG Tech will be awarded physical certificates.',
  },
];