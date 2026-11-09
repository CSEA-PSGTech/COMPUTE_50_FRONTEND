import { Speaker } from '../types/hackathon';
import arulkumaraImg from '../assets/images/speakers/arulkumara.jpg';
import mithunImg from '../assets/images/speakers/Mithun_karthik.jpeg';
import hariniImg from '../assets/images/speakers/Harini.jpeg';
import mahimaaImg from '../assets/images/speakers/Mahimaa.jpeg';
import shananthikaImg from '../assets/images/speakers/Shananthika.jpeg';

export const mockSpeakers: Speaker[] = [
  {
    id: 'spk-1',
    name: 'Mr. Arulkumara B R',
    role: 'AI Engineer',
    organization: 'ARM Bangalore',
    bio: 'AI Engineer at ARM Bangalore · BE CSE 2026 Alumnus',
    image: arulkumaraImg,
    type: 'judge',
    confirmed: true,
  },
  {
    id: 'spk-2',
    name: 'Mr.Mithun Karthik A S',
    role: 'Associate Software Engineer',
    organization: 'Birla Pivot Bangalore',
    bio: 'Associate Software Engineer at Birla Pivot Bangalore · BE CSE 2026 Alumnus',
    image: mithunImg,
    type: 'judge',
    confirmed: true,
  },
  {
    id: 'spk-3',
    name: 'Ms. Harini R',
    role: 'ERP Technical Analyst',
    organization: 'Schneider Electric Bangalore',
    bio: 'ERP Technical Analyst , Schneider Electric Bangalore · BE CSE 2026 Alumnus',
    image: hariniImg,
    type: 'judge',
    confirmed: true,
  },
  {
    id: 'spk-4',
    name: 'Ms. Mahimaa U',
    role: 'Software Engineer',
    organization: 'IBM Bangalore',
    bio: 'Software Engineer at IBM Bangalore · BE CSE 2026 Alumnus',
    image: mahimaaImg,
    type: 'judge',
    confirmed: true,
  },
  {
    id: 'spk-5',
    name: 'Ms. Shananthika S',
    role: 'Data Integration Engineer',
    organization: 'ExxonMobil',
    bio: 'Data Integration Engineer at ExxonMobil · BE CSE 2026 Alumnus.',
    image: shananthikaImg,
    type: 'judge',
    confirmed: true,
  },
  {
    id: 'spk-6',
    name: 'Priya Venkatesh',
    role: 'Senior Product Architect',
    organization: 'InnovateX Labs',
    bio: 'Hands-on technical mentor guiding participant teams on product design, scalable APIs, and full-stack UX.',
    image: '',
    type: 'mentor',
    confirmed: false,
  },
];
