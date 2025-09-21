import React, { useState, useEffect } from 'react';
import { Customer, Loan } from '../types';
import LoanList from './LoanList';
import LoanDetail from './LoanDetail';
import CustomerSummary from './CustomerSummary';
import Card from './ui/Card';

interface CustomerViewProps {
  customer: Customer;
}

const CustomerView: React.FC<CustomerViewProps> = ({ customer }) => {
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);

  useEffect(() => {
    // When customer changes, select the first loan by default
    if (customer && customer.loans.length > 0) {
      setSelectedLoan(customer.loans[0]);
    } else {
      setSelectedLoan(null);
    }
  }, [customer]);


  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1 space-y-6">
        <CustomerSummary loans={customer.loans} />
        <Card>
            <h2 className="text-xl font-bold mb-4 text-sky-400">My Loans</h2>
          <LoanList
            loans={customer.loans}
            selectedLoanId={selectedLoan?.id || null}
            onSelectLoan={(loanId) => setSelectedLoan(customer.loans.find(l => l.id === loanId) || null)}
            readOnly={true}
          />
        </Card>
      </div>
      <div className="lg:col-span-2">
        {selectedLoan ? (
          <LoanDetail loan={selectedLoan} />
        ) : (
          <div className="flex items-center justify-center h-full bg-slate-800/50 rounded-lg">
            <p className="text-xl text-slate-400">You have no loans to display.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerView;