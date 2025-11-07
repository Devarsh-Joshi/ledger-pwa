import { Trash2, TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import type { Transaction } from '../App';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

export function TransactionList({ transactions, onDelete }: TransactionListProps) {
  if (transactions.length === 0) {
    return (
      <Card className="p-12 text-center bg-white shadow-lg">
        <p className="text-slate-400">No transactions found</p>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-white shadow-lg">
      <h2 className="text-slate-900 mb-4">Recent Transactions</h2>
      <div className="space-y-3">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-md transition-all bg-slate-50/50"
          >
            <div className="flex items-center gap-4 flex-1">
              <div
                className={`p-2.5 rounded-xl ${
                  transaction.type === 'income'
                    ? 'bg-green-50'
                    : 'bg-red-50'
                }`}
              >
                {transaction.type === 'income' ? (
                  <TrendingUp className="w-5 h-5 text-green-600" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-red-600" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-slate-900">{transaction.description}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-sm">
                    {transaction.category}
                  </span>
                  <span className="flex items-center gap-1 text-slate-500 text-sm">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(transaction.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <p
                className={`${
                  transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {transaction.type === 'income' ? '+' : '-'}$
                {transaction.amount.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(transaction.id)}
                className="hover:bg-red-50 hover:text-red-600 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
