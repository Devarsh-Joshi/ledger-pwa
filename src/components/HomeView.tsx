import { SummaryCards } from './SummaryCards';
import { SmartInputBar } from './SmartInputBar';
import { RecentActivities } from './RecentActivities';
import type { Entry, Site } from '../App';

interface HomeViewProps {
  entries: Entry[];
  totalOwed: number;
  totalOwe: number;
  peopleOwingCount: number;
  onAddEntry: (entry: Omit<Entry, 'id'>) => void;
  onDeleteEntry: (id: string) => void;
  selectedLanguage: string;
  sites: Site[];
}

export function HomeView({
  entries,
  totalOwed,
  totalOwe,
  peopleOwingCount,
  onAddEntry,
  onDeleteEntry,
  selectedLanguage,
  sites,
}: HomeViewProps) {
  return (
    <div className="px-4 pb-6 space-y-6">
      {/* Summary Cards */}
      <SummaryCards
        totalOwed={totalOwed}
        peopleOwingCount={peopleOwingCount}
        totalOwe={totalOwe}
        selectedLanguage={selectedLanguage}
      />

      {/* Smart Search Bar */}
      <SmartInputBar entries={entries} selectedLanguage={selectedLanguage} />

      {/* Recent Activities */}
      <RecentActivities 
        entries={entries.slice(0, 5)} 
        onDeleteEntry={onDeleteEntry} 
        selectedLanguage={selectedLanguage}
        sites={sites}
      />
    </div>
  );
}
