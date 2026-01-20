
import React, { useState, useRef, useEffect } from 'react';
import { Download, Upload, Printer, FileText, X, History, RotateCcw, Trash2, Save, Menu, Eye, Edit3, Home, NotebookPen } from 'lucide-react';
import { AppData, TemplateId, ResumeVersion } from './types';
import { INITIAL_APP_DATA, TEMPLATES } from './constants';
import ResumeEditor from './components/ResumeEditor';
import ResumePreview from './components/ResumePreview';
import CoverLetterEditor from './components/CoverLetterEditor';
import CoverLetterPreview from './components/CoverLetterPreview';
import WelcomeScreen from './components/WelcomeScreen';
import SplashScreen from './components/SplashScreen';

const STORAGE_KEYS = {
  DATA: 'ats_app_package_data',
  HISTORY: 'ats_app_package_history',
  TEMPLATE: 'ats_active_template'
};

const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [appData, setAppData] = useState<AppData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DATA);
      return saved ? JSON.parse(saved) : INITIAL_APP_DATA;
    } catch {
      return INITIAL_APP_DATA;
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
    } catch {
      return [];
    }
  });

  const [view, setView] = useState<'welcome' | 'editor'>('welcome');
  const [activeMode, setActiveMode] = useState<'resume' | 'cover-letter'>('resume');
  const [mobileTab, setMobileTab] = useState<'editor' | 'preview'>('editor');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [newVersionLabel, setNewVersionLabel] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DATA, JSON.stringify(appData));
  }, [appData]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TEMPLATE, activeTemplate);
  }, [activeTemplate]);

  const handleCreateNew = () => {
    if (window.confirm("Start fresh? Any unsaved changes to the current workspace will be overwritten.")) {
      setAppData(INITIAL_APP_DATA);
      setView('editor');
    }
  };

  const handleLoadVersionFromWelcome = (version: ResumeVersion) => {
     if (window.confirm(`Load version "${version.label}"?`)) {
      setAppData(JSON.parse(JSON.stringify(version.data)));
      setView('editor');
    }
  };

  const saveVersion = (label: string = 'Manual Save') => {
    const newVersion: ResumeVersion = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      data: JSON.parse(JSON.stringify(appData)),
      label,
    };
    setHistory((prev) => [newVersion, ...prev]);
  };

  const restoreVersion = (version: ResumeVersion) => {
    if (window.confirm(`Restore "${version.label}"?`)) {
      setAppData(JSON.parse(JSON.stringify(version.data)));
      setIsHistoryOpen(false);
    }
  };

  const exportJson = () => {
    const dataStr = JSON.stringify(appData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `resume-package-${appData.resume.personalInfo.fullName.replace(/\s+/g, '-').toLowerCase()}.json`;
    link.click();
    setIsMobileMenuOpen(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        if (json.resume && json.coverLetter) {
          saveVersion('Auto-save');
          setAppData(json);
        } else {
          alert('Invalid JSON format');
        }
      } catch {
        alert('Error parsing JSON');
      }
    };
    reader.readAsText(file);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}

      <div className="h-screen w-full flex flex-col bg-gray-100 overflow-hidden font-sans no-print">
         {view === 'welcome' ? (
            <WelcomeScreen 
              history={history}
              onCreateNew={handleCreateNew}
              onContinue={() => setView('editor')}
              onLoadVersion={handleLoadVersionFromWelcome}
              onDeleteVersion={(id) => setHistory(h => h.filter(v => v.id !== id))}
            />
         ) : (
            <>
              <header className="bg-white border-b border-gray-200 flex flex-col z-30 pt-[env(safe-area-inset-top)]">
                <div className="h-16 flex items-center justify-between px-4 sm:px-6 w-full">
                    <div className="flex items-center gap-3">
                      <button onClick={() => setView('welcome')} className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Home size={20} />
                      </button>
                      <div className="flex bg-gray-100 p-1 rounded-lg border border-gray-200">
                          <button 
                            onClick={() => setActiveMode('resume')}
                            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-md transition-all ${activeMode === 'resume' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                          >
                            <FileText size={14} /> Resume
                          </button>
                          <button 
                            onClick={() => setActiveMode('cover-letter')}
                            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-md transition-all ${activeMode === 'cover-letter' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                          >
                            <NotebookPen size={14} /> Cover Letter
                          </button>
                      </div>
                    </div>

                    <div className="hidden md:flex items-center gap-3">
                        <div className="flex bg-gray-100 p-1 rounded-md border border-gray-200">
                            {TEMPLATES.map(t => (
                                <button key={t.id} onClick={() => setActiveTemplate(t.id)} className={`px-3 py-1.5 text-xs font-medium rounded transition-all ${activeTemplate === t.id ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>{t.name}</button>
                            ))}
                        </div>
                        <div className="h-6 w-px bg-gray-300 mx-1"></div>
                        <button onClick={() => setIsHistoryOpen(true)} className="p-2 text-gray-600 hover:bg-gray-100 rounded-md relative"><History size={20} />{history.length > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full"></span>}</button>
                        <button onClick={() => fileInputRef.current?.click()} className="p-2 text-gray-600 hover:bg-gray-100 rounded-md"><Upload size={20} /></button>
                        <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept=".json" />
                        <button onClick={exportJson} className="p-2 text-gray-600 hover:bg-gray-100 rounded-md"><Download size={20} /></button>
                        <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-md text-sm font-medium hover:bg-gray-800 transition-colors shadow-sm"><Printer size={16} /> <span>Print PDF</span></button>
                    </div>

                    <div className="flex md:hidden items-center gap-2">
                        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-gray-600 hover:bg-gray-100 rounded-md">{isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}</button>
                    </div>
                </div>
              </header>
              
              <main className="flex-1 flex overflow-hidden relative">
                <div className={`w-full md:w-[450px] border-r border-gray-200 bg-white overflow-y-auto z-10 flex-shrink-0 transition-all ${mobileTab === 'editor' ? 'block' : 'hidden md:block'}`}>
                  {activeMode === 'resume' ? (
                    <ResumeEditor data={appData.resume} onChange={(resume) => setAppData({ ...appData, resume })} />
                  ) : (
                    <CoverLetterEditor data={appData.coverLetter} onChange={(coverLetter) => setAppData({ ...appData, coverLetter })} />
                  )}
                </div>

                <div className={`flex-1 bg-gray-100/90 overflow-hidden flex flex-col relative ${mobileTab === 'preview' ? 'block' : 'hidden md:flex'}`}>
                  <div className="flex-1 overflow-auto flex justify-center p-4 md:p-8 custom-scrollbar">
                    <div className="bg-white shadow-2xl w-full md:max-w-[210mm] min-h-[297mm] relative transition-all">
                        {activeMode === 'resume' ? (
                            <ResumePreview data={appData.resume} templateId={activeTemplate} />
                        ) : (
                            <CoverLetterPreview coverLetter={appData.coverLetter} personalInfo={appData.resume.personalInfo} templateId={activeTemplate} />
                        )}
                    </div>
                  </div>
                </div>
              </main>

              <div className="md:hidden bg-white border-t border-gray-200 flex text-xs font-medium z-30 flex-shrink-0 pb-[env(safe-area-inset-bottom)]">
                  <button onClick={() => setMobileTab('editor')} className={`flex-1 p-3 flex flex-col items-center gap-1 ${mobileTab === 'editor' ? 'text-blue-600 bg-blue-50/50' : 'text-gray-500'}`}><Edit3 size={20} /> Editor</button>
                  <div className="w-px bg-gray-200"></div>
                  <button onClick={() => setMobileTab('preview')} className={`flex-1 p-3 flex flex-col items-center gap-1 ${mobileTab === 'preview' ? 'text-blue-600 bg-blue-50/50' : 'text-gray-500'}`}><Eye size={20} /> Preview</button>
              </div>

              {isHistoryOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                  <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 max-h-[85vh] flex flex-col animate-in fade-in zoom-in duration-200">
                    <div className="flex justify-between items-center mb-4"><h2 className="text-xl font-bold flex items-center gap-2 text-gray-800"><History className="text-blue-600" /> History</h2><button onClick={() => setIsHistoryOpen(false)}><X size={20} /></button></div>
                    <div className="bg-gray-50 p-4 rounded-lg mb-4 flex gap-2">
                        <input type="text" value={newVersionLabel} onChange={(e) => setNewVersionLabel(e.target.value)} placeholder="Snapshot name..." className="flex-1 border rounded-md px-3 py-2 text-sm" />
                        <button onClick={() => { saveVersion(newVersionLabel || 'Snapshot'); setNewVersionLabel(''); }} className="bg-blue-600 text-white px-3 py-2 rounded-md"><Save size={18} /></button>
                    </div>
                    <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                        {history.map(v => (
                            <div key={v.id} className="border rounded-lg p-3 hover:bg-gray-50 flex justify-between items-center">
                                <div><div className="font-semibold text-sm">{v.label}</div><div className="text-xs text-gray-500">{new Date(v.timestamp).toLocaleString()}</div></div>
                                <button onClick={() => restoreVersion(v)} className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-md"><RotateCcw size={16} /></button>
                            </div>
                        ))}
                    </div>
                  </div>
                </div>
              )}
            </>
         )}
      </div>

      <div className="hidden print-only">
         {activeMode === 'resume' ? (
            <ResumePreview data={appData.resume} templateId={activeTemplate} />
         ) : (
            <CoverLetterPreview coverLetter={appData.coverLetter} personalInfo={appData.resume.personalInfo} templateId={activeTemplate} />
         )}
      </div>
    </>
  );
};

export default App;