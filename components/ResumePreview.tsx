
import React from 'react';
import { ResumeData, TemplateId, CustomSection } from '../types';
import { MapPin, Mail, Phone, Linkedin, Globe, ExternalLink, Github } from 'lucide-react';

interface ResumePreviewProps {
  data: ResumeData;
  templateId: TemplateId;
}

const ResumePreview: React.FC<ResumePreviewProps> = ({ data, templateId }) => {
  // Common sections
  const { personalInfo, experience, education, skills, projects, customSections } = data;

  const ContactItem = ({ icon: Icon, value, linkType }: { icon: any, value?: string, linkType?: 'email' | 'phone' | 'url' }) => {
      if (!value) return null;
      
      let href = value;
      let displayText = value;

      if (linkType === 'email') {
          href = `mailto:${value}`;
      } else if (linkType === 'phone') {
          href = `tel:${value.replace(/[^\d+]/g, '')}`;
      } else if (linkType === 'url') {
          if (!value.startsWith('http')) {
              href = `https://${value}`;
          }
          // Strip https://, http://, www. for cleaner display
          displayText = value.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
      }

      return (
        <div className="flex items-center gap-1.5 text-sm">
            <Icon size={14} className="flex-shrink-0" />
            {linkType ? (
                <a 
                    href={href} 
                    target={linkType === 'url' ? "_blank" : undefined} 
                    rel="noreferrer" 
                    className="hover:underline hover:text-blue-600 transition-colors"
                >
                    {displayText}
                </a>
            ) : (
                <span>{displayText}</span>
            )}
        </div>
      );
  }

  // Helper to render custom sections dynamically
  const renderCustomSection = (section: CustomSection, template: TemplateId) => {
      // --- CLASSIC RENDER ---
      if (template === 'classic') {
          if (section.type === 'list') {
              return (
                  <div key={section.id} className="mb-6 break-inside-avoid">
                      <h2 className="text-lg font-bold uppercase border-b border-gray-400 mb-3">{section.title}</h2>
                      <div className="space-y-1">
                          {section.items.map(item => (
                              <div key={item.id} className="flex justify-between items-baseline text-sm">
                                  <span className="font-bold">{item.name}</span>
                                  <span className="italic">{item.description}</span>
                              </div>
                          ))}
                      </div>
                  </div>
              );
          } else {
              // Detailed render for Classic
              return (
                  <div key={section.id} className="mb-6">
                      <h2 className="text-lg font-bold uppercase border-b border-gray-400 mb-3 break-inside-avoid">{section.title}</h2>
                      <div className="space-y-4">
                          {section.items.map(item => (
                              <div key={item.id} className="break-inside-avoid">
                                  <div className="flex justify-between items-baseline font-bold text-base">
                                      <div className="flex items-center gap-2">
                                          <h3>{item.name}</h3>
                                          {item.url && <a href={item.url.startsWith('http') ? item.url : `https://${item.url}`} target="_blank" rel="noreferrer"><ExternalLink size={12} className="text-blue-600"/></a>}
                                      </div>
                                      <span className="text-sm font-normal">{item.location}</span>
                                  </div>
                                  {(item.subtitle || item.startDate) && (
                                      <div className="flex justify-between items-baseline italic text-sm mb-1">
                                          <span>{item.subtitle}</span>
                                          <span>{item.startDate}{item.startDate && item.endDate ? ` - ${item.endDate}` : ''}</span>
                                      </div>
                                  )}
                                  <div className="text-sm pl-4">
                                       {item.description && (
                                           <ul className="list-disc space-y-1">
                                              {item.description.split('\n').map((line, i) => line.trim() && <li key={i}>{line.replace(/^[•-]\s*/, '')}</li>)}
                                           </ul>
                                       )}
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>
              );
          }
      }

      // --- MODERN RENDER ---
      if (template === 'modern') {
           // Modern List renders in Sidebar usually, but if called here (in Main Content), render appropriately
           if (section.type === 'list') {
                return (
                    <div key={section.id} className="mb-6 break-inside-avoid">
                        <h3 className="text-xl font-bold text-blue-700 mb-4">{section.title}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                            {section.items.map(item => (
                                <div key={item.id} className="flex justify-between text-sm border-b border-slate-100 pb-1">
                                    <span className="font-semibold text-slate-700">{item.name}</span>
                                    <span className="text-slate-500">{item.description}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                );
           } else {
                // Detailed Render for Modern
                return (
                    <div key={section.id} className="mb-8">
                        <h3 className="text-xl font-bold text-blue-700 mb-4 break-inside-avoid">{section.title}</h3>
                        <div className="space-y-6">
                            {section.items.map(item => (
                                <div key={item.id} className="relative pl-4 border-l-2 border-blue-100 break-inside-avoid">
                                    <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-blue-500"></div>
                                    <div className="flex justify-between items-baseline mb-1">
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-bold text-lg">{item.name}</h4>
                                            {item.url && <a href={item.url.startsWith('http') ? item.url : `https://${item.url}`} target="_blank" rel="noreferrer"><ExternalLink size={12} className="text-blue-500"/></a>}
                                        </div>
                                        <span className="text-xs text-slate-500 font-medium">{item.startDate} {item.startDate && item.endDate ? `– ${item.endDate}` : ''}</span>
                                    </div>
                                    <div className="text-blue-600 font-medium text-sm mb-2">
                                        {item.subtitle} {item.subtitle && item.location ? ', ' : ''} {item.location}
                                    </div>
                                    <ul className="list-disc list-outside ml-4 space-y-1 text-sm text-slate-600">
                                        {item.description.split('\n').map((line, i) => line.trim() && <li key={i}>{line.replace(/^[•-]\s*/, '')}</li>)}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                );
           }
      }

      // --- MINIMAL RENDER ---
      if (template === 'minimal') {
          if (section.type === 'list') {
              return (
                  <section key={section.id} className="break-inside-avoid">
                      <h2 className="font-bold uppercase tracking-widest text-xs text-gray-400 mb-6">{section.title}</h2>
                      <div className="space-y-3">
                           {section.items.map(item => (
                               <div key={item.id} className="flex justify-between text-sm border-b border-gray-100 pb-2">
                                   <span className="font-medium text-gray-700">{item.name}</span>
                                   <span className="text-gray-500">{item.description}</span>
                               </div>
                           ))}
                      </div>
                  </section>
              );
          } else {
              // Detailed Render for Minimal
              return (
                  <section key={section.id}>
                      <h2 className="font-bold uppercase tracking-widest text-xs text-gray-400 mb-6 break-inside-avoid">{section.title}</h2>
                      <div className="space-y-8">
                          {section.items.map(item => (
                              <div key={item.id} className="break-inside-avoid">
                                  <div className="flex justify-between items-baseline mb-2">
                                      <div className="flex items-center gap-2">
                                        <h3 className="font-semibold text-lg">{item.name}</h3>
                                        {item.url && <a href={item.url.startsWith('http') ? item.url : `https://${item.url}`} target="_blank" rel="noreferrer"><ExternalLink size={12} className="text-gray-400 hover:text-gray-600"/></a>}
                                      </div>
                                      <span className="text-xs text-gray-400">{item.startDate} {item.startDate && item.endDate ? `- ${item.endDate}` : ''}</span>
                                  </div>
                                  <div className="text-sm font-medium text-gray-500 mb-3">
                                      {item.subtitle} {item.subtitle && item.location ? '•' : ''} {item.location}
                                  </div>
                                  <ul className="text-sm text-gray-600 space-y-2 list-none">
                                      {item.description.split('\n').map((line, i) => line.trim() && <li key={i} className="flex gap-2">
                                          <span className="text-gray-300 mt-1.5">•</span>
                                          <span className="flex-1">{line.replace(/^[•-]\s*/, '')}</span>
                                      </li>)}
                                  </ul>
                              </div>
                          ))}
                      </div>
                  </section>
              );
          }
      }
      return null;
  };

  // --- TEMPLATE: CLASSIC ATS ---
  if (templateId === 'classic') {
    return (
      <div className="w-full min-h-full bg-white p-6 md:px-[0.5in] md:pt-[0.3in] md:pb-[1in] print:px-[0.5in] print:pt-[0.3in] print:pb-[1in] text-gray-900 font-serif leading-relaxed break-words">
        {/* Header */}
        <div className="text-center border-b-2 border-gray-800 pb-4 mb-6 break-inside-avoid">
          <h1 className="text-3xl font-bold uppercase tracking-wide">{personalInfo.fullName}</h1>
          {personalInfo.jobTitle && <h2 className="text-xl mt-1 text-gray-700 font-medium">{personalInfo.jobTitle}</h2>}
          <div className="flex flex-wrap justify-center gap-4 mt-3 text-sm">
             <ContactItem icon={MapPin} value={personalInfo.location} />
             <ContactItem icon={Mail} value={personalInfo.email} linkType="email" />
             <ContactItem icon={Phone} value={personalInfo.phone} linkType="phone" />
             <ContactItem icon={Linkedin} value={personalInfo.linkedin} linkType="url" />
             <ContactItem icon={Github} value={personalInfo.github} linkType="url" />
             <ContactItem icon={Globe} value={personalInfo.portfolio} linkType="url" />
          </div>
        </div>

        {/* Summary */}
        {personalInfo.summary && (
            <div className="mb-6 break-inside-avoid">
                <h2 className="text-lg font-bold uppercase border-b border-gray-400 mb-2">Professional Summary</h2>
                <p className="text-sm text-justify">{personalInfo.summary}</p>
            </div>
        )}

        {/* Experience */}
        {experience.length > 0 && (
            <div className="mb-6">
                 <h2 className="text-lg font-bold uppercase border-b border-gray-400 mb-3 break-inside-avoid">Work Experience</h2>
                 <div className="space-y-4">
                     {experience.map(exp => (
                         <div key={exp.id} className="break-inside-avoid">
                             <div className="flex justify-between items-baseline font-bold text-base">
                                 <h3>{exp.company}</h3>
                                 <span className="text-sm font-normal">{exp.location} {exp.locationType && exp.locationType !== 'On-site' ? `(${exp.locationType})` : ''}</span>
                             </div>
                             <div className="flex justify-between items-baseline italic text-sm mb-1">
                                 <span>{exp.position} {exp.employmentType && exp.employmentType !== 'Full-time' ? `• ${exp.employmentType}` : ''}</span>
                                 <span>{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
                             </div>
                             <div className="text-sm pl-4">
                                 <ul className="list-disc space-y-1">
                                     {exp.description.split('\n').map((line, i) => line.trim() && <li key={i}>{line.replace(/^[•-]\s*/, '')}</li>)}
                                 </ul>
                             </div>
                         </div>
                     ))}
                 </div>
            </div>
        )}

        {/* Education */}
         {education.length > 0 && (
            <div className="mb-6">
                 <h2 className="text-lg font-bold uppercase border-b border-gray-400 mb-3 break-inside-avoid">Education</h2>
                 <div className="space-y-3">
                     {education.map(edu => (
                         <div key={edu.id} className="break-inside-avoid">
                             <div className="flex justify-between font-bold text-base">
                                 <h3>{edu.institution}</h3>
                                 <span className="text-sm font-normal">{edu.location}</span>
                             </div>
                             <div className="flex justify-between text-sm italic">
                                 <span>{edu.degree}, {edu.fieldOfStudy}</span>
                                 <span>{edu.startDate} - {edu.endDate || 'Present'}</span>
                             </div>
                         </div>
                     ))}
                 </div>
            </div>
        )}

        {/* Projects */}
        {projects.length > 0 && (
            <div className="mb-6">
                <h2 className="text-lg font-bold uppercase border-b border-gray-400 mb-3 break-inside-avoid">Projects</h2>
                 <div className="space-y-3">
                    {projects.map(proj => (
                        <div key={proj.id} className="break-inside-avoid">
                            <div className="flex justify-between font-bold text-base">
                                 <div className="flex items-center gap-2">
                                    <h3>{proj.name}</h3>
                                    {proj.link && <a href={proj.link.startsWith('http') ? proj.link : `https://${proj.link}`} target="_blank" rel="noreferrer"><ExternalLink size={12} className="text-blue-600"/></a>}
                                 </div>
                             </div>
                             <p className="text-sm italic mb-1">{proj.technologies.join(', ')}</p>
                             <p className="text-sm">{proj.description}</p>
                        </div>
                    ))}
                 </div>
            </div>
        )}

        {/* Custom Sections */}
        {(customSections || []).map(section => renderCustomSection(section, 'classic'))}

        {/* Skills */}
        {skills.length > 0 && (
             <div className="break-inside-avoid">
                <h2 className="text-lg font-bold uppercase border-b border-gray-400 mb-2">Technical Skills</h2>
                <p className="text-sm">{skills.join(' • ')}</p>
            </div>
        )}
      </div>
    );
  }

  // --- TEMPLATE: MODERN ---
  if (templateId === 'modern') {
      return (
          <div className="w-full min-h-full bg-white flex flex-col md:flex-row print:flex-row text-slate-800 font-sans break-words">
              {/* Sidebar */}
              <div className="w-full md:w-1/3 print:w-1/3 bg-slate-100 p-6 md:pt-[0.3in] md:pb-[1in] md:pl-[0.5in] md:pr-6 print:pt-[0.3in] print:pb-[1in] print:pl-[0.5in] print:pr-6 flex flex-col gap-8 border-r-0 border-b md:border-b-0 md:border-r print:border-b-0 print:border-r border-slate-200 min-h-0 md:min-h-full print:min-h-0">
                  <div className="space-y-4 break-inside-avoid">
                      <div>
                        <h1 className="text-2xl font-bold text-slate-900 leading-tight">{personalInfo.fullName}</h1>
                        {personalInfo.jobTitle && <h2 className="text-md font-medium text-slate-600 mt-1">{personalInfo.jobTitle}</h2>}
                      </div>
                      <div className="text-sm text-slate-600 space-y-2">
                        <ContactItem icon={MapPin} value={personalInfo.location} />
                        <ContactItem icon={Mail} value={personalInfo.email} linkType="email" />
                        <ContactItem icon={Phone} value={personalInfo.phone} linkType="phone" />
                        <ContactItem icon={Linkedin} value={personalInfo.linkedin} linkType="url" />
                        <ContactItem icon={Github} value={personalInfo.github} linkType="url" />
                        <ContactItem icon={Globe} value={personalInfo.portfolio} linkType="url" />
                      </div>
                  </div>

                  {/* Skills */}
                  {skills.length > 0 && (
                    <div className="break-inside-avoid">
                        <h3 className="uppercase font-bold text-slate-500 tracking-wider text-sm mb-3 border-b border-slate-300 pb-1">Skills</h3>
                        <div className="flex flex-wrap gap-2">
                            {skills.map(skill => (
                                <span key={skill} className="bg-white border border-slate-300 rounded px-2 py-1 text-xs font-medium">{skill}</span>
                            ))}
                        </div>
                    </div>
                  )}

                  {/* Education (Sidebar for Modern) */}
                   {education.length > 0 && (
                    <div className="break-inside-avoid">
                        <h3 className="uppercase font-bold text-slate-500 tracking-wider text-sm mb-3 border-b border-slate-300 pb-1">Education</h3>
                        <div className="space-y-4">
                            {education.map(edu => (
                                <div key={edu.id} className="text-sm">
                                    <div className="font-bold">{edu.institution}</div>
                                    <div>{edu.degree}</div>
                                    <div className="text-slate-500 text-xs">{edu.startDate} - {edu.endDate}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                  )}
              </div>

              {/* Main Content */}
              <div className="w-full md:w-2/3 print:w-2/3 p-8 md:pt-[0.3in] md:pb-[1in] md:pr-[0.5in] md:pl-8 print:pt-[0.3in] print:pb-[1in] print:pr-[0.5in] print:pl-8">
                  {personalInfo.summary && (
                      <div className="mb-8 break-inside-avoid">
                           <h3 className="text-xl font-bold text-blue-700 mb-3">Profile</h3>
                           <p className="text-sm leading-relaxed text-slate-600">{personalInfo.summary}</p>
                      </div>
                  )}

                  {experience.length > 0 && (
                      <div className="mb-8">
                          <h3 className="text-xl font-bold text-blue-700 mb-4 break-inside-avoid">Experience</h3>
                          <div className="space-y-6">
                              {experience.map(exp => (
                                  <div key={exp.id} className="relative pl-4 border-l-2 border-blue-100 break-inside-avoid">
                                      <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-blue-500"></div>
                                      <div className="flex justify-between items-baseline mb-1">
                                          <div className="flex items-center gap-2">
                                            <h4 className="font-bold text-lg">{exp.position}</h4>
                                            {exp.employmentType && exp.employmentType !== 'Full-time' && (
                                                <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded uppercase font-semibold">{exp.employmentType}</span>
                                            )}
                                          </div>
                                          <span className="text-xs text-slate-500 font-medium">{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
                                      </div>
                                      <div className="text-blue-600 font-medium text-sm mb-2">
                                          {exp.company}, {exp.location} {exp.locationType && exp.locationType !== 'On-site' ? `(${exp.locationType})` : ''}
                                      </div>
                                      <ul className="list-disc list-outside ml-4 space-y-1 text-sm text-slate-600">
                                         {exp.description.split('\n').map((line, i) => line.trim() && <li key={i}>{line.replace(/^[•-]\s*/, '')}</li>)}
                                      </ul>
                                  </div>
                              ))}
                          </div>
                      </div>
                  )}

                   {projects.length > 0 && (
                      <div className="mb-8">
                          <h3 className="text-xl font-bold text-blue-700 mb-4 break-inside-avoid">Key Projects</h3>
                          <div className="grid gap-4">
                              {projects.map(proj => (
                                  <div key={proj.id} className="bg-slate-50 p-4 rounded-lg break-inside-avoid">
                                       <div className="flex justify-between items-center mb-2">
                                           <h4 className="font-bold">{proj.name}</h4>
                                            {proj.link && <a href={proj.link.startsWith('http') ? proj.link : `https://${proj.link}`} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline text-xs flex items-center gap-1">View <ExternalLink size={10}/></a>}
                                       </div>
                                       <p className="text-xs text-slate-500 mb-2 italic">{proj.technologies.join(', ')}</p>
                                       <p className="text-sm text-slate-600">{proj.description}</p>
                                  </div>
                              ))}
                          </div>
                      </div>
                  )}

                  {/* Custom Sections (Modern - Main Content) */}
                  {(customSections || []).map(section => renderCustomSection(section, 'modern'))}
              </div>
          </div>
      );
  }

  // --- TEMPLATE: MINIMAL ---
  return (
    <div className="w-full min-h-full bg-white p-6 md:px-[0.5in] md:pt-[0.3in] md:pb-[1in] print:px-[0.5in] print:pt-[0.3in] print:pb-[1in] text-gray-800 font-sans break-words">
         <header className="mb-10 break-inside-avoid">
             <h1 className="text-4xl font-light mb-1">{personalInfo.fullName}</h1>
             {personalInfo.jobTitle && <h2 className="text-lg font-medium text-gray-500 uppercase tracking-wide mb-3">{personalInfo.jobTitle}</h2>}
             <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-500 font-light">
                <span>{personalInfo.location}</span>
                {personalInfo.email && (
                    <a href={`mailto:${personalInfo.email}`} className="hover:underline hover:text-gray-800 transition-colors">
                        {personalInfo.email}
                    </a>
                )}
                {personalInfo.phone && (
                    <a href={`tel:${personalInfo.phone.replace(/[^\d+]/g, '')}`} className="hover:underline hover:text-gray-800 transition-colors">
                        {personalInfo.phone}
                    </a>
                )}
                
                {/* Minimal Links */}
                {[
                    { val: personalInfo.linkedin, label: 'LinkedIn' }, 
                    { val: personalInfo.github, label: 'GitHub' }, 
                    { val: personalInfo.portfolio, label: 'Portfolio' }
                ].map((item, index) => item.val && (
                    <a 
                        key={index}
                        href={item.val.startsWith('http') ? item.val : `https://${item.val}`} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="hover:underline hover:text-gray-800 transition-colors"
                    >
                         {/* Display cleaned URL or account handle */}
                         {item.val.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}
                    </a>
                ))}
             </div>
         </header>

         <div className="grid grid-cols-1 md:grid-cols-[1fr_3fr] print:grid-cols-[1fr_3fr] gap-8">
             <div className="space-y-8 text-sm">
                 {/* Left Column: Education, Skills, Custom Sections (if short) */}
                 {education.length > 0 && (
                    <section className="break-inside-avoid">
                        <h2 className="font-bold uppercase tracking-widest text-xs text-gray-400 mb-4">Education</h2>
                        <div className="space-y-4">
                             {education.map(edu => (
                                 <div key={edu.id}>
                                     <div className="font-medium">{edu.institution}</div>
                                     <div className="text-gray-500">{edu.degree}</div>
                                     <div className="text-gray-400 text-xs mt-1">{edu.startDate.split('-')[0]} - {edu.endDate.split('-')[0] || 'Now'}</div>
                                 </div>
                             ))}
                        </div>
                    </section>
                 )}

                 {skills.length > 0 && (
                    <section className="break-inside-avoid">
                        <h2 className="font-bold uppercase tracking-widest text-xs text-gray-400 mb-4">Skills</h2>
                        <div className="flex flex-col gap-2">
                             {skills.map(skill => (
                                 <span key={skill} className="text-gray-600">{skill}</span>
                             ))}
                        </div>
                    </section>
                 )}
             </div>

             <div className="space-y-8">
                 {/* Right Column: Summary, Experience, Projects */}
                 {personalInfo.summary && (
                     <section className="break-inside-avoid">
                          <h2 className="font-bold uppercase tracking-widest text-xs text-gray-400 mb-4">About</h2>
                          <p className="text-sm leading-relaxed text-gray-600">{personalInfo.summary}</p>
                     </section>
                 )}

                 {experience.length > 0 && (
                     <section>
                         <h2 className="font-bold uppercase tracking-widest text-xs text-gray-400 mb-6 break-inside-avoid">Experience</h2>
                         <div className="space-y-8">
                             {experience.map(exp => (
                                 <div key={exp.id} className="break-inside-avoid">
                                     <div className="flex justify-between items-baseline mb-2">
                                         <h3 className="font-semibold text-lg">{exp.position}</h3>
                                         <span className="text-xs text-gray-400">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
                                     </div>
                                     <div className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-2">
                                         {exp.company}
                                         {(exp.employmentType || exp.locationType) && (
                                            <span className="text-xs font-normal text-gray-400 border-l pl-2 border-gray-300">
                                                {[exp.employmentType, exp.locationType].filter(Boolean).join(' • ')}
                                            </span>
                                         )}
                                     </div>
                                     <ul className="text-sm text-gray-600 space-y-2 list-none">
                                         {exp.description.split('\n').map((line, i) => line.trim() && <li key={i} className="flex gap-2">
                                             <span className="text-gray-300 mt-1.5">•</span>
                                             <span className="flex-1">{line.replace(/^[•-]\s*/, '')}</span>
                                         </li>)}
                                     </ul>
                                 </div>
                             ))}
                         </div>
                     </section>
                 )}
                 
                 {projects.length > 0 && (
                     <section>
                         <h2 className="font-bold uppercase tracking-widest text-xs text-gray-400 mb-6 break-inside-avoid">Projects</h2>
                         <div className="grid grid-cols-2 gap-6">
                            {projects.map(proj => (
                                <div key={proj.id} className="bg-gray-50 p-4 rounded break-inside-avoid">
                                    <div className="font-semibold mb-1">{proj.name}</div>
                                    <div className="text-xs text-gray-500 mb-2">{proj.technologies.join(', ')}</div>
                                    <p className="text-sm text-gray-600 leading-snug">{proj.description}</p>
                                </div>
                            ))}
                         </div>
                     </section>
                 )}

                 {/* Custom Sections (Minimal - Right Column) */}
                 {(customSections || []).map(section => renderCustomSection(section, 'minimal'))}
             </div>
         </div>
    </div>
  );
};

export default ResumePreview;
