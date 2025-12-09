import React, { useEffect, useState } from 'react';
import { FileText, Sparkles } from 'lucide-react';

interface SplashScreenProps {
  onFinish: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Start exit animation after 2.5 seconds
    const timer = setTimeout(() => {
      setIsExiting(true);
      // Unmount component after animation finishes (500ms duration)
      setTimeout(onFinish, 500); 
    }, 2500);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-gradient-to-br from-indigo-600 via-blue-600 to-blue-800 transition-opacity duration-500 ${
        isExiting ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="relative flex flex-col items-center">
        {/* Animated Icon Container */}
        <div className="relative mb-8 animate-float">
          <div className="absolute inset-0 bg-white/30 rounded-3xl blur-2xl animate-pulse"></div>
          <div className="relative bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl shadow-2xl">
            <FileText size={80} className="text-white drop-shadow-lg" />
            <div className="absolute -top-3 -right-3 bg-yellow-400 p-2.5 rounded-full shadow-lg animate-spin-slow">
               <Sparkles size={24} className="text-white" />
            </div>
          </div>
        </div>

        {/* Text Animation */}
        <div className="text-center space-y-3 mb-10">
            <h1 className="text-5xl font-bold text-white tracking-tight drop-shadow-md animate-fade-in opacity-0" style={{ animationDelay: '0.3s' }}>
              ATS Builder
            </h1>
            <p className="text-blue-100 text-lg font-medium tracking-wide animate-fade-in opacity-0" style={{ animationDelay: '0.6s' }}>
               Optimize. Organize. Succeed.
            </p>
        </div>

        {/* Loading Bar */}
        <div className="w-64 h-2 bg-blue-900/40 rounded-full overflow-hidden backdrop-blur-sm border border-white/10 animate-fade-in opacity-0" style={{ animationDelay: '0.8s' }}>
            <div className="h-full bg-gradient-to-r from-blue-300 to-white rounded-full animate-progress shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;