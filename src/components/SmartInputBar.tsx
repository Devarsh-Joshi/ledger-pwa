import { useState, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type { Entry } from '../App';

interface SmartInputBarProps {
  entries: Entry[];
}

export function SmartInputBar({ entries }: SmartInputBarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Group entries by person and calculate net balance
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;

    const query = searchQuery.toLowerCase();
    const peopleMap = new Map<string, { entries: Entry[]; totalGiven: number; totalReceived: number }>();

    entries.forEach(entry => {
      if (entry.name.toLowerCase().includes(query)) {
        const current = peopleMap.get(entry.name) || { entries: [], totalGiven: 0, totalReceived: 0 };
        current.entries.push(entry);
        if (entry.type === 'given') {
          current.totalGiven += entry.amount;
        } else {
          current.totalReceived += entry.amount;
        }
        peopleMap.set(entry.name, current);
      }
    });

    return Array.from(peopleMap.entries()).map(([name, data]) => ({
      name,
      ...data,
      balance: data.totalReceived - data.totalGiven,
    }));
  }, [searchQuery, entries]);

  const handleClear = () => {
    setSearchQuery('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-3xl p-5 border border-blue-100 shadow-lg"
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
          <Search className="w-4 h-4 text-white" />
        </div>
        <p className="text-slate-700">Smart Search</p>
      </div>
      
      <div className="relative">
        <input
          type="text"
          placeholder="Search by person name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-3.5 pr-10 bg-white rounded-2xl border-2 border-transparent focus:border-blue-500 focus:outline-none text-slate-900 placeholder:text-slate-400 shadow-sm transition-all"
        />
        {searchQuery && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-slate-400" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {searchResults && searchResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 space-y-3 overflow-hidden"
          >
            {searchResults.map((person) => (
              <motion.div
                key={person.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-4 border border-slate-200 shadow-md"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-slate-900">{person.name}</p>
                    <p className="text-xs text-slate-500">{person.entries.length} transactions</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500 mb-1">Net Balance</p>
                    <p className={`text-lg ${
                      person.balance > 0 ? 'text-green-600' : person.balance < 0 ? 'text-red-600' : 'text-slate-600'
                    }`}>
                      {person.balance > 0 ? '+' : person.balance < 0 ? '-' : ''}₹{Math.abs(person.balance).toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
                
                <div className={`px-3 py-2 rounded-xl ${
                  person.balance > 0 
                    ? 'bg-green-50 border border-green-200' 
                    : person.balance < 0 
                    ? 'bg-red-50 border border-red-200'
                    : 'bg-slate-50 border border-slate-200'
                }`}>
                  <p className={`text-sm ${
                    person.balance > 0 
                      ? 'text-green-700' 
                      : person.balance < 0 
                      ? 'text-red-700'
                      : 'text-slate-700'
                  }`}>
                    {person.balance > 0 
                      ? `${person.name} owes you ₹${person.balance.toLocaleString('en-IN')}`
                      : person.balance < 0
                      ? `You owe ${person.name} ₹${Math.abs(person.balance).toLocaleString('en-IN')}`
                      : 'All settled up!'}
                  </p>
                </div>

                {/* Recent transactions */}
                <div className="mt-3 space-y-2">
                  {person.entries.slice(0, 3).map((entry) => (
                    <div key={entry.id} className="flex items-center justify-between text-sm bg-slate-50 rounded-xl p-2">
                      <div>
                        <p className="text-slate-700">{entry.category}</p>
                        <p className="text-xs text-slate-500">
                          {new Date(entry.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </p>
                      </div>
                      <p className={entry.type === 'received' ? 'text-green-600' : 'text-red-600'}>
                        {entry.type === 'received' ? '+' : '-'}₹{entry.amount.toLocaleString('en-IN')}
                      </p>
                    </div>
                  ))}
                  {person.entries.length > 3 && (
                    <p className="text-xs text-slate-400 text-center">
                      +{person.entries.length - 3} more transactions
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
        
        {searchResults && searchResults.length === 0 && searchQuery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 text-center py-4"
          >
            <p className="text-slate-400 text-sm">No results found for "{searchQuery}"</p>
          </motion.div>
        )}
      </AnimatePresence>

      {!searchQuery && (
        <p className="text-xs text-slate-500 mt-3 ml-1">
          💡 Type a person's name to see their transaction history and balance
        </p>
      )}
    </motion.div>
  );
}
