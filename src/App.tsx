import { useState, useEffect } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { Header } from './components/Header';
import { HomeView } from './components/HomeView';
import { PeopleView } from './components/PeopleView';
import { ReportsView } from './components/ReportsView';
import { SettingsView } from './components/SettingsView';
import { SitesView } from './components/SitesView';
import { SiteDetailView } from './components/SiteDetailView';
import { SuppliersView } from './components/SuppliersView';
import { BottomNav } from './components/BottomNav';
import { AddEntryDialog } from './components/AddEntryDialog';
import { AuthScreen } from './components/AuthScreen';
import { InstallPrompt } from './components/InstallPrompt';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner@2.0.3';
import { APIClient } from './utils/api';
import { registerServiceWorker } from './utils/registerServiceWorker';

export interface Entry {
  id: string;
  name: string;
  amount: number;
  type: 'given' | 'received';
  category: string;
  date: string;
  notes?: string;
  personType?: 'worker' | 'supplier';
  siteId?: string;
}

export interface Site {
  id: string;
  name: string;
  budget: number;
  spent: number;
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [userName, setUserName] = useState('User');
  const [apiClient, setApiClient] = useState<APIClient | null>(null);
  
  const [entries, setEntries] = useState<Entry[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [selectedSiteId, setSelectedSiteId] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount and register service worker
  useEffect(() => {
    // Register service worker for PWA
    registerServiceWorker();
    
    const storedToken = localStorage.getItem('smart_ledger_token');
    const storedUserName = localStorage.getItem('smart_ledger_user_name');
    
    if (storedToken) {
      handleAuthSuccess(storedToken, storedUserName || 'User');
    } else {
      setLoading(false);
    }
  }, []);

  // Load entries when authenticated
  useEffect(() => {
    if (apiClient) {
      loadEntries();
      loadSites();
      loadSettings();
    }
  }, [apiClient]);

  const handleAuthSuccess = async (token: string, name: string) => {
    setAccessToken(token);
    setUserName(name);
    setIsAuthenticated(true);
    
    // Store in localStorage
    localStorage.setItem('smart_ledger_token', token);
    localStorage.setItem('smart_ledger_user_name', name);
    
    // Create API client
    const client = new APIClient(token);
    setApiClient(client);
    setLoading(false);
  };

  const handleSignOut = () => {
    localStorage.removeItem('smart_ledger_token');
    localStorage.removeItem('smart_ledger_user_name');
    setIsAuthenticated(false);
    setAccessToken(null);
    setApiClient(null);
    setEntries([]);
    setSites([]);
    setSelectedSiteId(null);
    setActiveTab('home');
  };

  const loadEntries = async () => {
    if (!apiClient) return;
    
    try {
      const fetchedEntries = await apiClient.getEntries();
      setEntries(fetchedEntries);
    } catch (error) {
      console.error('Failed to load entries:', error);
      toast.error('Failed to load entries', {
        description: 'Please try again or sign out and sign back in',
      });
    }
  };

  const loadSites = async () => {
    if (!apiClient) return;
    
    try {
      const fetchedSites = await apiClient.getSites();
      setSites(fetchedSites);
    } catch (error) {
      console.error('Failed to load sites:', error);
    }
  };

  const loadSettings = async () => {
    if (!apiClient) return;
    
    try {
      const settings = await apiClient.getUserSettings();
      setSelectedLanguage(settings.language || 'en');
      setIsDarkMode(settings.darkMode || false);
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const handleAddEntry = async (entry: Omit<Entry, 'id'>) => {
    if (!apiClient) return;
    
    try {
      const newEntry = await apiClient.addEntry(entry);
      setEntries([newEntry, ...entries]);
      setIsAddDialogOpen(false);
      
      toast.success('Entry added successfully!', {
        description: `₹${entry.amount.toLocaleString('en-IN')} ${entry.type === 'given' ? 'given to' : 'received from'} ${entry.name}`,
      });
    } catch (error) {
      console.error('Failed to add entry:', error);
      toast.error('Failed to add entry', {
        description: 'Please check your connection and try again',
      });
    }
  };

  const handleDeleteEntry = async (id: string) => {
    if (!apiClient) return;
    
    const entry = entries.find(e => e.id === id);
    
    try {
      await apiClient.deleteEntry(id);
      setEntries(entries.filter(e => e.id !== id));
      
      if (entry) {
        toast.success('Entry deleted', {
          description: `Transaction with ${entry.name} removed`,
        });
      }
    } catch (error) {
      console.error('Failed to delete entry:', error);
      toast.error('Failed to delete entry', {
        description: 'Please try again',
      });
    }
  };

  const handleLanguageChange = async (language: string) => {
    if (!apiClient) return;
    
    try {
      await apiClient.updateLanguage(language);
      setSelectedLanguage(language);
      toast.success('Language updated', {
        description: 'Your language preference has been saved',
      });
    } catch (error) {
      console.error('Failed to update language:', error);
      toast.error('Failed to update language');
    }
  };

  const handleAddSite = async (site: Omit<Site, 'id' | 'spent'>) => {
    if (!apiClient) return;
    
    try {
      const newSite = await apiClient.addSite(site);
      setSites([newSite, ...sites]);
      toast.success('Site added successfully!', {
        description: `${site.name} has been added to your sites`,
      });
    } catch (error) {
      console.error('Failed to add site:', error);
      toast.error('Failed to add site');
    }
  };

  const handleDeleteSite = async (id: string) => {
    if (!apiClient) return;
    
    const site = sites.find(s => s.id === id);
    
    try {
      await apiClient.deleteSite(id);
      setSites(sites.filter(s => s.id !== id));
      
      if (site) {
        toast.success('Site deleted', {
          description: `${site.name} has been removed`,
        });
      }
    } catch (error) {
      console.error('Failed to delete site:', error);
      toast.error('Failed to delete site');
    }
  };

  // Show auth screen if not authenticated
  if (!isAuthenticated) {
    if (loading) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      );
    }
    return <AuthScreen onAuthSuccess={handleAuthSuccess} />;
  }

  const totalOwed = entries
    .filter(e => e.type === 'received')
    .reduce((sum, e) => sum + e.amount, 0);

  const totalOwe = entries
    .filter(e => e.type === 'given')
    .reduce((sum, e) => sum + e.amount, 0);

  const peopleOwingCount = new Set(
    entries.filter(e => e.type === 'received').map(e => e.name)
  ).size;

  const renderView = () => {
    // If a site is selected, show site detail view
    if (selectedSiteId) {
      const site = sites.find(s => s.id === selectedSiteId);
      if (site) {
        return (
          <SiteDetailView
            site={site}
            entries={entries}
            onBack={() => setSelectedSiteId(null)}
            onDeleteEntry={handleDeleteEntry}
            selectedLanguage={selectedLanguage}
          />
        );
      }
    }

    switch (activeTab) {
      case 'home':
        return (
          <HomeView
            entries={entries}
            totalOwed={totalOwed}
            totalOwe={totalOwe}
            peopleOwingCount={peopleOwingCount}
            onAddEntry={handleAddEntry}
            onDeleteEntry={handleDeleteEntry}
            selectedLanguage={selectedLanguage}
            sites={sites}
          />
        );
      case 'people':
        return <PeopleView entries={entries} onDeleteEntry={handleDeleteEntry} selectedLanguage={selectedLanguage} />;
      case 'suppliers':
        return <SuppliersView entries={entries} onDeleteEntry={handleDeleteEntry} selectedLanguage={selectedLanguage} />;
      case 'sites':
        return (
          <SitesView
            sites={sites}
            entries={entries}
            onAddSite={handleAddSite}
            onDeleteSite={handleDeleteSite}
            onSiteClick={setSelectedSiteId}
            selectedLanguage={selectedLanguage}
          />
        );
      case 'reports':
        return <ReportsView entries={entries} selectedLanguage={selectedLanguage} />;
      case 'settings':
        return (
          <SettingsView
            isDarkMode={isDarkMode}
            setIsDarkMode={setIsDarkMode}
            selectedLanguage={selectedLanguage}
            onLanguageChange={handleLanguageChange}
            onSignOut={handleSignOut}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-slate-900' : 'bg-slate-50'} pb-20`}>
      {/* Mobile Container */}
      <div className={`max-w-md mx-auto ${isDarkMode ? 'bg-slate-800' : 'bg-white'} min-h-screen shadow-2xl relative overflow-hidden`}>
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl -translate-y-32 translate-x-32" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-br from-green-500/10 to-blue-500/10 rounded-full blur-3xl translate-y-32 -translate-x-32" />
        
        {/* Header */}
        <Header userName={userName} isDarkMode={isDarkMode} selectedLanguage={selectedLanguage} />

        {/* Main Content */}
        <div className="relative z-10">
          {renderView()}
        </div>

        {/* Floating Add Button */}
        <button
          onClick={() => setIsAddDialogOpen(true)}
          className="fixed bottom-24 right-6 w-16 h-16 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 hover:from-blue-600 hover:via-blue-700 hover:to-indigo-700 text-white rounded-2xl shadow-xl hover:shadow-2xl transition-all flex items-center justify-center active:scale-95 group z-50"
          style={{ maxWidth: 'calc(28rem - 1.5rem)' }}
        >
          <Plus className="w-7 h-7 group-hover:rotate-90 transition-transform duration-300" />
        </button>

        {/* Bottom Navigation */}
        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} isDarkMode={isDarkMode} selectedLanguage={selectedLanguage} />

        {/* Add Entry Dialog */}
        <AddEntryDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          onAddEntry={handleAddEntry}
          selectedLanguage={selectedLanguage}
          sites={sites}
        />

        {/* Toast Notifications */}
        <Toaster position="top-center" />

        {/* Install Prompt */}
        <InstallPrompt />
      </div>
    </div>
  );
}
