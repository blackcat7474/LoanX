import React, { useState, useEffect } from 'react';
import { Loan, LoanStatus } from '../types';
import Button from './ui/Button';
import Input from './ui/Input';
import Card from './ui/Card';

interface LoanFormProps {
  onSubmit: (loan: Omit<Loan, 'id'> | Loan) => void;
  initialData?: Loan | null;
  onCancel: () => void;
}

const loanTypes = ['Personal', 'Home', 'Car', 'Education', 'Business', 'Other'];
const loanStatuses: LoanStatus[] = ['Active', 'Paid Off', 'Default'];

const LoanForm: React.FC<LoanFormProps> = ({ onSubmit, initialData, onCancel }) => {
  const [name, setName] = useState('');
  const [loanType, setLoanType] = useState(loanTypes[0]);
  const [principal, setPrincipal] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [term, setTerm] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState<LoanStatus>(loanStatuses[0]);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setLoanType(initialData.loanType);
      setPrincipal(initialData.principal.toString());
      setInterestRate(initialData.interestRate.toString());
      setTerm(initialData.term.toString());
      setDueDate(initialData.dueDate);
      setStatus(initialData.status);
    } else {
      // Reset form when switching from edit to add
      setName('');
      setLoanType(loanTypes[0]);
      setPrincipal('');
      setInterestRate('');
      setTerm('');
      setDueDate('');
      setStatus(loanStatuses[0]);
    }
  }, [initialData]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !principal || !interestRate || !term || !dueDate || !loanType || !status) {
      alert('Please fill out all fields.');
      return;
    }
    
    const loanData = {
      name,
      loanType,
      principal: parseFloat(principal),
      interestRate: parseFloat(interestRate),
      term: parseInt(term, 10),
      dueDate,
      status,
    };

    if (initialData) {
      onSubmit({ ...loanData, id: initialData.id });
    } else {
      onSubmit(loanData);
    }
  };
  
  const isEditMode = !!initialData;

  return (
    <Card className="bg-slate-700/50">
      <h3 className="text-xl font-semibold mb-4 text-sky-300">{isEditMode ? 'Edit Loan' : 'Add New Loan'}</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="loanName" className="block text-sm font-medium text-slate-300">Loan Nickname</label>
          <Input id="loanName" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., HDFC Home Loan" />
        </div>
         <div>
          <label htmlFor="loanType" className="block text-sm font-medium text-slate-300">Loan Type</label>
          <select
            id="loanType"
            value={loanType}
            onChange={(e) => setLoanType(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-md text-sm shadow-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
          >
            {loanTypes.map(type => <option key={type} value={type}>{type}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="principal" className="block text-sm font-medium text-slate-300">Loan Amount (₹)</label>
          <Input id="principal" type="number" value={principal} onChange={(e) => setPrincipal(e.target.value)} placeholder="e.g., 500000" />
        </div>
        <div>
          <label htmlFor="interestRate" className="block text-sm font-medium text-slate-300">Annual Interest Rate (%)</label>
          <Input id="interestRate" type="number" step="0.01" value={interestRate} onChange={(e) => setInterestRate(e.target.value)} placeholder="e.g., 12.5" />
        </div>
        <div>
          <label htmlFor="term" className="block text-sm font-medium text-slate-300">Loan Term (Months)</label>
          <Input id="term" type="number" value={term} onChange={(e) => setTerm(e.target.value)} placeholder="e.g., 36" />
        </div>
        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium text-slate-300">Next Due Date</label>
          <Input id="dueDate" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        </div>
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-slate-300">Loan Status</label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as LoanStatus)}
            className="mt-1 block w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-md text-sm shadow-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
          >
            {loanStatuses.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="flex gap-4">
          <Button type="button" onClick={onCancel} className="w-full bg-slate-600 hover:bg-slate-500">Cancel</Button>
          <Button type="submit" className="w-full">{isEditMode ? 'Update Loan' : 'Add Loan'}</Button>
        </div>
      </form>
    </Card>
  );
};

export default LoanForm;