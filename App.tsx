import React, { useState, useRef, useEffect } from 'react';
import { Download, Upload, Printer, FileText, X, History, RotateCcw, Trash2, Save, Menu, Eye, Edit3, Home } from 'lucide-react';
import { ResumeData, TemplateId, ResumeVersion } from './types';
import { INITIAL_RESUME_DATA, TEMPLATES } from './constants';
import ResumeEditor from './components/ResumeEditor';
import ResumePreview from './components/ResumePreview';
import WelcomeScreen from './components/WelcomeScreen';
import SplashScreen from './components/SplashScreen';

const STORAGE_KEYS = {
  DATA: 'ats_resume_data',
  HISTORY: 'ats_resume_history',
  TEMPLATE: 'ats_active_template'
};

const App: React.FC = () => {
  // Splash Screen State
  const [showSplash, setShowSplash] = useState(true);

  // Initialize state from LocalStorage or defaults
  const [resumeData, setResumeData] = useState<ResumeData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DATA);
      return saved ? JSON.parse(saved) : INITIAL_RESUME_DATA;
    } catch (error) {
      console.error('Failed to load resume data from storage:', error);
      return INITIAL_RESUME_DATA;
    }
  });

  const [activeTemplate, setActiveTemplate] = useState<TemplateId>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TEMPLATE);
      return (saved as TemplateId) || 'classic';
    } catch {
      return 'classic';
    }
  });

  const [history, setHistory] = useState<ResumeVersion[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.HISTORY);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Failed to load history from storage:', error);
      return [];
    }
  });

  const [view, setView] = useState<'welcome' | 'editor'>('welcome');

  // Mobile State
  const [mobileTab, setMobileTab] = useState<'editor' | 'preview'>('editor');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // History UI State
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [newVersionLabel, setNewVersionLabel] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Persistence Effects
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.DATA, JSON.stringify(resumeData));
    } catch (error) {
      console.error('Failed to save resume data:', error);
    }
  }, [resumeData]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
    } catch (error) {
      console.error('Failed to save history:', error);
    }
  }, [history]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TEMPLATE, activeTemplate);
  }, [activeTemplate]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // --- View Transition Functions ---

  const handleCreateNew = () => {
    if (window.confirm("Start a new resume? Any unsaved changes to the current workspace will be overwritten.")) {
      setResumeData(INITIAL_RESUME_DATA);
      setView('editor');
    }
  };

  const handleContinue = () => {
    setView('editor');
  };

  const handleLoadVersionFromWelcome = (version: ResumeVersion) => {
     if (window.confirm(`Load version "${version.label}"? This will overwrite your current workspace.`)) {
      setResumeData(JSON.parse(JSON.stringify(version.data)));
      setView('editor');
    }
  };

  // --- History Functions ---

  const saveVersion = (label: string = 'Manual Save') => {
    const newVersion: ResumeVersion = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      data: JSON.parse(JSON.stringify(resumeData)), // Deep copy
      label,
    };
    setHistory((prev) => [newVersion, ...prev]);
  };

  const restoreVersion = (version: ResumeVersion) => {
    if (window.confirm(`Are you sure you want to restore "${version.label}"? Current unsaved changes will be lost.`)) {
      setResumeData(JSON.parse(JSON.stringify(version.data)));
      setIsHistoryOpen(false);
      setIsMobileMenuOpen(false);
    }
  };

  const deleteVersion = (id: string) => {
    if(window.confirm("Are you sure you want to delete this saved version?")) {
        setHistory((prev) => prev.filter((v) => v.id !== id));
    }
  };

  const handleManualSave = () => {
    saveVersion(newVersionLabel || 'Manual Snapshot');
    setNewVersionLabel('');
  };

  // --- Import/Export Functions ---

  const exportJson = () => {
    const dataStr = JSON.stringify(resumeData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `resume-${resumeData.personalInfo.fullName.replace(/\s+/g, '-').toLowerCase()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setIsMobileMenuOpen(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        // Simple validation check
        if (json.personalInfo && json.experience) {
          saveVersion('Before Import'); // Auto-save before overwriting
          setResumeData(json);
        } else {
          alert('Invalid JSON format for Resume Data');
        }
      } catch (error) {
        alert('Error parsing JSON');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setIsMobileMenuOpen(false);
  };

  const handlePrint = () => {
    window.print();
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}

      {/* MAIN APP UI - Hidden during print */}
      <div className="h-screen w-full flex flex-col bg-gray-100 overflow-hidden font-sans no-print">
         
         {/* Render app content but hidden if splash is active? No, let it render behind */}
         {view === 'welcome' ? (
            <WelcomeScreen 
              history={history}
              onCreateNew={handleCreateNew}
              onContinue={handleContinue}
              onLoadVersion={handleLoadVersionFromWelcome}
              onDeleteVersion={deleteVersion}
            />
         ) : (
            <>
              {/* Navbar - Safe Area Top added */}
              <header className="bg-white border-b border-gray-200 flex flex-col z-30 pt-[env(safe-area-inset-top)]">
                <div className="h-16 flex items-center justify-between px-4 sm:px-6 w-full">
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => setView('welcome')}
                        className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Back to Home"
                      >
                        <Home size={20} />
                      </button>
                      <div className="flex items-center gap-2">
                        <div className="bg-blue-600 p-1.5 rounded-lg text-white">
                            <FileText size={20} />
                        </div>
                        <h1 className="font-bold text-lg sm:text-xl text-gray-800 tracking-tight">ATS Builder</h1>
                      </div>
                    </div>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center gap-3">
                    
                    <div className="flex bg-gray-100 p-1 rounded-md border border-gray-200">
                        {TEMPLATES.map(t => (
                            <button
                                key={t.id}
                                onClick={() => setActiveTemplate(t.id)}
                                className={`px-3 py-1.5 text-xs font-medium rounded transition-all ${activeTemplate === t.id ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                {t.name}
                            </button>
                        ))}
                    </div>

                    <div className="h-6 w-px bg-gray-300 mx-1"></div>
                    
                    <button
                        onClick={() => setIsHistoryOpen(true)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors relative"
                        title="Version History"
                    >
                        <History size={20} />
                        {history.length > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full"></span>}
                    </button>

                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                        title="Import JSON"
                    >
                        <Upload size={20} />
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        className="hidden"
                        accept=".json"
                    />

                    <button
                        onClick={exportJson}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                        title="Export JSON"
                    >
                        <Download size={20} />
                    </button>

                    <button
                        onClick={handlePrint}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-md text-sm font-medium hover:bg-gray-800 transition-colors shadow-sm"
                    >
                        <Printer size={16} /> <span>Export PDF</span>
                    </button>
                    </div>

                    {/* Mobile Actions */}
                    <div className="flex md:hidden items-center gap-2">
                        <button 
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-md"
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
              </header>
              
              {/* Mobile Menu Dropdown - Adjusted top position */}
              {isMobileMenuOpen && (
                  <div 
                    className="absolute left-0 w-full bg-white shadow-xl border-b border-gray-200 z-40 md:hidden animate-in slide-in-from-top-2 duration-200" 
                    style={{ top: 'calc(4rem + env(safe-area-inset-top))' }}
                    ref={mobileMenuRef}
                  >
                    <div className="p-4 space-y-4">
                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase mb-2 block">Templates</label>
                            <div className="grid grid-cols-3 gap-2">
                                {TEMPLATES.map(t => (
                                    <button
                                        key={t.id}
                                        onClick={() => { setActiveTemplate(t.id); setIsMobileMenuOpen(false); }}
                                        className={`px-2 py-2 text-xs font-medium rounded border ${activeTemplate === t.id ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-gray-200 text-gray-600'}`}
                                    >
                                        {t.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                            <button onClick={() => { setIsHistoryOpen(true); setIsMobileMenuOpen(false); }} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg text-sm font-medium text-gray-700">
                                <History size={16} /> History
                            </button>
                            <button onClick={handlePrint} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg text-sm font-medium text-gray-700">
                                <Printer size={16} /> PDF Export
                            </button>
                            <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg text-sm font-medium text-gray-700">
                                <Upload size={16} /> Import JSON
                            </button>
                            <button onClick={exportJson} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg text-sm font-medium text-gray-700">
                                <Download size={16} /> Export JSON
                            </button>
                        </div>
                        <div className="pt-2 border-t">
                            <button onClick={() => { setView('welcome'); setIsMobileMenuOpen(false); }} className="flex items-center gap-2 p-3 w-full bg-gray-50 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100">
                                <Home size={16} /> Back to Home
                            </button>
                        </div>
                    </div>
                  </div>
              )}

              {/* Main Content */}
              <main className="flex-1 flex overflow-hidden relative">
                
                {/* Editor Pane */}
                <div className={`
                    w-full md:w-[450px] border-r border-gray-200 bg-white overflow-y-auto z-10 flex-shrink-0 transition-all
                    ${mobileTab === 'editor' ? 'block' : 'hidden md:block'}
                `}>
                  <ResumeEditor data={resumeData} onChange={setResumeData} />
                </div>

                {/* Preview Pane */}
                <div 
                  className={`
                    flex-1 bg-gray-100/90 overflow-hidden flex flex-col relative
                    ${mobileTab === 'preview' ? 'block' : 'hidden md:flex'}
                  `}
                >
                  {/* Scrollable Container for the paper */}
                  <div className="flex-1 overflow-auto flex justify-center p-4 md:p-8 custom-scrollbar">
                    {/* Responsive Container: Full width on mobile, A4-ish max-width on desktop */}
                    <div 
                        className="bg-white shadow-2xl w-full md:max-w-[210mm] min-h-[297mm] relative transition-all"
                    >
                        <ResumePreview data={resumeData} templateId={activeTemplate} />
                    </div>
                  </div>
                </div>
              </main>

              {/* Mobile Bottom Navigation Bar */}
              <div className="md:hidden bg-white border-t border-gray-200 flex text-xs font-medium z-30 flex-shrink-0 pb-[env(safe-area-inset-bottom)]">
                  <button 
                    onClick={() => setMobileTab('editor')}
                    className={`flex-1 p-3 flex flex-col items-center gap-1 ${mobileTab === 'editor' ? 'text-blue-600 bg-blue-50/50' : 'text-gray-500'}`}
                  >
                      <Edit3 size={20} /> Editor
                  </button>
                  <div className="w-px bg-gray-200"></div>
                  <button 
                    onClick={() => setMobileTab('preview')}
                    className={`flex-1 p-3 flex flex-col items-center gap-1 ${mobileTab === 'preview' ? 'text-blue-600 bg-blue-50/50' : 'text-gray-500'}`}
                  >
                      <Eye size={20} /> Preview
                  </button>
              </div>

              {/* History Modal */}
              {isHistoryOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                  <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 max-h-[85vh] flex flex-col animate-in fade-in zoom-in duration-200">
                    <div className="flex justify-between items-center mb-4 flex-shrink-0">
                        <h2 className="text-xl font-bold flex items-center gap-2 text-gray-800">
                            <History className="text-blue-600" /> Version History
                        </h2>
                        <button onClick={() => setIsHistoryOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg mb-4 flex-shrink-0 border border-gray-100">
                        <label className="text-xs font-semibold text-gray-500 uppercase block mb-2">Create New Snapshot</label>
                        <div className="flex gap-2">
                            <input 
                                type="text" 
                                value={newVersionLabel}
                                onChange={(e) => setNewVersionLabel(e.target.value)}
                                placeholder="Version Name..." 
                                className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                onKeyDown={(e) => e.key === 'Enter' && handleManualSave()}
                            />
                            <button 
                                onClick={handleManualSave}
                                className="bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 transition-colors"
                                title="Save Current Version"
                            >
                                <Save size={18} />
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-3 pr-2 min-h-0">
                        {history.length === 0 ? (
                            <div className="text-center py-8 text-gray-400 flex flex-col items-center gap-2">
                                <History size={32} className="opacity-20" />
                                <p className="text-sm">No saved versions yet.</p>
                                <p className="text-xs">Versions are saved automatically before major changes.</p>
                            </div>
                        ) : (
                            history.map(version => (
                                <div key={version.id} className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors group">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="font-semibold text-gray-800 text-sm">{version.label}</div>
                                            <div className="text-xs text-gray-500 mt-0.5">
                                                {new Date(version.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} 
                                                {' • '} 
                                                {new Date(version.timestamp).toLocaleDateString()}
                                            </div>
                                        </div>
                                        <div className="flex gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button 
                                                onClick={() => restoreVersion(version)}
                                                title="Restore this version"
                                                className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-md transition-colors"
                                            >
                                                <RotateCcw size={16} />
                                            </button>
                                            <button 
                                                onClick={() => deleteVersion(version.id)}
                                                title="Delete version"
                                                className="p-1.5 text-red-500 hover:bg-red-100 rounded-md transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center text-xs text-gray-400 flex-shrink-0">
                        <span>{history.length} versions saved</span>
                        {history.length > 0 && (
                            <button onClick={() => setHistory([])} className="hover:text-red-500 transition-colors">Clear All</button>
                        )}
                    </div>
                  </div>
                </div>
              )}

            </>
         )}

      </div>

      {/* PRINT UI - Only visible during print */}
      <div className="hidden print-only">
         <ResumePreview data={resumeData} templateId={activeTemplate} />
      </div>
    </>
  );
};

export default App;