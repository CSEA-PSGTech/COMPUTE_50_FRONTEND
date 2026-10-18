import { EventItem } from '../types/hackathon';

export const mockEvents: EventItem[] = [
  {
    id: 'evt-1',
    title: 'Compute 50 Main Hackathon',
    description: 'The flagship technical innovation event bringing together student teams to build solutions.',
    date: 'Oct 15 - 16, 2026',
    type: 'Hackathon',
    mode: 'Round 1 Online · Finals at PSG Tech',
    status: 'Upcoming',
  },
  {
    id: 'evt-2',
    title: 'Algorithmic Coding Challenge',
    description: 'Competitive programming contest designed to test extreme speed and precision algorithms.',
    date: 'Oct 15, 2:00 PM',
    type: 'Coding Contest',
    mode: 'Round 1 Online',
    status: 'Upcoming',
  },
  {
    id: 'evt-3',
    title: 'Keynote & Tech Workshop',
    description: 'Interactive session by industry pioneers on AI engineering and system scaling.',
    date: 'Oct 15, 5:00 PM',
    type: 'Workshop',
    mode: 'Online',
    status: 'Upcoming',
  },
  {
    id: 'evt-4',
    title: 'Project Pitch & Grand Finale',
    description: 'Final short-listed teams present live demos on PSG Tech campus.',
    date: 'Oct 16, 4:00 PM',
    type: 'Valedictory',
    mode: 'Finals at PSG Tech',
    status: 'Upcoming',
  },
];
