import { EventItem } from '../types/hackathon';

export const mockEvents: EventItem[] = [
  {
    id: 'evt-1',
    title: 'Round 1 — Online Hackathon',
    description: 'Online ideation and prototype development round. Shortlisted teams advance to the on-campus finals.',
    date: 'Dec 4, 2026',
    type: 'Hackathon',
    mode: 'Round 1 Online',
    status: 'Upcoming',
  },
  {
    id: 'evt-2',
    title: 'Round 2 — On-Campus Hackathon (Finals)',
    description: 'Final 24-hour prototype build, mentoring, and judging live on campus at PSG College of Technology.',
    date: 'Dec 5, 2026',
    type: 'Hackathon',
    mode: 'Finals at PSG Tech',
    status: 'Upcoming',
  },
];
