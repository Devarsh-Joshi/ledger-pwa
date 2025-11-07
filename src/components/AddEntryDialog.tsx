import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Info } from 'lucide-react';
import type { Entry, Site } from '../App';

interface AddEntryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddEntry: (entry: Omit<Entry, 'id'>) => void;
  selectedLanguage: string;
  sites: Site[];
}

export function AddEntryDialog({ open, onOpenChange, onAddEntry, selectedLanguage, sites }: AddEntryDialogProps) {
  const [type, setType] = useState<'given' | 'received'>('given');
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [personType, setPersonType] = useState<'worker' | 'supplier'>('worker');
  const [siteId, setSiteId] = useState<string>('');

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      setName('');
      setAmount('');
      setReason('');
      setNotes('');
      setDate(new Date().toISOString().split('T')[0]);
      setPersonType('worker');
      setSiteId('');
      setType('given');
    }
  }, [open]);

  // Determine the actual name and category based on "/" rule
  const getProcessedData = () => {
    if (name.includes('/')) {
      // Name with "/" - it's a regular transaction
      return {
        processedName: name,
        category: reason,
      };
    } else {
      // Name without "/" - goes to "Extra" category
      return {
        processedName: name,
        category: 'Extra',
      };
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !amount || !reason) {
      return;
    }

    const { processedName, category } = getProcessedData();

    onAddEntry({
      name: processedName,
      amount: parseFloat(amount),
      type,
      category,
      date,
      notes,
      personType,
      siteId: siteId || undefined,
    });

    onOpenChange(false);
  };

  const showNameHelp = name && !name.includes('/');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Add Transaction</DialogTitle>
          <DialogDescription>
            Record a new transaction with workers or suppliers
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-5 py-4">
            {/* Transaction Type */}
            <div className="space-y-2">
              <Label>Transaction Type</Label>
              <Tabs value={type} onValueChange={(value) => setType(value as 'given' | 'received')}>
                <TabsList className="grid w-full grid-cols-2 h-12">
                  <TabsTrigger 
                    value="given" 
                    className="data-[state=active]:bg-red-100 data-[state=active]:text-red-700 rounded-xl"
                  >
                    💸 Money Given
                  </TabsTrigger>
                  <TabsTrigger 
                    value="received" 
                    className="data-[state=active]:bg-green-100 data-[state=active]:text-green-700 rounded-xl"
                  >
                    💰 Money Received
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Person Type */}
            <div className="space-y-2">
              <Label>Person Type</Label>
              <Tabs value={personType} onValueChange={(value) => setPersonType(value as 'worker' | 'supplier')}>
                <TabsList className="grid w-full grid-cols-2 h-12">
                  <TabsTrigger value="worker" className="rounded-xl">
                    👷 Worker
                  </TabsTrigger>
                  <TabsTrigger value="supplier" className="rounded-xl">
                    📦 Supplier
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Site Selection */}
            {sites.length > 0 && (
              <div className="space-y-2">
                <Label htmlFor="site">Assign to Site (Optional)</Label>
                <Select value={siteId || 'none'} onValueChange={(value) => setSiteId(value === 'none' ? '' : value)}>
                  <SelectTrigger id="site" className="rounded-xl h-11">
                    <SelectValue placeholder="Select a site..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">
                      <span className="text-slate-500">No Site</span>
                    </SelectItem>
                    {sites.map((site) => (
                      <SelectItem key={site.id} value={site.id}>
                        🏗️ {site.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-slate-500">
                  {siteId 
                    ? '✓ This expense will be tracked under the selected site\'s budget' 
                    : 'Not assigned to any site budget'}
                </p>
              </div>
            )}

            {/* Name Field with Help */}
            <div className="space-y-2">
              <Label htmlFor="name">
                Person's Name
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="e.g., John Doe or Supplier/ABC Ltd"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-xl h-11"
                required
              />
              {showNameHelp && (
                <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                  <Info className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-amber-800">
                    <strong>Tip:</strong> Without "/" this will go to "Extra" category. 
                    Add "/" in the name (e.g., "Supplier/ABC") to use the reason field as category.
                  </p>
                </div>
              )}
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <Label htmlFor="amount">
                Amount (₹)
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="amount"
                type="number"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="rounded-xl h-11"
                min="0"
                step="0.01"
                required
              />
            </div>

            {/* Reason */}
            <div className="space-y-2">
              <Label htmlFor="reason">
                Reason / Category
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="reason"
                type="text"
                placeholder="e.g., Materials, Labour, Advance, Payment"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="rounded-xl h-11"
                required
              />
              <p className="text-xs text-slate-500">
                {name.includes('/') 
                  ? '✓ This will be used as the transaction category' 
                  : 'This entry will be categorized as "Extra"'}
              </p>
            </div>

            {/* Date */}
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="rounded-xl h-11"
                required
              />
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Add any additional details about this transaction..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="resize-none rounded-xl"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 rounded-xl h-11"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 hover:from-blue-600 hover:via-blue-700 hover:to-indigo-700 rounded-xl h-11"
            >
              Add Transaction
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
