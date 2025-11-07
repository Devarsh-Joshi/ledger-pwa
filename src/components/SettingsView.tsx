import { useState } from 'react';
import { motion } from 'motion/react';
import { Moon, Sun, Bell, Lock, HelpCircle, Info, ChevronRight, Languages, LogOut } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import { useTranslation } from '../hooks/useTranslation';

interface SettingsViewProps {
  isDarkMode: boolean;
  setIsDarkMode: (value: boolean) => void;
  selectedLanguage?: string;
  onLanguageChange?: (language: string) => void;
  onSignOut?: () => void;
}

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'हिंदी (Hindi)', flag: '🇮🇳' },
  { code: 'mr', name: 'मराठी (Marathi)', flag: '🇮🇳' },
  { code: 'ta', name: 'தமிழ் (Tamil)', flag: '🇮🇳' },
  { code: 'te', name: 'తెలుగు (Telugu)', flag: '🇮🇳' },
  { code: 'kn', name: 'ಕನ್ನಡ (Kannada)', flag: '🇮🇳' },
  { code: 'gu', name: 'ગુજરાતી (Gujarati)', flag: '🇮🇳' },
  { code: 'bn', name: 'বাংলা (Bengali)', flag: '🇮🇳' },
  { code: 'pa', name: 'ਪੰਜਾਬੀ (Punjabi)', flag: '🇮🇳' },
];

export function SettingsView({ 
  isDarkMode, 
  setIsDarkMode, 
  selectedLanguage: propSelectedLanguage = 'en',
  onLanguageChange,
  onSignOut 
}: SettingsViewProps) {
  const [isLanguageDialogOpen, setIsLanguageDialogOpen] = useState(false);
  const selectedLanguage = propSelectedLanguage;
  const { t } = useTranslation(selectedLanguage);

  const handleLanguageChange = (code: string) => {
    setIsLanguageDialogOpen(false);
    if (onLanguageChange) {
      onLanguageChange(code);
    }
  };

  const settingsGroups = [
    {
      title: t('appearance'),
      items: [
        {
          icon: isDarkMode ? Moon : Sun,
          label: t('darkMode'),
          description: t('toggleDarkTheme'),
          action: () => setIsDarkMode(!isDarkMode),
          toggle: true,
          value: isDarkMode,
        },
      ],
    },
    {
      title: t('preferences'),
      items: [
        {
          icon: Languages,
          label: t('language'),
          description: LANGUAGES.find(l => l.code === selectedLanguage)?.name || 'English',
          action: () => setIsLanguageDialogOpen(true),
        },
        {
          icon: Bell,
          label: t('notifications'),
          description: t('manageNotifications'),
          action: () => alert(t('notifications')),
        },
        {
          icon: Lock,
          label: t('privacySecurity'),
          description: t('controlPrivacy'),
          action: () => alert(t('privacySecurity')),
        },
      ],
    },
    {
      title: t('support'),
      items: [
        {
          icon: HelpCircle,
          label: t('helpSupport'),
          description: t('getHelp'),
          action: () => alert(t('helpSupport')),
        },
        {
          icon: Info,
          label: t('about'),
          description: t('appVersionInfo'),
          action: () => alert('Smart Ledger v1.0.0'),
        },
      ],
    },
    {
      title: t('account'),
      items: [
        {
          icon: LogOut,
          label: t('signOut'),
          description: t('signOutAccount'),
          action: () => onSignOut && onSignOut(),
          destructive: true,
        },
      ],
    },
  ];

  return (
    <>
      <div className="px-4 py-6 space-y-6">
        <div>
          <h2 className="text-slate-900 mb-2">{t('settings')}</h2>
          <p className="text-slate-500 text-sm">{t('managePreferences')}</p>
        </div>

        {settingsGroups.map((group, groupIndex) => (
          <motion.div
            key={group.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: groupIndex * 0.1 }}
            className="space-y-2"
          >
            <p className="text-sm text-slate-500 px-2">{group.title}</p>
            <div className="bg-white rounded-3xl border border-slate-100 shadow-lg overflow-hidden divide-y divide-slate-100">
              {group.items.map((item, itemIndex) => {
                const Icon = item.icon;
                return (
                  <button
                    key={itemIndex}
                    onClick={item.action}
                    className={`w-full p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors active:scale-[0.99] ${
                      (item as any).destructive ? 'hover:bg-red-50' : ''
                    }`}
                  >
                    <div className={`w-12 h-12 bg-gradient-to-br ${
                      (item as any).destructive 
                        ? 'from-red-500 to-red-600' 
                        : 'from-blue-500 to-indigo-600'
                    } rounded-2xl flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className={`${(item as any).destructive ? 'text-red-700' : 'text-slate-900'}`}>
                        {item.label}
                      </p>
                      <p className="text-xs text-slate-500">{item.description}</p>
                    </div>
                    {item.toggle ? (
                      <div
                        className={`w-12 h-7 rounded-full transition-colors ${
                          item.value ? 'bg-blue-600' : 'bg-slate-200'
                        } relative`}
                      >
                        <motion.div
                          animate={{ x: item.value ? 20 : 0 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                          className="absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-md"
                        />
                      </div>
                    ) : (
                      <ChevronRight className="w-5 h-5 text-slate-400" />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        ))}

        {/* App Info */}
        <div className="text-center pt-4">
          <p className="text-slate-400 text-sm">Smart Ledger v1.0.0</p>
          <p className="text-slate-400 text-xs mt-1">{t('madeWithLove')}</p>
        </div>
      </div>

      {/* Language Selection Dialog */}
      <Dialog open={isLanguageDialogOpen} onOpenChange={setIsLanguageDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t('selectLanguage')}</DialogTitle>
            <DialogDescription>
              {t('chooseLanguage')}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 max-h-[400px] overflow-y-auto">
            <div className="space-y-2">
              {LANGUAGES.map((language) => (
                <button
                  key={language.code}
                  onClick={() => handleLanguageChange(language.code)}
                  className={`w-full p-4 rounded-2xl flex items-center gap-3 transition-all ${
                    selectedLanguage === language.code
                      ? 'bg-blue-100 border-2 border-blue-500'
                      : 'bg-slate-50 border-2 border-transparent hover:bg-slate-100'
                  }`}
                >
                  <span className="text-2xl">{language.flag}</span>
                  <div className="flex-1 text-left">
                    <p className="text-slate-900">{language.name}</p>
                  </div>
                  {selectedLanguage === language.code && (
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
