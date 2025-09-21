import React from 'react';
import { Loan, LoanStatus } from '../types';
import AmortizationSchedule from './AmortizationSchedule';
import PaymentStrategy from './PaymentStrategy';
import Card from './ui/Card';

const statusColors: Record<LoanStatus, string> = {
  'Active': 'bg-sky-600/50 text-sky-300',
  'Paid Off': 'bg-emerald-600/50 text-emerald-300',
  'Default': 'bg-red-600/50 text-red-300',
};

interface LoanDetailProps {
  loan: Loan;
}

const LoanDetail: React.FC<LoanDetailProps> = ({ loan }) => {
  return (
    <div className="space-y-8">
      <Card>
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-3xl font-bold text-sky-400">{loan.name}</h2>
          <span className={`px-3 py-1 text-sm font-semibold rounded-full ${statusColors[loan.status]}`}>
            {loan.status}
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-slate-300">
          <div>
            <p className="text-sm text-slate-400">Principal</p>
            <p className="text-xl font-semibold">₹{loan.principal.toLocaleString('en-IN')}</p>
          </div>
          <div>
            <p className="text-sm text-slate-400">Interest Rate</p>
            <p className="text-xl font-semibold">{loan.interestRate}%</p>
          </div>
          <div>
            <p className="text-sm text-slate-400">Term</p>
            <p className="text-xl font-semibold">{loan.term} months</p>
          </div>
           <div className="col-span-2 md:col-span-3">
            <p className="text-sm text-slate-400">Next Due Date</p>
            <p className="text-xl font-semibold">{new Date(loan.dueDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
        </div>
      </Card>
      
      <PaymentStrategy loan={loan} />
      <AmortizationSchedule loan={loan} />
    </div>
  );
};

export default LoanDetail;