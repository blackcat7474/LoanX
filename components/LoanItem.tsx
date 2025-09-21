import React from 'react';
import { Loan, LoanStatus } from '../types';

interface LoanItemProps {
  loan: Loan;
  isSelected?: boolean;
  readOnly: boolean;
  onSelect?: () => void;
  onDelete?: () => void;
  onEdit?: () => void;
}

const statusColors: Record<LoanStatus, string> = {
  'Active': 'bg-sky-600/50 text-sky-300 border-sky-500/60',
  'Paid Off': 'bg-emerald-600/50 text-emerald-300 border-emerald-500/60',
  'Default': 'bg-red-600/50 text-red-300 border-red-500/60',
};

const LoanItem: React.FC<LoanItemProps> = ({ loan, isSelected, onSelect, onDelete, onEdit, readOnly }) => {
  const selectedClasses = isSelected 
    ? 'bg-sky-500/20 border-sky-400' 
    : 'bg-slate-800 border-slate-700 hover:border-sky-500';
  
  const cursorClass = onSelect ? 'cursor-pointer' : '';

  return (
    <div
      onClick={onSelect}
      className={`p-4 rounded-lg border-2 transition-all duration-200 group relative ${selectedClasses} ${cursorClass}`}
    >
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-3">
             <h4 className="font-bold text-lg text-slate-100">{loan.name}</h4>
             <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${statusColors[loan.status]}`}>
              {loan.status}
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            ₹{loan.principal.toLocaleString('en-IN')} at {loan.interestRate}%
          </p>
           <p className="text-xs text-slate-500 mt-1">
            Due: {new Date(loan.dueDate).toLocaleDateString('en-GB')}
          </p>
        </div>
        {!readOnly && (
          <div className="flex gap-2 absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={(e) => { e.stopPropagation(); onEdit?.(); }}
              className="text-slate-500 hover:text-sky-400 transition-colors"
              aria-label={`Edit ${loan.name}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); onDelete?.(); }}
              className="text-slate-500 hover:text-red-400 transition-colors"
              aria-label={`Delete ${loan.name}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoanItem;