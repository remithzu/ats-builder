
import { AppData, Template } from './types';

export const INITIAL_APP_DATA: AppData = {
  resume: {
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
    customSections: []
  },
  coverLetter: {
    recipient: {
      name: 'Hiring Manager',
      title: 'Recruiting Team',
      company: 'Future Corp',
      address: '123 Innovation Drive, Silicon Valley, CA'
    },
    date: new Date().toISOString().split('T')[0],
    salutation: 'Dear Hiring Manager,',
    paragraphs: [
      "I am writing to express my strong interest in the [Job Title] position at [Company Name], as advertised on [Platform]. With my background in software development and my passion for building user-centric applications, I am confident that I would be a valuable addition to your team.",
      "In my previous role at Tech Solutions Inc., I led key frontend initiatives that improved application performance and user engagement. I am particularly impressed by [Company Name]'s commitment to innovation and would love the opportunity to contribute to your upcoming projects.",
      "Thank you for your time and consideration. I look forward to the possibility of discussing how my skills and experience align with the needs of your team."
    ],
    closing: 'Sincerely,'
  }
};

export const TEMPLATES: Template[] = [
  { id: 'classic', name: 'Classic ATS', thumbnail: 'bg-white border-gray-300' },
  { id: 'modern', name: 'Modern Clean', thumbnail: 'bg-slate-50 border-blue-200' },
  { id: 'minimal', name: 'Minimalist', thumbnail: 'bg-gray-50 border-gray-200' },
];
