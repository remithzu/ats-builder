
import React, { useState } from 'react';
import { ResumeData, WorkExperience, Education, Project, CustomSection, CustomSectionItem, CustomSectionType } from '../types';
import { Plus, Trash2, ChevronDown, ChevronUp, AlignLeft, List, ArrowUp, ArrowDown, ListOrdered } from 'lucide-react';

interface ResumeEditorProps {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
}

const ResumeEditor: React.FC<ResumeEditorProps> = ({ data, onChange }) => {
  const [activeSection, setActiveSection] = useState<string | null>('personal');

  const updatePersonalInfo = (field: keyof ResumeData['personalInfo'], value: string) => {
    onChange({
      ...data,
      personalInfo: { ...data.personalInfo, [field]: value },
    });
  };

  const updateExperience = (id: string, field: keyof WorkExperience, value: any) => {
    const newExperience = data.experience.map((exp) =>
      exp.id === id ? { ...exp, [field]: value } : exp
    );
    onChange({ ...data, experience: newExperience });
  };

  const addExperience = () => {
    const newExp: WorkExperience = {
      id: crypto.randomUUID(),
      company: 'New Company',
      position: 'Position',
      startDate: '',
      endDate: '',
      current: false,
      location: '',
      description: '',
      employmentType: 'Full-time',
      locationType: 'On-site',
    };
    onChange({ ...data, experience: [newExp, ...data.experience] });
  };

  const removeExperience = (id: string) => {
    onChange({ ...data, experience: data.experience.filter((e) => e.id !== id) });
  };

  const moveExperience = (index: number, direction: 'up' | 'down') => {
    const newExperience = [...data.experience];
    if (direction === 'up' && index > 0) {
      [newExperience[index], newExperience[index - 1]] = [newExperience[index - 1], newExperience[index]];
    } else if (direction === 'down' && index < newExperience.length - 1) {
      [newExperience[index], newExperience[index + 1]] = [newExperience[index + 1], newExperience[index]];
    }
    onChange({ ...data, experience: newExperience });
  };

  const formatBullets = (id: string, text: string) => {
    const lines = text.split('\n');
    const formatted = lines.map(line => {
      const trimmed = line.trim();
      if (!trimmed) return '';
      if (trimmed.startsWith('•') || trimmed.startsWith('-')) return trimmed.replace(/^-/, '•');
      return `• ${trimmed}`;
    }).filter(l => l !== '').join('\n');
    updateExperience(id, 'description', formatted);
  };

  const updateEducation = (id: string, field: keyof Education, value: any) => {
    const newEdu = data.education.map((edu) =>
      edu.id === id ? { ...edu, [field]: value } : edu
    );
    onChange({ ...data, education: newEdu });
  };

  const addEducation = () => {
    const newEdu: Education = {
      id: crypto.randomUUID(),
      institution: 'University',
      degree: 'Degree',
      fieldOfStudy: 'Field',
      startDate: '',
      endDate: '',
      current: false,
      location: '',
    };
    onChange({ ...data, education: [newEdu, ...data.education] });
  };

  const removeEducation = (id: string) => {
    onChange({ ...data, education: data.education.filter((e) => e.id !== id) });
  };

   const updateProject = (id: string, field: keyof Project, value: any) => {
    const newProjs = data.projects.map((proj) =>
      proj.id === id ? { ...proj, [field]: value } : proj
    );
    onChange({ ...data, projects: newProjs });
  };

  const addProject = () => {
    const newProj: Project = {
        id: crypto.randomUUID(),
        name: "Project Name",
        description: "",
        technologies: [],
        link: ""
    };
    onChange({ ...data, projects: [newProj, ...data.projects] });
  };

  const removeProject = (id: string) => {
    onChange({...data, projects: data.projects.filter(p => p.id !== id)});
  }

  const updateSkills = (value: string) => {
      const skillsArray = value.split(',').map(s => s.trim());
      onChange({ ...data, skills: skillsArray });
  }

  // --- Custom Section Logic ---

  const addCustomSection = (type: CustomSectionType) => {
    const newSection: CustomSection = {
      id: crypto.randomUUID(),
      title: type === 'list' ? 'New List Section' : 'New Detailed Section',
      type: type,
      items: []
    };
    const currentSections = data.customSections || [];
    onChange({ ...data, customSections: [...currentSections, newSection] });
    setActiveSection(newSection.id);
  };

  const removeCustomSection = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange({ ...data, customSections: (data.customSections || []).filter(s => s.id !== id) });
    if (activeSection === id) setActiveSection(null);
  };

  const updateCustomSectionTitle = (id: string, newTitle: string) => {
    const updatedSections = (data.customSections || []).map(s => 
      s.id === id ? { ...s, title: newTitle } : s
    );
    onChange({ ...data, customSections: updatedSections });
  };

  const addCustomItem = (sectionId: string, type: CustomSectionType) => {
    const newItem: CustomSectionItem = {
      id: crypto.randomUUID(),
      name: type === 'list' ? 'Label' : 'Title / Role',
      description: type === 'list' ? 'Value' : '',
    };
    const updatedSections = (data.customSections || []).map(s => {
      if (s.id === sectionId) {
        return { ...s, items: [...s.items, newItem] };
      }
      return s;
    });
    onChange({ ...data, customSections: updatedSections });
  };

  const updateCustomItem = (sectionId: string, itemId: string, field: keyof CustomSectionItem, value: string) => {
    const updatedSections = (data.customSections || []).map(s => {
      if (s.id === sectionId) {
        const updatedItems = s.items.map(item => 
          item.id === itemId ? { ...item, [field]: value } : item
        );
        return { ...s, items: updatedItems };
      }
      return s;
    });
    onChange({ ...data, customSections: updatedSections });
  };

  const removeCustomItem = (sectionId: string, itemId: string) => {
    const updatedSections = (data.customSections || []).map(s => {
      if (s.id === sectionId) {
        return { ...s, items: s.items.filter(i => i.id !== itemId) };
      }
      return s;
    });
    onChange({ ...data, customSections: updatedSections });
  };

  const SectionHeader = ({ title, id, onDelete }: { title: string; id: string; onDelete?: (e: React.MouseEvent) => void }) => (
    <div
      className="w-full flex justify-between items-center p-4 bg-white border-b hover:bg-gray-50 transition-colors cursor-pointer group"
      onClick={() => setActiveSection(activeSection === id ? null : id)}
    >
      <span className="font-semibold text-gray-700 flex-1 truncate pr-2">{title}</span>
      <div className="flex items-center gap-2">
         {onDelete && (
             <button 
                onClick={onDelete}
                className="text-gray-300 hover:text-red-500 transition-colors p-1"
                title="Delete Section"
             >
                 <Trash2 size={14} />
             </button>
         )}
         {activeSection === id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden h-full flex flex-col">
      <div className="bg-gray-50 p-4 border-b">
        <h2 className="font-bold text-lg text-gray-800">Editor</h2>
      </div>
      
      <div className="overflow-y-auto flex-1">
        {/* Personal Info */}
        <SectionHeader title="Personal Information" id="personal" />
        {activeSection === 'personal' && (
          <div className="p-4 space-y-4 bg-white">
            <div className="grid grid-cols-2 gap-4">
              <Input label="Full Name" value={data.personalInfo.fullName} onChange={(v) => updatePersonalInfo('fullName', v)} />
              <Input label="Job Title" value={data.personalInfo.jobTitle || ''} placeholder="e.g. Senior Frontend Engineer" onChange={(v) => updatePersonalInfo('jobTitle', v)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Email" value={data.personalInfo.email} onChange={(v) => updatePersonalInfo('email', v)} />
              <Input label="Phone" value={data.personalInfo.phone} onChange={(v) => updatePersonalInfo('phone', v)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Location" value={data.personalInfo.location} onChange={(v) => updatePersonalInfo('location', v)} />
              <Input label="LinkedIn" value={data.personalInfo.linkedin || ''} onChange={(v) => updatePersonalInfo('linkedin', v)} placeholder="linkedin.com/in/..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="GitHub" value={data.personalInfo.github || ''} onChange={(v) => updatePersonalInfo('github', v)} placeholder="github.com/..." />
              <Input label="Portfolio / Website" value={data.personalInfo.portfolio || ''} onChange={(v) => updatePersonalInfo('portfolio', v)} placeholder="yourname.dev" />
            </div>
            <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-500 uppercase">Professional Summary</label>
                <textarea 
                    className="w-full p-2 border rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    rows={4}
                    value={data.personalInfo.summary}
                    onChange={(e) => updatePersonalInfo('summary', e.target.value)}
                />
            </div>
          </div>
        )}

        {/* Work Experience */}
        <SectionHeader title="Work Experience" id="experience" />
        {activeSection === 'experience' && (
          <div className="p-4 space-y-6 bg-white">
            {data.experience.map((exp, index) => (
              <div key={exp.id} className="border p-4 rounded-md relative group bg-gray-50/30">
                <div className="absolute top-2 right-2 flex gap-1">
                   <button
                    onClick={() => moveExperience(index, 'up')}
                    disabled={index === 0}
                    className="p-1 text-gray-400 hover:text-blue-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    title="Move Up"
                  >
                    <ArrowUp size={16} />
                  </button>
                  <button
                    onClick={() => moveExperience(index, 'down')}
                    disabled={index === data.experience.length - 1}
                    className="p-1 text-gray-400 hover:text-blue-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    title="Move Down"
                  >
                    <ArrowDown size={16} />
                  </button>
                  <div className="w-px bg-gray-300 mx-1"></div>
                  <button
                    onClick={() => removeExperience(exp.id)}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-3 mt-4">
                  <Input label="Company" value={exp.company} onChange={(v) => updateExperience(exp.id, 'company', v)} />
                  <Input label="Position" value={exp.position} onChange={(v) => updateExperience(exp.id, 'position', v)} />
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-3">
                   <div className="flex flex-col gap-1 w-full">
                      <label className="text-xs font-semibold text-gray-500 uppercase">Type</label>
                      <select 
                        className="w-full p-2 border rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                        value={exp.employmentType || 'Full-time'}
                        onChange={(e) => updateExperience(exp.id, 'employmentType', e.target.value)}
                      >
                         <option value="Full-time">Full-time</option>
                         <option value="Part-time">Part-time</option>
                         <option value="Contract">Contract</option>
                         <option value="Freelance">Freelance</option>
                         <option value="Internship">Internship</option>
                      </select>
                   </div>
                   <div className="flex flex-col gap-1 w-full">
                      <label className="text-xs font-semibold text-gray-500 uppercase">Work Style</label>
                      <select 
                        className="w-full p-2 border rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                        value={exp.locationType || 'On-site'}
                        onChange={(e) => updateExperience(exp.id, 'locationType', e.target.value)}
                      >
                         <option value="On-site">On-site</option>
                         <option value="Hybrid">Hybrid</option>
                         <option value="Remote">Remote</option>
                      </select>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div className="flex gap-2">
                    <Input type="month" label="Start" value={exp.startDate} onChange={(v) => updateExperience(exp.id, 'startDate', v)} />
                    <Input type="month" label="End" value={exp.endDate} disabled={exp.current} onChange={(v) => updateExperience(exp.id, 'endDate', v)} />
                  </div>
                   <div className="flex items-center h-full pt-6">
                    <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={exp.current}
                        onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)}
                        className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                      />
                      I currently work here
                    </label>
                  </div>
                </div>
                <Input label="Location" value={exp.location} onChange={(v) => updateExperience(exp.id, 'location', v)} placeholder="City, Country" />
                <div className="mt-3">
                    <div className="flex justify-between items-end mb-1">
                      <label className="text-xs font-semibold text-gray-500 uppercase">Description</label>
                      <button 
                         onClick={() => formatBullets(exp.id, exp.description)}
                         className="text-[10px] text-blue-600 hover:text-blue-800 flex items-center gap-1 bg-blue-50 px-2 py-0.5 rounded transition-colors"
                         title="Convert lines to bullet points"
                      >
                         <ListOrdered size={12} /> Format Bullets
                      </button>
                    </div>
                    <textarea
                        className="w-full p-2 border rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        rows={5}
                        value={exp.description}
                        onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                        placeholder="• Accomplishment 1&#10;• Accomplishment 2"
                    />
                </div>
              </div>
            ))}
            <button
              onClick={addExperience}
              className="w-full py-2 border-2 border-dashed border-gray-300 rounded text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors flex justify-center items-center gap-2"
            >
              <Plus size={16} /> Add Position
            </button>
          </div>
        )}

        {/* Education */}
        <SectionHeader title="Education" id="education" />
        {activeSection === 'education' && (
          <div className="p-4 space-y-6 bg-white">
            {data.education.map((edu) => (
              <div key={edu.id} className="border p-4 rounded-md relative group">
                <button
                  onClick={() => removeEducation(edu.id)}
                  className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={16} />
                </button>
                <Input label="Institution" value={edu.institution} onChange={(v) => updateEducation(edu.id, 'institution', v)} />
                <div className="grid grid-cols-2 gap-4 mt-3">
                  <Input label="Degree" value={edu.degree} onChange={(v) => updateEducation(edu.id, 'degree', v)} />
                  <Input label="Field of Study" value={edu.fieldOfStudy} onChange={(v) => updateEducation(edu.id, 'fieldOfStudy', v)} />
                </div>
                <div className="grid grid-cols-2 gap-4 mt-3">
                    <Input type="month" label="Start Date" value={edu.startDate} onChange={(v) => updateEducation(edu.id, 'startDate', v)} />
                    <Input type="month" label="End Date" value={edu.endDate} onChange={(v) => updateEducation(edu.id, 'endDate', v)} />
                </div>
              </div>
            ))}
            <button
              onClick={addEducation}
              className="w-full py-2 border-2 border-dashed border-gray-300 rounded text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors flex justify-center items-center gap-2"
            >
              <Plus size={16} /> Add Education
            </button>
          </div>
        )}

        {/* Skills */}
        <SectionHeader title="Skills" id="skills" />
        {activeSection === 'skills' && (
            <div className="p-4 bg-white">
                <label className="text-xs font-semibold text-gray-500 uppercase block mb-1">Skills (Comma separated)</label>
                <textarea
                    className="w-full p-2 border rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    rows={4}
                    value={data.skills.join(', ')}
                    onChange={(e) => updateSkills(e.target.value)}
                    placeholder="React, TypeScript, Node.js, ..."
                />
            </div>
        )}

         {/* Projects */}
         <SectionHeader title="Projects" id="projects" />
        {activeSection === 'projects' && (
          <div className="p-4 space-y-6 bg-white">
            {data.projects.map((proj) => (
              <div key={proj.id} className="border p-4 rounded-md relative group">
                 <button
                  onClick={() => removeProject(proj.id)}
                  className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={16} />
                </button>
                <Input label="Project Name" value={proj.name} onChange={(v) => updateProject(proj.id, 'name', v)} />
                <div className="mt-3">
                    <Input label="Link" value={proj.link || ''} onChange={(v) => updateProject(proj.id, 'link', v)} />
                </div>
                <div className="mt-3">
                    <label className="text-xs font-semibold text-gray-500 uppercase block mb-1">Technologies (Comma separated)</label>
                     <input
                        className="w-full p-2 border rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        value={proj.technologies.join(', ')}
                        onChange={(e) => updateProject(proj.id, 'technologies', e.target.value.split(',').map(t => t.trim()))}
                    />
                </div>
                <div className="mt-3">
                    <label className="text-xs font-semibold text-gray-500 uppercase block mb-1">Description</label>
                    <textarea
                        className="w-full p-2 border rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        rows={2}
                        value={proj.description}
                        onChange={(e) => updateProject(proj.id, 'description', e.target.value)}
                    />
                </div>
              </div>
            ))}
             <button
              onClick={addProject}
              className="w-full py-2 border-2 border-dashed border-gray-300 rounded text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors flex justify-center items-center gap-2"
            >
              <Plus size={16} /> Add Project
            </button>
          </div>
        )}

        {/* Custom Sections - Rendered dynamically */}
        {(data.customSections || []).map((section) => (
          <div key={section.id}>
             <SectionHeader 
                title={section.title} 
                id={section.id} 
                onDelete={(e) => removeCustomSection(section.id, e)} 
             />
             {activeSection === section.id && (
                <div className="p-4 bg-white space-y-4">
                   <div className="flex justify-between items-center gap-2">
                      <div className="flex-1">
                          <Input 
                              label="Section Title" 
                              value={section.title} 
                              onChange={(v) => updateCustomSectionTitle(section.id, v)} 
                              placeholder="e.g. Certifications, Languages"
                          />
                      </div>
                      <div className="text-xs text-gray-400 font-medium uppercase mt-5 px-2 py-1 border rounded bg-gray-50">
                         {section.type === 'detailed' ? 'Detailed Layout' : 'List Layout'}
                      </div>
                   </div>
                   
                   <div className="space-y-4">
                      {section.items.map(item => (
                         <div key={item.id} className="border p-3 rounded bg-gray-50/50 relative group">
                             <button
                                onClick={() => removeCustomItem(section.id, item.id)}
                                className="absolute top-2 right-2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                             >
                                <Trash2 size={14} />
                             </button>
                             
                             {section.type === 'list' ? (
                               // Simple List View Inputs
                               <div className="flex gap-2 items-start pr-6">
                                   <div className="flex-1">
                                      <Input 
                                          label="Label" 
                                          value={item.name} 
                                          onChange={(v) => updateCustomItem(section.id, item.id, 'name', v)}
                                          placeholder="Name (e.g. English)"
                                      />
                                   </div>
                                   <div className="flex-1">
                                      <Input 
                                          label="Value" 
                                          value={item.description} 
                                          onChange={(v) => updateCustomItem(section.id, item.id, 'description', v)}
                                          placeholder="Description (e.g. Native)"
                                      />
                                   </div>
                               </div>
                             ) : (
                               // Detailed View Inputs
                               <div className="space-y-3">
                                  <Input 
                                      label="Title / Role" 
                                      value={item.name} 
                                      onChange={(v) => updateCustomItem(section.id, item.id, 'name', v)}
                                      placeholder="e.g. Project Name, Award"
                                  />
                                  <div className="grid grid-cols-2 gap-3">
                                      <Input 
                                          label="Subtitle / Org" 
                                          value={item.subtitle || ''} 
                                          onChange={(v) => updateCustomItem(section.id, item.id, 'subtitle', v)}
                                          placeholder="e.g. Company, Issuer"
                                      />
                                      <Input 
                                          label="Location" 
                                          value={item.location || ''} 
                                          onChange={(v) => updateCustomItem(section.id, item.id, 'location', v)}
                                          placeholder="e.g. New York, NY"
                                      />
                                  </div>
                                  <div className="grid grid-cols-2 gap-3">
                                      <Input type="month" label="Start Date" value={item.startDate || ''} onChange={(v) => updateCustomItem(section.id, item.id, 'startDate', v)} />
                                      <Input type="month" label="End Date" value={item.endDate || ''} onChange={(v) => updateCustomItem(section.id, item.id, 'endDate', v)} />
                                  </div>
                                  <Input 
                                      label="Link / URL" 
                                      value={item.url || ''} 
                                      onChange={(v) => updateCustomItem(section.id, item.id, 'url', v)}
                                      placeholder="https://..."
                                  />
                                  <div className="flex flex-col gap-1 w-full">
                                    <label className="text-xs font-semibold text-gray-500 uppercase">Description</label>
                                    <textarea
                                        className="w-full p-2 border rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                        rows={3}
                                        value={item.description}
                                        onChange={(e) => updateCustomItem(section.id, item.id, 'description', e.target.value)}
                                        placeholder="Details about the item..."
                                    />
                                  </div>
                               </div>
                             )}
                         </div>
                      ))}
                   </div>

                   <button
                    onClick={() => addCustomItem(section.id, section.type)}
                    className="w-full py-2 border-2 border-dashed border-gray-300 rounded text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors flex justify-center items-center gap-2 text-sm"
                  >
                    <Plus size={14} /> Add Item
                  </button>
                </div>
             )}
          </div>
        ))}
        
        {/* Add Section Button Area */}
        <div className="p-4 bg-gray-50 border-t space-y-2">
            <h3 className="text-xs font-semibold text-gray-500 uppercase">Add New Section</h3>
            <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => addCustomSection('list')}
                  className="py-3 bg-white border border-gray-300 rounded-md text-gray-700 hover:border-blue-500 hover:text-blue-600 hover:shadow-sm transition-all flex flex-col justify-center items-center gap-1 font-medium text-sm group"
                >
                  <List size={18} className="text-gray-400 group-hover:text-blue-500" />
                  <span>List Section</span>
                  <span className="text-[10px] text-gray-400 font-normal">For Skills, Languages</span>
                </button>
                <button
                  onClick={() => addCustomSection('detailed')}
                  className="py-3 bg-white border border-gray-300 rounded-md text-gray-700 hover:border-blue-500 hover:text-blue-600 hover:shadow-sm transition-all flex flex-col justify-center items-center gap-1 font-medium text-sm group"
                >
                  <AlignLeft size={18} className="text-gray-400 group-hover:text-blue-500" />
                  <span>Detailed Section</span>
                  <span className="text-[10px] text-gray-400 font-normal">For Awards, Volunteering</span>
                </button>
            </div>
        </div>

      </div>
    </div>
  );
};

const Input = ({ label, value, onChange, type = "text", placeholder, isTextArea = false, disabled = false }: { 
    label: string; 
    value: string; 
    onChange: (val: string) => void; 
    type?: string;
    placeholder?: string;
    isTextArea?: boolean;
    disabled?: boolean;
}) => (
  <div className="flex flex-col gap-1 w-full">
    <label className="text-xs font-semibold text-gray-500 uppercase">{label}</label>
    {isTextArea ? (
         <textarea
            className={`w-full p-2 border rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${disabled ? 'bg-gray-100' : ''}`}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
        />
    ) : (
        <input
            type={type}
            className={`w-full p-2 border rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${disabled ? 'bg-gray-100' : ''}`}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
        />
    )}
   
  </div>
);

export default ResumeEditor;
