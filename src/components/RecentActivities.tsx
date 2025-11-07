import { ArrowDownLeft, ArrowUpRight, Clock, Trash2, Building2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import type { Entry, Site } from '../App';
import { useTranslation } from '../hooks/useTranslation';

interface RecentActivitiesProps {
  entries: Entry[];
  onDeleteEntry: (id: string) => void;
  selectedLanguage: string;
  sites?: Site[];
}

export function RecentActivities({ entries, onDeleteEntry, selectedLanguage, sites = [] }: RecentActivitiesProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { t } = useTranslation(selectedLanguage);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  const getSiteName = (siteId?: string) => {
    if (!siteId) return null;
    const site = sites.find(s => s.id === siteId);
    return site?.name;
  };

  const handleDelete = (id: string) => {
    setDeletingId(id);
    setTimeout(() => {
      onDeleteEntry(id);
      setDeletingId(null);
    }, 300);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.7 }}
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
          <Clock className="w-4 h-4 text-white" />
        </div>
        <h2 className="text-slate-700">{t('recentActivity')}</h2>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 divide-y divide-slate-100 shadow-lg overflow-hidden">
        {entries.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-slate-400">No recent activities</p>
          </div>
        ) : (
          entries.map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: deletingId === entry.id ? 0 : 1, x: deletingId === entry.id ? -50 : 0 }}
              transition={{ duration: 0.3, delay: 0.8 + index * 0.05 }}
              className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors group"
            >
              <div className="flex items-center gap-3 flex-1">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                    entry.type === 'received'
                      ? 'bg-gradient-to-br from-green-100 to-emerald-200'
                      : 'bg-gradient-to-br from-red-100 to-pink-200'
                  }`}
                >
                  {entry.type === 'received' ? (
                    <ArrowDownLeft className="w-6 h-6 text-green-600" />
                  ) : (
                    <ArrowUpRight className="w-6 h-6 text-red-600" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-slate-900">{entry.name}</p>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    <span className="text-xs text-slate-500">{entry.category}</span>
                    <span className="text-xs text-slate-300">•</span>
                    <span className="text-xs text-slate-500">{formatDate(entry.date)}</span>
                    {entry.siteId && getSiteName(entry.siteId) && (
                      <>
                        <span className="text-xs text-slate-300">•</span>
                        <span className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                          <Building2 className="w-3 h-3" />
                          {getSiteName(entry.siteId)}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <p
                  className={`${
                    entry.type === 'received' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {entry.type === 'received' ? '+' : '-'}₹{entry.amount.toLocaleString('en-IN')}
                </p>
                <button
                  onClick={() => handleDelete(entry.id)}
                  className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-50 rounded-xl transition-all active:scale-90"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
}
