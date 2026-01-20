
export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  location: string;
  description: string;
  employmentType?: string;
  locationType?: string;
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
  name: string;
  description: string;
  subtitle?: string;
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

export interface PersonalInfo {
  fullName: string;
  jobTitle?: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  summary: string;
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  experience: WorkExperience[];
  education: Education[];
  skills: string[];
  projects: Project[];
  customSections: CustomSection[];
}

export interface CoverLetterData {
  recipient: {
    name: string;
    title: string;
    company: string;
    address: string;
  };
  date: string;
  salutation: string;
  paragraphs: string[];
  closing: string;
}

export interface AppData {
  resume: ResumeData;
  coverLetter: CoverLetterData;
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
  data: AppData;
  label: string;
}
