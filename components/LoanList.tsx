
import React from 'react';
import { Loan } from '../types';
import LoanItem from './LoanItem';

interface LoanListProps {
  loans: Loan[];
  readOnly: boolean;
  selectedLoanId?: string | null;
  onSelectLoan?: (id: string) => void;
  onDeleteLoan?: (id: string) => void;
  onEditLoan?: (loan: Loan) => void;
}

const LoanList: React.FC<LoanListProps> = ({ loans, selectedLoanId, onSelectLoan, onDeleteLoan, onEditLoan, readOnly }) => {
  return (
    <div className="space-y-3">
      {loans.length > 0 ? (
        loans.map(loan => (
          <LoanItem
            key={loan.id}
            loan={loan}
            isSelected={loan.id === selectedLoanId}
            onSelect={onSelectLoan ? () => onSelectLoan(loan.id) : undefined}
            onDelete={onDeleteLoan ? () => onDeleteLoan(loan.id) : undefined}
            onEdit={onEditLoan ? () => onEditLoan(loan) : undefined}
            readOnly={readOnly}
          />
        ))
      ) : (
        <p className="text-center text-slate-400 p-4 bg-slate-800 rounded-lg">No loans found.</p>
      )}
    </div>
  );
};

export default LoanList;
