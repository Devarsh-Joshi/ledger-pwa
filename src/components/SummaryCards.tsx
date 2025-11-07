import { TrendingUp, Users, TrendingDown } from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslation } from '../hooks/useTranslation';

interface SummaryCardsProps {
  totalOwed: number;
  peopleOwingCount: number;
  totalOwe: number;
  selectedLanguage: string;
}

export function SummaryCards({ totalOwed, peopleOwingCount, totalOwe, selectedLanguage }: SummaryCardsProps) {
  const { t } = useTranslation(selectedLanguage);
  
  return (
    <div className="space-y-3 -mt-8">
      {/* You Are Owed */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-gradient-to-br from-emerald-500 via-green-500 to-green-600 rounded-3xl p-6 shadow-xl relative overflow-hidden group hover:shadow-2xl transition-shadow"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex-1">
            <p className="text-green-50 text-sm mb-2">{t('totalOwed')}</p>
            <p className="text-white text-3xl">
              ₹{totalOwed.toLocaleString('en-IN')}
            </p>
          </div>
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-xl border border-white/30">
            <TrendingUp className="w-7 h-7 text-white" />
          </div>
        </div>
      </motion.div>

      {/* Two Cards Side by Side */}
      <div className="grid grid-cols-2 gap-3">
        {/* People Owing You */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-white rounded-3xl p-5 shadow-lg border border-slate-100 hover:shadow-xl transition-all hover:scale-[1.02] group"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-slate-500 text-sm mb-1">{t('peopleOwing')}</p>
          <p className="text-slate-900 text-2xl">{peopleOwingCount}</p>
        </motion.div>

        {/* You Owe */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-white rounded-3xl p-5 shadow-lg border border-slate-100 hover:shadow-xl transition-all hover:scale-[1.02] group"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform">
              <TrendingDown className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-slate-500 text-sm mb-1">{t('totalOwe')}</p>
          <p className="text-red-600 text-2xl">
            ₹{totalOwe.toLocaleString('en-IN')}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
