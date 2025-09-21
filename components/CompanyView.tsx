import React, { useState, useMemo, useEffect } from 'react';
import { Customer, Loan } from '../types';
import LoanList from './LoanList';
import LoanForm from './LoanForm';
import CustomerForm from './CustomerForm';
import Card from './ui/Card';
import Button from './ui/Button';
import Input from './ui/Input';

interface CompanyViewProps {
  customers: Customer[];
  onAddCustomer: (customerData: Omit<Customer, 'id' | 'loans'>) => void;
  onUpdateCustomer: (customerData: Omit<Customer, 'loans'>) => void;
  onDeleteCustomer: (customerId: string) => void;
  onAddLoan: (customerId: string, loan: Omit<Loan, 'id'>) => void;
  onUpdateLoan: (customerId: string, loan: Loan) => void;
  onDeleteLoan: (customerId: string, loanId: string) => void;
}

type SearchCategory = 'All' | 'Name' | 'Loan Type' | 'Overdue';

const CompanyView: React.FC<CompanyViewProps> = ({ customers, onAddCustomer, onUpdateCustomer, onDeleteCustomer, onAddLoan, onUpdateLoan, onDeleteLoan }) => {
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  
  // Search and filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [searchCategory, setSearchCategory] = useState<SearchCategory>('All');

  // Loan form state
  const [editingLoan, setEditingLoan] = useState<Loan | null>(null);
  const [isLoanFormVisible, setIsLoanFormVisible] = useState(false);
  
  // Customer form state
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [isCustomerFormVisible, setIsCustomerFormVisible] = useState(false);

  const filteredCustomers = useMemo(() => {
    const lowercasedTerm = searchTerm.toLowerCase();

    if (searchCategory === 'Overdue') {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Compare dates only
      return customers.filter(customer =>
        customer.loans.some(loan => new Date(loan.dueDate) < today && loan.status === 'Active')
      );
    }

    if (!lowercasedTerm) {
      return customers;
    }

    return customers.filter(customer => {
      const customerNameMatch = customer.name.toLowerCase().includes(lowercasedTerm);

      if (searchCategory === 'Name') {
        return customerNameMatch;
      }

      const loanMatch = customer.loans.some(loan => {
        const loanTypeMatch = loan.loanType.toLowerCase().includes(lowercasedTerm);
        const loanNameMatch = loan.name.toLowerCase().includes(lowercasedTerm);
        const principalMatch = loan.principal.toString().includes(lowercasedTerm);
        
        if (searchCategory === 'Loan Type') {
          return loanTypeMatch;
        }
        
        // 'All' category search
        return loanTypeMatch || loanNameMatch || principalMatch;
      });

      return customerNameMatch || loanMatch;
    });
  }, [customers, searchTerm, searchCategory]);

  // Effect to handle selection changes when filters are applied
  useEffect(() => {
    // If there is no selection or the current selection is filtered out
    if (!selectedCustomerId || !filteredCustomers.find(c => c.id === selectedCustomerId)) {
        // Select the first customer from the filtered list, or null if empty
        setSelectedCustomerId(filteredCustomers[0]?.id || null);
    }
  }, [filteredCustomers, selectedCustomerId]);


  const selectedCustomer = customers.find(c => c.id === selectedCustomerId);

  const handleLoanFormSubmit = (loanData: Omit<Loan, 'id'> | Loan) => {
    if (!selectedCustomerId) return;
    if ('id' in loanData) {
      onUpdateLoan(selectedCustomerId, loanData);
    } else {
      onAddLoan(selectedCustomerId, loanData);
    }
    setEditingLoan(null);
    setIsLoanFormVisible(false);
  };
  
  const handleCustomerFormSubmit = (customerData: Omit<Customer, 'id' | 'loans'> | Omit<Customer, 'loans'>) => {
    if ('id' in customerData) {
      onUpdateCustomer(customerData);
    } else {
      onAddCustomer(customerData);
    }
    setEditingCustomer(null);
    setIsCustomerFormVisible(false);
  };
  
  const showLoanForm = (loan: Loan | null) => {
    setEditingLoan(loan);
    setIsLoanFormVisible(true);
  };
  
  const showCustomerForm = (customer: Customer | null) => {
    setEditingCustomer(customer);
    setIsCustomerFormVisible(true);
  };
  
  const handleDeleteLoanWithConfirmation = (loanId: string) => {
    if (!selectedCustomer) return;
    const loanToDelete = selectedCustomer.loans.find(l => l.id === loanId);
    if (loanToDelete && window.confirm(`Are you sure you want to delete the loan "${loanToDelete.name}"?`)) {
        onDeleteLoan(selectedCustomer.id, loanId);
    }
  };

  const handleDeleteCustomerWithConfirmation = (customer: Customer) => {
    if (window.confirm(`Are you sure you want to delete customer ${customer.name}? This will also delete all their loans.`)) {
      onDeleteCustomer(customer.id);
    }
  };

  const handleExportData = () => {
    const csvRows = [];
    const headers = ['CustomerID', 'CustomerName', 'MobileNumber', 'LoanID', 'LoanNickname', 'LoanType', 'Principal(₹)', 'InterestRate(%)', 'Term(Months)', 'DueDate', 'Status'];
    csvRows.push(headers.join(','));

    for (const customer of customers) {
        if (customer.loans.length > 0) {
            for (const loan of customer.loans) {
                const values = [
                    customer.id,
                    `"${customer.name}"`, // Enclose in quotes to handle potential commas
                    customer.mobileNumber,
                    loan.id,
                    `"${loan.name}"`,
                    loan.loanType,
                    loan.principal,
                    loan.interestRate,
                    loan.term,
                    loan.dueDate,
                    loan.status
                ].join(',');
                csvRows.push(values);
            }
        } else {
            // Include customers with no loans for a complete customer list
            const values = [
                customer.id,
                `"${customer.name}"`,
                customer.mobileNumber,
                '', '', '', '', '', '', '', '' // Empty loan fields
            ].join(',');
            csvRows.push(values);
        }
    }

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'customer_loan_data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1 space-y-6">
        <Card>
            <h2 className="text-xl font-bold text-sky-400 mb-4">Customer Management</h2>
            <div className="flex gap-2 mb-4">
                <Input 
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-grow"
                    disabled={searchCategory === 'Overdue'}
                />
                <select
                    value={searchCategory}
                    onChange={(e) => setSearchCategory(e.target.value as SearchCategory)}
                    className="bg-slate-900 border border-slate-600 rounded-md text-sm shadow-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                >
                    <option value="All">All Fields</option>
                    <option value="Name">Customer Name</option>
                    <option value="Loan Type">Loan Type</option>
                    <option value="Overdue">Show Overdue</option>
                </select>
            </div>
            <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold text-slate-300">Customer List</h3>
                <div className="flex items-center gap-2">
                    <Button onClick={handleExportData} className="bg-emerald-600 hover:bg-emerald-700 text-xs px-2 py-1">Export</Button>
                    <Button onClick={() => showCustomerForm(null)} className="text-xs px-2 py-1">Add New</Button>
                </div>
            </div>
            <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2">
              {filteredCustomers.length > 0 ? filteredCustomers.map(c => (
                <div 
                  key={c.id}
                  onClick={() => setSelectedCustomerId(c.id)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors group relative ${selectedCustomerId === c.id ? 'bg-sky-500/20' : 'bg-slate-700/50 hover:bg-slate-700'}`}
                >
                  <p className="font-semibold">{c.name}</p>
                  <p className="text-sm text-slate-400">{c.mobileNumber}</p>
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={(e) => { e.stopPropagation(); showCustomerForm(c); }}
                      className="text-slate-500 hover:text-sky-400 transition-colors p-1 rounded-full bg-slate-800"
                      aria-label={`Edit ${c.name}`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                    </button>
                     <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCustomerWithConfirmation(c);
                      }}
                      className="text-slate-500 hover:text-red-400 transition-colors p-1 rounded-full bg-slate-800"
                      aria-label={`Delete ${c.name}`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </div>
              )) : (
                <div className="p-4 text-center text-slate-400 bg-slate-800 rounded-lg">
                    No customers match your search.
                </div>
              )}
            </div>
        </Card>
        {isCustomerFormVisible && (
          <CustomerForm 
            onSubmit={handleCustomerFormSubmit}
            initialData={editingCustomer}
            onCancel={() => setIsCustomerFormVisible(false)}
          />
        )}
      </div>
      <div className="lg:col-span-2">
        {selectedCustomer ? (
          <Card>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-sky-400">{selectedCustomer.name}'s Loans</h2>
              <Button onClick={() => showLoanForm(null)}>Add New Loan</Button>
            </div>
            {isLoanFormVisible ? (
              <LoanForm onSubmit={handleLoanFormSubmit} initialData={editingLoan} onCancel={() => setIsLoanFormVisible(false)} />
            ) : (
              <LoanList 
                loans={selectedCustomer.loans} 
                onDeleteLoan={handleDeleteLoanWithConfirmation}
                onEditLoan={(loan) => showLoanForm(loan)}
                readOnly={false}
              />
            )}
          </Card>
        ) : (
           <div className="flex items-center justify-center h-full bg-slate-800/50 rounded-lg">
              <p className="text-xl text-slate-400">Select or add a customer to manage their loans.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default CompanyView;