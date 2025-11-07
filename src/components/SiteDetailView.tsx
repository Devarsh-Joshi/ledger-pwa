import { ArrowLeft, Building2, TrendingDown, Wallet, ArrowDownLeft, ArrowUpRight, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';
import type { Site, Entry } from '../App';
import { Button } from './ui/button';

interface SiteDetailViewProps {
  site: Site;
  entries: Entry[];
  onBack: () => void;
  onDeleteEntry: (id: string) => void;
  selectedLanguage: string;
}

export function SiteDetailView({ site, entries, onBack, onDeleteEntry, selectedLanguage }: SiteDetailViewProps) {
  // Filter entries for this site
  const siteEntries = entries.filter(e => e.siteId === site.id);
  const spent = siteEntries
    .filter(e => e.type === 'given')
    .reduce((sum, e) => sum + e.amount, 0);
  const remaining = site.budget - spent;
  const percentSpent = (spent / site.budget) * 100;

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

  return (
    <div className="px-4 py-6 space-y-6">
      {/* Header */}
      <div>
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Sites</span>
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center">
            <Building2 className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-slate-900">{site.name}</h2>
            <p className="text-slate-500 text-sm">Site Details & Transactions</p>
          </div>
        </div>

        {/* Budget Summary */}
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-100 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Wallet className="w-4 h-4 text-blue-600" />
                <p className="text-sm text-slate-600">Total Budget</p>
              </div>
              <p className="text-slate-900 text-2xl">₹{site.budget.toLocaleString('en-IN')}</p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="w-4 h-4 text-red-600" />
                <p className="text-sm text-slate-600">Total Spent</p>
              </div>
              <p className="text-red-600 text-2xl">₹{spent.toLocaleString('en-IN')}</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Remaining Budget</span>
              <span className={remaining >= 0 ? 'text-green-600' : 'text-red-600'}>
                ₹{Math.abs(remaining).toLocaleString('en-IN')}
                {remaining < 0 && ' over budget!'}
              </span>
            </div>
            <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  percentSpent > 100
                    ? 'bg-gradient-to-r from-red-500 to-red-600'
                    : percentSpent > 80
                    ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                    : 'bg-gradient-to-r from-green-500 to-emerald-500'
                }`}
                style={{ width: `${Math.min(percentSpent, 100)}%` }}
              />
            </div>
            <p className="text-xs text-slate-500 text-right">
              {percentSpent.toFixed(1)}% of budget used
            </p>
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-slate-900">Site Transactions</h3>
          <p className="text-sm text-slate-500">{siteEntries.length} total</p>
        </div>
        
        {siteEntries.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center shadow-lg border border-slate-100">
            <p className="text-slate-500 mb-2">No transactions for this site yet</p>
            <p className="text-xs text-slate-400">Use the + button and select this site when adding transactions</p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-100 divide-y divide-slate-100 shadow-lg overflow-hidden">
            {siteEntries.map((entry) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-4 hover:bg-slate-50 transition-colors group"
              >
                <div className="flex items-center gap-4">
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                    entry.type === 'received'
                      ? 'bg-gradient-to-br from-green-500 to-emerald-600'
                      : 'bg-gradient-to-br from-red-500 to-pink-600'
                  }`}>
                    {entry.type === 'received' ? (
                      <ArrowDownLeft className="w-6 h-6 text-white" />
                    ) : (
                      <ArrowUpRight className="w-6 h-6 text-white" />
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1">
                    <p className="text-slate-900">{entry.name}</p>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <span>{formatDate(entry.date)}</span>
                      {entry.category && (
                        <>
                          <span>•</span>
                          <span>{entry.category}</span>
                        </>
                      )}
                      {entry.personType && (
                        <>
                          <span>•</span>
                          <span className="capitalize">{entry.personType}</span>
                        </>
                      )}
                      {entry.type === 'given' && (
                        <>
                          <span>•</span>
                          <span className="inline-flex items-center gap-1 text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded-full">
                            📊 Tracked
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Amount */}
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <p className={entry.type === 'received' ? 'text-green-600' : 'text-red-600'}>
                        {entry.type === 'received' ? '+' : '-'}₹{entry.amount.toLocaleString('en-IN')}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        if (confirm('Delete this transaction?')) {
                          onDeleteEntry(entry.id);
                        }
                      }}
                      className="w-8 h-8 rounded-xl hover:bg-red-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all text-slate-400 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
