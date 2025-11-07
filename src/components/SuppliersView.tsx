import { motion } from 'motion/react';
import { Package, Search, ArrowDownLeft, ArrowUpRight, Trash2, Building2 } from 'lucide-react';
import { useState } from 'react';
import type { Entry, Site } from '../App';
import { Input } from './ui/input';

interface SuppliersViewProps {
  entries: Entry[];
  onDeleteEntry: (id: string) => void;
  selectedLanguage: string;
  sites?: Site[];
}

export function SuppliersView({ entries, onDeleteEntry, selectedLanguage, sites = [] }: SuppliersViewProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const getSiteName = (siteId?: string) => {
    if (!siteId) return null;
    const site = sites.find(s => s.id === siteId);
    return site?.name;
  };

  // Filter only supplier entries
  const supplierEntries = entries.filter(e => e.personType === 'supplier');

  // Group by supplier name
  const suppliersByName = supplierEntries.reduce((acc, entry) => {
    if (!acc[entry.name]) {
      acc[entry.name] = [];
    }
    acc[entry.name].push(entry);
    return acc;
  }, {} as Record<string, Entry[]>);

  // Calculate net balance for each supplier
  const suppliers = Object.entries(suppliersByName).map(([name, transactions]) => {
    const received = transactions
      .filter(t => t.type === 'received')
      .reduce((sum, t) => sum + t.amount, 0);
    const given = transactions
      .filter(t => t.type === 'given')
      .reduce((sum, t) => sum + t.amount, 0);
    const netBalance = received - given;

    return {
      name,
      transactions,
      received,
      given,
      netBalance,
      transactionCount: transactions.length,
    };
  });

  // Filter suppliers by search
  const filteredSuppliers = suppliers.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="px-4 py-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-slate-900 mb-2">Suppliers</h2>
        <p className="text-slate-500 text-sm">Manage transactions with your suppliers</p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search suppliers..."
          className="pl-12 rounded-3xl border-slate-200 h-14 bg-white shadow-lg"
        />
      </div>

      {/* Suppliers List */}
      {supplierEntries.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <Package className="w-10 h-10 text-slate-400" />
          </div>
          <p className="text-slate-600 mb-2">No supplier transactions yet</p>
          <p className="text-slate-400 text-sm">Add transactions and mark them as supplier to see them here</p>
        </div>
      ) : filteredSuppliers.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-slate-600">No suppliers found matching "{searchQuery}"</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredSuppliers.map((supplier, index) => (
            <motion.div
              key={supplier.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden"
            >
              {/* Supplier Header */}
              <div className="p-6 bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-600 text-white">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/30">
                    <Package className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white">{supplier.name}</h3>
                    <p className="text-purple-100 text-sm">{supplier.transactionCount} transactions</p>
                  </div>
                </div>

                {/* Balance Summary */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-3 border border-white/20">
                    <p className="text-purple-100 text-xs mb-1">Given</p>
                    <p className="text-white text-sm">₹{supplier.given.toLocaleString('en-IN')}</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-3 border border-white/20">
                    <p className="text-purple-100 text-xs mb-1">Received</p>
                    <p className="text-white text-sm">₹{supplier.received.toLocaleString('en-IN')}</p>
                  </div>
                  <div className={`backdrop-blur-xl rounded-2xl p-3 border ${
                    supplier.netBalance > 0
                      ? 'bg-green-500/20 border-green-300/30'
                      : supplier.netBalance < 0
                      ? 'bg-red-500/20 border-red-300/30'
                      : 'bg-white/10 border-white/20'
                  }`}>
                    <p className="text-white text-xs mb-1">Net</p>
                    <p className="text-white text-sm">
                      {supplier.netBalance > 0 ? '+' : ''}₹{supplier.netBalance.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Transactions */}
              <div className="divide-y divide-slate-100">
                {supplier.transactions.slice(0, 5).map((entry) => (
                  <div
                    key={entry.id}
                    className="p-4 hover:bg-slate-50 transition-colors group flex items-center gap-4"
                  >
                    {/* Icon */}
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      entry.type === 'received'
                        ? 'bg-green-100 text-green-600'
                        : 'bg-red-100 text-red-600'
                    }`}>
                      {entry.type === 'received' ? (
                        <ArrowDownLeft className="w-5 h-5" />
                      ) : (
                        <ArrowUpRight className="w-5 h-5" />
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1">
                      <p className="text-slate-900 text-sm">{entry.category || 'Transaction'}</p>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <p className="text-xs text-slate-500">{formatDate(entry.date)}</p>
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

                    {/* Amount */}
                    <div className="flex items-center gap-2">
                      <p className={entry.type === 'received' ? 'text-green-600' : 'text-red-600'}>
                        {entry.type === 'received' ? '+' : '-'}₹{entry.amount.toLocaleString('en-IN')}
                      </p>
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
                ))}

                {supplier.transactions.length > 5 && (
                  <div className="p-4 text-center">
                    <p className="text-sm text-slate-500">
                      +{supplier.transactions.length - 5} more transactions
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
