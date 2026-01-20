
import React from 'react';
import { CoverLetterData, PersonalInfo, TemplateId } from '../types';
import { MapPin, Mail, Phone, Linkedin, Globe, Github } from 'lucide-react';

interface CoverLetterPreviewProps {
  coverLetter: CoverLetterData;
  personalInfo: PersonalInfo;
  templateId: TemplateId;
}

const CoverLetterPreview: React.FC<CoverLetterPreviewProps> = ({ coverLetter, personalInfo, templateId }) => {
  const ContactItem = ({ icon: Icon, value, linkType }: { icon: any, value?: string, linkType?: 'email' | 'phone' | 'url' }) => {
      if (!value) return null;
      let displayText = value.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
      return (
        <div className="flex items-center gap-1.5 text-xs sm:text-sm">
            <Icon size={14} className="flex-shrink-0" />
            <span>{displayText}</span>
        </div>
      );
  }

  const Header = () => {
    if (templateId === 'classic') {
        return (
            <div className="text-center border-b-2 border-gray-800 pb-4 mb-8">
                <h1 className="text-3xl font-bold uppercase tracking-wide">{personalInfo.fullName}</h1>
                <div className="flex flex-wrap justify-center gap-4 mt-3 text-sm">
                    <ContactItem icon={MapPin} value={personalInfo.location} />
                    <ContactItem icon={Mail} value={personalInfo.email} />
                    <ContactItem icon={Phone} value={personalInfo.phone} />
                </div>
            </div>
        );
    }
    if (templateId === 'modern') {
        return (
            <div className="bg-slate-100 -mx-[0.5in] -mt-[0.3in] p-8 mb-8 flex justify-between items-center border-b border-slate-200">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 leading-tight">{personalInfo.fullName}</h1>
                    {personalInfo.jobTitle && <h2 className="text-md font-medium text-blue-700 mt-1">{personalInfo.jobTitle}</h2>}
                </div>
                <div className="text-right text-xs text-slate-500 space-y-1">
                    <div>{personalInfo.location}</div>
                    <div>{personalInfo.email}</div>
                    <div>{personalInfo.phone}</div>
                </div>
            </div>
        );
    }
    return (
        <header className="mb-10">
             <h1 className="text-4xl font-light mb-1">{personalInfo.fullName}</h1>
             <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-400 font-light">
                <span>{personalInfo.location}</span>
                <span>{personalInfo.email}</span>
                <span>{personalInfo.phone}</span>
             </div>
        </header>
    );
  };

  const fontClass = templateId === 'classic' ? 'font-serif' : 'font-sans';
  const textClass = templateId === 'modern' ? 'text-slate-700' : 'text-gray-800';

  return (
    <div className={`w-full min-h-full bg-white p-6 md:px-[0.5in] md:pt-[0.3in] md:pb-[1in] print:px-[0.5in] print:pt-[0.3in] print:pb-[1in] ${fontClass} ${textClass} leading-relaxed break-words`}>
        <Header />
        
        <div className="space-y-6 text-sm sm:text-base">
            <div className="mb-8">
                <p className="font-medium">{new Date(coverLetter.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <div className="mt-6 space-y-0.5">
                    <p className="font-bold">{coverLetter.recipient.name}</p>
                    <p>{coverLetter.recipient.title}</p>
                    <p className="font-medium">{coverLetter.recipient.company}</p>
                    <p className="text-gray-600 whitespace-pre-line">{coverLetter.recipient.address}</p>
                </div>
            </div>

            <p className="font-bold">{coverLetter.salutation}</p>

            {coverLetter.paragraphs.map((p, i) => (
                <p key={i} className="text-justify leading-relaxed">{p}</p>
            ))}

            <div className="mt-10">
                <p>{coverLetter.closing}</p>
                <p className="font-bold mt-4 text-lg">{personalInfo.fullName}</p>
            </div>
        </div>
    </div>
  );
};

export default CoverLetterPreview;
