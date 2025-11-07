import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Building2, Plus, Trash2, Edit, TrendingDown, Wallet, Info } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import type { Site, Entry } from '../App';

interface SitesViewProps {
  sites: Site[];
  entries: Entry[];
  onAddSite: (site: Omit<Site, 'id' | 'spent'>) => void;
  onDeleteSite: (id: string) => void;
  onSiteClick: (siteId: string) => void;
  selectedLanguage: string;
}

export function SitesView({ sites, entries, onAddSite, onDeleteSite, onSiteClick, selectedLanguage }: SitesViewProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [siteName, setSiteName] = useState('');
  const [siteBudget, setSiteBudget] = useState('');

  // Calculate spent amount for each site
  const getSiteSpent = (siteId: string) => {
    return entries
      .filter(e => e.siteId === siteId && e.type === 'given')
      .reduce((sum, e) => sum + e.amount, 0);
  };

  const handleAddSite = () => {
    if (!siteName || !siteBudget) return;
    
    onAddSite({
      name: siteName,
      budget: parseFloat(siteBudget),
    });
    
    setSiteName('');
    setSiteBudget('');
    setIsAddDialogOpen(false);
  };

  return (
    <>
      <div className="px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-slate-900 mb-2">Construction Sites</h2>
            <p className="text-slate-500 text-sm">Manage your site budgets and expenses</p>
          </div>
          <Button
            onClick={() => setIsAddDialogOpen(true)}
            className="bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 rounded-2xl h-10"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Site
          </Button>
        </div>

        {/* Info Card - How It Works */}
        {sites.length > 0 && (
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-5 border border-blue-100">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <Info className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="text-slate-900 mb-1">How Budget Tracking Works</h4>
                <p className="text-sm text-slate-600">
                  When adding transactions (using the + button), select a site to track expenses against its budget. 
                  Only "Money Given" transactions reduce the site budget.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Sites Grid */}
        {sites.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-10 h-10 text-slate-400" />
            </div>
            <p className="text-slate-600 mb-2">No sites yet</p>
            <p className="text-slate-400 text-sm mb-6">Add your first construction site to track budgets</p>
            <Button
              onClick={() => setIsAddDialogOpen(true)}
              className="bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 rounded-2xl"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Site
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {sites.map((site, index) => {
              const spent = getSiteSpent(site.id);
              const remaining = site.budget - spent;
              const percentSpent = (spent / site.budget) * 100;

              return (
                <motion.div
                  key={site.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  onClick={() => onSiteClick(site.id)}
                  className="bg-white rounded-3xl p-6 shadow-lg border border-slate-100 hover:shadow-xl transition-all cursor-pointer group"
                >
                  {/* Site Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform">
                        <Building2 className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-slate-900">{site.name}</h3>
                        <p className="text-sm text-slate-500">Site Budget & Expenses</p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm('Delete this site?')) {
                          onDeleteSite(site.id);
                        }
                      }}
                      className="w-10 h-10 rounded-xl hover:bg-red-50 flex items-center justify-center transition-colors text-slate-400 hover:text-red-600"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Budget Info */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-blue-50 rounded-2xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Wallet className="w-4 h-4 text-blue-600" />
                        <p className="text-xs text-blue-600">Total Budget</p>
                      </div>
                      <p className="text-blue-900">₹{site.budget.toLocaleString('en-IN')}</p>
                    </div>
                    <div className="bg-red-50 rounded-2xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingDown className="w-4 h-4 text-red-600" />
                        <p className="text-xs text-red-600">Total Spent</p>
                      </div>
                      <p className="text-red-900">₹{spent.toLocaleString('en-IN')}</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Remaining</span>
                      <span className={remaining >= 0 ? 'text-green-600' : 'text-red-600'}>
                        ₹{Math.abs(remaining).toLocaleString('en-IN')}
                        {remaining < 0 && ' over budget!'}
                      </span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
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
                      {percentSpent.toFixed(1)}% used
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Site Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Site</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="siteName">Site Name</Label>
              <Input
                id="siteName"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                placeholder="e.g., Downtown Plaza, Riverside Apartments"
                className="rounded-2xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="siteBudget">Budget (₹)</Label>
              <Input
                id="siteBudget"
                type="number"
                value={siteBudget}
                onChange={(e) => setSiteBudget(e.target.value)}
                placeholder="e.g., 1000000"
                className="rounded-2xl"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => setIsAddDialogOpen(false)}
              variant="outline"
              className="flex-1 rounded-2xl"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddSite}
              className="flex-1 bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 rounded-2xl"
              disabled={!siteName || !siteBudget}
            >
              Add Site
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
