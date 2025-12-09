
export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  location: string;
  description: string; // Bullet points separated by newlines or markdown
  employmentType?: string; // 'Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance'
  locationType?: string; // 'On-site', 'Remote', 'Hybrid'
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  current: boolean;
  location: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  link?: string;
}

export interface CustomSectionItem {
  id: string;
  name: string; // The label or Main Title (e.g. "Spanish" or "Volunteering Role")
  description: string; // The value or Description
  subtitle?: string; // Optional: Organization, Issuer, etc.
  startDate?: string;
  endDate?: string;
  location?: string;
  url?: string;
}

export type CustomSectionType = 'list' | 'detailed';

export interface CustomSection {
  id: string;
  title: string;
  type: CustomSectionType;
  items: CustomSectionItem[];
}

export interface ResumeData {
  personalInfo: {
    fullName: string;
    jobTitle?: string;
    email: string;
    phone: string;
    location: string;
    linkedin?: string;
    github?: string;
    portfolio?: string;
    summary: string;
  };
  experience: WorkExperience[];
  education: Education[];
  skills: string[];
  projects: Project[];
  customSections: CustomSection[];
}

export type TemplateId = 'classic' | 'modern' | 'minimal';

export interface Template {
  id: TemplateId;
  name: string;
  thumbnail: string;
}

export interface ResumeVersion {
  id: string;
  timestamp: number;
  data: ResumeData;
  label: string;
}
