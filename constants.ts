
import { ResumeData, Template } from './types';

export const INITIAL_RESUME_DATA: ResumeData = {
  personalInfo: {
    fullName: 'Alex Doe',
    jobTitle: 'Senior Frontend Engineer',
    email: 'alex.doe@example.com',
    phone: '(555) 123-4567',
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/alexdoe',
    github: 'github.com/alexdoe',
    portfolio: 'alexdoe.dev',
    summary: 'Experienced Software Engineer with a passion for building scalable web applications and AI integration. Proven track record of delivering high-quality code in fast-paced environments.',
  },
  experience: [
    {
      id: '1',
      company: 'Tech Solutions Inc.',
      position: 'Senior Frontend Engineer',
      startDate: '2021-03',
      endDate: '',
      current: true,
      location: 'San Francisco, CA',
      description: '• Led a team of 5 developers to rebuild the core customer dashboard using React and TypeScript.\n• Improved application performance by 40% through code splitting and lazy loading.\n• Integrated AI-powered features using Large Language Models to enhance user productivity.',
      employmentType: 'Full-time',
      locationType: 'Hybrid',
    },
    {
      id: '2',
      company: 'Creative Agency',
      position: 'Web Developer',
      startDate: '2018-06',
      endDate: '2021-02',
      current: false,
      location: 'Austin, TX',
      description: '• Developed responsive websites for diverse clients using HTML, CSS, and JavaScript.\n• Collaborated with designers to ensure pixel-perfect implementation of UI/UX designs.\n• Managed deployment pipelines and server configurations.',
      employmentType: 'Contract',
      locationType: 'On-site',
    },
  ],
  education: [
    {
      id: '1',
      institution: 'University of Technology',
      degree: 'Bachelor of Science',
      fieldOfStudy: 'Computer Science',
      startDate: '2014-09',
      endDate: '2018-05',
      current: false,
      location: 'Austin, TX',
    },
  ],
  skills: ['React', 'TypeScript', 'Node.js', 'Tailwind CSS', 'AWS', 'GraphQL', 'Python', 'Git'],
  projects: [
    {
      id: '1',
      name: 'E-commerce Platform',
      description: 'A full-featured e-commerce application with cart, checkout, and payment processing.',
      technologies: ['Next.js', 'Stripe', 'PostgreSQL'],
      link: 'github.com/alexdoe/ecommerce',
    },
  ],
  customSections: [
    {
      id: '1',
      title: 'Languages',
      type: 'list',
      items: [
        { id: '1', name: 'English', description: 'Native' },
        { id: '2', name: 'Spanish', description: 'B2 Intermediate' },
      ]
    }
  ]
};

export const TEMPLATES: Template[] = [
  { id: 'classic', name: 'Classic ATS', thumbnail: 'bg-white border-gray-300' },
  { id: 'modern', name: 'Modern Clean', thumbnail: 'bg-slate-50 border-blue-200' },
  { id: 'minimal', name: 'Minimalist', thumbnail: 'bg-gray-50 border-gray-200' },
];
