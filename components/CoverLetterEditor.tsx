
import React from 'react';
import { CoverLetterData } from '../types';
import { Plus, Trash2 } from 'lucide-react';

interface CoverLetterEditorProps {
  data: CoverLetterData;
  onChange: (data: CoverLetterData) => void;
}

const CoverLetterEditor: React.FC<CoverLetterEditorProps> = ({ data, onChange }) => {
  const updateRecipient = (field: keyof CoverLetterData['recipient'], value: string) => {
    onChange({
      ...data,
      recipient: { ...data.recipient, [field]: value },
    });
  };

  const updateParagraph = (index: number, value: string) => {
    const newParagraphs = [...data.paragraphs];
    newParagraphs[index] = value;
    onChange({ ...data, paragraphs: newParagraphs });
  };

  const addParagraph = () => {
    onChange({ ...data, paragraphs: [...data.paragraphs, ''] });
  };

  const removeParagraph = (index: number) => {
    onChange({ ...data, paragraphs: data.paragraphs.filter((_, i) => i !== index) });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden h-full flex flex-col">
      <div className="bg-gray-50 p-4 border-b">
        <h2 className="font-bold text-lg text-gray-800">Cover Letter Editor</h2>
      </div>
      
      <div className="overflow-y-auto flex-1 p-4 space-y-6">
        {/* Date & Recipient */}
        <div className="space-y-4">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Recipient Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 uppercase">Date</label>
              <input 
                type="date" 
                className="w-full p-2 border rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                value={data.date}
                onChange={(e) => onChange({ ...data, date: e.target.value })}
              />
            </div>
            <Input label="Recipient Name" value={data.recipient.name} onChange={(v) => updateRecipient('name', v)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Title" value={data.recipient.title} onChange={(v) => updateRecipient('title', v)} />
            <Input label="Company" value={data.recipient.company} onChange={(v) => updateRecipient('company', v)} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500 uppercase">Address</label>
            <textarea 
              className="w-full p-2 border rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              rows={2}
              value={data.recipient.address}
              onChange={(e) => updateRecipient('address', e.target.value)}
              placeholder="123 Street Name, City, State"
            />
          </div>
        </div>

        {/* Salutation */}
        <div className="space-y-4">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Message Content</h3>
          <Input label="Salutation" value={data.salutation} onChange={(v) => onChange({ ...data, salutation: v })} />
          
          <div className="space-y-4">
            <label className="text-xs font-semibold text-gray-500 uppercase block">Body Paragraphs</label>
            {data.paragraphs.map((para, index) => (
              <div key={index} className="relative group">
                <textarea 
                  className="w-full p-2 border rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  rows={4}
                  value={para}
                  onChange={(e) => updateParagraph(index, e.target.value)}
                  placeholder={`Paragraph ${index + 1}...`}
                />
                <button 
                  onClick={() => removeParagraph(index)}
                  className="absolute -top-2 -right-2 bg-red-50 text-red-500 p-1 rounded-full border border-red-200 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            <button 
              onClick={addParagraph}
              className="w-full py-2 border-2 border-dashed border-gray-300 rounded text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors flex justify-center items-center gap-2 text-sm"
            >
              <Plus size={14} /> Add Paragraph
            </button>
          </div>
        </div>

        {/* Closing */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <Input label="Closing" value={data.closing} onChange={(v) => onChange({ ...data, closing: v })} />
        </div>
      </div>
    </div>
  );
};

const Input = ({ label, value, onChange, type = "text", placeholder }: { 
    label: string; 
    value: string; 
    onChange: (val: string) => void; 
    type?: string;
    placeholder?: string;
}) => (
  <div className="flex flex-col gap-1 w-full">
    <label className="text-xs font-semibold text-gray-500 uppercase">{label}</label>
    <input
        type={type}
        className="w-full p-2 border rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
    />
  </div>
);

export default CoverLetterEditor;
