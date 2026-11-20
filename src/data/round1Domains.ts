export interface Round1Domain {
  id: string;
  title: string;
  description: string;
  iconName: string;
  tag: string;
}

export const round1Domains: Round1Domain[] = [
  {
    id: 'domain-1',
    title: 'Sustainable Development and Climate Action',
    description:
      'AI solutions for environmental conservation, carbon footprint reduction, and climate change mitigation.',
    iconName: 'Leaf',
    tag: 'Climate & Environment',
  },
  {
    id: 'domain-2',
    title: 'Smart Cities and Urban Innovation',
    description:
      'Intelligent systems for urban planning, traffic management, and smart infrastructure.',
    iconName: 'Building2',
    tag: 'Urban Tech',
  },
  {
    id: 'domain-3',
    title: 'Women Safety and Security',
    description:
      "Innovative AI applications in emergency alert systems, incident prevention, and women's protection.",
    iconName: 'ShieldAlert',
    tag: 'Safety & Defense',
  },
  {
    id: 'domain-4',
    title: 'Healthcare and Life Sciences',
    description:
      'Innovative AI applications in medical diagnosis, drug discovery, and healthcare delivery.',
    iconName: 'HeartPulse',
    tag: 'Health & BioTech',
  },
  {
    id: 'domain-5',
    title: 'Agriculture and Rural Innovation',
    description:
      'Smart farming solutions, crop monitoring, and agricultural automation using AI.',
    iconName: 'Sprout',
    tag: 'AgriTech',
  },
  {
    id: 'domain-6',
    title: 'Education Technology and Learning Platforms',
    description:
      'AI-driven personalized learning, skill assessment, and educational accessibility.',
    iconName: 'GraduationCap',
    tag: 'EdTech',
  },
  {
    id: 'domain-7',
    title: 'E-commerce and Digital Ecosystems',
    description:
      'Intelligent recommendations, supply chain optimization, and digital marketplace solutions.',
    iconName: 'ShoppingBag',
    tag: 'FinTech & Commerce',
  },
  {
    id: 'domain-8',
    title: 'Media, Entertainment, and Digital Experiences',
    description:
      'AI applications in content creation, personalization, and immersive digital experiences.',
    iconName: 'Film',
    tag: 'Digital Media',
  },
  {
    id: 'domain-9',
    title: 'Developer Productivity and Intelligent Automation',
    description:
      'Tools and frameworks to enhance developer efficiency and automate software development.',
    iconName: 'Wrench',
    tag: 'DevTools & Automation',
  },
  {
    id: 'domain-10',
    title: 'Responsible AI and Resource Optimization',
    description:
      'Fair, transparent AI systems with efficient resource utilization and ethical considerations.',
    iconName: 'Scale',
    tag: 'AI Ethics & Systems',
  },
];
