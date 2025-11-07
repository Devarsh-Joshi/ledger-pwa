import { TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { Card } from "./ui/card";

interface BalanceCardsProps {
  balance: number;
  totalIncome: number;
  totalExpense: number;
}

export function BalanceCards({
  balance,
  totalIncome,
  totalExpense,
}: BalanceCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Total Balance */}
      <Card className="p-6 bg-gradient-to-br from-indigo-600 to-blue-600 text-white border-0 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-indigo-100 mb-1">
              Total Balance
            </p>
            <p className="text-white">
              $
              {balance.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>
          <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
            <Wallet className="w-6 h-6" />
          </div>
        </div>
      </Card>

      {/* Total Income */}
      <Card className="p-6 bg-white border-green-100 shadow-lg hover:shadow-xl transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-600 mb-1">Total Income</p>
            <p className="text-green-600">
              $
              {totalIncome.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>
          <div className="p-3 bg-green-50 rounded-xl">
            <TrendingUp className="w-6 h-6 text-green-600" />
          </div>
        </div>
      </Card>

      {/* Total Expenses */}
      <Card className="p-6 bg-white border-red-100 shadow-lg hover:shadow-xl transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-600 mb-1">
              Total Expenses
            </p>
            <p className="text-red-600">
              $
              {totalExpense.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>
          <div className="p-3 bg-red-50 rounded-xl">
            <TrendingDown className="w-6 h-6 text-red-600" />
          </div>
        </div>
      </Card>
    </div>
  );
}