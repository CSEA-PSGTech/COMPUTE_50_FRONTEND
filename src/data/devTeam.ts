export interface DevTeamMember {
  id: string;
  name: string;
  role: string;
  category: 'frontend' | 'backend' | 'coordinator';
  avatar?: string;
  contributions: string[];
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
}

export const DEV_TEAM_MEMBERS: DevTeamMember[] = [
  // ==========================================
  // FRONTEND TEAM
  // ==========================================
  {
    id: 'fe-1',
    name: 'Frontend Lead',
    role: 'Lead Frontend Architect & UI Engineer',
    category: 'frontend',
    contributions: ['React 19', 'Tailwind CSS v4', 'Framer Motion', 'Holographic UX'],
    githubUrl: 'https://github.com',
    linkedinUrl: 'https://linkedin.com',
  },
  {
    id: 'fe-2',
    name: 'UI/UX Developer',
    role: 'Client State & Motion Specialist',
    category: 'frontend',
    contributions: ['Micro-Animations', 'Sound Engine', 'Responsive Layouts'],
    githubUrl: 'https://github.com',
    linkedinUrl: 'https://linkedin.com',
  },
  {
    id: 'fe-3',
    name: 'Component Engineer',
    role: 'Design System & Component Specialist',
    category: 'frontend',
    contributions: ['Interactive Cards', 'Forms & Modals', 'Accessibility (a11y)'],
    githubUrl: 'https://github.com',
    linkedinUrl: 'https://linkedin.com',
  },

  // ==========================================
  // BACKEND TEAM
  // ==========================================
  {
    id: 'be-1',
    name: 'Backend Lead',
    role: 'Lead Systems Architect & API Engineer',
    category: 'backend',
    contributions: ['RESTful APIs', 'Authentication', 'Security Hardening'],
    githubUrl: 'https://github.com',
    linkedinUrl: 'https://linkedin.com',
  },
  {
    id: 'be-2',
    name: 'Cloud & Database Engineer',
    role: 'Database & Realtime Sync Specialist',
    category: 'backend',
    contributions: ['Team State Sync', 'Data Schema Design', 'Cloud Deployment'],
    githubUrl: 'https://github.com',
    linkedinUrl: 'https://linkedin.com',
  },

  // ==========================================
  // COORDINATORS & DESIGN LEADS
  // ==========================================
  {
    id: 'co-1',
    name: 'Web Operations Head',
    role: 'Project Lead & Web Coordinator, CSEA',
    category: 'coordinator',
    contributions: ['Technical Strategy', 'Team Coordination', 'Feature Roadmap'],
    githubUrl: 'https://github.com',
    linkedinUrl: 'https://linkedin.com',
  },
  {
    id: 'co-2',
    name: 'Design & Visual Director',
    role: 'Brand Identity & Visual Designer',
    category: 'coordinator',
    contributions: ['Figma Design System', 'Cyberpunk Aesthetics', 'Logo Direction'],
    githubUrl: 'https://github.com',
    linkedinUrl: 'https://linkedin.com',
  },
];
