export const DEPARTMENTS: string[] = [
  'Automobile Engineering',
  'Biomedical Engineering',
  'Civil Engineering',
  'Computer Science and Engineering',
  'Computer Science and Engineering (AI and ML)',
  'Electrical and Electronics Engineering',
  'Electronics and Communication Engineering',
  'Instrumentation and Control Engineering',
  'Mechanical Engineering',
  'Metallurgical Engineering',
  'Production Engineering',
  'Robotics and Automation',
  'Bio Technology',
  'Fashion Technology',
  'Information Technology',
  'Textile Technology',
  'Artificial intelligence and Data Science',
  'Applied Mathematics and Computational Science',
];

export const PSG_COLLEGES: Record<string, string> = {
  '@psgtech.ac.in': 'PSG College of Technology (Autonomous), Peelamedu, Coimbatore District 641004',
  '@psgitech.ac.in': 'PSG Institute of Technology and Applied Research, Avinashi Road, Neelambur, Coimbatore 641062',
};

export const psgCollegeForEmail = (email: string): string | null => {
  const lower = email.trim().toLowerCase();
  const domain = Object.keys(PSG_COLLEGES).find((d) => lower.endsWith(d));
  return domain ? PSG_COLLEGES[domain] : null;
};