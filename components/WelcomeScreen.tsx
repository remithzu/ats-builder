import React from 'react';
import { Plus, FileText, History, Trash2, ArrowRight, Clock, Calendar } from 'lucide-react';
import { ResumeVersion } from '../types';

interface WelcomeScreenProps {
  history: ResumeVersion[];
  onCreateNew: () => void;
  onContinue: () => void;
  onLoadVersion: (version: ResumeVersion) => void;
  onDeleteVersion: (id: string) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ 
  history, 
  onCreateNew, 
  onContinue, 
  onLoadVersion, 
  onDeleteVersion 
}) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 md:p-8 font-sans">
      <div className="w-full max-w-4xl space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-3 bg-blue-600 rounded-xl shadow-lg mb-4">
            <FileText size={40} className="text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">ATS Resume Builder</h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Create professional, ATS-friendly resumes in minutes. Use AI optimization to stand out.
          </p>
        </div>

        {/* Main Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto w-full">
          <button
            onClick={onCreateNew}
            className="group flex flex-col items-center justify-center p-8 bg-white border-2 border-dashed border-gray-300 rounded-2xl hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer text-center space-y-3 shadow-sm hover:shadow-md"
          >
            <div className="p-3 bg-blue-100 text-blue-600 rounded-full group-hover:scale-110 transition-transform">
              <Plus size={32} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">Create New Resume</h3>
              <p className="text-sm text-gray-500">Start from scratch with a fresh template</p>
            </div>
          </button>

          <button
            onClick={onContinue}
            className="group flex flex-col items-center justify-center p-8 bg-white border border-gray-200 rounded-2xl hover:border-blue-500 hover:bg-gray-50 transition-all cursor-pointer text-center space-y-3 shadow-sm hover:shadow-md"
          >
            <div className="p-3 bg-green-100 text-green-600 rounded-full group-hover:scale-110 transition-transform">
              <ArrowRight size={32} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">Continue Editing</h3>
              <p className="text-sm text-gray-500">Pick up exactly where you left off</p>
            </div>
          </button>
        </div>

        {/* History Section */}
        {history.length > 0 && (
          <div className="max-w-3xl mx-auto w-full pt-8">
            <div className="flex items-center gap-2 mb-4">
              <History className="text-gray-400" size={20} />
              <h2 className="text-lg font-bold text-gray-700">Recent Versions</h2>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden divide-y divide-gray-100">
              {history.map((version) => (
                <div 
                  key={version.id} 
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-gray-50 transition-colors gap-4 group"
                >
                  <div 
                    className="flex-1 cursor-pointer" 
                    onClick={() => onLoadVersion(version)}
                  >
                    <h4 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">{version.label}</h4>
                    <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {new Date(version.timestamp).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {new Date(version.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span className="px-2 py-0.5 bg-gray-100 rounded-full">
                        {version.data.personalInfo.fullName}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onLoadVersion(version)}
                      className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      Open
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); onDeleteVersion(version.id); }}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Version"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WelcomeScreen;
