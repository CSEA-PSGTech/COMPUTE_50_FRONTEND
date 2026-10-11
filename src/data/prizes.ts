import { EVENT_CONFIG } from '../config/event';

export interface PrizeItem {
  id: string;
  rank: string;
  title: string;
  amount: number;
  amountFormatted: string;
  description: string;
  perks: string[];
  isGrandWinner?: boolean;
}

export interface PrizeData {
  totalAmount: number;
  totalFormatted: string;
  label: string;
  subtitle: string;
  items: PrizeItem[];
  trackPrizes: {
    amount: number;
    amountFormatted: string;
    label: string;
    description: string;
  };
  rules: string[];
}

export const prizeData: PrizeData = {
  totalAmount: EVENT_CONFIG.prizes.total,
  totalFormatted: EVENT_CONFIG.prizes.totalFormatted,
  label: '// PRIZE POOL',
  subtitle: 'Rewarding technical innovation & engineering excellence',
  items: [
    {
      id: 'first-place',
      rank: '1st Place',
      title: 'Grand Winner',
      amount: EVENT_CONFIG.prizes.first,
      amountFormatted: EVENT_CONFIG.prizes.firstFormatted.replace('1st: ', ''),
      description: 'Awarded to the overall top-performing hackathon submission demonstrating technical complexity and real-world impact.',
      perks: ['Grand Winner Trophy', 'Cash Prize Reward of ₹1,00,000', 'Certificate of Excellence', 'Direct Mentorship Opportunities'],
      isGrandWinner: true,
    },
    {
      id: 'second-place',
      rank: '2nd Place',
      title: 'First Runner Up',
      amount: EVENT_CONFIG.prizes.second,
      amountFormatted: EVENT_CONFIG.prizes.secondFormatted.replace('2nd: ', ''),
      description: 'Awarded to the second-highest scoring team for outstanding prototype implementation and execution.',
      perks: ['Runner Up Trophy', 'Cash Prize Reward of ₹60,000', 'Certificate of Merit'],
    },
    {
      id: 'third-place',
      rank: '3rd Place',
      title: 'Second Runner Up',
      amount: EVENT_CONFIG.prizes.third,
      amountFormatted: EVENT_CONFIG.prizes.thirdFormatted.replace('3rd: ', ''),
      description: 'Awarded to the third-highest scoring team for creative problem-solving and solid technical design.',
      perks: ['Third Place Trophy', 'Cash Prize Reward of ₹40,000', 'Certificate of Merit'],
    },
  ],
  trackPrizes: {
    amount: EVENT_CONFIG.prizes.categories,
    amountFormatted: '₹50,000',
    label: 'Track Prizes',
    description: 'Distributed across domain-specific tracks for best domain innovation, technical depth, and UI/UX implementation.',
  },
  rules: [
    'Prizes are distributed to team leaders following official verification of working code and project repository.',
    'All prototypes must be developed during the hackathon timeline using original code.',
    'Judges’ evaluation and decision on prize distribution across tracks is final.',
    'Teams must adhere to the official Code of Conduct throughout the event.',
  ],
};
