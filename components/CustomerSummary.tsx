import React, { useMemo } from 'react';
import { Loan, LoanStatus } from '../types';
import Card from './ui/Card';

interface CustomerSummaryProps {
  loans: Loan[];
}

const CustomerSummary: React.FC<CustomerSummaryProps> = ({ loans }) => {
  const { totalBalance, balanceByCategory, summaryByStatus } = useMemo(() => {
    const totalBalance = loans.reduce((acc, loan) => acc + loan.principal, 0);
    
    const balanceByCategory = loans.reduce((acc, loan) => {
      const category = `${loan.loanType} Loan`;
      acc[category] = (acc[category] || 0) + loan.principal;
      return acc;
    }, {} as Record<string, number>);

    const summaryByStatus = loans.reduce((acc, loan) => {
        acc[loan.status] = (acc[loan.status] || 0) + 1;
        return acc;
    }, {} as Record<LoanStatus, number>);

    return { totalBalance, balanceByCategory, summaryByStatus };
  }, [loans]);
  
  return (
    <Card>
      <h2 className="text-xl font-bold mb-4 text-sky-400">Loan Summary</h2>
      <div className="space-y-4">
        <div>
          <p className="text-sm text-slate-400">Total Outstanding Balance</p>
          <p className="text-3xl font-bold text-slate-100">₹{totalBalance.toLocaleString('en-IN')}</p>
        </div>
        <div className="border-t border-slate-700 pt-4">
          <h3 className="text-lg font-semibold text-slate-200 mb-2">Balance by Category</h3>
          <div className="space-y-2">
            {Object.entries(balanceByCategory).map(([category, amount]) => (
              <div key={category} className="flex justify-between items-center text-sm">
                <span className="text-slate-300">{category}</span>
                <span className="font-medium text-slate-100">₹{amount.toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>
        </div>
         <div className="border-t border-slate-700 pt-4">
          <h3 className="text-lg font-semibold text-slate-200 mb-2">Summary by Status</h3>
          <div className="space-y-2">
            {(Object.entries(summaryByStatus) as [LoanStatus, number][]).map(([status, count]) => (
              <div key={status} className="flex justify-between items-center text-sm">
                <span className="text-slate-300">{status}</span>
                <span className="font-medium text-slate-100">{count} {count > 1 ? 'loans' : 'loan'}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CustomerSummary;