import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Card } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import type { Transaction } from '../App';

interface ExpenseChartProps {
  transactions: Transaction[];
}

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#f97316'];

export function ExpenseChart({ transactions }: ExpenseChartProps) {
  const categoryData = useMemo(() => {
    const categoryMap = new Map<string, { income: number; expense: number }>();

    transactions.forEach(transaction => {
      const current = categoryMap.get(transaction.category) || { income: 0, expense: 0 };
      if (transaction.type === 'income') {
        current.income += transaction.amount;
      } else {
        current.expense += transaction.amount;
      }
      categoryMap.set(transaction.category, current);
    });

    return Array.from(categoryMap.entries()).map(([category, data]) => ({
      category,
      income: data.income,
      expense: data.expense,
    }));
  }, [transactions]);

  const pieData = useMemo(() => {
    const expenseMap = new Map<string, number>();

    transactions
      .filter(t => t.type === 'expense')
      .forEach(transaction => {
        const current = expenseMap.get(transaction.category) || 0;
        expenseMap.set(transaction.category, current + transaction.amount);
      });

    return Array.from(expenseMap.entries()).map(([name, value]) => ({
      name,
      value,
    }));
  }, [transactions]);

  return (
    <Card className="p-6 bg-white shadow-lg">
      <h2 className="text-slate-900 mb-6">Financial Overview</h2>
      <Tabs defaultValue="bar" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="bar">By Category</TabsTrigger>
          <TabsTrigger value="pie">Expense Breakdown</TabsTrigger>
        </TabsList>
        <TabsContent value="bar" className="mt-6">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="category" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
              />
              <Legend />
              <Bar dataKey="income" fill="#10b981" radius={[8, 8, 0, 0]} />
              <Bar dataKey="expense" fill="#ef4444" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </TabsContent>
        <TabsContent value="pie" className="mt-6">
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
