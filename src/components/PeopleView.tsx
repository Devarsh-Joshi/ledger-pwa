import { motion } from 'motion/react';
import { User, ArrowDownLeft, ArrowUpRight, Trash2, Building2 } from 'lucide-react';
import { useState } from 'react';
import type { Entry, Site } from '../App';

interface PeopleViewProps {
  entries: Entry[];
  onDeleteEntry: (id: string) => void;
  sites?: Site[];
}

export function PeopleView({ entries, onDeleteEntry, sites = [] }: PeopleViewProps) {
  const [expandedPerson, setExpandedPerson] = useState<string | null>(null);

  const getSiteName = (siteId?: string) => {
    if (!siteId) return null;
    const site = sites.find(s => s.id === siteId);
    return site?.name;
  };

  // Group entries by person
  const peopleMap = new Map<string, { entries: Entry[]; totalGiven: number; totalReceived: number }>();

  entries.forEach(entry => {
    const current = peopleMap.get(entry.name) || { entries: [], totalGiven: 0, totalReceived: 0 };
    current.entries.push(entry);
    if (entry.type === 'given') {
      current.totalGiven += entry.amount;
    } else {
      current.totalReceived += entry.amount;
    }
    peopleMap.set(entry.name, current);
  });

  const people = Array.from(peopleMap.entries()).map(([name, data]) => ({
    name,
    ...data,
    balance: data.totalReceived - data.totalGiven,
  })).sort((a, b) => Math.abs(b.balance) - Math.abs(a.balance));

  return (
    <div className="px-4 py-6 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-slate-900">People</h2>
          <p className="text-slate-500 text-sm">{people.length} contacts</p>
        </div>
      </div>

      <div className="space-y-3">
        {people.map((person, index) => (
          <motion.div
            key={person.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="bg-white rounded-3xl border border-slate-100 shadow-lg overflow-hidden"
          >
            <button
              onClick={() => setExpandedPerson(expandedPerson === person.name ? null : person.name)}
              className="w-full p-5 flex items-center justify-between hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                  person.balance > 0
                    ? 'bg-gradient-to-br from-green-100 to-emerald-200'
                    : person.balance < 0
                    ? 'bg-gradient-to-br from-red-100 to-pink-200'
                    : 'bg-gradient-to-br from-slate-100 to-slate-200'
                }`}>
                  <span className="text-xl">
                    {person.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div className="text-left">
                  <p className="text-slate-900">{person.name}</p>
                  <p className="text-xs text-slate-500">{person.entries.length} transactions</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`${
                  person.balance > 0 ? 'text-green-600' : person.balance < 0 ? 'text-red-600' : 'text-slate-600'
                }`}>
                  {person.balance > 0 ? 'Owes you' : person.balance < 0 ? 'You owe' : 'Settled'}
                </p>
                <p className={`${
                  person.balance > 0 ? 'text-green-600' : person.balance < 0 ? 'text-red-600' : 'text-slate-600'
                }`}>
                  ₹{Math.abs(person.balance).toLocaleString('en-IN')}
                </p>
              </div>
            </button>

            {expandedPerson === person.name && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="border-t border-slate-100"
              >
                <div className="p-4 space-y-2 bg-slate-50">
                  {person.entries.map((entry) => (
                    <div
                      key={entry.id}
                      className="bg-white p-3 rounded-2xl flex items-center justify-between group hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center gap-2 flex-1">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                          entry.type === 'received' ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                          {entry.type === 'received' ? (
                            <ArrowDownLeft className="w-4 h-4 text-green-600" />
                          ) : (
                            <ArrowUpRight className="w-4 h-4 text-red-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-slate-900">{entry.category}</p>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <p className="text-xs text-slate-500">
                              {new Date(entry.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </p>
                            {entry.siteId && getSiteName(entry.siteId) && (
                              <>
                                <span className="text-xs text-slate-300">•</span>
                                <span className="inline-flex items-center gap-0.5 text-xs bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-full">
                                  <Building2 className="w-2.5 h-2.5" />
                                  {getSiteName(entry.siteId)}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <p className={`text-sm ${entry.type === 'received' ? 'text-green-600' : 'text-red-600'}`}>
                          {entry.type === 'received' ? '+' : '-'}₹{entry.amount.toLocaleString('en-IN')}
                        </p>
                        <button
                          onClick={() => onDeleteEntry(entry.id)}
                          className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-50 rounded-lg transition-all active:scale-90"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-red-500" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
