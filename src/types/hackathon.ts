export interface Track {
  id: string;
  title: string;
  description: string;
  iconName: string;
  problemCount: number;
}

export interface Speaker {
  id: string;
  name: string;
  role: string;
  organization: string;
  bio?: string;
  image: string;
  type: 'speaker' | 'judge' | 'mentor';
  confirmed?: boolean;
}

export interface Sponsor {
  id: string;
  name: string;
  category: 'Title' | 'Gold' | 'Silver' | 'Community' | 'Partner';
  logo: string;
  website: string;
}

export interface EventItem {
  id: string;
  title: string;
  description: string;
  date: string;
  type: string;
  mode?: string;
  status: 'Upcoming' | 'Ongoing' | 'Completed';
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'General' | 'Registration' | 'Hackathon' | 'Accommodation';
}

export interface ScheduleItem {
  id: string;
  day: 'Day 1' | 'Day 2';
  time: string;
  title: string;
  description: string;
  venue: string;
}

export interface ClubDetails {
  intro: string;
  approach: { title: string; text: string }[];
  worksTowards: string[];
  whoItsFor: { title: string; text: string }[];
}

export interface ClubItem {
  id: string;
  name: string;
  abbreviation?: string;
  description: string;
  summary?: string;
  logo: string;
  fullName?: string;
  tagline?: string;
  url?: string;
  index?: string;
  accent?: string;
  details?: ClubDetails;
}