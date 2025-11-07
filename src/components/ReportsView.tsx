import { motion } from 'motion/react';
import { TrendingUp, TrendingDown, Calendar, PieChart } from 'lucide-react';
import { useMemo } from 'react';
import type { Entry } from '../App';

interface ReportsViewProps {
  entries: Entry[];
}

export function ReportsView({ entries }: ReportsViewProps) {
  const stats = useMemo(() => {
    const totalGiven = entries.filter(e => e.type === 'given').reduce((sum, e) => sum + e.amount, 0);
    const totalReceived = entries.filter(e => e.type === 'received').reduce((sum, e) => sum + e.amount, 0);
    const netBalance = totalReceived - totalGiven;

    // Category breakdown
    const categoryMap = new Map<string, { given: number; received: number }>();
    entries.forEach(entry => {
      const current = categoryMap.get(entry.category) || { given: 0, received: 0 };
      if (entry.type === 'given') {
        current.given += entry.amount;
      } else {
        current.received += entry.amount;
      }
      categoryMap.set(entry.category, current);
    });

    const categories = Array.from(categoryMap.entries())
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => (b.given + b.received) - (a.given + a.received));

    // Monthly trend
    const monthMap = new Map<string, { given: number; received: number }>();
    entries.forEach(entry => {
      const month = new Date(entry.date).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
      const current = monthMap.get(month) || { given: 0, received: 0 };
      if (entry.type === 'given') {
        current.given += entry.amount;
      } else {
        current.received += entry.amount;
      }
      monthMap.set(month, current);
    });

    const months = Array.from(monthMap.entries())
      .map(([name, data]) => ({ name, ...data }))
      .slice(-6);

    return { totalGiven, totalReceived, netBalance, categories, months };
  }, [entries]);

  return (
    <div className="px-4 py-6 space-y-6">
      <div>
        <h2 className="text-slate-900 mb-2">Financial Reports</h2>
        <p className="text-slate-500 text-sm">Overview of your transactions</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl p-5 shadow-xl text-white"
        >
          <TrendingUp className="w-8 h-8 mb-3 opacity-80" />
          <p className="text-green-100 text-sm mb-1">Total Received</p>
          <p className="text-2xl">₹{stats.totalReceived.toLocaleString('en-IN')}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-gradient-to-br from-red-500 to-pink-600 rounded-3xl p-5 shadow-xl text-white"
        >
          <TrendingDown className="w-8 h-8 mb-3 opacity-80" />
          <p className="text-red-100 text-sm mb-1">Total Given</p>
          <p className="text-2xl">₹{stats.totalGiven.toLocaleString('en-IN')}</p>
        </motion.div>
      </div>

      {/* Net Balance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className={`rounded-3xl p-6 shadow-xl ${
          stats.netBalance > 0
            ? 'bg-gradient-to-br from-green-500 to-emerald-600'
            : stats.netBalance < 0
            ? 'bg-gradient-to-br from-red-500 to-pink-600'
            : 'bg-gradient-to-br from-slate-500 to-slate-600'
        } text-white`}
      >
        <p className="text-white/80 mb-2">Net Balance</p>
        <p className="text-4xl mb-1">₹{Math.abs(stats.netBalance).toLocaleString('en-IN')}</p>
        <p className="text-white/70 text-sm">
          {stats.netBalance > 0 ? 'You are owed money' : stats.netBalance < 0 ? 'You owe money' : 'All settled'}
        </p>
      </motion.div>

      {/* Category Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="bg-white rounded-3xl p-5 shadow-lg border border-slate-100"
      >
        <div className="flex items-center gap-2 mb-4">
          <PieChart className="w-5 h-5 text-slate-600" />
          <h3 className="text-slate-900">Category Breakdown</h3>
        </div>
        <div className="space-y-3">
          {stats.categories.map((category, index) => (
            <div key={category.name} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">{category.name}</span>
                <span className="text-slate-900">
                  ₹{(category.given + category.received).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${((category.given + category.received) / (stats.totalGiven + stats.totalReceived)) * 100}%` }}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Monthly Trend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
        className="bg-white rounded-3xl p-5 shadow-lg border border-slate-100"
      >
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-slate-600" />
          <h3 className="text-slate-900">Monthly Activity</h3>
        </div>
        <div className="space-y-3">
          {stats.months.map((month, index) => (
            <div key={month.name} className="flex items-center gap-3">
              <p className="text-sm text-slate-600 w-20">{month.name}</p>
              <div className="flex-1 flex gap-2">
                <div className="flex-1 h-8 bg-green-100 rounded-xl overflow-hidden relative">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(month.received / Math.max(stats.totalReceived / stats.months.length, 1)) * 100}%` }}
                    transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-end pr-2"
                  >
                    {month.received > 0 && (
                      <span className="text-xs text-white">+{month.received.toLocaleString('en-IN')}</span>
                    )}
                  </motion.div>
                </div>
                <div className="flex-1 h-8 bg-red-100 rounded-xl overflow-hidden relative">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(month.given / Math.max(stats.totalGiven / stats.months.length, 1)) * 100}%` }}
                    transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                    className="h-full bg-gradient-to-r from-red-500 to-pink-600 rounded-xl flex items-center justify-end pr-2"
                  >
                    {month.given > 0 && (
                      <span className="text-xs text-white">-{month.given.toLocaleString('en-IN')}</span>
                    )}
                  </motion.div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
