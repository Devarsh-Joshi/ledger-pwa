import { useTranslation } from '../hooks/useTranslation';

interface HeaderProps {
  userName: string;
  isDarkMode?: boolean;
  selectedLanguage: string;
}

export function Header({ userName, isDarkMode, selectedLanguage }: HeaderProps) {
  const { t } = useTranslation(selectedLanguage);

  return (
    <div className={`${isDarkMode ? 'bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950' : 'bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600'} px-6 pt-12 pb-8 rounded-b-[2rem] shadow-2xl relative overflow-hidden`}>
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-2xl" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-white/80 text-sm mb-1">Smart Ledger</p>
            <h1 className="text-white">
              {t('hello')}, {userName} 👋
            </h1>
          </div>
          <div className="w-12 h-12 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/30">
            <span className="text-2xl">💼</span>
          </div>
        </div>
        <p className="text-white/70 text-sm">Let's manage your finances smartly</p>
      </div>
    </div>
  );
}
