import { Home, Users, BarChart3, Settings, Building2, Package } from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslation } from '../hooks/useTranslation';
import { useState } from 'react';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isDarkMode?: boolean;
  selectedLanguage: string;
}

export function BottomNav({ activeTab, onTabChange, isDarkMode, selectedLanguage }: BottomNavProps) {
  const { t } = useTranslation(selectedLanguage);
  const [showMore, setShowMore] = useState(false);
  
  const mainTabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'people', label: 'Workers', icon: Users },
    { id: 'suppliers', label: 'Suppliers', icon: Package },
    { id: 'sites', label: 'Sites', icon: Building2 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className={`fixed bottom-0 left-0 right-0 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} border-t px-1 py-2 max-w-md mx-auto shadow-2xl z-40`}>
      <div className="flex items-center justify-around relative">
        {mainTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex flex-col items-center gap-1 px-2 py-2 rounded-2xl transition-all ${
                isActive
                  ? 'text-blue-600'
                  : isDarkMode
                  ? 'text-slate-400 hover:text-slate-300'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-blue-100 rounded-2xl"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
              <Icon className={`w-5 h-5 relative z-10 ${isActive ? 'scale-110' : ''} transition-transform`} />
              <span className={`text-[10px] relative z-10 ${isActive ? '' : ''}`}>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
